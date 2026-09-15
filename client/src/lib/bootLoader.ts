declare global {
  interface Window {
    __finishBootLoader?: () => void;
  }
}

export function finishBootLoader() {
  window.__finishBootLoader?.();
}

export async function waitForFirstRender(options?: {
  timeoutMs?: number;
  imageSelector?: string;
}) {
  const timeoutMs = options?.timeoutMs ?? 2200;
  const started = performance.now();

  const fonts = document.fonts?.ready?.catch(() => undefined) ?? Promise.resolve();
  const frames = new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  const image = options?.imageSelector
    ? new Promise<void>((resolve) => {
        const img = document.querySelector<HTMLImageElement>(options.imageSelector!);
        if (!img || img.complete) {
          resolve();
          return;
        }
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      })
    : Promise.resolve();

  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, timeoutMs);
  });

  await Promise.race([
    Promise.all([fonts, frames, image]),
    timeout,
  ]);

  const remaining = 420 - (performance.now() - started);
  if (remaining > 0) {
    await new Promise((resolve) => window.setTimeout(resolve, remaining));
  }
}
