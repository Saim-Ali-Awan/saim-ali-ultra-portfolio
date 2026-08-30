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
