import bundleDataJson from './bundleData.json';
import type { BundleData } from '../types/bundle';

export const bundleData = bundleDataJson as BundleData;

export function getAllProducts() {
  return bundleData.steps.flatMap((step) => step.products);
}

export function getProductById(productId: string) {
  return getAllProducts().find((product) => product.id === productId);
}
