import type { Product } from '../../types/bundle';
import type { BundleCardActions } from './bundleCardActions';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  stepId: string;
  actions: BundleCardActions;
}

export function ProductGrid({ products, stepId, actions }: ProductGridProps) {
  const gridClass =
    stepId === 'cameras'
      ? 'product-grid product-grid--cameras'
      : 'product-grid';

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} actions={actions} />
      ))}
    </div>
  );
}
