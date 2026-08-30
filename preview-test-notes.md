# Live preview test notes

The rebuilt preview is responding at the managed dev URL and renders the Kinetic Systems visual direction instead of the unstyled template. The preview exposes the profile content, featured projects, technologies, contact form, and the `CONTENT NODE / LIVE` status indicator from the database-backed query.

The first viewport shows the archive-ivory dotted field, persistent progress bar, fixed header, oversized display headline, orange action layer, circular orbital hero image, and the scroll field-notes rail. The full-page capture shows the green philosophy section, offset project media, black about section, technology grid, and orange contact module with clear contrast and responsive composition.

The index navigation interaction works: the `INDEX` trigger opens an orange overlay with accessible navigation buttons for work, system, about, and contact; the trigger changes to `CLOSE` and the page remains visible behind it.

The contact form is present with persisted content status, but a live form submission has not yet been sent because submitting creates a durable contact record. Next test step is to populate the form and submit it after explicit user confirmation if they want a real contact record created during QA.

Additional QA: scrolling one viewport moved from the hero into the green philosophy section while preserving the fixed header, progress bar, and field-notes rail. The index `work` action then navigated to the selected-work section, where the asymmetrical case-study composition and generated 3D project image rendered correctly.

The confirmed QA form submission completed successfully: the UI cleared the form, showed the toast `Message saved. I’ll be in touch soon.`, and displayed `Saved to the contact archive.` The submitted values were the clearly labeled QA Portfolio Test record using qa@saimalidev.com. A direct database count query is the final persistence check.

Premium interaction QA: reloading the preview showed the cinematic black loader with `Designing the feeling.` and the copper progress bar before the page revealed. The header interaction exposes `OPEN` on the hamburger, then the browser state changes to `CLOSE` while the overlay navigation is visible, confirming the hamburger-to-cross state transition and stagger-ready nav structure.

Refinement QA: desktop reload displayed the cinematic loader with `Designing the feeling.` before revealing the site. The live browser switched from `OPEN` to `CLOSE` on the header control and displayed the orange navigation panel. Desktop and mobile screenshot captures show the new bone / smoked-ink / mineral-sage / copper palette and the responsive hero composition. The native pointer is disabled on fine-pointer devices in CSS, with the custom tracking cursor rendered in the React tree; coarse-pointer and reduced-motion fallbacks hide it.

Reduced-motion QA: the live browser confirmed the custom cursor is mounted, the native cursor computes to `none` on the fine-pointer viewport, and a reduced-motion emulation check verified loader hidden, cursor hidden, and nav animation disabled. Essential content remained present in the DOM.

Final verification: live preview rendered the persisted refined bio and the new premium action language (`OPEN THE CHANNEL`, `SEE THE THINKING IN MOTION`, `SEND THE DIFFICULT PART`). The browser inspection found the loader mounted, native cursor computed to `none`, and 17 cursor intent labels covering header, nav, CTAs, contact fields, email, submit, and social links. The current browser reports `prefers-reduced-motion: false`; the app includes a dedicated reduced-motion media path that hides the loader/cursor and suppresses nav stagger when that preference is active.

Runtime reduced-motion QA: toggling the application’s motion-preference bridge to `true` in the live browser produced `loaderVisibility: hidden`, `cursorDisplay: none`, `navAnimation: none`, and `essentialContentPresent: true`. This verifies the accessibility fallback without stylesheet injection; the bridge listens to the real `prefers-reduced-motion` media query and updates when the browser preference changes.
## Follow-up redesign QA

The updated live preview now exposes the source portrait in the studio section, duplicates the technology list into a continuous marquee track, removes the unavailable hello email from the visible contact UI, and adds explicit `/about`, `/portfolio`, `/techstack`, and `/contact` route pages. Home content is readable on the paper/black/acid surfaces in the desktop and mobile captures.

The browser menu check confirms the control changes to `close`, exposes `Go to work`, `Go to studio`, `Go to playground`, and `Go to contact` labels, and keeps the panel fully interactive. The implementation closes the menu on Escape, removes hidden navigation links from tab order, and locks background scroll while open. `pnpm check` and `pnpm test` pass.

## Latest accessibility and route QA

The direct `/portfolio` route renders the source project titles, project media, route header, and back-to-index link. The home browser check shows the source portrait, the continuously moving technology strip content, the form-first contact copy, and the updated content status.

After opening the index menu, the trigger switches to `close`, the route controls expose explicit Go to labels, and the panel visually receives keyboard focus styling. The code now focuses the first menu button on open, traps Tab and Shift+Tab within the menu buttons, restores focus to the trigger on close, adds `aria-controls`, removes hidden controls from tab order, marks the background page content `aria-hidden`, and locks background scroll.

## Navbar motion update QA

The home preview now uses in-view heading reveals for the work, studio, capabilities, and contact headings in addition to the hero text entrance. The desktop index panel spans the full viewport width with its acid surface and staggered destination rows; the mobile rule constrains it to 50vw while preserving readable controls. The menu remains accessible with Escape close, focus entry, Tab trapping, focus restoration, and background scroll suppression. The native browser cursor remains active.
