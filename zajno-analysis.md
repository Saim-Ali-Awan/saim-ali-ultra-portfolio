# Zajno reference analysis

The provided Zajno home page is intentionally sparse at first paint and then resolves into a studio-style portfolio system. Its strongest observable patterns are a minimal top-level navigation (`work`, `studio`, `contact`) with a compact wordmark, a large editorial work index, full-bleed or immersive project presentation, and a clear service/studio narrative rather than a conventional personal résumé.

The design language is monochrome and art-directed, with high-contrast type, generous negative space, small metadata labels, and an interaction model that treats the page as an editorial stage. The home page emphasizes work entries with numbered index items, capability labels, award metadata, studio stats, and a long-form contact sequence. The site also exposes social links and a showreel invitation as secondary routes.

For Saima, the safe adaptation will preserve the structural ideas—minimal index navigation, numbered work archive, studio-like positioning, metadata-led case studies, and long-form contact flow—while using Saima’s own name, portfolio records, generated visuals, portrait, copy, and an original implementation of the interaction behavior. It will not copy Zajno’s source code, exact assets, branding, or proprietary typography files.

Proposed motion model: a quiet monochrome base; page-entry reveal with a measured loader; cursor-following index marker; large hover previews or media drift on work rows; smooth section transitions; nav overlay with stepped entry; and tactile form controls. Interactions will be reduced-motion aware and touch-safe.

## Live implementation check

The new Saima preview now resolves into a clean studio archive: black-and-paper hero, large stacked `Designing the feeling.` statement, circular 3D visual, thin metadata rails, numbered work rows, black studio section, acid capabilities section, and a structured collaboration form. The full-page desktop capture shows the page reading as one long visual system rather than a conventional portfolio stack.

The browser check confirmed the custom loader is visible at initial load, the new content hierarchy is present in the DOM, and the index control transitions from `index` to `close` while a full-height acid navigation panel slides in from the right with numbered destinations: work, studio, playground, and contact. The work list exposes two persisted projects and a hover-preview region using the existing project visuals. The contact area continues to show `CONTENT NODE / LIVE` and the tRPC-backed form.
