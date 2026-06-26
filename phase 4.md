# Phase 4 — Bundle State, Quantity Logic, and Pricing Utilities

**Recommended Cursor model:** Claude Sonnet / strong coding model.

## Goal
Create the shared state engine that will power product cards, variant behavior, selected counts, review lines, persistence, and totals.

## Context
The most important interaction requirement is that **variants have separate quantities**.

Example:
- A product has Red and Blue.
- User adds 2 Red.
- User switches to Blue.
- Stepper shows 0 for Blue.
- Red quantity remains 2.
- Review panel shows Red x2 and Blue only if Blue becomes greater than 0.

This app has no real checkout backend. All logic can be client-side.

## Exact work
Create:

```txt
src/hooks/useBundleState.ts
src/utils/pricing.ts
src/utils/format.ts
```

## State shape
Use a normalized state shape. Do not store duplicated derived totals in state.

Required state:
- `activeStepId`
- `activeVariantByProductId`
- `quantities`
  - for products with variants: key by `productId::variantId`
  - for products without variants: key by `productId`
- `hasRestoredSavedConfig`
- `saveStatus` if useful for UI feedback later

## Required functions from the hook
Expose functions like:

- `setActiveStep(stepId)`
- `goToNextStep()`
- `selectVariant(productId, variantId)`
- `getActiveVariant(product)`
- `getQuantity(product, variantId?)`
- `increment(product, variantId?)`
- `decrement(product, variantId?)`
- `setQuantity(product, quantity, variantId?)`
- `getStepSelectedCount(stepId)`
- `getProductTotalQuantity(product)`
- `getReviewLines()`
- `getTotals()`
- `saveConfiguration()`
- `restoreSavedConfiguration()`

## Quantity rules
- Quantity cannot go below `0`.
- Required products cannot go below `minQuantity`.
- Default min quantity is `0`.
- Default max quantity can be `99`, unless product has a lower max.
- Decrement buttons should become disabled when the next decrement would violate min.
- Increment buttons should become disabled at max.
- Plan should behave like a selected quantity of `1`, unless data says otherwise.

## Pricing utilities
Implement:
- `formatMoney(value: number): string`
- `formatLinePrice(line): string`
- `calculateActiveTotal(lines, plan, shipping)`
- `calculateCompareTotal(lines, plan, shipping)`
- `calculateSavings(compareTotal, activeTotal)`

Handle:
- free rows as `FREE`
- monthly suffix for plan row
- struck-through compare price where present

## Initial state
Load initial quantities from `bundleData.json` exactly.
Do not use localStorage yet in this phase, except maybe a placeholder function. Full persistence is a later phase.

## Acceptance checklist
- State initializes from JSON.
- Variant quantities are independent.
- Required product min quantity is respected.
- Totals match the design initial state:
  - active total `$187.89`
  - compare total `$238.81`
  - savings `$50.92`
- No UI components need to be complete yet.
- Build passes.
