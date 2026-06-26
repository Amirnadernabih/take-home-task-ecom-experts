/**
 * Phase 7 verification — review lines, totals, and bidirectional sync logic.
 * Run: npx tsx scripts/verify-phase7.ts
 */
import { bundleData, getProductById } from '../src/data/index.ts';
import {
  buildInitialQuantities,
  buildReviewLines,
  calculateActiveTotal,
  calculateCompareTotal,
  calculateSavings,
  getStoredQuantity,
  shouldShowVariantLabelInReview,
} from '../src/utils/pricing.ts';
import type { QuantitiesRecord } from '../src/types/bundle.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed += 1;
    console.log(`  ✓ ${message}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${message}`);
  }
}

function incrementQty(
  quantities: QuantitiesRecord,
  productId: string,
  variantId: string,
): QuantitiesRecord {
  const product = getProductById(productId);
  if (!product) throw new Error(`Missing product ${productId}`);
  const current = getStoredQuantity(quantities, product, variantId);
  const key = product.variants.length === 1 && product.variants[0]?.id === 'default'
    ? product.id
    : `${product.id}::${variantId}`;
  return { ...quantities, [key]: current + 1 };
}

console.log('Phase 7 — review panel verification\n');

const quantities = buildInitialQuantities();
const lines = buildReviewLines(quantities);
const activeTotal = calculateActiveTotal(lines);
const compareTotal = calculateCompareTotal(lines);
const savings = calculateSavings(compareTotal, activeTotal);

console.log('Initial review lines');
const merchandise = lines.filter((line) => line.category !== 'shipping');
assert(merchandise.length === 6, 'Six merchandise lines on initial load');
assert(lines.some((line) => line.productTitle === 'Wyze Cam v4' && line.quantity === 1), 'Cam v4 line');
assert(lines.some((line) => line.productTitle === 'Wyze Cam Pan v3' && line.quantity === 2), 'Pan v3 line');
assert(lines.some((line) => line.productTitle === 'Fast Shipping'), 'Shipping line');
assert(lines.some((line) => line.displayPriceLabel === 'FREE'), 'FREE line present');

console.log('\nGrouped categories');
const categories = new Set(merchandise.map((line) => line.category));
assert(categories.has('cameras'), 'Cameras group has items');
assert(categories.has('sensors'), 'Sensors group has items');
assert(categories.has('accessories'), 'Accessories group has items');
assert(categories.has('plan'), 'Plan group has items');

console.log('\nInitial totals match design');
assert(activeTotal === bundleData.summary.expectedActiveTotal, `Active total is $${activeTotal}`);
assert(compareTotal === bundleData.summary.expectedCompareTotal, `Compare total is $${compareTotal}`);
assert(savings === bundleData.summary.expectedSavings, `Savings is $${savings}`);

console.log('\nVariant label visibility');
const camV4Line = lines.find((line) => line.productId === 'wyze-cam-v4');
assert(camV4Line !== undefined, 'Cam v4 review line exists');
assert(
  !shouldShowVariantLabelInReview(merchandise, camV4Line!),
  'Single variant line hides variant label',
);

console.log('\nBidirectional quantity sync (shared state)');
let qty = { ...quantities };
const camV4 = getProductById('wyze-cam-v4')!;
const beforeCardQty = getStoredQuantity(qty, camV4, 'white');
qty = incrementQty(qty, 'wyze-cam-v4', 'white');
const afterReviewLines = buildReviewLines(qty);
const camV4Review = afterReviewLines.find((line) => line.productId === 'wyze-cam-v4');
assert(
  getStoredQuantity(qty, camV4, 'white') === beforeCardQty + 1,
  'Card quantity key updated',
);
assert(camV4Review?.quantity === beforeCardQty + 1, 'Review line quantity matches card state');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
