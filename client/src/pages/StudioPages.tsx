import { FormEvent, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Send } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "../lib/trpc";

const portrait = "https://saimalidev.vercel.app/saim.jpg";
const fallback = {
  name: "Saim Ali",
  bio: "I make complex digital products feel inevitable — fast to understand, satisfying to use, and precise down to the last transition.",
  email: "",
  portraitUrl: portrait,
};

function PageHeader({ current }: { current: string }) {
  return <header className="route-header"><Link data-cursor="HOME" href="/" className="zajno-brand"><img src="/manus-storage/saima-mark_b8611117.png" alt="" /><span>saima<span>li</span><sup>®</sup></span></Link><span className="studio-label">{current} / SAIMALI®</span><Link data-cursor="INDEX" href="/" className="route-back"><ArrowUpRight size={15} /> back to index</Link></header>;
}

function RouteFooter() {
  return <footer className="route-footer"><span>© 2026 SAIM ALI</span><div><Link href="/portfolio">Portfolio</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div><span>Made with intent</span></footer>;
}

export function AboutPage() {
  const { data } = trpc.portfolio.getAll.useQuery(undefined, { staleTime: 60_000 });
  const profile = data?.profile ?? fallback;
  return <main className="route-page route-page--dark"><PageHeader current="about" /><section className="route-hero"><span className="studio-label">01 / About the practice</span><h1>A little<br /><em>obsessed</em><br />with the details.</h1><div className="route-two-col"><img className="route-portrait" src={profile.portraitUrl || portrait} alt={`Portrait of ${profile.name}`} /><div><p className="route-lead">A practice between systems and sensation.</p><p>{profile.bio}</p><p>Every interaction should make the next decision easier. I work across product strategy, interface design, motion, and 3D to remove the friction between an idea and the way it feels in someone’s hands.</p><Link className="zajno-arrow-link" data-cursor="WORK" href="/portfolio">See the work <ArrowDownRight size={17} /></Link></div></div></section><RouteFooter /></main>;
}

export function PortfolioPage() {
  const { data } = trpc.portfolio.getAll.useQuery(undefined, { staleTime: 60_000 });
  const projects = data?.projects?.length ? data.projects : [
    { id: 1, title: "BITLINKS", projectType: "URL Shortening & Real-time Analytics Engine", summary: "A URL shortening and real-time analytics engine built for fast, measurable sharing.", imageUrl: "https://saimalidev.vercel.app/bitlinks.png", projectUrl: "https://bitlinksdev.vercel.app", tags: ["Next.js", "Tailwind", "Framer"] },
    { id: 2, title: "K72 PLATFORM", projectType: "Interactive Agency Platform", summary: "A motion-led agency platform translating bold art direction into a responsive digital system.", imageUrl: "https://saimalidev.vercel.app/k72.png", projectUrl: "https://k72agency.vercel.app", tags: ["React", "Motion", "Three.js"] },
    { id: 3, title: "CORE PORTFOLIO", projectType: "Industrial Portfolio System", summary: "An earlier portfolio system exploring industrial UI, motion, and a modular archive language.", imageUrl: "https://saimalidev.vercel.app/portfolio.png", projectUrl: "https://saimaliportfolio.vercel.app", tags: ["Industrial UI", "GSAP", "Next.js"] },
  ];
  return <main className="route-page"><PageHeader current="portfolio" /><section className="route-hero route-hero--portfolio"><span className="studio-label">02 / Selected work</span><h1>Projects<br /><em>in motion.</em></h1><div className="route-projects">{projects.map((project, index) => <a className="route-project" data-cursor="VIEW" href={project.projectUrl || "#"} key={project.id ?? project.title}><span className="route-project__index">0{index + 1}</span><img src={project.imageUrl || (index ? "/manus-storage/saima-project-depth_7dc27813.jpg" : "/manus-storage/saima-project-kinetic_c3802524.jpg")} alt="" /><div><span className="studio-label">{project.projectType}</span><h2>{project.title}</h2><p>{project.summary}</p><span className="route-project__meta">{project.tags.join(" / ")} <ArrowUpRight size={17} /></span></div></a>)}</div></section><RouteFooter /></main>;
}

export function TechStackPage() {
  const { data } = trpc.portfolio.getAll.useQuery(undefined, { staleTime: 60_000 });
  const items = data?.technologies?.length ? data.technologies : ["Next.js", "React", "Three.js", "Framer", "GSAP", "Node.js"].map((name) => ({ id: name, name, category: "Technology" }));
  return <main className="route-page route-page--acid"><PageHeader current="tech stack" /><section className="route-hero"><span className="studio-label">03 / System capabilities</span><h1>Tools for<br /><em>the feeling.</em></h1><div className="route-tech-list">{items.map((item, index) => <div key={item.id ?? item.name}><span>0{index + 1}</span><strong>{item.name}</strong><small>{item.category}</small><ArrowUpRight size={17} /></div>)}</div></section><RouteFooter /></main>;
}

export function ContactPage() {
  const submitContact = trpc.contact.submit.useMutation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); try { await submitContact.mutateAsync(form); setForm({ name: "", email: "", message: "" }); toast.success("Request received. I’ll be in touch soon."); } catch { toast.error("The request could not be saved. Please try again."); } };
  return <main className="route-page"><PageHeader current="contact" /><section className="route-hero route-hero--contact"><span className="studio-label">04 / Let’s collaborate</span><h1>Have an<br /><em>idea?</em></h1><div className="route-contact-grid"><div><p className="route-lead">Bring the difficult part. We’ll find the shape it was always meant to have.</p><p>Use the form and your project request will land in the studio archive.</p></div><form className="zajno-form" onSubmit={submit}><div className="zajno-form__status"><span className="zajno-live" /> CONTENT NODE / LIVE</div><label><span>01 / Your name</span><input data-cursor="WRITE" required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter name" /></label><label><span>02 / Your email</span><input data-cursor="WRITE" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Enter email" /></label><label><span>03 / Project details</span><textarea data-cursor="WRITE" required minLength={10} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Your project, goals, success criteria" rows={4} /></label><button className="zajno-submit" data-cursor="SEND" disabled={submitContact.isPending}>{submitContact.isPending ? "Sending..." : <>Send request <Send size={16} /></>}</button>{submitContact.isSuccess && <p className="zajno-success"><Check size={15} /> Saved to the contact archive.</p>}</form></div></section><RouteFooter /></main>;
}
