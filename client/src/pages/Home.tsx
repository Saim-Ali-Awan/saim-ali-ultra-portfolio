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
import { trpc } from "../lib/trpc";
import { useForm } from "@formspree/react";

const FORMSPREE_ID = "xkjnoean";

const FALLBACK = {
  kinetic: "/manus-storage/saima-project-kinetic_c3802524.jpg",
  depth: "/manus-storage/saima-project-depth_7dc27813.jpg",
  mark: "/manus-storage/saima-mark_b8611117.png",
  portrait: "https://saimalidev.vercel.app/saim.jpg",
};

const fallbackProfile = {
  name: "Saim Ali",
  role: "Full-Stack Web Architect",
  headline: "Interfaces with a pulse.",
  bio: "I make complex digital products feel inevitable — fast to understand, satisfying to use, and precise down to the last transition.",
  email: "hello@saimalidev.com",
  availability: "Available for select freelance work",
  portraitUrl: FALLBACK.portrait,
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://x.com",
};

const fallbackTechnologies = [
  "Next.js",
  "React",
  "Three.js",
  "Framer",
  "GSAP",
  "Node.js",
];

const fallbackProjects = [
  {
    id: 1,
    title: "BITLINKS",
    projectType: "URL Shortening & Real-time Analytics Engine",
    summary:
      "A URL shortening and real-time analytics engine built for fast, measurable sharing.",
    imageUrl: "https://saimalidev.vercel.app/bitlinks.png",
    projectUrl: "https://bitlinksdev.vercel.app",
    tags: ["Next.js", "Tailwind", "Framer"],
  },
  {
    id: 2,
    title: "K72 PLATFORM",
    projectType: "Interactive Agency Platform",
    summary:
      "A motion-led agency platform translating bold art direction into a responsive digital system.",
    imageUrl: "https://saimalidev.vercel.app/k72.png",
    projectUrl: "https://k72agency.vercel.app",
    tags: ["React", "Motion", "Three.js"],
  },
  {
    id: 3,
    title: "CORE PORTFOLIO",
    projectType: "Industrial Portfolio System",
    summary:
      "An earlier portfolio system exploring industrial UI, motion, and a modular archive language.",
    imageUrl: "https://saimalidev.vercel.app/portfolio.png",
    projectUrl: "https://saimaliportfolio.vercel.app",
    tags: ["Industrial UI", "GSAP", "Next.js"],
  },
];

