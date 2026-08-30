# Source route and content map

The original portfolio currently exposes Home, Tech stack, About, Portfolio, and Contact navigation. The home experience includes the identity line `Full-Stack Web Architect`, the hero copy about ultra-responsive web experiences, interactive 3D interfaces, and high-conversion web applications, two primary CTAs, and the portrait at `/saim.jpg`.

The philosophy section is titled `Logical Fluidity` and positions the work around speed, clean modular architecture, and smooth 60fps micro-interactions. The technology section contains Next.js, React, ThreeJS, Framer, GSAP, and Node.js. The footer describes Saim as a frontend web developer specializing in interactive user experiences, clean architecture, and modern web applications, with social links and freelance availability.

The redesigned managed project will make the route structure explicit with `/`, `/about`, `/portfolio`, `/contact`, and `/techstack` paths. The shared shell will use the observed source content and portrait while adapting the Zajno-inspired archive presentation into an original monochrome studio system. The visible contact UI will not display the unavailable hello email; it will use the persisted visitor contact form instead.
## Form-preservation inspection

The original home page exposes navigation links for Home, Tech stack, About, Portfolio, and Contact. Its home content includes the source portrait at `/saim.jpg`, technology items Next.js, React, ThreeJS, Framer, GSAP, and Node.js, and form-first messaging through the `GET IN TOUCH` route. The public home page does not expose an email address or the form endpoint in the rendered content; further delivery behavior should be preserved by leaving the current working form contract unchanged rather than introducing a new Resend sender/recipient configuration.

## Portfolio archive inspection

The original `/portfolio` route contains exactly three projects and the requested live links: **BITLINKS** at `https://bitlinksdev.vercel.app` with image `/bitlinks.png`, **K72 PLATFORM** at `https://k72agency.vercel.app` with image `/k72.png`, and **CORE PORTFOLIO** at `https://saimaliportfolio.vercel.app` with image `/portfolio.png`. The original page labels each as an operational Vercel-hosted live node. These three source image paths are suitable for the redesigned project rows as long as they remain referenced from the original public site or are copied to project storage according to the managed asset workflow.

## Contact-route inspection

Opening the original `/contact` route redirected to `/login`, where the site presents a Supabase-backed login screen. The public rendered page therefore does not expose the original contact form or its delivery endpoint without an authenticated session. The safe no-disruption decision is to preserve the current portfolio form contract and copy the source site’s public route styling/content, but not claim that the private original delivery path has been replicated without access to its authenticated implementation.
