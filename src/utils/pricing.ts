import { bundleData } from '../data';
import type { SelectedVariantLine } from '../types/bundle';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getInitialSelectedLines(): SelectedVariantLine[] {
  const lines: SelectedVariantLine[] = [];

  for (const step of bundleData.steps) {
    for (const product of step.products) {
      for (const variant of product.variants) {
        if (variant.initialQuantity <= 0) {
          continue;
        }

        lines.push({
          productId: product.id,
          variantId: variant.id,
          productTitle: product.title,
          variantLabel: variant.label,
          category: product.category,
          quantity: variant.initialQuantity,
          unitPrice: product.lineUnitPrice ?? product.price,
          unitCompareAtPrice:
            product.lineUnitCompareAtPrice ?? product.compareAtPrice,
          displayPriceLabel: product.displayPriceLabel,
          billingSuffix: product.billingSuffix,
          image: product.image ?? variant.thumbnail,
        });
      }
    }
  }

  return lines;
}

export function getLineActiveTotal(line: SelectedVariantLine): number {
  if (line.displayPriceLabel === 'FREE') {
    return 0;
  }

  return roundMoney(line.unitPrice * line.quantity);
}

export function getLineCompareTotal(line: SelectedVariantLine): number {
  if (line.unitCompareAtPrice === undefined) {
    return getLineActiveTotal(line);
  }

  return roundMoney(line.unitCompareAtPrice * line.quantity);
}

export function calculateInitialTotals() {
  const lines = getInitialSelectedLines();

  const merchandiseActiveTotal = roundMoney(
    lines.reduce((sum, line) => sum + getLineActiveTotal(line), 0),
  );
  const merchandiseCompareTotal = roundMoney(
    lines.reduce((sum, line) => sum + getLineCompareTotal(line), 0),
  );

  const activeTotal = merchandiseActiveTotal;
  const compareTotal = merchandiseCompareTotal;

  return {
    lines,
    activeTotal,
    compareTotal,
    savings: roundMoney(compareTotal - activeTotal),
    shipping: bundleData.shipping,
    expected: bundleData.summary,
  };
}
