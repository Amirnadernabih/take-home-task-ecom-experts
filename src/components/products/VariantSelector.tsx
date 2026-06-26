import { useRef, type KeyboardEvent } from 'react';
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
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const lastIndex = variants.length - 1;
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = index === lastIndex ? 0 : index + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = index === 0 ? lastIndex : index - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextVariant = variants[nextIndex];
    if (!nextVariant) {
      return;
    }

    onSelect(nextVariant.id);
    focusOption(nextIndex);
  };

  return (
    <div
      className="variant-selector"
      role="radiogroup"
      aria-label={`${product.title} color options`}
    >
      {variants.map((variant, index) => {
        const isActive = variant.id === activeVariantId;

        return (
          <button
            key={variant.id}
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            type="button"
            className={`variant-selector__option${isActive ? ' variant-selector__option--active' : ''}`}
            role="radio"
            aria-checked={isActive}
            aria-label={variant.label}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(variant.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
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
