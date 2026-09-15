import { createTRPCReact } from "@trpc/react-query";

/** Client stub. The live site uses static content and Formspree; no tRPC server ships with this build. */
export const trpc = createTRPCReact<Record<string, never>>();
