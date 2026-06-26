# Frontend Take-Home Bundle Builder

A React prototype of a multi-step Wyze security bundle builder with a live review panel. Shoppers configure cameras, plan, sensors, and accessories in a four-step accordion, see totals update in real time, and save their configuration for later.

## What this includes

- 4-step accordion builder (cameras, plan, sensors, accessories)
- Data-driven product catalog from JSON
- Variant selectors with independent quantities per variant
- Synchronized quantity steppers between product cards and the review panel
- Live grouped review summary with compare-at pricing and savings
- Recalculated totals and savings on every quantity change
- `localStorage` save/restore behavior
- Responsive desktop, tablet, and mobile layouts

## Tech stack

- React 19
- TypeScript
- Vite 6
- CSS (design tokens, no UI framework)

## Getting started

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project structure

```
src/
  components/     UI: accordion, product cards, review panel, shared controls
  data/           bundleData.json catalog + lookup helpers
  hooks/          useBundleState — single source of truth for bundle configuration
  types/          TypeScript interfaces for products, steps, review lines, state
  utils/          pricing, persistence, formatting
  styles/         global.css design tokens and responsive layout
public/
  products/       Local product images for camera cards and variant thumbnails
scripts/          Optional verification scripts (phases 6–10)
figma design/     Reference screenshots for layout fidelity
task gallery/     Original source product images
```

| Path | Role |
|------|------|
| `src/components/accordion/` | Step navigation, expand/collapse, next actions |
| `src/components/products/` | Product cards, variant selectors, quantity steppers |
| `src/components/review/` | Grouped line items, totals, save/checkout actions |
| `src/hooks/useBundleState.ts` | Quantities, variants, step, save status |
| `src/utils/persistence.ts` | Validate, merge, and read/write `localStorage` |
| `src/utils/pricing.ts` | Quantity keys, review lines, totals |

## Data model

Product and step content lives in `src/data/bundleData.json`. The catalog drives the entire UI without product-specific JSX.

Each product supports:

- `id`, `title`, `description`, `category`
- `price`, `compareAtPrice`, optional `lineUnitPrice` overrides
- `variants` with `initialQuantity`, swatches, and thumbnails
- `required`, `minQuantity`, `maxQuantity` constraints
- `badge`, `billingSuffix`, `displayPriceLabel` (e.g. FREE, /mo)
- `image` or `icon` for card/review display

Steps define which products appear in each accordion panel. A separate `shipping` entry and `summary` block provide financing copy and expected initial totals for verification.

## Variant behavior

Multi-color camera products store **one quantity per variant**, keyed as `productId::variantId`. Single-variant products (plan, sensors, accessories) use `productId` as the key.

- The visible card stepper controls the **active** variant only.
- Switching variants shows that variant's quantity without resetting others.
- Adding 2 White and 1 Black, then switching back, preserves both counts.
- The review panel lists each variant with quantity > 0 as its own line.

## Persistence

Clicking **Save my system for later** writes to `localStorage` under `wyze-bundle-builder-config`:

- `quantities`
- `activeVariantByProductId`
- `activeStepId`

Derived totals are not stored; they are recalculated on load. On reload, saved values are validated against the current catalog, unknown keys are ignored, and required items (e.g. Wyze Sense Hub min qty 1) are clamped. Corrupted JSON falls back to the seeded initial state without crashing.

In development, run `__clearWyzeBundleConfig()` in the browser console to clear saved config.

## Tradeoffs / notes

- **Checkout** is a prototype placeholder — no payment or navigation.
- **No backend** — catalog is local JSON; persistence is `localStorage` only.
- **Icons for non-camera items** — plan, sensors, and accessories use inline SVG placeholders where dedicated photography was not provided.
- **Collapsed accordion panels unmount** — keeps the DOM lean; focus may reset when switching steps while a panel is open.
- **`body { overflow-x: hidden }`** — prevents horizontal scroll on narrow viewports; layout should still be checked at 320–1280px widths.

## Final QA checklist

- [ ] `npm install` works from a clean clone
- [ ] `npm run dev` starts the app
- [ ] `npm run build` passes
- [ ] Desktop layout matches the Figma direction (two columns, sticky review)
- [ ] Mobile layout remains usable (stacked, tappable controls)
- [ ] Variant quantities stay independent and sync card ↔ review
- [ ] Review totals update when quantities change (initial: $187.89 active, $238.81 compare, $50.92 savings)
- [ ] Save → reload → restore preserves configuration
- [ ] Checkout shows prototype confirmation without navigation

### Optional verification scripts

```bash
npx tsx scripts/verify-phase6.ts   # variant quantity logic
npx tsx scripts/verify-phase7.ts   # review lines and totals
npx tsx scripts/verify-phase8.ts   # plan, sensors, accessories
npx tsx scripts/verify-phase9.ts   # responsive CSS rules
npx tsx scripts/verify-phase10.ts  # localStorage persistence
```
