import type { Product } from '../../types/bundle';

export interface BundleCardActions {
  getActiveVariant: (product: Product) => string;
  getQuantity: (product: Product, variantId?: string) => number;
  getProductTotalQuantity: (product: Product) => number;
  selectVariant: (productId: string, variantId: string) => void;
  increment: (product: Product, variantId?: string) => void;
  decrement: (product: Product, variantId?: string) => void;
  canIncrement: (product: Product, variantId?: string) => boolean;
  canDecrement: (product: Product, variantId?: string) => boolean;
}
