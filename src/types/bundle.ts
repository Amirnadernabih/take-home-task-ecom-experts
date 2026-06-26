export type ProductCategory = 'cameras' | 'plan' | 'sensors' | 'accessories';

export interface ProductVariant {
  id: string;
  label: string;
  swatch?: string;
  thumbnail?: string;
  initialQuantity: number;
}

export interface Product {
  id: string;
  category: ProductCategory;
  title: string;
  description: string;
  learnMoreUrl: string;
  image?: string;
  icon?: string;
  badge?: string;
  price: number;
  compareAtPrice?: number;
  lineUnitPrice?: number;
  lineUnitCompareAtPrice?: number;
  displayPriceLabel?: string;
  required?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  billingSuffix?: string;
  defaultVariantId?: string;
  variants: ProductVariant[];
}

export interface BundleStep {
  id: string;
  stepNumber: number;
  title: string;
  icon: string;
  category: ProductCategory;
  nextLabel: string;
  products: Product[];
}

export interface ShippingOption {
  id: string;
  category: 'shipping';
  title: string;
  icon: string;
  compareAtPrice: number;
  price: number;
  displayPriceLabel: string;
}

export interface BundleSummary {
  financingLabel: string;
  expectedCompareTotal: number;
  expectedActiveTotal: number;
  expectedSavings: number;
  savingsMessage: string;
}

export interface BundleData {
  steps: BundleStep[];
  shipping: ShippingOption;
  summary: BundleSummary;
}

export interface SelectedVariantLine {
  productId: string;
  variantId: string;
  productTitle: string;
  variantLabel: string;
  category: ProductCategory;
  quantity: number;
  unitPrice: number;
  unitCompareAtPrice?: number;
  displayPriceLabel?: string;
  billingSuffix?: string;
  image?: string;
}
