# Next.js + TypeScript + Supabase migration blueprint

The managed portfolio currently runs in the project’s full-stack React runtime so its preview, database gateway, and checkpoint workflow remain stable. The UI has been organized around the requested Next.js App Router shape and this document provides the direct migration map for a standalone Next.js deployment.

## Recommended App Router structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
  about/page.tsx
  portfolio/page.tsx
  techstack/page.tsx
  contact/page.tsx
  admin/page.tsx
  api/
    send-message/route.ts
    send-otp/route.ts
    verify-otp/route.ts
components/
  AnimationWrapper.tsx
  AwesomeNav.tsx
  CustomCursor.tsx
  Footer.tsx
  MatrixText.tsx
  TechnologyMarquee.tsx
  ui/
    skiper-ui/
lib/
  supabase/
    client.ts
    server.ts
  data.ts
  types.ts
public/
  favicon.ico
  images/
```

The current managed files map as follows: `client/src/pages/Home.tsx` becomes `app/page.tsx`; `client/src/pages/StudioPages.tsx` becomes the four route files under `app/about`, `app/portfolio`, `app/techstack`, and `app/contact`; the shared visual system in `client/src/index.css` becomes `app/globals.css`; and `client/src/components` maps directly to the new `components` directory.

## Supabase environment contract

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=server-only-key
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` belong in the browser-safe client helper. `SUPABASE_SERVICE_ROLE_KEY` must only be used in server actions or route handlers and must never be exposed to client components.

## Typed data model

```ts
export type PortfolioProfile = {
  id: number;
  name: string;
  role: string;
  headline: string;
  bio: string;
  availability: string;
  portrait_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
};

export type PortfolioProject = {
  id: number;
  title: string;
  project_type: string;
  summary: string;
  image_url: string;
  project_url: string | null;
  tags: string[];
  sort_order: number;
};

export type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};
```

The existing Drizzle tables already express the same concepts. For Supabase, create equivalent `profiles`, `technologies`, `projects`, and `contact_submissions` tables, enable row-level security, allow public reads for published portfolio content, and allow inserts into `contact_submissions` only after server-side validation. Do not expose an admin write policy to anonymous clients.

## Server route replacement

The current tRPC `portfolio.getAll` query maps to a server-side `getPortfolioData()` function in `lib/data.ts`. The current `contact.submit` mutation maps to `app/api/send-message/route.ts` or a server action. Keep the visitor email field because it is required for replies, but do not display an invented studio hello address. The visible contact page should continue to say that requests are received through the form.

## Page behavior

Use `app/layout.tsx` for the global font imports, `CustomCursor`, `AnimationWrapper`, and shared navigation. Keep `MatrixText` client-side because it reacts to pointer movement. Use server components for profile/project reads where possible, and keep form submission in a server action or route handler. Add `prefers-reduced-motion` handling to every animation component and preserve native pointer behavior on touch devices.

This blueprint is intentionally implementation-ready while the managed project continues to run on its supported runtime. A standalone Next.js deployment can be produced from this map once the Supabase project URL and keys are available.
