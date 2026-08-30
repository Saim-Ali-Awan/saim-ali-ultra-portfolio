import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  getPortfolioProfile: vi.fn(),
  getPortfolioTechnologies: vi.fn(),
  getFeaturedProjects: vi.fn(),
  createContactSubmission: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("portfolio persistence contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.getPortfolioProfile.mockResolvedValue({ id: 1, name: "Saim Ali" });
    dbMocks.getPortfolioTechnologies.mockResolvedValue([{ id: 1, name: "React", category: "Library", sortOrder: 1 }]);
    dbMocks.getFeaturedProjects.mockResolvedValue([
      { id: 1, title: "BITLINKS", tags: "Next.js, Tailwind, Framer", projectUrl: "https://bitlinksdev.vercel.app", imageUrl: "https://saimalidev.vercel.app/bitlinks.png", isFeatured: 1 },
      { id: 2, title: "K72 PLATFORM", tags: "React, Motion, Three.js", projectUrl: "https://k72agency.vercel.app", imageUrl: "https://saimalidev.vercel.app/k72.png", isFeatured: 1 },
      { id: 3, title: "CORE PORTFOLIO", tags: "Industrial UI, GSAP, Next.js", projectUrl: "https://saimaliportfolio.vercel.app", imageUrl: "https://saimalidev.vercel.app/portfolio.png", isFeatured: 1 },
    ]);
    dbMocks.createContactSubmission.mockResolvedValue({ id: 42 });
  });

  it("returns persisted profile, technologies, and parsed project tags", async () => {
    const result = await appRouter.createCaller(createContext()).portfolio.getAll();

    expect(result.profile?.name).toBe("Saim Ali");
    expect(result.technologies).toHaveLength(1);
    expect(result.projects).toHaveLength(3);
    expect(result.projects[0]?.tags).toEqual(["Next.js", "Tailwind", "Framer"]);
  });

  it("keeps the three source portfolio links and images in the public contract", async () => {
    const result = await appRouter.createCaller(createContext()).portfolio.getAll();

    expect(result.projects.map((project) => project.projectUrl)).toEqual([
      "https://bitlinksdev.vercel.app",
      "https://k72agency.vercel.app",
      "https://saimaliportfolio.vercel.app",
    ]);
    expect(result.projects.map((project) => project.imageUrl)).toEqual([
      "https://saimalidev.vercel.app/bitlinks.png",
      "https://saimalidev.vercel.app/k72.png",
      "https://saimalidev.vercel.app/portfolio.png",
    ]);
  });

  it("validates and persists a contact submission", async () => {
    const result = await appRouter.createCaller(createContext()).contact.submit({
      name: "Ada Lovelace",
      email: "ADA@EXAMPLE.COM",
      message: "I would like to discuss a new product experience.",
    });

    expect(result).toEqual({ success: true, id: 42 });
    expect(dbMocks.createContactSubmission).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I would like to discuss a new product experience.",
      status: "new",
    });
  });

  it("rejects malformed contact submissions before the database call", async () => {
    await expect(appRouter.createCaller(createContext()).contact.submit({
      name: "A",
      email: "not-an-email",
      message: "short",
    })).rejects.toThrow();
    expect(dbMocks.createContactSubmission).not.toHaveBeenCalled();
  });
});
