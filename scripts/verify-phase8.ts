/**
 * Phase 8 verification — plan, sensors, accessories steps and full accordion flow.
 * Run: npx tsx scripts/verify-phase8.ts
 */
import { bundleData, getProductById } from '../src/data/index.ts';
import {
  buildInitialQuantities,
  buildReviewLines,
  canDecrementQuantity,
  canIncrementQuantity,
  getProductTotalQuantity,
  getStoredQuantity,
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

function getStepSelectedCount(quantities: QuantitiesRecord, stepId: string): number {
  const step = bundleData.steps.find((item) => item.id === stepId);
  if (!step) return 0;
  return step.products.filter(
    (product) => getProductTotalQuantity(quantities, product) > 0,
  ).length;
}

console.log('Phase 8 — plan, sensors, and accessories verification\n');

const quantities = buildInitialQuantities();

console.log('All four steps have products');
assert(bundleData.steps.length === 4, 'Four accordion steps exist');
for (const step of bundleData.steps) {
  assert(step.products.length > 0, `${step.title} has products`);
}

console.log('\nStep 2 — plan');
const plan = getProductById('cam-unlimited')!;
assert(plan.billingSuffix === '/mo', 'Cam Unlimited has /mo billing');
assert(plan.compareAtPrice === 12.99, 'Compare price $12.99/mo');
assert(plan.price === 9.99, 'Active price $9.99/mo');
assert(getStoredQuantity(quantities, plan, 'default') === 1, 'Plan quantity fixed at 1');
assert(!canDecrementQuantity(plan, 1), 'Plan minus disabled at 1');
assert(!canIncrementQuantity(plan, 1), 'Plan plus disabled at max 1');
assert(getStepSelectedCount(quantities, 'plan') === 1, 'Plan step shows 1 selected');

console.log('\nStep 3 — sensors');
const motion = getProductById('wyze-sense-motion-sensor')!;
const hub = getProductById('wyze-sense-hub')!;
assert(motion.icon === 'motion-sensor', 'Motion sensor has icon');
assert(hub.icon === 'sense-hub', 'Sense hub has icon');
assert(hub.required === true, 'Hub is required');
assert(getStoredQuantity(quantities, motion, 'default') === 2, 'Motion sensor starts at 2');
assert(getStoredQuantity(quantities, hub, 'default') === 1, 'Hub starts at 1');
assert(!canDecrementQuantity(hub, 1), 'Required hub cannot drop below 1');
assert(getStepSelectedCount(quantities, 'sensors') === 2, 'Sensors step shows 2 selected');

console.log('\nStep 4 — accessories');
const microsd = getProductById('wyze-microsd-card-256gb')!;
assert(microsd.icon === 'microsd', 'MicroSD has icon');
assert(getStoredQuantity(quantities, microsd, 'default') === 2, 'MicroSD starts at 2');
assert(getStepSelectedCount(quantities, 'accessories') === 1, 'Accessories step shows 1 selected');

console.log('\nStep 1 — cameras unchanged');
assert(getStepSelectedCount(quantities, 'cameras') === 2, 'Cameras step still shows 2 selected');

console.log('\nReview panel includes plan, sensors, and accessories');
const lines = buildReviewLines(quantities);
assert(lines.some((line) => line.productId === 'cam-unlimited'), 'Review has Cam Unlimited');
assert(lines.some((line) => line.productId === 'wyze-sense-motion-sensor'), 'Review has motion sensor');
assert(lines.some((line) => line.productId === 'wyze-sense-hub'), 'Review has sense hub');
assert(lines.some((line) => line.productId === 'wyze-microsd-card-256gb'), 'Review has MicroSD');

console.log('\nQuantity sync from sensor step to review');
let qty = { ...quantities };
const motionQty = getStoredQuantity(qty, motion, 'default') + 1;
qty = { ...qty, [motion.id]: motionQty };
const updatedLines = buildReviewLines(qty);
const motionLine = updatedLines.find(
  (line) => line.productId === 'wyze-sense-motion-sensor',
);
assert(motionLine?.quantity === 3, 'Review motion sensor qty updates to 3');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
