# Phase 11 — Final QA, Accessibility, Performance, and Code Quality

**Recommended Cursor model:** Auto for first pass. Use a stronger reasoning model / Max Mode for a repo-wide audit if available.

## Goal
Audit and polish the project like a production UI take-home before the final README phase.

## Functional QA
Test these manually in the browser:

1. Accordion
   - Step 1 opens by default.
   - Each step opens when clicked.
   - `Next:` buttons advance correctly.
   - `N selected` is correct.

2. Variants
   - Add 2 of one variant.
   - Switch to another variant.
   - Stepper changes to that variant's quantity.
   - Switch back and old quantity remains.
   - Review preserves each selected variant as a separate line.

3. Steppers
   - Product card stepper updates review.
   - Review stepper updates product card.
   - Minus disables at 0.
   - Required hub minus disables at 1.
   - Plus respects max if set.

4. Totals
   - Initial active total is `$187.89`.
   - Initial compare total is `$238.81`.
   - Initial savings is `$50.92`.
   - Totals change correctly when quantities change.

5. Persistence
   - Change quantities.
   - Click Save my system for later.
   - Reload page.
   - State is restored exactly.

6. Responsive
   - Check 320, 375, 390, 768, 1024, 1280 widths.
   - No horizontal scroll.
   - No clipped text.
   - Buttons remain tappable.

## Accessibility QA
- Buttons have clear accessible names.
- Accordion headers use `aria-expanded`.
- Quantity buttons have labels like `Increase Wyze Cam v4` / `Decrease Wyze Cam v4`.
- Focus states are visible.
- Color is not the only indicator of disabled state.
- Links are real anchors where appropriate.
- Decorative icons are hidden from screen readers.
- Images have meaningful alt text.
- App works with keyboard only.

## Performance QA
- No heavy libraries.
- No remote product images.
- Images use reasonable dimensions.
- Avoid unnecessary re-renders where easy.
- Avoid storing duplicated derived state.

## Code quality QA
- No product-specific JSX duplication.
- No AI/Cursor/generated-code comments.
- No console logs.
- No dead files.
- No unused variables.
- No TypeScript `any` unless truly justified.
- No broken imports.
- `npm run build` passes.

## Optional improvements if time remains
- Add a small empty-state in review if all non-required items are removed.
- Add subtle transition for accordion open/close while respecting reduced motion.
- Add unit-like utility checks for price calculations if project setup is simple.

## Acceptance checklist
- All QA items pass.
- Build passes.
- UI feels polished.
- Code is clean enough for review.
- Ready for final README and cleanup.
