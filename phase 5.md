# Phase 5 — Accordion Step System and Navigation

**Recommended Cursor model:** Claude Sonnet / Auto.

## Goal
Implement the 4-step accordion from the design using the data and state hook.

## Visual target
Each accordion step has:
- small uppercase label: `STEP X OF 4`
- an icon at the left of the title
- step title
- right-side state indicator
  - expanded: `N selected` + up chevron
  - collapsed: down chevron
- thin divider lines between collapsed sections
- expanded content area with light blue panel background
- bottom button: `Next: ...`

Step 1 should be expanded on page load.

## Exact work
Create components:

```txt
src/components/accordion/BundleAccordion.tsx
src/components/accordion/AccordionStep.tsx
src/components/ui/Icon.tsx
```

## Data-driven rules
- Render steps from `bundleData.json`.
- Do not hardcode step markup one by one.
- Step selected count must come from `getStepSelectedCount(stepId)`.
- The selected count should count distinct selected products in that step, not total units.
  - Example: two Wyze Cam Pan v3 units = `1 selected` for that product.
  - Wyze Cam v4 + Wyze Cam Pan v3 = `2 selected`.
- If multiple variants of the same product are selected, count that product once for the step count.

## Interactions
- Clicking a collapsed step header opens that step.
- Clicking the open step header may keep it open or collapse it, but never leave the user with a broken empty UI.
- The `Next:` button advances to the next step.
- The final step can keep the user on the final step or scroll to review; no route change needed.

## Styling
Match the screenshot:
- compact accordion headers
- small icon in a soft outline style
- purple selected text on the right
- very subtle borders
- light blue expanded area
- rounded top/bottom corners for expanded panel
- no heavy shadows

## Accessibility
- Header button should have `aria-expanded`.
- Expanded content should be region-like and connected with `aria-controls`.
- Chevrons can be text or inline SVG, but should not be read as confusing text by screen readers.

## Acceptance checklist
- Step 1 is open on load.
- All 4 step headers render from data.
- Open/collapsed state works.
- `N selected` updates when state changes.
- Next button moves forward.
- Build passes.
