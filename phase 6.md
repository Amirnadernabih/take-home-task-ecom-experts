# Phase 6 — Product Cards, Variant Selectors, and Synced Card Steppers

**Recommended Cursor model:** Claude Sonnet / strong coding model. Use the highest reasoning coding model only if variant logic becomes messy.

## Goal
Build the product cards exactly as the design requires and connect them to the shared state.

## Components to create
```txt
src/components/products/ProductGrid.tsx
src/components/products/ProductCard.tsx
src/components/products/VariantSelector.tsx
src/components/ui/QuantityStepper.tsx
src/components/ui/PriceStack.tsx
src/components/ui/Badge.tsx
```

## Product card content
Each card can include:
- optional discount badge
- product image
- product title
- short description
- `Learn More` link
- optional variant selector
- quantity stepper
- compare-at price with strike-through
- active price
- selected state border

Render only the elements present in the data. Do not show empty badge or empty variant rows.

## Selected card state
A product card is selected when:
- product has variants and any variant quantity is greater than 0
- product has no variants and quantity is greater than 0

Selected state should match the Figma:
- purple border
- subtle purple emphasis
- no huge background change

## Variant behavior
This is critical:

1. Each variant has its own quantity.
2. The card stepper is bound to the currently selected variant.
3. Switching variants changes the stepper to that variant's quantity.
4. Quantities on other variants remain unchanged.
5. The product card remains selected if any variant has quantity above 0.
6. Products with no variants have no variant selector and a normal product quantity.

## QuantityStepper behavior
- Use real buttons.
- Minus disabled at min.
- Plus disabled at max.
- Shows the current number between buttons.
- Works from both product cards and later review panel.
- Keep it visually small and compact like the screenshots.

## Camera step visual layout
For the camera step:
- Desktop/sidebar layout screenshot: cards can wrap in a 2-column grid.
- Wider stacked screenshot: cards can fit in a 5-card row if space allows.
- Mobile: cards stack or use a clean one-column compact layout.
- Keep card heights consistent enough that the grid feels polished.

## Image rules
- Use the 5 product images copied to `public/products/`.
- Product images should be contained, not cropped badly.
- No distorted aspect ratios.
- Do not use the Figma screenshots as product images.

## Acceptance checklist
- Product cards render from JSON.
- Variant selectors work.
- Card steppers update independent variant quantities.
- Selected card border appears correctly.
- Step count updates when card quantities change.
- Build passes.
