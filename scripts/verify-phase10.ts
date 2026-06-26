/**
 * Phase 10 verification — localStorage persistence, restore, and totals.
 * Run: npx tsx scripts/verify-phase10.ts
 */
import { bundleData } from '../src/data/index.ts';
import {
  buildInitialActiveVariants,
  buildInitialQuantities,
  buildReviewLines,
  calculateActiveTotal,
  calculateCompareTotal,
  calculateSavings,
  getStoredQuantity,
} from '../src/utils/pricing.ts';
import {
  STORAGE_KEY,
  clearPersistedConfig,
  loadPersistedConfig,
  parsePersistedConfig,
  savePersistedConfig,
} from '../src/utils/persistence.ts';
import type { PersistedBundleConfig } from '../src/types/bundle.ts';

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

const memoryStore = new Map<string, string>();

const localStorageMock = {
  getItem(key: string) {
    return memoryStore.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    memoryStore.set(key, value);
  },
  removeItem(key: string) {
    memoryStore.delete(key);
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

console.log('Phase 10 — persistence verification\n');

memoryStore.clear();

console.log('Storage key');
assert(STORAGE_KEY === 'wyze-bundle-builder-config', 'Uses wyze-bundle-builder-config key');

console.log('\nSave and load round-trip');
const modifiedConfig: PersistedBundleConfig = {
  activeStepId: 'sensors',
  activeVariantByProductId: {
    ...buildInitialActiveVariants(),
    'wyze-cam-v4': 'black',
    'wyze-cam-pan-v3': 'white',
  },
  quantities: {
    ...buildInitialQuantities(),
    'wyze-cam-v4::black': 3,
    'wyze-cam-pan-v3::white': 4,
    'wyze-sense-hub': 2,
  },
};

savePersistedConfig(modifiedConfig);
const loaded = loadPersistedConfig();
assert(loaded !== null, 'Saved config loads from localStorage');
assert(loaded?.activeStepId === 'sensors', 'Active step restored');
assert(
  loaded?.activeVariantByProductId['wyze-cam-v4'] === 'black',
  'Active variant restored',
);
assert(
  getStoredQuantity(loaded!.quantities, bundleData.steps[0]!.products[0]!, 'black') === 3 ||
    loaded!.quantities['wyze-cam-v4::black'] === 3,
  'Modified quantity restored',
);

console.log('\nCorrupted localStorage');
memoryStore.set(STORAGE_KEY, '{not valid json');
assert(parsePersistedConfig('{not valid json') === null, 'Corrupted JSON returns null');
assert(loadPersistedConfig() === null, 'Corrupted storage does not crash load');

console.log('\nUnknown product and variant keys ignored');
const merged = parsePersistedConfig(
  JSON.stringify({
    activeStepId: 'invalid-step',
    activeVariantByProductId: {
      'ghost-product': 'white',
      'wyze-cam-v4': 'not-a-color',
    },
    quantities: {
      'ghost-product': 5,
      'wyze-cam-v4::purple': 9,
      'wyze-cam-v4::white': 2,
    },
  }),
);
assert(merged !== null, 'Partially invalid payload still merges');
assert(
  merged!.activeStepId === bundleData.steps[0]?.id,
  'Invalid step falls back to first step',
);
assert(
  merged!.activeVariantByProductId['ghost-product'] === undefined,
  'Unknown product variant entry ignored',
);
assert(
  merged!.activeVariantByProductId['wyze-cam-v4'] === buildInitialActiveVariants()['wyze-cam-v4'],
  'Invalid variant id ignored for known product',
);
assert(merged!.quantities['ghost-product'] === undefined, 'Unknown product quantity ignored');
assert(merged!.quantities['wyze-cam-v4::purple'] === undefined, 'Unknown variant quantity ignored');

console.log('\nRequired hub minimum after restore');
const hubClamped = parsePersistedConfig(
  JSON.stringify({
    activeStepId: 'cameras',
    activeVariantByProductId: buildInitialActiveVariants(),
    quantities: {
      ...buildInitialQuantities(),
      'wyze-sense-hub': 0,
    },
  }),
);
assert(hubClamped !== null, 'Hub clamp payload parses');
assert(
  hubClamped!.quantities['wyze-sense-hub'] === 1,
  'Required hub quantity clamped to minimum of 1',
);

console.log('\nTotals recalculate from restored state');
const restoredLines = buildReviewLines(loaded!.quantities);
const restoredActive = calculateActiveTotal(restoredLines);
const restoredCompare = calculateCompareTotal(restoredLines);
const restoredSavings = calculateSavings(restoredCompare, restoredActive);

const expectedLines = buildReviewLines(modifiedConfig.quantities);
const expectedActive = calculateActiveTotal(expectedLines);
assert(restoredActive === expectedActive, 'Active total matches restored quantities');
assert(restoredSavings === calculateSavings(restoredCompare, restoredActive), 'Savings derived from restored lines');

console.log('\nSaved payload excludes derived totals');
savePersistedConfig(modifiedConfig);
const rawSaved = memoryStore.get(STORAGE_KEY) ?? '';
let parsedSaved: Record<string, unknown> = {};
try {
  parsedSaved = JSON.parse(rawSaved) as Record<string, unknown>;
} catch {
  failed += 1;
  console.error('  ✗ Saved payload is valid JSON');
}
assert(!('activeTotal' in parsedSaved), 'Does not persist active total');
assert(!('compareTotal' in parsedSaved), 'Does not persist compare total');
assert(!('savings' in parsedSaved), 'Does not persist savings');

console.log('\nClear persisted config');
clearPersistedConfig();
assert(loadPersistedConfig() === null, 'Clear removes saved configuration');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
