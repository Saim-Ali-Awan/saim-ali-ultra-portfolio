import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, MoveDown, Send } from "lucide-react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const FALLBACK = {
  hero: "/manus-storage/saima-hero-orbit_634b9293.jpg",
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
  ["01", "Next.js", "Framework"],
  ["02", "React", "Library"],
  ["03", "Three.js", "3D engine"],
  ["04", "Framer", "Interaction"],
  ["05", "GSAP", "Motion"],
  ["06", "Node.js", "Backend"],
];

const fallbackProjects = [
  { id: 1, title: "Kinetic / Commerce", projectType: "Product system", summary: "A conversion-minded interface where motion makes a complex product feel obvious.", imageUrl: FALLBACK.kinetic, projectUrl: "#", tags: ["Next.js", "Framer", "Strategy"] },
  { id: 2, title: "Depth / Interface", projectType: "Interactive 3D", summary: "An immersive web layer that turns navigation into spatial storytelling.", imageUrl: FALLBACK.depth, projectUrl: "#", tags: ["Three.js", "GSAP", "Art direction"] },
];

function SectionLabel({ number, children }: { number: string; children: string }) {
  return <div className="section-label"><span className="section-label__number">{number}</span><span>{children}</span></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cursorLabel, setCursorLabel] = useState("");
  const cursorX = useSpring(useMotionValue(-100), { stiffness: 420, damping: 32, mass: 0.35 });
  const cursorY = useSpring(useMotionValue(-100), { stiffness: 420, damping: 32, mass: 0.35 });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const portfolioQuery = trpc.portfolio.getAll.useQuery(undefined, { staleTime: 60_000 });
  const submitContact = trpc.contact.submit.useMutation();
  const profile = portfolioQuery.data?.profile ?? fallbackProfile;
  const projects = portfolioQuery.data?.projects?.length ? portfolioQuery.data.projects : fallbackProjects;
  const technologies = portfolioQuery.data?.technologies?.length
    ? portfolioQuery.data.technologies.map((item, index) => [String(index + 1).padStart(2, "0"), item.name, item.category] as const)
    : fallbackTechnologies;
  const contentIsPersisted = Boolean(portfolioQuery.data?.profile);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.2 });
  const orbRotate = useTransform(progress, [0, 1], [0, 260]);
  const orbY = useTransform(progress, [0, 0.35, 1], [0, -30, 95]);
  const heroTitleY = useTransform(progress, [0, 0.22], [0, -80]);
  const heroTitleOpacity = useTransform(progress, [0, 0.2], [1, 0.1]);
  const navLinks = useMemo(() => ["work", "system", "about", "contact"], []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => { document.documentElement.dataset.reducedMotion = media.matches ? "true" : "false"; };
    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);
    return () => media.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1150);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const moveCursor = (event: MouseEvent) => { cursorX.set(event.clientX); cursorY.set(event.clientY); };
    const setIntent = (event: Event) => {
      const target = event.target as HTMLElement;
      const interactive = target.closest("a, button, input, textarea");
      setCursorLabel(interactive?.getAttribute("data-cursor") || "");
    };
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", setIntent);
    return () => { window.removeEventListener("mousemove", moveCursor); window.removeEventListener("mouseover", setIntent); };
  }, [cursorX, cursorY]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await submitContact.mutateAsync(form);
      setForm({ name: "", email: "", message: "" });
      toast.success("Message saved. I’ll be in touch soon.");
    } catch {
      toast.error("Couldn’t save that message. Please try again.");
    }
  };

  return (
    <main className="portfolio-shell">
      <motion.div className={`site-loader ${isLoading ? "site-loader--visible" : ""}`} aria-hidden={!isLoading}>
        <div className="loader-topline"><span>SAIMALI / SYSTEM 01</span><span>INITIALIZING</span></div>
        <div className="loader-center"><span className="loader-glyph">S</span><strong>Designing<br />the feeling.</strong></div>
        <div className="loader-bottomline"><span>INTERFACE / MOTION / 3D</span><span>00—100</span></div>
        <motion.div className="loader-bar" initial={{ scaleX: 0 }} animate={{ scaleX: isLoading ? 0.86 : 1 }} transition={{ duration: 1.05, ease: [0.23, 1, 0.32, 1] }} />
      </motion.div>
      <motion.div className="custom-cursor" style={{ x: cursorX, y: cursorY }} aria-hidden="true"><span>{cursorLabel}</span></motion.div>
      <div className="noise" aria-hidden="true" />
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <button className="brand" data-cursor="TOP" onClick={() => scrollTo("top")} aria-label="Back to top"><img src={FALLBACK.mark} alt="" className="brand__mark" /><span className="brand__wordmark">SAIM<span>ALI</span></span></button>
        <div className="header-meta">DIGITAL PRODUCT ENGINEER <span>/</span> 2026</div>
        <button className={`menu-trigger ${menuOpen ? "menu-trigger--open" : ""}`} data-cursor="OPEN" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}><span className="menu-icon"><i /><i /></span><span>{menuOpen ? "Close" : "Index"}</span></button>
      </header>
      <nav className={`overlay-nav ${menuOpen ? "overlay-nav--open" : ""}`} aria-hidden={!menuOpen}>
        <div className="overlay-nav__eyebrow">Field notes / navigation</div>
        {navLinks.map((link, index) => <button key={link} data-cursor="GO" onClick={() => scrollTo(link === "work" ? "work" : link === "system" ? "system" : link)}><span>0{index + 1}</span>{link}</button>)}
        <p>Good systems should feel obvious<br />before they feel impressive.</p>
      </nav>
      <aside className="index-rail" aria-hidden="true"><span>SCROLL / FIELD NOTES</span><span className="index-rail__line" /><span>00—05</span></aside>

      <section id="top" className="hero-section">
        <div className="hero-section__grid" />
        {portfolioQuery.isLoading && <div className="data-banner" role="status">SYNCING CONTENT NODE / READING PORTFOLIO DATA</div>}
        {portfolioQuery.isError && <div className="data-banner data-banner--warning" role="status">CONTENT NODE UNAVAILABLE / DISPLAYING LAST-KNOWN EDITORIAL STATE</div>}
        <div className="hero-kicker"><span className="live-dot" /> {profile.role.toUpperCase()}</div>
        <motion.div className="hero-copy" style={{ y: heroTitleY, opacity: heroTitleOpacity }}>
          <p className="micro-label">{profile.name.toUpperCase()} / INDEPENDENT PRACTICE</p>
          <h1>Interfaces<br /><em>with a pulse.</em></h1>
          <p className="hero-description">{profile.bio}</p>
          <div className="hero-actions"><button className="button button--orange" data-cursor="MOVE" onClick={() => scrollTo("work")}>Move through the work <ArrowDownRight size={17} /></button><button className="button button--quiet" data-cursor="OPEN CHANNEL" onClick={() => scrollTo("contact")}>Open the channel <ArrowUpRight size={17} /></button></div>
        </motion.div>
        <motion.div className="hero-orbit" style={{ y: orbY, rotate: orbRotate }}><img src={FALLBACK.hero} alt="Abstract chrome orbital sculpture in a dark studio" /><span className="hero-orbit__annotation">OBJECT_01<br />DEPTH / MOTION</span></motion.div>
        <div className="hero-bottom-note"><MoveDown size={15} /> Scroll to enter the system</div>
      </section>

      <section id="system" className="manifesto-section section-pad">
        <div className="section-topline"><SectionLabel number="01">Philosophy</SectionLabel><span>LOGICAL FLUIDITY / 01</span></div>
        <div className="manifesto-layout"><h2>Good interfaces<br /><span>make complexity</span><br /><em>feel lighter.</em></h2><div className="manifesto-body"><p className="lead">I build with a bias toward clarity: clean modular architecture, responsive motion, and details that reward a second look.</p><p>Not decoration for decoration’s sake. Every transition has a job. Every layer earns its depth. I make the difficult part legible, then give it a pulse.</p><div className="manifesto-stamp"><span>BUILT FOR</span><strong>SPEED<br />&amp; PERFECTION</strong><span>60 FPS / ALWAYS IN MOTION</span></div></div></div>
      </section>

      <section id="work" className="work-section section-pad">
        <div className="section-topline"><SectionLabel number="02">Selected work</SectionLabel><span>CASE STUDIES / 2024—26</span></div>
        <div className="work-intro"><h2>See the thinking<br /><em>in motion.</em></h2><p>Two ways of thinking about the web: as a product surface, and as a place you can move through.</p></div>
        <div className="project-list">{projects.map((project, index) => <article className="project-card" key={project.id ?? project.title}><div className="project-card__media"><img src={project.imageUrl || (index === 0 ? FALLBACK.kinetic : FALLBACK.depth)} alt="" /><span className="project-card__number">{String(index + 1).padStart(2, "0")}</span><span className="project-card__view">View case study <ArrowUpRight size={17} /></span></div><div className="project-card__info"><div><span className="micro-label">{project.projectType}</span><h3>{project.title}</h3></div><p>{project.summary}</p><div className="project-tags">{project.tags.map((tag: string) => <span key={tag}>{tag}</span>)}</div></div></article>)}</div>
      </section>

      <section id="about" className="portrait-section section-pad"><div className="portrait-frame"><img src={profile.portraitUrl || FALLBACK.portrait} alt={`Portrait of ${profile.name}`} /><span>[ PROFILE_PHOTO.RAW ]</span></div><div className="portrait-copy"><SectionLabel number="03">About / working style</SectionLabel><h2>Precision is<br /><em>a point of view.</em></h2><p>{profile.bio}</p><button className="text-link" data-cursor="READ" onClick={() => scrollTo("contact")}>See the thinking in motion <ArrowUpRight size={17} /></button></div></section>

      <section className="stack-section section-pad"><div className="section-topline"><SectionLabel number="04">Core technologies</SectionLabel><span>VERSION 2026.4.0</span></div><div className="stack-grid">{technologies.map(([number, name, role]) => <div className="stack-item" key={name}><span className="stack-item__number">{number}</span><div><h3>{name}</h3><p>{role}</p></div><ArrowUpRight size={17} /></div>)}</div></section>

      <section id="contact" className="contact-section section-pad"><div className="contact-section__top"><SectionLabel number="05">Contact</SectionLabel><span>{profile.availability.toUpperCase()}</span></div><div className="contact-layout"><div><h2>Bring the<br /><em>difficult part.</em></h2><p>Send the difficult part. We’ll shape the solution until it feels like it could not have been built any other way.</p><a className="contact-email" data-cursor="MAIL" href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight size={25} /></a></div><form className="contact-form" onSubmit={submitForm}><div className="form-status"><span className={contentIsPersisted ? "status-light status-light--live" : "status-light"} />{contentIsPersisted ? "CONTENT NODE / LIVE" : "LOCAL FALLBACK / RECONNECTING"}</div><label><span>Your name</span><input data-cursor="WRITE" required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Saim's next collaborator" /></label><label><span>Email address</span><input data-cursor="WRITE" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" /></label><label><span>What are we making?</span><textarea data-cursor="WRITE" required minLength={10} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="The difficult part, in a sentence or two..." rows={4} /></label><button className="button button--orange form-submit" data-cursor="SEND" type="submit" disabled={submitContact.isPending}>{submitContact.isPending ? "Saving..." : <>Send the difficult part <Send size={16} /></>}</button>{submitContact.isSuccess && <p className="form-success"><Check size={15} /> Saved to the contact archive.</p>}</form></div><div className="contact-footer"><span>© 2026 {profile.name.toUpperCase()}</span><div><a data-cursor="VISIT" href={profile.githubUrl || "#"} target="_blank" rel="noreferrer">GitHub</a><a data-cursor="VISIT" href={profile.linkedinUrl || "#"} target="_blank" rel="noreferrer">LinkedIn</a><a data-cursor="VISIT" href={profile.twitterUrl || "#"} target="_blank" rel="noreferrer">X / Twitter</a></div><span>MADE WITH INTENT</span></div></section>
    </main>
  );
}
