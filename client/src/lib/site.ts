export const SITE_URL = "https://saimalidev.com";
export const SITE_NAME = "Saim Ali";
export const SITE_TITLE = "Saim Ali | Full-Stack Web Developer & Digital Studio";
export const SITE_DESCRIPTION =
  "Saim Ali is a full-stack web developer in Multan, Pakistan. Independent digital studio for product design, React and Next.js development, motion systems, and high-conversion websites.";
export const SITE_EMAIL = "hello@saimalidev.com";
export const FORMSPREE_ID = "xkjnoean";

export const DEFAULT_PROFILE = {
  name: "Saim Ali",
  role: "Full-Stack Web Architect",
  headline: "Interfaces with a pulse.",
  bio: "I make complex digital products feel inevitable — fast to understand, satisfying to use, and precise down to the last transition.",
  email: SITE_EMAIL,
  availability: "Available for select freelance work",
  portraitUrl: "/saim.webp",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://x.com",
};

export const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "BITLINKS",
    projectType: "URL Shortening & Real-time Analytics Engine",
    summary:
      "A URL shortening and real-time analytics engine built for fast, measurable sharing.",
    imageUrl: "/bitlinks.webp",
    projectUrl: "https://bitlinksdev.vercel.app",
    tags: ["Next.js", "Tailwind", "Framer"],
  },
  {
    id: 2,
    title: "K72 PLATFORM",
    projectType: "Interactive Agency Platform",
    summary:
      "A motion-led agency platform translating bold art direction into a responsive digital system.",
    imageUrl: "/k72.webp",
    projectUrl: "https://k72agency.vercel.app",
    tags: ["React", "Motion", "Three.js"],
  },
  {
    id: 3,
    title: "OLD PORTFOLIO",
    projectType: "Personal portfolio archive",
    summary:
      "An earlier portfolio system exploring industrial UI, motion, and a modular archive language.",
    imageUrl: "/portfolio.webp",
    projectUrl: "https://saimaliportfolio.vercel.app",
    tags: ["Industrial UI", "GSAP", "Next.js"],
  },
];

export const DEFAULT_TECHNOLOGIES = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "Node.js",
];

export function setPageMeta(title: string, description: string, path = "/") {
  document.title = title;
  const canonicalHref = `${SITE_URL}${path}`;

  const ensure = (selector: string, create: () => HTMLElement) => {
    let node = document.head.querySelector(selector) as HTMLElement | null;
    if (!node) {
      node = create();
      document.head.appendChild(node);
    }
    return node;
  };

  const desc = ensure('meta[name="description"]', () => {
    const el = document.createElement("meta");
    el.setAttribute("name", "description");
    return el;
  });
  desc.setAttribute("content", description);

  const ogTitle = ensure('meta[property="og:title"]', () => {
    const el = document.createElement("meta");
    el.setAttribute("property", "og:title");
    return el;
  });
  ogTitle.setAttribute("content", title);

  const ogDesc = ensure('meta[property="og:description"]', () => {
    const el = document.createElement("meta");
    el.setAttribute("property", "og:description");
    return el;
  });
  ogDesc.setAttribute("content", description);

  const ogUrl = ensure('meta[property="og:url"]', () => {
    const el = document.createElement("meta");
    el.setAttribute("property", "og:url");
    return el;
  });
  ogUrl.setAttribute("content", canonicalHref);

  const canonical = ensure('link[rel="canonical"]', () => {
    const el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    return el;
  });
  canonical.setAttribute("href", canonicalHref);
}
