# Phase 7 — Live Review Panel, Line Items, and Totals

**Recommended Cursor model:** Claude Sonnet / Auto. Use Max Mode only if you need full-repo context.

## Goal
Implement the right-side review panel titled **Your security system** and connect it live to builder state.

## Visual target
The review panel includes:
- top label: `REVIEW`
- title: `Your security system`
- short description
- grouped selected items:
  - Cameras
  - Sensors
  - Accessories
  - Plan
- each item line:
  - thumbnail/icon
  - name
  - quantity stepper when quantity can be changed
  - compare-at price if present
  - active price or `FREE`
- shipping row
- satisfaction guarantee badge
- financing line: `as low as $19/mo`
- total area:
  - struck-through compare total
  - active total
- green savings callout
- primary `Checkout` button
- `Save my system for later` link

## Components to create
```txt
src/components/review/ReviewPanel.tsx
src/components/review/ReviewGroup.tsx
src/components/review/ReviewLineItem.tsx
src/components/review/GuaranteeBadge.tsx
src/components/review/TotalSummary.tsx
```

## Data behavior
- The review panel must be generated from `getReviewLines()`.
- Do not duplicate product data manually.
- If a variant quantity is above zero, show it as a separate line.
- If two variants of the same product are selected, show two lines.
- For initial design state, the review should match:
  - Wyze Cam v4 x1
  - Wyze Cam Pan v3 x2
  - Wyze Sense Motion Sensor x2
  - Wyze Sense Hub (Required) x1, FREE
  - Wyze MicroSD Card (256GB) x2
  - Cam Unlimited, `$9.99/mo`
  - Fast Shipping, FREE
  - total `$187.89`

## Variant labels in review
The requirement says selected variants must appear as separate review lines. To keep fidelity:
- If only one variant of a product is selected, the line can show the product name only.
- If multiple variants of the same product are selected, add a small muted variant label like `White` or `Black` under the product name.

## Review steppers
- Review line steppers must use the same quantity state as product card steppers.
- Updating quantity in the review must update product cards immediately.
- Required item cannot be reduced below 1.
- Plan can be fixed at 1 unless your data supports toggling it.

## Responsive layout
- Desktop: review panel sits in the right column.
- Medium stacked view: review panel can become a wider horizontal summary.
- Mobile: review becomes a single-column card below the accordion.

## Checkout behavior
- The button does not need a real destination.
- Implement either:
  - a small confirmation message, or
  - `alert("Checkout placeholder")`
- Prefer a small inline confirmation over alert if quick to implement.

## Acceptance checklist
- Review updates live.
- Review steppers sync with product cards.
- Totals recalculate.
- Initial totals match the design.
- Group headings render correctly.
- Build passes.
