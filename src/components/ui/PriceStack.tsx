import { formatMoneyWithSuffix } from '../../utils/format';

interface PriceStackProps {
  price: number;
  compareAtPrice?: number;
  billingSuffix?: string;
  displayPriceLabel?: string;
}

export function PriceStack({
  price,
  compareAtPrice,
  billingSuffix,
  displayPriceLabel,
}: PriceStackProps) {
  if (displayPriceLabel === 'FREE') {
    return (
      <div className="price-stack">
        {compareAtPrice !== undefined ? (
          <span className="price-stack__compare">
            {formatMoneyWithSuffix(compareAtPrice, billingSuffix)}
          </span>
        ) : null}
        <span className="price-stack__active price-stack__active--free">FREE</span>
      </div>
    );
  }

  return (
    <div className="price-stack">
      {compareAtPrice !== undefined && compareAtPrice !== price ? (
        <span className="price-stack__compare">
          {formatMoneyWithSuffix(compareAtPrice, billingSuffix)}
        </span>
      ) : null}
      <span className="price-stack__active">
        {formatMoneyWithSuffix(price, billingSuffix)}
      </span>
    </div>
  );
}
