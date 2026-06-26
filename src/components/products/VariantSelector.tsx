import type { Product, ProductVariant } from '../../types/bundle';

interface VariantSelectorProps {
  product: Product;
  variants: ProductVariant[];
  activeVariantId: string;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({
  product,
  variants,
  activeVariantId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div
      className="variant-selector"
      role="radiogroup"
      aria-label={`${product.title} color options`}
    >
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;

        return (
          <button
            key={variant.id}
            type="button"
            className={`variant-selector__option${isActive ? ' variant-selector__option--active' : ''}`}
            role="radio"
            aria-checked={isActive}
            aria-label={variant.label}
            onClick={() => onSelect(variant.id)}
          >
            {variant.thumbnail ? (
              <img
                src={variant.thumbnail}
                alt=""
                className="variant-selector__thumb"
              />
            ) : (
              <span
                className="variant-selector__swatch"
                style={{ backgroundColor: variant.swatch ?? '#cccccc' }}
              />
            )}
            <span className="variant-selector__label">{variant.label}</span>
          </button>
        );
      })}
    </div>
  );
}
