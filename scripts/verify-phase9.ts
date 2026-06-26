/**
 * Phase 9 verification — responsive CSS breakpoints and layout rules.
 * Run: npx tsx scripts/verify-phase9.ts
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const cssPath = resolve('src/styles/global.css');
const css = readFileSync(cssPath, 'utf8');

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

console.log('Phase 9 — responsive layout verification\n');

console.log('Breakpoint rules');
assert(css.includes('@media (max-width: 640px)'), 'Mobile breakpoint (<=640px)');
assert(css.includes('@media (min-width: 1024px)'), 'Desktop breakpoint (>=1024px)');
assert(
  css.includes('@media (min-width: 641px) and (max-width: 1023px)'),
  'Medium stacked breakpoint (641–1023px)',
);

console.log('\nDesktop two-column layout');
assert(
  css.includes('grid-template-columns: minmax(0, 1fr) var(--width-review-column)'),
  'Builder + review columns on desktop',
);
assert(css.includes('position: sticky'), 'Sticky review panel on desktop');

console.log('\nMedium review split layout');
assert(css.includes('.review-panel__body'), 'Review panel body wrapper');
assert(css.includes('.review-panel__items'), 'Review items column');
assert(css.includes('.review-panel__summary'), 'Review summary column');

console.log('\nCamera grid responsiveness');
assert(
  css.includes('repeat(5, minmax(0, 1fr))'),
  'Wide medium camera row layout',
);
assert(
  css.includes('repeat(2, minmax(0, 1fr))'),
  'Desktop camera two-column grid',
);

console.log('\nMobile touch targets');
assert(css.includes('min-height: 3rem'), 'Large checkout tap target on mobile');
assert(css.includes('width: 2.25rem'), 'Larger stepper buttons on mobile');

console.log('\nOverflow prevention');
assert(css.includes('min-width: 0'), 'Min-width zero on flex/grid children');
assert(css.includes('overflow-wrap: anywhere'), 'Text wrap on narrow screens');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
