import type { Product } from '../../types/bundle';
import type { BundleCardActions } from './bundleCardActions';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  stepId: string;
  actions: BundleCardActions;
}

function getGridClass(stepId: string): string {
  return `product-grid product-grid--${stepId}`;
}

export function ProductGrid({ products, stepId, actions }: ProductGridProps) {
  return (
    <div className={getGridClass(stepId)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} actions={actions} />
      ))}
    </div>
  );
}
