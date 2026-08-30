import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Menu, MoveDown, Send, X } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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

const fallbackTechnologies = ["Next.js", "React", "Three.js", "Framer", "GSAP", "Node.js"];
const fallbackProjects = [
  { id: 1, title: "Kinetic / Commerce", projectType: "Product system", summary: "A conversion-minded interface where motion makes a complex product feel obvious.", imageUrl: FALLBACK.kinetic, projectUrl: "#", tags: ["Next.js", "Framer", "Strategy"] },
  { id: 2, title: "Depth / Interface", projectType: "Interactive 3D", summary: "An immersive web layer that turns navigation into spatial storytelling.", imageUrl: FALLBACK.depth, projectUrl: "#", tags: ["Three.js", "GSAP", "Art direction"] },
];

function Label({ children }: { children: string }) {
  return <span className="studio-label">{children}</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const portfolioQuery = trpc.portfolio.getAll.useQuery(undefined, { staleTime: 60_000 });
  const submitContact = trpc.contact.submit.useMutation();
  const profile = portfolioQuery.data?.profile ?? fallbackProfile;
  const projects = portfolioQuery.data?.projects?.length ? portfolioQuery.data.projects : fallbackProjects;
  const technologies = portfolioQuery.data?.technologies?.length ? portfolioQuery.data.technologies.map((item) => item.name) : fallbackTechnologies;
  const contentIsPersisted = Boolean(portfolioQuery.data?.profile);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.25 });
  const heroScale = useTransform(progress, [0, 0.18], [1, 0.92]);
  const heroY = useTransform(progress, [0, 0.2], [0, -90]);

  const navLinks = useMemo(() => ["work", "studio", "playground", "contact"], []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1050);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => { document.documentElement.dataset.reducedMotion = media.matches ? "true" : "false"; };
    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);
    return () => { window.clearTimeout(timer); media.removeEventListener("change", syncMotionPreference); };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) {
      window.requestAnimationFrame(() => menuPanelRef.current?.querySelector<HTMLButtonElement>("button")?.focus());
    } else {
      menuTriggerRef.current?.focus();
    }
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const panel = menuPanelRef.current;
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = Array.from(panel?.querySelectorAll<HTMLButtonElement>("button") ?? []);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    panel?.addEventListener("keydown", trapFocus);
    return () => panel?.removeEventListener("keydown", trapFocus);
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await submitContact.mutateAsync(form);
      setForm({ name: "", email: "", message: "" });
      toast.success("Request received. I’ll be in touch soon.");
    } catch {
      toast.error("The request could not be saved. Please try again.");
    }
  };

  return (
    <main className="zajno-shell">
      <motion.div className={`zajno-loader ${isLoading ? "zajno-loader--visible" : ""}`} aria-hidden={!isLoading}>
        <span>SAIMALI® / DIGITAL STUDIO</span><strong>00</strong><span>LOADING EXPERIENCE</span>
        <motion.div className="zajno-loader__bar" initial={{ scaleX: 0 }} animate={{ scaleX: isLoading ? 0.88 : 1 }} transition={{ duration: 0.95, ease: [0.77, 0, 0.175, 1] }} />
      </motion.div>
      <motion.div className="zajno-progress" style={{ scaleX: progress }} aria-hidden="true" />

      <header className="zajno-header">
        <button className="zajno-brand" data-cursor="TOP" onClick={() => scrollTo("top")} aria-label="Back to top"><img src={FALLBACK.mark} alt="" /><span>saima<span>li</span><sup>®</sup></span></button>
        <div className="zajno-header__meta">digital studio <span>/</span> 2015—26</div>
        <button ref={menuTriggerRef} className={`zajno-menu ${menuOpen ? "zajno-menu--open" : ""}`} data-cursor="MENU" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-controls="site-index-panel">{menuOpen ? <X size={18} /> : <Menu size={18} />}<span>{menuOpen ? "close" : "index"}</span></button>
      </header>

      <nav ref={menuPanelRef} id="site-index-panel" className={`zajno-menu-panel ${menuOpen ? "zajno-menu-panel--open" : ""}`} aria-hidden={!menuOpen}>
        {navLinks.map((link, index) => <button key={link} tabIndex={menuOpen ? 0 : -1} aria-label={`Go to ${link}`} data-cursor="GO" onClick={() => scrollTo(link)}><small>0{index + 1}</small>{link}<ArrowUpRight size={19} /></button>)}
        <p>Independent digital practice<br />for people who care how software feels.</p>
      </nav>

      <div className="zajno-page-content" aria-hidden={menuOpen}>
      <section id="top" className="zajno-hero">
        <div className="zajno-hero__top"><Label>Los Angeles, CA</Label><Label>Independent practice</Label></div>
        <motion.div className="zajno-hero__content" style={{ scale: heroScale, y: heroY }}>
          <div className="zajno-hero__copy"><Label>Full-cycle product development</Label><h1><motion.span className="matrix-text" data-text="Designing" initial={{ y: "100%", opacity: 0 }} animate={isLoading ? { y: "100%", opacity: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.75, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}>Designing</motion.span><br /><motion.span className="matrix-text matrix-text--muted" data-text="the feeling." initial={{ y: "100%", opacity: 0 }} animate={isLoading ? { y: "100%", opacity: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.75, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}>the <em>feeling.</em></motion.span></h1><p>{profile.bio}</p><button className="zajno-arrow-link" data-cursor="WORK" onClick={() => scrollTo("work")}>Enter the work <ArrowDownRight size={17} /></button></div>
          <div className="zajno-hero__visual"><img src={FALLBACK.hero} alt="Abstract chrome orbital sculpture in a dark studio" /><span>OBJECT / 01</span></div>
        </motion.div>
        <div className="zajno-hero__bottom"><span>SCROLL TO EXPLORE</span><MoveDown size={16} /><span>SAIM ALI / {profile.role.toUpperCase()}</span></div>
      </section>

      <section id="work" className="zajno-section zajno-work">
        <div className="zajno-section__head"><Label>Selected work</Label><span>01—0{projects.length}</span></div>
        <div className="zajno-work__intro"><h2>Work that<br /><em>moves.</em></h2><p>From first principle to final polish, I build digital products that feel as good as they function.</p></div>
        <div className="zajno-work-list">{projects.map((project, index) => <a className={`zajno-work-row ${activeProject === index ? "zajno-work-row--active" : ""}`} data-cursor="VIEW" href={project.projectUrl || "#"} key={project.id ?? project.title} onMouseEnter={() => setActiveProject(index)} onFocus={() => setActiveProject(index)}><span className="zajno-work-row__number">0{index + 1}</span><span className="zajno-work-row__title">{project.title}</span><span className="zajno-work-row__type">{project.projectType}</span><ArrowUpRight size={20} /></a>)}</div>
        <div className="zajno-work-preview"><img src={projects[activeProject]?.imageUrl || FALLBACK.kinetic} alt="" /><span>Hover a project / See the thinking in motion</span></div>
      </section>

      <section id="studio" className="zajno-section zajno-studio">
        <div className="zajno-section__head"><Label>Studio / working style</Label><span>02</span></div>
        <div className="zajno-studio__grid"><div><h2><span className="matrix-text" data-text="A practice">A practice</span><br />between <em>systems</em><br />and sensation.</h2><div className="zajno-studio__portrait"><img src={profile.portraitUrl || FALLBACK.portrait} alt={`Portrait of ${profile.name}`} /><span>PROFILE_PHOTO.RAW</span></div></div><div className="zajno-studio__copy"><p className="zajno-lead">{profile.bio}</p><p>Every interaction should make the next decision easier. I work across product strategy, interface design, motion, and 3D to remove the friction between an idea and the way it feels in someone’s hands.</p><button className="zajno-arrow-link" data-cursor="CONTACT" onClick={() => scrollTo("contact")}>Let’s make something clear <ArrowUpRight size={17} /></button></div></div>
        <div className="zajno-stats"><div><strong>01</strong><span>Clear thinking</span></div><div><strong>60</strong><span>Frames / second</span></div><div><strong>∞</strong><span>Details considered</span></div></div>
      </section>

      <section id="playground" className="zajno-playground"><div className="zajno-section__head"><Label>Capabilities</Label><span>03</span></div><h2>We dare to<br /><em>make it felt.</em></h2><div className="zajno-services">{["Product design", "Web development", "Motion systems", "3D direction", "Creative technology"].map((service, index) => <div key={service}><small>0{index + 1}</small><span>{service}</span><ArrowUpRight size={18} /></div>)}</div><div className="zajno-tech-strip"><div className="zajno-marquee__track">{[...technologies, ...technologies].map((technology, index) => <span key={`${technology}-${index}`}>{technology}</span>)}</div></div></section>

      <section id="contact" className="zajno-contact">
        <div className="zajno-section__head"><Label>Let’s collaborate</Label><span>04</span></div>
        <div className="zajno-contact__grid"><div><h2>Have an<br /><em>idea?</em></h2><p>Bring the difficult part. We’ll find the shape it was always meant to have.</p><p className="zajno-contact-note">No hello email. Use the form and your project will land in the studio archive.</p></div><form className="zajno-form" onSubmit={submitForm}><div className="zajno-form__status"><span className={contentIsPersisted ? "zajno-live" : ""} />{contentIsPersisted ? "CONTENT NODE / LIVE" : "LOCAL FALLBACK / RECONNECTING"}</div><label><span>01 / Your name</span><input data-cursor="WRITE" required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter name" /></label><label><span>02 / Your email</span><input data-cursor="WRITE" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Enter email" /></label><label><span>03 / Project details</span><textarea data-cursor="WRITE" required minLength={10} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Your project, goals, success criteria" rows={4} /></label><button className="zajno-submit" data-cursor="SEND" type="submit" disabled={submitContact.isPending}>{submitContact.isPending ? "Sending..." : <>Send request <Send size={16} /></>}</button>{submitContact.isSuccess && <p className="zajno-success"><Check size={15} /> Saved to the contact archive.</p>}</form></div>
        <footer className="zajno-footer"><span>© 2026 {profile.name.toUpperCase()}</span><div><a data-cursor="VISIT" href={profile.githubUrl || "#"} target="_blank" rel="noreferrer">GitHub</a><a data-cursor="VISIT" href={profile.linkedinUrl || "#"} target="_blank" rel="noreferrer">LinkedIn</a><a data-cursor="VISIT" href={profile.twitterUrl || "#"} target="_blank" rel="noreferrer">Twitter</a></div><span>Made with intent</span></footer>
      </section>
      </div>
    </main>
  );
}
