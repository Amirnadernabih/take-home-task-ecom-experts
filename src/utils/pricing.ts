import { bundleData } from '../data';
import type { Product, ReviewLine, ShippingOption } from '../types/bundle';
import type { QuantitiesRecord } from '../types/bundle';

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function usesVariantQuantityKeys(product: Product): boolean {
  return !(
    product.variants.length === 1 && product.variants[0]?.id === 'default'
  );
}

export function getQuantityKey(product: Product, variantId: string): string {
  if (!usesVariantQuantityKeys(product)) {
    return product.id;
  }

  return `${product.id}::${variantId}`;
}

export function getVariantIdsForProduct(product: Product): string[] {
  if (!usesVariantQuantityKeys(product)) {
    return [product.variants[0]?.id ?? 'default'];
  }

  return product.variants.map((variant) => variant.id);
}

export function getDefaultVariantId(product: Product): string {
  return product.defaultVariantId ?? product.variants[0]?.id ?? 'default';
}

export function getMinQuantity(product: Product): number {
  return product.minQuantity ?? 0;
}

export function getMaxQuantity(product: Product): number {
  return product.maxQuantity ?? 99;
}

export function buildInitialQuantities(): QuantitiesRecord {
  const quantities: QuantitiesRecord = {};

  for (const step of bundleData.steps) {
    for (const product of step.products) {
      for (const variant of product.variants) {
        const key = getQuantityKey(product, variant.id);
        quantities[key] = variant.initialQuantity;
      }
    }
  }

  return quantities;
}

export function buildInitialActiveVariants(): Record<string, string> {
  const activeVariantByProductId: Record<string, string> = {};

  for (const step of bundleData.steps) {
    for (const product of step.products) {
      activeVariantByProductId[product.id] = getDefaultVariantId(product);
    }
  }

  return activeVariantByProductId;
}

export function getStoredQuantity(
  quantities: QuantitiesRecord,
  product: Product,
  variantId: string,
): number {
  return quantities[getQuantityKey(product, variantId)] ?? 0;
}

export function getProductTotalQuantity(
  quantities: QuantitiesRecord,
  product: Product,
): number {
  return getVariantIdsForProduct(product).reduce(
    (sum, variantId) => sum + getStoredQuantity(quantities, product, variantId),
    0,
  );
}

export function canIncrementQuantity(
  product: Product,
  currentQuantity: number,
): boolean {
  return currentQuantity < getMaxQuantity(product);
}

export function canDecrementQuantity(
  product: Product,
  currentQuantity: number,
): boolean {
  return currentQuantity > getMinQuantity(product);
}

export function clampQuantity(product: Product, quantity: number): number {
  return Math.min(getMaxQuantity(product), Math.max(getMinQuantity(product), quantity));
}

function getLineUnitPrice(product: Product): number {
  return product.lineUnitPrice ?? product.price;
}

function getLineUnitCompareAtPrice(product: Product): number | undefined {
  return product.lineUnitCompareAtPrice ?? product.compareAtPrice;
}

function getLineActiveTotal(line: Pick<ReviewLine, 'quantity' | 'unitPrice' | 'displayPriceLabel'>): number {
  if (line.displayPriceLabel === 'FREE') {
    return 0;
  }

  return roundMoney(line.unitPrice * line.quantity);
}

function getLineCompareTotal(
  line: Pick<
    ReviewLine,
    'quantity' | 'unitPrice' | 'unitCompareAtPrice' | 'displayPriceLabel'
  >,
): number {
  if (line.unitCompareAtPrice === undefined) {
    return getLineActiveTotal(line);
  }

  return roundMoney(line.unitCompareAtPrice * line.quantity);
}

export function buildReviewLine(
  product: Product,
  variantId: string,
  quantity: number,
): ReviewLine {
  const variant = product.variants.find((item) => item.id === variantId);
  const unitPrice = getLineUnitPrice(product);
  const unitCompareAtPrice = getLineUnitCompareAtPrice(product);

  const line: ReviewLine = {
    id: usesVariantQuantityKeys(product)
      ? `${product.id}::${variantId}`
      : product.id,
    productId: product.id,
    variantId: usesVariantQuantityKeys(product) ? variantId : undefined,
    productTitle: product.title,
    variantLabel:
      usesVariantQuantityKeys(product) && variant?.label !== 'Default'
        ? variant?.label
        : undefined,
    category: product.category,
    quantity,
    unitPrice,
    unitCompareAtPrice,
    displayPriceLabel: product.displayPriceLabel,
    billingSuffix: product.billingSuffix,
    image: product.image ?? variant?.thumbnail,
    icon: product.icon,
    activeLineTotal: 0,
    compareLineTotal: 0,
  };

  line.activeLineTotal = getLineActiveTotal(line);
  line.compareLineTotal = getLineCompareTotal(line);

  return line;
}

export function buildShippingReviewLine(shipping: ShippingOption): ReviewLine {
  const line: ReviewLine = {
    id: shipping.id,
    productId: shipping.id,
    productTitle: shipping.title,
    category: 'shipping',
    quantity: 1,
    unitPrice: shipping.price,
    unitCompareAtPrice: shipping.compareAtPrice,
    displayPriceLabel: shipping.displayPriceLabel,
    icon: shipping.icon,
    activeLineTotal: 0,
    compareLineTotal: 0,
  };

  line.activeLineTotal = getLineActiveTotal(line);
  line.compareLineTotal = getLineCompareTotal(line);

  return line;
}

export function buildReviewLines(quantities: QuantitiesRecord): ReviewLine[] {
  const lines: ReviewLine[] = [];

  for (const step of bundleData.steps) {
    for (const product of step.products) {
      for (const variantId of getVariantIdsForProduct(product)) {
        const quantity = getStoredQuantity(quantities, product, variantId);
        if (quantity <= 0) {
          continue;
        }

        lines.push(buildReviewLine(product, variantId, quantity));
      }
    }
  }

  lines.push(buildShippingReviewLine(bundleData.shipping));

  return lines;
}

export function getMerchandiseReviewLines(lines: ReviewLine[]): ReviewLine[] {
  return lines.filter((line) => line.category !== 'shipping');
}

export function shouldShowVariantLabelInReview(
  lines: ReviewLine[],
  line: ReviewLine,
): boolean {
  if (!line.variantLabel) {
    return false;
  }

  const siblingCount = lines.filter(
    (item) =>
      item.productId === line.productId && item.category !== 'shipping',
  ).length;

  return siblingCount > 1;
}

export function calculateActiveTotal(lines: ReviewLine[]): number {
  return roundMoney(
    getMerchandiseReviewLines(lines).reduce(
      (sum, line) => sum + line.activeLineTotal,
      0,
    ),
  );
}

export function calculateCompareTotal(lines: ReviewLine[]): number {
  return roundMoney(
    getMerchandiseReviewLines(lines).reduce(
      (sum, line) => sum + line.compareLineTotal,
      0,
    ),
  );
}

export function calculateSavings(
  compareTotal: number,
  activeTotal: number,
): number {
  return roundMoney(compareTotal - activeTotal);
}
