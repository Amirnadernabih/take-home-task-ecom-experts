/**
 * Phase 6 verification — exercises variant independence and stepper bounds
 * without a browser. Run: npx tsx scripts/verify-phase6.ts
 */
import { bundleData, getProductById } from '../src/data/index.ts';
import {
  buildInitialActiveVariants,
  buildInitialQuantities,
  canDecrementQuantity,
  canIncrementQuantity,
  getProductTotalQuantity,
  getQuantityKey,
  getStoredQuantity,
  usesVariantQuantityKeys,
} from '../src/utils/pricing.ts';
import type { Product, QuantitiesRecord } from '../src/types/bundle.ts';

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

function requireProduct(id: string) {
  const product = getProductById(id);
  if (!product) throw new Error(`Product not found: ${id}`);
  return product;
}

function simulateSelectVariant(
  quantities: QuantitiesRecord,
  activeVariants: Record<string, string>,
  productId: string,
  variantId: string,
) {
  return {
    ...activeVariants,
    [productId]: variantId,
  };
}

function simulateIncrement(
  quantities: QuantitiesRecord,
  product: Product,
  variantId: string,
): QuantitiesRecord {
  const key = getQuantityKey(product, variantId);
  const current = quantities[key] ?? 0;
  if (!canIncrementQuantity(product, current)) return quantities;
  return { ...quantities, [key]: current + 1 };
}

function simulateDecrement(
  quantities: QuantitiesRecord,
  product: Product,
  variantId: string,
): QuantitiesRecord {
  const key = getQuantityKey(product, variantId);
  const current = quantities[key] ?? 0;
  if (!canDecrementQuantity(product, current)) return quantities;
  return { ...quantities, [key]: current - 1 };
}

function getActiveQuantity(
  quantities: QuantitiesRecord,
  productId: string,
  activeVariants: Record<string, string>,
): number {
  const product = requireProduct(productId);
  const variantId =
    activeVariants[product.id] ?? product.defaultVariantId ?? 'default';
  const key = getQuantityKey(product, variantId);
  return quantities[key] ?? 0;
}

console.log('Phase 6 — product card logic verification\n');

// --- Initial state ---
const quantities = buildInitialQuantities();
const activeVariants = buildInitialActiveVariants();

const camV4 = requireProduct('wyze-cam-v4');
const camPan = requireProduct('wyze-cam-pan-v3');
const floodlight = requireProduct('wyze-cam-floodlight-v2');
const doorbell = requireProduct('wyze-duo-cam-doorbell');
const batteryPro = requireProduct('wyze-battery-cam-pro');
const camUnlimited = requireProduct('cam-unlimited');
const motionSensor = requireProduct('wyze-sense-motion-sensor');
const senseHub = requireProduct('wyze-sense-hub');
const microsd = requireProduct('wyze-microsd-card-256gb');

console.log('Camera step — initial quantities');
assert(getActiveQuantity(quantities, camV4.id, activeVariants) === 1, 'Wyze Cam v4 White starts at 1');
assert(getActiveQuantity(quantities, camPan.id, activeVariants) === 2, 'Wyze Cam Pan v3 White starts at 2');
assert(getActiveQuantity(quantities, floodlight.id, activeVariants) === 0, 'Floodlight starts at 0');
assert(getActiveQuantity(quantities, doorbell.id, activeVariants) === 0, 'Doorbell starts at 0');
assert(getActiveQuantity(quantities, batteryPro.id, activeVariants) === 0, 'Battery Cam Pro starts at 0');

console.log('\nSelected state (any variant qty > 0)');
assert(getProductTotalQuantity(quantities, camV4) > 0, 'Cam v4 is selected');
assert(getProductTotalQuantity(quantities, camPan) > 0, 'Pan v3 is selected');
assert(getProductTotalQuantity(quantities, floodlight) === 0, 'Floodlight is not selected');

console.log('\nVariant independence — Cam v4');
let qty = { ...quantities };
let variants = { ...activeVariants };

assert(
  getStoredQuantity(qty, camV4, 'white') === 1,
  'White quantity is 1 before switch',
);

variants = simulateSelectVariant(qty, variants, camV4.id, 'black');
assert(
  getActiveQuantity(qty, camV4.id, variants) === 0,
  'Stepper shows 0 when switching to Black',
);
assert(
  getStoredQuantity(qty, camV4, 'white') === 1,
  'White quantity preserved after switching to Black',
);
assert(
  getProductTotalQuantity(qty, camV4) > 0,
  'Card stays selected while White qty > 0',
);

variants = simulateSelectVariant(qty, variants, camV4.id, 'white');
assert(
  getActiveQuantity(qty, camV4.id, variants) === 1,
  'Stepper returns to 1 when switching back to White',
);

console.log('\nVariant selectors — all camera products');
for (const product of bundleData.steps[0]!.products) {
  const hasSelector = usesVariantQuantityKeys(product);
  const expected =
    product.id !== 'wyze-duo-cam-doorbell' &&
    product.variants.length > 1;
  assert(hasSelector === expected, `${product.title} variant selector visibility`);
}

console.log('\nQuantity stepper bounds');
assert(!canDecrementQuantity(camV4, 0), 'Minus disabled at 0 for Cam v4');
assert(canIncrementQuantity(camV4, 0), 'Plus enabled at 0 for Cam v4');
assert(!canIncrementQuantity(camUnlimited, 1), 'Cam Unlimited plus disabled at max 1');
assert(!canDecrementQuantity(senseHub, 1), 'Sense Hub minus disabled at min 1');

console.log('\nIncrement / decrement on Pan v3 Black');
qty = { ...quantities };
variants = { ...activeVariants };
variants = simulateSelectVariant(qty, variants, camPan.id, 'black');
qty = simulateIncrement(qty, camPan, 'black');
assert(getStoredQuantity(qty, camPan, 'black') === 1, 'Black incremented to 1');
assert(getStoredQuantity(qty, camPan, 'white') === 2, 'White still at 2');
qty = simulateDecrement(qty, camPan, 'black');
assert(getStoredQuantity(qty, camPan, 'black') === 0, 'Black decremented to 0');

console.log('\nOther steps — products render from data');
assert(camUnlimited.billingSuffix === '/mo', 'Plan has billing suffix');
assert(senseHub.displayPriceLabel === 'FREE', 'Sense Hub shows FREE label');
assert(motionSensor.variants.length === 1, 'Motion sensor has no color variants');
assert(!usesVariantQuantityKeys(doorbell), 'Doorbell has no variant selector');
assert(getActiveQuantity(quantities, motionSensor.id, activeVariants) === 2, 'Motion sensor starts at 2');
assert(getActiveQuantity(quantities, microsd.id, activeVariants) === 2, 'MicroSD starts at 2');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
