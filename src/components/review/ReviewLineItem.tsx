import { getProductById } from '../../data';
import type { Product, ReviewLine } from '../../types/bundle';
import { PriceStack } from '../ui/PriceStack';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Icon } from '../ui/Icon';

export interface ReviewLineActions {
  increment: (product: Product, variantId?: string) => void;
  decrement: (product: Product, variantId?: string) => void;
  canIncrement: (product: Product, variantId?: string) => boolean;
  canDecrement: (product: Product, variantId?: string) => boolean;
}

interface ReviewLineItemProps {
  line: ReviewLine;
  showVariantLabel: boolean;
  showStepper: boolean;
  actions: ReviewLineActions;
}

function ReviewLinePrice({ line }: { line: ReviewLine }) {
  if (line.billingSuffix) {
    return (
      <PriceStack
        price={line.unitPrice}
        compareAtPrice={line.unitCompareAtPrice}
        billingSuffix={line.billingSuffix}
        displayPriceLabel={line.displayPriceLabel}
      />
    );
  }

  if (line.displayPriceLabel === 'FREE') {
    return (
      <PriceStack
        price={0}
        compareAtPrice={line.unitCompareAtPrice}
        displayPriceLabel="FREE"
      />
    );
  }

  const activePrice =
    line.quantity > 1 ? line.activeLineTotal : line.unitPrice;
  const comparePrice =
    line.quantity > 1 ? line.compareLineTotal : line.unitCompareAtPrice;

  return (
    <PriceStack
      price={activePrice}
      compareAtPrice={comparePrice}
      displayPriceLabel={line.displayPriceLabel}
    />
  );
}

export function ReviewLineItem({
  line,
  showVariantLabel,
  showStepper,
  actions,
}: ReviewLineItemProps) {
  const product = getProductById(line.productId);
  const isRequired = product?.required ?? false;

  const handleIncrement = () => {
    if (!product) return;
    actions.increment(product, line.variantId);
  };

  const handleDecrement = () => {
    if (!product) return;
    actions.decrement(product, line.variantId);
  };

  return (
    <div className="review-line-item">
      <div className="review-line-item__media" aria-hidden>
        {line.image ? (
          <img
            src={line.image}
            alt=""
            className="review-line-item__image"
          />
        ) : line.icon ? (
          <span className="review-line-item__icon-wrap">
            <Icon name={line.icon} className="review-line-item__icon" />
          </span>
        ) : null}
      </div>

      <div className="review-line-item__body">
        <div className="review-line-item__details">
          <p className="review-line-item__title">
            {line.productTitle}
            {isRequired ? (
              <span className="review-line-item__required"> (Required)</span>
            ) : null}
          </p>
          {showVariantLabel && line.variantLabel ? (
            <p className="review-line-item__variant">{line.variantLabel}</p>
          ) : null}

          {showStepper && product ? (
            <QuantityStepper
              value={line.quantity}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
              canDecrement={actions.canDecrement(product, line.variantId)}
              canIncrement={actions.canIncrement(product, line.variantId)}
              decrementLabel={`Decrease ${line.productTitle}`}
              incrementLabel={`Increase ${line.productTitle}`}
            />
          ) : null}
        </div>

        <ReviewLinePrice line={line} />
      </div>
    </div>
  );
}
