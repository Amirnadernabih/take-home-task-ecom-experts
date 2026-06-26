# Phase 2 — Data Model, Product Catalog, and Asset Wiring

**Recommended Cursor model:** Claude Sonnet / strong coding model. Use Auto if unsure.

## Goal
Create a data-driven product catalog and initial selection state that can render the bundle builder without hardcoding each product in JSX.

## Context
The take-home explicitly requires the app to be **data-driven from JSON**. The design shows 4 steps:

1. Choose your cameras
2. Choose your plan
3. Choose your sensors
4. Add extra protection

The app must load with the same pre-selected system shown in the design:
- Wyze Cam v4: quantity 1
- Wyze Cam Pan v3: quantity 2
- Wyze Sense Motion Sensor: quantity 2
- Wyze Sense Hub (Required): quantity 1
- Wyze MicroSD Card (256GB): quantity 2
- Cam Unlimited plan: selected
- Fast Shipping: free row in review

The visible total in the design is:
- compare/regular total: `$238.81`
- active total: `$187.89`
- savings: `$50.92`

## Exact work
1. Inspect `task gallery/`.
2. Copy the 5 camera product images into `public/products/` using safe kebab-case filenames.
   - Keep the original `task gallery/` folder untouched.
   - Map images by their product title filenames.
3. Create `src/data/bundleData.json`.
4. Create TypeScript types in `src/types/bundle.ts`.

## Required data structure
Design the JSON so each step and product can render from data. Include enough fields for:

### Step fields
- `id`
- `stepNumber`
- `title`
- `icon`
- `category`
- `nextLabel`

### Product fields
- `id`
- `category`
- `title`
- `description`
- `learnMoreUrl`
- `image`
- `badge`
- `price`
- `compareAtPrice`
- `required`
- `minQuantity`
- `maxQuantity`
- `defaultVariantId`
- `variants`

### Variant fields
- `id`
- `label`
- `swatch`
- `thumbnail`
- `initialQuantity`

## Product data to include

### Cameras
1. **Wyze Cam v4**
   - badge: `Save 22%`
   - description: `The clearest Wyze Cam ever made.`
   - compareAtPrice: `35.98`
   - price: `27.98`
   - variants: White, Grey, Black
   - initial quantity: 1 on the default variant

2. **Wyze Cam Pan v3**
   - badge: `Save 12%`
   - description: `360° pan and 180° tilt security camera.`
   - compareAtPrice: `39.98`
   - price: `34.98`
   - variants: White, Black
   - initial quantity: 2 on the default variant

3. **Wyze Cam Floodlight v2**
   - badge: `Save 22%`
   - description: `2K floodlight camera with a 160° wide-angle view for your garage.`
   - compareAtPrice: `89.98`
   - price: `69.98`
   - variants: White, Black
   - initial quantity: 0

4. **Wyze Duo Cam Doorbell**
   - no badge
   - description: `Two cameras. Two views. Double the protection.`
   - price: `69.98`
   - no variants
   - initial quantity: 0

5. **Wyze Battery Cam Pro**
   - no badge
   - description: `Protect anywhere. See everything in 2.5K HDR. No power outlet or electrician needed.`
   - price: `89.98`
   - variants: White, Black
   - initial quantity: 0

### Sensors
1. **Wyze Sense Motion Sensor**
   - price: `29.99`
   - initial quantity: 2
   - review line total should be `$59.98`

2. **Wyze Sense Hub (Required)**
   - compareAtPrice: `29.92`
   - price: `0`
   - displayPriceLabel: `FREE`
   - required: true
   - minQuantity: 1
   - initial quantity: 1

### Accessories
1. **Wyze MicroSD Card (256GB)**
   - price: `20.98`
   - initial quantity: 2
   - review line total should be `$41.96`

### Plan
1. **Cam Unlimited**
   - compareAtPrice: `12.99`
   - price: `9.99`
   - billingSuffix: `/mo`
   - initial quantity: 1
   - selected by default

### Shipping / review-only row
- **Fast Shipping**
  - compareAtPrice: `5.99`
  - price: `0`
  - displayPriceLabel: `FREE`

## Important behavior to support later
- Every variant has its own quantity.
- The card quantity stepper is bound to the currently selected variant.
- The review panel should show every selected variant as its own line.
- Products without variants use one quantity.

## Acceptance checklist
- `bundleData.json` is valid JSON.
- TypeScript types match the data.
- Product image paths work from `public/products/`.
- The initial data can reproduce the design totals.
- No JSX hardcoding per product has been added yet.
