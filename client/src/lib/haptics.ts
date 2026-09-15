"use client";

/**
 * ─────────────────────────────────────────────────────────────
 *  Cross-platform haptics engine (web-haptics → native → iOS fallback)
 * ─────────────────────────────────────────────────────────────
 *  Every call is wrapped in try/catch — haptics can NEVER crash the site.
 *
 *  Tier 1: web-haptics library (auto-detects export shape)
 *  Tier 2: navigator.vibrate → REAL vibration on Android browsers
 *  Tier 3: WebAudio tick → closest iOS Safari substitute
 */

// @ts-ignore — remove this line if your web-haptics version ships types
import * as webHapticsModule from "web-haptics";

export type HapticStyle =
  | "tap"       // generic button press
  | "selection" // tiny tick
  | "light"
  | "medium"
  | "heavy"
  | "double"    // DOUBLE haptic (5-second idle nudge)
  | "success"   // form sent / action completed
  | "error";    // form failed

/** Patterns in ms. Even indexes = vibrate, odd = pause. */
const PATTERNS: Record<HapticStyle, number[]> = {
  tap: [12],
  selection: [6],
  light: [10],
  medium: [20],
  heavy: [38],
  double: [45, 70, 45],
  success: [12, 60, 12, 60, 30],
  error: [40, 60, 40, 60, 40],
};

/** Set to `false` to mute the iOS audio substitute. */
const IOS_AUDIO_FALLBACK = true;

let enabled = true;
let engine: unknown = null;
let engineResolved = false;
let audioCtx: AudioContext | null = null;

/* ── web-haptics adapter (auto-detects API) ─────────────────── */
function resolveEngine(): unknown {
  if (engineResolved) return engine;
  engineResolved = true;
  try {
    const mod = webHapticsModule as unknown as Record<string, unknown>;
    const candidates = [mod.WebHaptics, mod.default, mod.webHaptics, mod.haptics];
    for (const candidate of candidates) {
      if (typeof candidate === "function") {
        try {
          return new (candidate as new () => unknown)();
        } catch {
          return candidate;
        }
      }
      if (candidate && typeof candidate === "object") return candidate;
    }
  } catch {
    /* package missing — native fallback handles it */
  }
  return null;
}

function callMethod(target: unknown, name: string, ...args: unknown[]): boolean {
  try {
    const fn = (target as Record<string, unknown> | null)?.[name];
    if (typeof fn === "function") {
      (fn as (...a: unknown[]) => unknown).apply(target, args);
      return true;
    }
  } catch {
    /* fall through */
  }
  return false;
}

function tryLibrary(style: HapticStyle): boolean {
  const lib = resolveEngine();
  if (!lib) return false;

  switch (style) {
    case "tap":       return callMethod(lib, "tap") || callMethod(lib, "impact", "light");
    case "selection": return callMethod(lib, "selection") || callMethod(lib, "selectionChanged");
    case "light":     return callMethod(lib, "light") || callMethod(lib, "impact", "light");
    case "medium":    return callMethod(lib, "medium") || callMethod(lib, "impact", "medium");
    case "heavy":     return callMethod(lib, "heavy") || callMethod(lib, "impact", "heavy");
    case "double":    return callMethod(lib, "doubleTap") || callMethod(lib, "double")
                        || callMethod(lib, "pattern", PATTERNS.double);
    case "success":   return callMethod(lib, "success") || callMethod(lib, "notification", "success");
    case "error":     return callMethod(lib, "error") || callMethod(lib, "notification", "error");
  }
}

/* ── iOS WebAudio substitute ────────────────────────────────── */
function ensureAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function scheduleTick(ctx: AudioContext, startAt: number, durationSec: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(140, startAt);
  osc.frequency.exponentialRampToValueAtTime(55, startAt + durationSec);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.18, startAt + Math.min(0.008, durationSec / 3));
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSec);

  osc.connect(gain).connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + durationSec + 0.02);
}

function playAudioPattern(pattern: number[]) {
  const ctx = ensureAudioContext();
  if (!ctx || ctx.state !== "running") return;
  let cursor = ctx.currentTime + 0.01;
  pattern.forEach((ms, index) => {
    const seconds = ms / 1000;
    if (index % 2 === 0) scheduleTick(ctx, cursor, seconds);
    cursor += seconds;
  });
}

/* ── Public API ─────────────────────────────────────────────── */
export function haptic(style: HapticStyle = "tap") {
  if (!enabled || typeof window === "undefined") return;
  try {
    if (tryLibrary(style)) return;

    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(PATTERNS[style]);
      return;
    }

    if (IOS_AUDIO_FALLBACK) playAudioPattern(PATTERNS[style]);
  } catch {
    /* haptics must never throw */
  }
}

export function setHapticsEnabled(next: boolean) {
  enabled = next;
}

/**
 * Global listeners:
 *  1. "tap" haptic on ANY button/link press.
 *     → Add data-haptic="off" to an element to opt out and fire
 *       your own (stronger / different) pattern manually.
 *  2. 5-second idle watcher → DOUBLE haptic.
 */
export function initHaptics(options?: { idleTimeoutMs?: number }): () => void {
  const idleTimeoutMs = options?.idleTimeoutMs ?? 5000;
  let disposed = false;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;

  const INTERACTIVE_SELECTOR = [
    "button",
    "a[href]",
    "[role='button']",
    "input[type='submit']",
    "input[type='button']",
    "summary",
  ].join(",");

  const onPointerDown = (event: PointerEvent) => {
    const target = event.target as HTMLElement | null;
    const interactive = target?.closest?.(
      INTERACTIVE_SELECTOR
    ) as HTMLElement | null;
    if (!interactive) return;

    // NEW: elements that manage their own haptic opt out here
    if (interactive.getAttribute("data-haptic") === "off") return;

    haptic("tap");
  };
  document.addEventListener("pointerdown", onPointerDown, {
    capture: true,
    passive: true,
  });

  const armIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!disposed && document.visibilityState === "visible") {
        haptic("double"); // ← DOUBLE haptic after 5s of stillness
      }
      armIdleTimer(); // re-arms every 5s while idle — delete to fire once
    }, idleTimeoutMs);
  };

  const ACTIVITY_EVENTS = [
    "scroll",
    "wheel",
    "pointermove",
    "pointerdown",
    "touchstart",
    "keydown",
  ] as const;
  ACTIVITY_EVENTS.forEach((evt) =>
    window.addEventListener(evt, armIdleTimer, { passive: true })
  );
  armIdleTimer();

  return () => {
    disposed = true;
    document.removeEventListener("pointerdown", onPointerDown, { capture: true });
    ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, armIdleTimer));
    if (idleTimer) clearTimeout(idleTimer);
  };
}