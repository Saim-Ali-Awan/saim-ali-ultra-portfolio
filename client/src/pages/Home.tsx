"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Menu,
  MoveDown,
  Send,
  X,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
// ── NEW: GSAP for the bouncing code-drawn arrow ───────────────
import gsap from "gsap";
// ── NEW: haptics ──────────────────────────────────────────────
import { haptic } from "../lib/haptics";
import { Link } from "wouter";
import { finishBootLoader, waitForFirstRender } from "../lib/bootLoader";
import {
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_TECHNOLOGIES,
  FORMSPREE_ID,
  SITE_EMAIL,
} from "../lib/site";

const FALLBACK = {
  kinetic: "/bitlinks.webp",
  depth: "/k72.webp",
  mark: "/portfolio.webp",
  portrait: "/saim.webp",
};

const FEATURED_PROJECT = {
  id: "alaman-security",
  title: "ALAMAN SECURITY",
  projectType: "Security Services Platform",
  projectUrl: "https://alamansecurity.vercel.app/",
  imageUrl:
    "/Alaman.webp",
};

type FormStatus = "idle" | "submitting" | "succeeded" | "error";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="studio-label">{children}</span>;
}

/* ── NEW: pure-code down arrow, bounced with GSAP ─────────────── */
function CodedDownArrow() {
  const arrowRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (
      !arrowRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        arrowRef.current,
        { y: -2, opacity: 1 },
        {
          y: 6,
          opacity: 0.35,
          duration: 0.65,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.1,
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // Down arrow drawn entirely with code (inline SVG path — no icon lib)
  return (
    <svg
      ref={arrowRef}
      width="13"
      height="18"
      viewBox="0 0 14 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 1.5v15M1.5 11.5 7 17l5.5-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── NEW: floating scroll-down tag (framer enter/exit + GSAP arrow) ── */
function ScrollDownTag({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Scroll to next section"
      initial={{ opacity: 0, y: 26, x: "-50%", scale: 0.85 }}
      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
      exit={{ opacity: 0, y: 26, x: "-50%", scale: 0.85 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: "fixed",
        left: "50%",
        bottom: "1.4rem",
        zIndex: 80,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.55rem",
        padding: "0.55rem 1.05rem",
        fontSize: "0.62rem",
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#111111",
        background: "rgba(255, 255, 255, 0.72)",
        border: "1px solid rgba(0, 0, 0, 0.18)",
        borderRadius: "999px",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 12px 34px rgba(0, 0, 0, 0.16)",
        cursor: "pointer",
        pointerEvents: "auto",
      }}
    >
      SCROLL
      <CodedDownArrow />
    </motion.button>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const wasMenuOpen = useRef(false);

  // ── NEW: scroll-down tag visibility state ─────────────────────
  const [showScrollTag, setShowScrollTag] = useState(false);
  const scrollHideTimer = useRef<number | null>(null);

  const profile = DEFAULT_PROFILE;
  const projects = useMemo(
    () => [FEATURED_PROJECT, ...DEFAULT_PROJECTS],
    []
  );
  const technologies = DEFAULT_TECHNOLOGIES;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.25,
  });
  const heroScale = useTransform(progress, [0, 0.18], [1, 0.92]);
  const heroY = useTransform(progress, [0, 0.2], [0, -90]);

  const navLinks = useMemo(
    () => [
      { id: "work", label: "work" },
      { id: "studio", label: "studio" },
      { id: "playground", label: "playground" },
      { id: "contact", label: "contact" },
    ],
    []
  );

  useEffect(() => {
    let cancelled = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      document.documentElement.dataset.reducedMotion = media.matches
        ? "true"
        : "false";
    };
    syncMotionPreference();
    media.addEventListener?.("change", syncMotionPreference);

    waitForFirstRender().then(
      () => {
        if (cancelled) return;
        finishBootLoader();
        setIntroReady(true);
      }
    );

    return () => {
      cancelled = true;
      media.removeEventListener?.("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = menuOpen ? "hidden" : "";

    if (wasMenuOpen.current && !menuOpen) {
      menuTriggerRef.current?.focus();
    }
    wasMenuOpen.current = menuOpen;

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const panel = menuPanelRef.current;
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = Array.from(
        panel?.querySelectorAll<HTMLElement>("a, button") ?? []
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    panel?.addEventListener("keydown", trapFocus);
    return () => panel?.removeEventListener("keydown", trapFocus);
  }, [menuOpen]);

  // ── NEW: show tag while scrolling, hide with animation ~1.1s after stop ──
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const atBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 60;

      window.clearTimeout(scrollHideTimer.current!);

      if (atBottom) {
        setShowScrollTag(false); // nothing left to scroll → fade out
        return;
      }
      setShowScrollTag(true); // scrolling → animate in
      scrollHideTimer.current = window.setTimeout(
        () => setShowScrollTag(false), // scroll stopped → animate out
        1100
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollHideTimer.current!);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ── NEW: tag tap → jump to the next section ────────────────────
  const scrollToNextSection = () => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id], main article[id]")
    );
    const target = sections.find(
      (section) => section.getBoundingClientRect().top > window.innerHeight * 0.35
    );
    (target ?? sections[sections.length - 1])?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setFormStatus("submitting");
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!response.ok) throw new Error("Form failed");
      form.reset();
      setFormStatus("succeeded");
      haptic("success"); // ── NEW: success haptic pattern
    } catch {
      setFormStatus("error");
      haptic("error"); // ── NEW: error haptic pattern
    }
  };

  return (
    <main className="zajno-shell">
      <motion.div
        className="zajno-progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <header className="zajno-header">
        <button
          className="zajno-brand"
          type="button"
          data-cursor="TOP"
          onClick={() => scrollTo("top")}
          aria-label="Back to top"
        >
          <span>
            saima<span>li</span>
            <sup>®</sup>
          </span>
        </button>
        <div className="zajno-header__meta">
          2026 <span>/</span> {profile.availability}
        </div>
        <button
          ref={menuTriggerRef}
          type="button"
          className={`zajno-menu ${menuOpen ? "zajno-menu--open" : ""}`}
          data-cursor="MENU"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-controls="site-index-panel"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
          <span>{menuOpen ? "close" : "index"}</span>
        </button>
      </header>

      <nav
        ref={menuPanelRef}
        id="site-index-panel"
        className={`zajno-menu-panel ${menuOpen ? "zajno-menu-panel--open" : ""}`}
        aria-hidden={!menuOpen}
        aria-label="Page sections"
      >
        {navLinks.map((link, index) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            tabIndex={menuOpen ? 0 : -1}
            aria-label={`Go to ${link.label}`}
            data-cursor="GO"
            onClick={(event) => {
              event.preventDefault();
              scrollTo(link.id);
            }}
          >
            <small>0{index + 1}</small>
            {link.label}
            <ArrowUpRight size={19} />
          </a>
        ))}
        <p>
          Independent digital practice
          <br />
          for people who care how software feels.
        </p>
      </nav>

      <div className="zajno-page-content">
        <section id="top" className="zajno-hero" style={{ textAlign: "center" }}>
          <div className="zajno-hero__top" style={{ justifyContent: "center" }}>
            <Label>Multan • PK</Label>
            <Label>Independent practice</Label>
          </div>
          <motion.div
            className="zajno-hero__content"
            style={{
              scale: heroScale,
              y: heroY,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
            }}
          >
            <div
              className="zajno-hero__copy"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                margin: "0 auto",
                maxWidth: "48rem",
              }}
            >
              <Label>Full-cycle product development</Label>
              <h1>
                <motion.span
                  className="matrix-text"
                  data-text="Designing"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={
                    introReady
                      ? { y: 0, opacity: 1 }
                      : { y: "100%", opacity: 0 }
                  }
                  transition={{
                    duration: 0.75,
                    delay: 0.12,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  Designing
                </motion.span>
                <br />
                <motion.span
                  className="matrix-text matrix-text--muted"
                  data-text="the feeling."
                  initial={{ y: "100%", opacity: 0 }}
                  animate={
                    introReady
                      ? { y: 0, opacity: 1 }
                      : { y: "100%", opacity: 0 }
                  }
                  transition={{
                    duration: 0.75,
                    delay: 0.2,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  the <em>feeling.</em>
                </motion.span>
              </h1>
              <p>{profile.bio}</p>
              <button
                className="zajno-arrow-link"
                type="button"
                data-cursor="WORK"
                onClick={() => scrollTo("work")}
              >
                Enter the work <ArrowDownRight size={17} />
              </button>
            </div>
          </motion.div>
          <div
            className="zajno-hero__bottom"
            style={{ justifyContent: "center" }}
          >
            <span>SCROLL TO EXPLORE</span>
            <MoveDown size={16} />
            <span>SAIM ALI / {profile.role?.toUpperCase()}</span>
          </div>
        </section>

        <section id="work" className="zajno-section zajno-work">
          <div className="zajno-section__head">
            <Label>Selected work</Label>
            <span>01—0{projects.length}</span>
          </div>
          <div className="zajno-work__intro">
            <motion.h2
              initial={{ y: 42, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
            >
              Work that
              <br />
              <em>moves.</em>
            </motion.h2>
            <p>
              From first principle to final polish, I build digital products
              that feel as good as they function. Each project below is a live
              product you can open, not a mock screenshot.
            </p>
          </div>
          <div className="zajno-work-list">
            {projects.map((project, index) => (
              <a
                className={`zajno-work-row ${
                  hoveredProject === index ? "zajno-work-row--active" : ""
                }`}
                style={{ position: "relative" }}
                data-cursor="VIEW"
                href={project.projectUrl || "#"}
                key={project.id ?? project.title}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                onFocus={() => setHoveredProject(index)}
                onBlur={() => setHoveredProject(null)}
              >
                <span className="zajno-work-row__number">0{index + 1}</span>
                <span
                  className="zajno-work-row__title"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  {project.title}
                  {index === 0 && (
                    <span
                      className="zajno-work-row__badge"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.2rem 0.6rem",
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        lineHeight: 1,
                        borderRadius: "999px",
                        whiteSpace: "nowrap",
                        color: "#111111",
                        background: "#D8FE3E",
                        border: "1px solid rgba(216, 254, 62)",
                        boxShadow: "0 4px 14px rgba(216, 254, 62)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#111111",
                        }}
                        aria-hidden="true"
                      />
                      Most Recent
                    </span>
                  )}
                </span>
                <span className="zajno-work-row__type">
                  {project.projectType}
                </span>

                <AnimatePresence>
                  {hoveredProject === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.88, y: "-40%", rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, y: "-50%", rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: "-45%", rotate: 1 }}
                      transition={{
                        duration: 0.32,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        position: "absolute",
                        right: "15%",
                        top: "50%",
                        width: "300px",
                        height: "175px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        pointerEvents: "none",
                        zIndex: 30,
                        boxShadow: "0 20px 45px rgba(0, 0, 0, 0.45)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      <img
                        src={project.imageUrl || FALLBACK.kinetic}
                        alt={`${project.title} project preview`}
                        width={300}
                        height={175}
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                          if (index === 0) {
                            event.currentTarget.src = FALLBACK.kinetic;
                          }
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <ArrowUpRight size={20} />
              </a>
            ))}
          </div>
        </section>

        <section id="studio" className="zajno-section zajno-studio">
          <div className="zajno-section__head">
            <Label>Studio / working style</Label>
            <span>02</span>
          </div>
          <div className="zajno-studio__grid">
            <div>
              <motion.h2
                initial={{ y: 42, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="matrix-text" data-text="A practice">
                  A practice
                </span>
                <br />
                between <em>systems</em>
                <br />
                and sensation.
              </motion.h2>
              <div className="zajno-studio__portrait">
                <img
                  src={profile.portraitUrl || FALLBACK.portrait}
                  alt={`Portrait of ${profile.name}, full-stack web developer in Multan, Pakistan`}
                  width={720}
                  height={900}
                  loading="lazy"
                  decoding="async"
                />
                <span>PROFILE_PHOTO.RAW</span>
              </div>
            </div>
            <div className="zajno-studio__copy">
              <p className="zajno-lead">{profile.bio}</p>
              <p>
                Every interaction should make the next decision easier. I work
                across product strategy, interface design, motion, and 3D to
                remove the friction between an idea and the way it feels in
                someone's hands.
              </p>
              <button
                className="zajno-arrow-link"
                type="button"
                data-cursor="CONTACT"
                onClick={() => scrollTo("contact")}
              >
                Let's make something clear <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
          <div className="zajno-stats">
            <div>
              <strong>01</strong>
              <span>Clear thinking</span>
            </div>
            <div>
              <strong>60</strong>
              <span>Frames / second</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>Details considered</span>
            </div>
          </div>
        </section>

        <article id="notes" className="zajno-section zajno-notes">
          <div className="zajno-section__head">
            <Label>Practice notes</Label>
            <span>02B</span>
          </div>
          <h2>How a small studio ships serious websites</h2>
          <p>
            I am {profile.name}, a full-stack web developer working from Multan,
            Pakistan, with clients who need a site that loads quickly, reads
            clearly, and still feels considered. Most of the work sits between
            product thinking and front-end engineering: information architecture,
            accessible layout, React or Next.js implementation, and the motion
            that explains a product without getting in the way.
          </p>
          <p>
            A typical engagement starts with constraints. Who is the page for,
            what should they do in the first thirty seconds, and which pages
            actually need to exist? From there I design in the browser whenever
            possible so spacing, type, and performance are decided together. That
            is slower than a slide deck and faster than discovering, after
            development, that the hero image is a megabyte and the form cannot
            be used on a phone.
          </p>
          <p>
            For teams that already have a brand, I translate art direction into
            a system: type scale, color tokens, reusable sections, and a CMS or
            form flow that a non-developer can live with. For founders still
            shaping the offer, I help cut the story down until a stranger can
            repeat it. Either way the public site should be honest enough for
            search engines and advertising review: real contact details, a
            privacy policy, original writing, and live work instead of stock
            filler.
          </p>
          <p>
            If you want to talk about a product, a rebuild, or a marketing site
            that has to earn its keep, write through the form below. I respond to every message within 24 hours.
          </p>
        </article>

        <section id="playground" className="zajno-playground">
          <div className="zajno-section__head">
            <Label>Capabilities</Label>
            <span>03</span>
          </div>
          <motion.h2
            initial={{ y: 42, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
          >
            We dare to
            <br />
            <em>make it felt.</em>
          </motion.h2>
          <div className="zajno-services">
            {[
              "Product design",
              "Web development",
              "Motion systems",
              "3D direction",
              "Creative technology",
            ].map((service, index) => (
              <div key={service}>
                <small>0{index + 1}</small>
                <span>{service}</span>
                <ArrowUpRight size={18} />
              </div>
            ))}
          </div>
          <div className="zajno-tech-strip">
            <div className="zajno-marquee__track">
              {[...technologies, ...technologies].map((technology, index) => (
                <span key={`${technology}-${index}`}>{technology}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="zajno-contact">
          <div className="zajno-section__head">
            <Label>Let's collaborate</Label>
            <span>04</span>
          </div>
          <div className="zajno-contact__grid">
            <div>
              <motion.h2
                initial={{ y: 42, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
              >
                Have an
                <br />
                <em>idea?</em>
              </motion.h2>
              <p>
                Bring the difficult part. We'll find the shape it was always
                meant to have.
              </p>
              <p className="zajno-contact-note">
                Use the form and your message lands directly in my inbox at{" "}
                {SITE_EMAIL}.
              </p>
            </div>

            <form
              ref={formRef}
              className="zajno-form"
              onSubmit={handleSubmit}
            >
              <div className="zajno-form__status">
                <span
                  className={formStatus === "idle" ? "zajno-live" : ""}
                  style={
                    formStatus === "submitting"
                      ? {
                          background: "#c85a32",
                          boxShadow: "0 0 0 3px rgba(200,90,50,0.18)",
                        }
                      : undefined
                  }
                />
                {formStatus === "submitting"
                  ? "TRANSMITTING…"
                  : formStatus === "succeeded"
                  ? "DELIVERED TO INBOX"
                  : "FORMSPREE / LIVE"}
              </div>

              <label>
                <span>01 / Your name</span>
                <input
                  data-cursor="WRITE"
                  required
                  minLength={2}
                  name="name"
                  autoComplete="name"
                  placeholder="Enter name"
                />
              </label>

              <label>
                <span>02 / Your email</span>
                <input
                  data-cursor="WRITE"
                  required
                  minLength={10}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter email"
                />
              </label>

              <label>
                <span>03 / Project details</span>
                <textarea
                  data-cursor="WRITE"
                  required
                  minLength={10}
                  name="message"
                  placeholder="Your project, goals, success criteria"
                  rows={4}
                />
              </label>

              <button
                className="zajno-submit"
                data-cursor="SEND"
                type="submit"
                disabled={formStatus === "submitting"}
              >
                {formStatus === "submitting" ? (
                  "Sending…"
                ) : (
                  <>
                    Send request <Send size={16} />
                  </>
                )}
              </button>

              {formStatus === "succeeded" && (
                <p className="zajno-success">
                  <Check size={15} /> Delivered to inbox — I'll respond within
                  24h.
                </p>
              )}

              {formStatus === "error" && (
                <p className="zajno-success" style={{ color: "#c85a32" }}>
                  <X size={15} /> Failed to send — try again or email{" "}
                  {SITE_EMAIL}.
                </p>
              )}
            </form>
          </div>

          <footer className="zajno-footer">
            <span>© 2026 {profile.name?.toUpperCase()}</span>
            <div>
              <a href={profile.githubUrl || "#"} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href={profile.linkedinUrl || "#"} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={profile.twitterUrl || "#"} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
              <Link href="/about">About</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
            <span>Made with intent</span>
          </footer>
        </section>
      </div>

      {/* ── NEW: floating scroll-down tag with animated code-drawn arrow ── */}
      <AnimatePresence>
        {showScrollTag && <ScrollDownTag key="scroll-down-tag" onClick={scrollToNextSection} />}
      </AnimatePresence>
    </main>
  );
}