# Phase 10 — Save My System for Later, Restore, and Checkout Placeholder

**Recommended Cursor model:** Claude Sonnet / Auto.

## Goal
Implement the required persistence behavior and final prototype actions.

## Requirement
The `Save my system for later` link must actually save the shopper's configuration.

Expected flow:
1. Shopper changes quantities and variants.
2. Shopper clicks `Save my system for later`.
3. Shopper reloads or leaves and returns.
4. The system is restored exactly as saved.

Use localStorage.

## Exact work
1. Add a localStorage key:
   - `wyze-bundle-builder-config`
2. Save only the minimal state needed:
   - quantities
   - active selected variant by product
   - active step if useful
3. Do not save derived totals.
4. On initial app load:
   - check localStorage
   - validate the saved shape lightly
   - merge only valid keys that still exist in current data
   - fall back to seeded JSON initial state if nothing valid is saved
5. On click of `Save my system for later`:
   - write current config
   - show a small visual confirmation like `System saved`
   - confirmation can disappear after a few seconds
6. Add a way for development/testing to clear saved config if useful, but do not make it visually prominent in the final design.
   - If implemented, keep it as a tiny dev-only button or omit it.
7. Implement checkout placeholder:
   - clicking Checkout shows a small confirmation message like `Checkout is a prototype action.`
   - do not navigate away.

## Validation
- If localStorage data is corrupted, app must not crash.
- If localStorage references a product/variant that no longer exists, ignore that entry.
- Required hub must still respect min quantity after restore.
- Totals must recalculate from restored state.

## Acceptance checklist
- Save link stores current config.
- Reload restores saved quantities and active variants.
- Corrupted localStorage does not crash the app.
- Checkout placeholder works.
- No backend is required.
- Build passes.
