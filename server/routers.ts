import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createContactSubmission, getFeaturedProjects, getPortfolioProfile, getPortfolioTechnologies } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  portfolio: router({
    getAll: publicProcedure.query(async () => {
      const [profile, technologies, projects] = await Promise.all([
        getPortfolioProfile(),
        getPortfolioTechnologies(),
        getFeaturedProjects(),
      ]);
      return {
        profile: profile ?? null,
        technologies,
        projects: projects.map((project) => ({
          ...project,
          tags: project.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        })),
      };
    }),
  }),
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(120),
          email: z.string().trim().email().max(320),
          message: z.string().trim().min(10).max(5000),
        }),
      )
      .mutation(async ({ input }) => {
        const result = await createContactSubmission({
          name: input.name,
          email: input.email.toLowerCase(),
          message: input.message,
          status: "new",
        });
        return { success: true, id: result.id } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