function Label({ children }: { children: string }) {
  return <span className="studio-label">{children}</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progressCount, setProgressCount] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const [formState, handleSubmit] = useForm(FORMSPREE_ID);

  // Safe tRPC Query Execution with fallback protection
  const portfolioQuery = trpc?.portfolio?.getAll?.useQuery?.(undefined, {
    staleTime: 60_000,
    retry: false,
  }) ?? { data: null, isLoading: false, isError: true };

  const profile = portfolioQuery?.data?.profile ?? fallbackProfile;
  const projects = portfolioQuery?.data?.projects?.length
    ? portfolioQuery.data.projects
    : fallbackProjects;
  const technologies = portfolioQuery?.data?.technologies?.length
    ? portfolioQuery.data.technologies.map((item: any) => item.name)
    : fallbackTechnologies;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.25,
  });
  const heroScale = useTransform(progress, [0, 0.18], [1, 0.92]);
  const heroY = useTransform(progress, [0, 0.2], [0, -90]);

  const navLinks = useMemo(
    () => ["work", "studio", "playground", "contact"],
    []
  );

  // Smooth 0 to 100 progress counter animation
  useEffect(() => {
    let frameId: number;
    const startTime = performance.now();
    const duration = 1400;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
      const count = Math.floor(easedProgress * 100);

      setProgressCount(count);

      if (rawProgress < 1) {
        frameId = requestAnimationFrame(updateProgress);
      } else {
        setProgressCount(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 350);
      }
    };

    frameId = requestAnimationFrame(updateProgress);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      document.documentElement.dataset.reducedMotion = media.matches
        ? "true"
        : "false";
    };
    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);

    return () => {
      cancelAnimationFrame(frameId);
      media.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (formState.succeeded) {
      formRef.current?.reset();
    }
  }, [formState.succeeded]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) {
      window.requestAnimationFrame(() =>
        menuPanelRef.current
          ?.querySelector<HTMLButtonElement>("button")
          ?.focus()
      );
    } else {
      menuTriggerRef.current?.focus();
    }
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
        panel?.querySelectorAll<HTMLButtonElement>("button") ?? []
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    panel?.addEventListener("keydown", trapFocus);
    return () => panel?.removeEventListener("keydown", trapFocus);
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="zajno-shell">
      {/* 0 to 100 loader with smooth background dissolve animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="zajno-loader"
            className="zajno-loader zajno-loader--visible"
            initial={{ opacity: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              filter: "blur(12px)",
              scale: 1.02,
              transition: { duration: 0.75, ease: [0.77, 0, 0.175, 1] },
            }}
            style={{ pointerEvents: "all" }}
            aria-hidden={!isLoading}
          >
            <span>SAIMALI® / DIGITAL STUDIO</span>
            <strong>{String(progressCount).padStart(2, "0")}</strong>
            <span>LOADING EXPERIENCE</span>
            <div
              className="zajno-loader__bar"
              style={{
                transform: `scaleX(${progressCount / 100})`,
                transformOrigin: "left center",
                transition: "transform 0.05s linear",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="zajno-progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <header className="zajno-header">
        <button
          className="zajno-brand"
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
      >
        {navLinks.map((link, index) => (
          <button
            key={link}
            tabIndex={menuOpen ? 0 : -1}
            aria-label={`Go to ${link}`}
            data-cursor="GO"
            onClick={() => scrollTo(link)}
          >
            <small>0{index + 1}</small>
            {link}
            <ArrowUpRight size={19} />
          </button>
        ))}
        <p>
          Independent digital practice
          <br />
          for people who care how software feels.
        </p>
      </nav>

      <div className="zajno-page-content">
        <section id="top" className="zajno-hero" style={{ textAlign: "center" }}>
          <div
            className="zajno-hero__top"
            style={{ justifyContent: "center" }}
          >
            <Label>Pakistan</Label>
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
                    isLoading
                      ? { y: "100%", opacity: 0 }
                      : { y: 0, opacity: 1 }
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
                    isLoading
                      ? { y: "100%", opacity: 0 }
                      : { y: 0, opacity: 1 }
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
              that feel as good as they function.
            </p>
          </div>
          <div className="zajno-work-list">
            {projects.map((project: any, index: number) => (
              <a
                className={`zajno-work-row ${
                  hoveredProject === index ? "zajno-work-row--active" : ""
                }`}
                style={{ position: "relative" }}
                data-cursor="VIEW"
                href={project.projectUrl || "#"}
                key={project.id ?? project.title}
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                onFocus={() => setHoveredProject(index)}
                onBlur={() => setHoveredProject(null)}
              >
                <span className="zajno-work-row__number">0{index + 1}</span>
                <span className="zajno-work-row__title">{project.title}</span>
                <span className="zajno-work-row__type">
                  {project.projectType}
                </span>

                {/* Floating Hover Card Directly Over the Line */}
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
                        alt={project.title}
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
                  alt={`Portrait of ${profile.name}`}
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
                Use the form and your message lands directly in my inbox.
              </p>
            </div>

            <form
              ref={formRef}
              className="zajno-form"
              onSubmit={handleSubmit}
            >
              <div className="zajno-form__status">
                <span
                  className={formState.submitting ? "" : "zajno-live"}
                  style={
                    formState.submitting
                      ? {
                          background: "#c85a32",
                          boxShadow: "0 0 0 3px rgba(200,90,50,0.18)",
                        }
                      : undefined
                  }
                />
                {formState.submitting
                  ? "TRANSMITTING…"
                  : formState.succeeded
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
                  placeholder="Enter name"
                />
              </label>

              <label>
                <span>02 / Your email</span>
                <input
                  data-cursor="WRITE"
                  required
                  type="email"
                  name="email"
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
                disabled={formState.submitting}
              >
                {formState.submitting ? (
                  "Sending…"
                ) : (
                  <>
                    Send request <Send size={16} />
                  </>
                )}
              </button>

              {formState.succeeded && (
                <p className="zajno-success">
                  <Check size={15} /> Delivered to inbox — I'll respond within
                  24h.
                </p>
              )}

              {formState.errors && formState.errors.length > 0 && !formState.succeeded && (
                <p className="zajno-success" style={{ color: "#c85a32" }}>
                  <X size={15} /> Failed to send — try again or email directly.
                </p>
              )}
            </form>
          </div>

          <footer className="zajno-footer">
            <span>© 2026 {profile.name?.toUpperCase()}</span>
            <div>
              <a
                data-cursor="VISIT"
                href={profile.githubUrl || "#"}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                data-cursor="VISIT"
                href={profile.linkedinUrl || "#"}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                data-cursor="VISIT"
                href={profile.twitterUrl || "#"}
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            </div>
            <span>Made with intent</span>
          </footer>
        </section>
      </div>
    </main>
  );
}