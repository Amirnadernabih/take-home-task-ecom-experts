# Phase 9 — Responsive Fidelity Pass for Desktop, Tablet, and Mobile

**Recommended Cursor model:** Claude Sonnet / Auto. For full visual refactor, use the strongest available coding model.

## Goal
Make the prototype visually coherent across the three screenshot patterns: desktop two-column, medium stacked, and phone.

## Breakpoints to implement
Use CSS that behaves approximately like this:

```css
/* Desktop */
@media (min-width: 1024px) {
  /* two columns: builder + right review */
}

/* Medium */
@media (max-width: 1023px) {
  /* stack review below builder */
}

/* Mobile */
@media (max-width: 640px) {
  /* compact one-column phone layout */
}
```

Adjust breakpoints if the screenshots look better with slightly different values.

## Desktop requirements
- Main app max width around `1180px`.
- Builder column takes the remaining space.
- Review panel width around `340px` to `370px`.
- Gap around `24px`.
- Camera grid should look close to screenshot:
  - no excessive card height
  - cards wrap cleanly
  - selected border visible
- Review panel aligns with top of builder.
- No horizontal overflow.

## Medium stacked requirements
- Builder full width.
- Camera products may fit in a single row if there is enough space.
- Review panel below the accordion.
- Review panel can use a wider internal layout:
  - line items on left
  - guarantee/total/checkout on right
- Keep the soft blue review background.

## Mobile requirements
- Page should be usable at iPhone widths around 390px.
- Accordion headers must fit without clipping.
- Product cards should stack cleanly.
- Review panel becomes vertical.
- Buttons should be full width where appropriate.
- The Checkout button should be easy to tap.
- Text should not overflow.
- Prices should not collide with steppers.
- The page should not require horizontal scrolling.

## Visual details to tune
- border radius
- product card padding
- badge size
- thumbnail sizes
- line height
- step label spacing
- divider color
- review group heading color
- selected border thickness
- CTA button height
- link underline style

## Do not
- Add heavy animations.
- Add a carousel.
- Add unrelated sections.
- Add new product data just to fill space.
- Use CSS hacks that break accessibility.

## Acceptance checklist
- Desktop resembles the two-column screenshot.
- Medium layout resembles the stacked wide screenshot.
- Mobile resembles the phone screenshot.
- No horizontal scroll at 320px, 375px, 390px, 768px, 1024px.
- Build passes.
