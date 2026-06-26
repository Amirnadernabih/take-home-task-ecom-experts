import type { Product } from '../../types/bundle';
import { usesVariantQuantityKeys } from '../../utils/pricing';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { PriceStack } from '../ui/PriceStack';
import { QuantityStepper } from '../ui/QuantityStepper';
import type { BundleCardActions } from './bundleCardActions';
import { VariantSelector } from './VariantSelector';

interface ProductCardProps {
  product: Product;
  actions: BundleCardActions;
}

function ProductCardMedia({
  product,
  imageSrc,
}: {
  product: Product;
  imageSrc?: string;
}) {
  if (imageSrc) {
    return (
      <div className="product-card__media">
        <img
          src={imageSrc}
          alt={product.title}
          className="product-card__image"
        />
      </div>
    );
  }

  if (product.icon) {
    return (
      <div className="product-card__media product-card__media--icon">
        <span className="product-card__icon-wrap" aria-hidden>
          <Icon name={product.icon} className="product-card__icon" />
        </span>
      </div>
    );
  }

  return null;
}

export function ProductCard({ product, actions }: ProductCardProps) {
  const activeVariantId = actions.getActiveVariant(product);
  const quantity = actions.getQuantity(product);
  const isSelected = actions.getProductTotalQuantity(product) > 0;
  const showVariants = usesVariantQuantityKeys(product);
  const imageSrc =
    product.variants.find((variant) => variant.id === activeVariantId)
      ?.thumbnail ?? product.image;

  return (
    <article
      className={`product-card product-card--${product.category}${isSelected ? ' product-card--selected' : ''}`}
    >
      {product.badge ? <Badge label={product.badge} /> : null}

      <div className="product-card__body">
        <ProductCardMedia product={product} imageSrc={imageSrc} />

        <div className="product-card__content">
          <h4 className="product-card__title">{product.title}</h4>
          <p className="product-card__description">{product.description}</p>
          <a
            href={product.learnMoreUrl}
            className="product-card__learn-more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
            <span className="visually-hidden"> (opens in new tab)</span>
          </a>

          {showVariants ? (
            <VariantSelector
              product={product}
              variants={product.variants}
              activeVariantId={activeVariantId}
              onSelect={(variantId) =>
                actions.selectVariant(product.id, variantId)
              }
            />
          ) : null}

          <div className="product-card__footer">
            <QuantityStepper
              value={quantity}
              onDecrement={() => actions.decrement(product)}
              onIncrement={() => actions.increment(product)}
              canDecrement={actions.canDecrement(product)}
              canIncrement={actions.canIncrement(product)}
              decrementLabel={`Decrease ${product.title}`}
              incrementLabel={`Increase ${product.title}`}
            />
            <PriceStack
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              billingSuffix={product.billingSuffix}
              displayPriceLabel={product.displayPriceLabel}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
