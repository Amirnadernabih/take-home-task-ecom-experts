import type { BundleSummary, BundleTotals } from '../../types/bundle';
import { formatMoney } from '../../utils/format';
import { GuaranteeBadge } from './GuaranteeBadge';

interface TotalSummaryProps {
  summary: BundleSummary;
  totals: BundleTotals;
  checkoutMessage: string | null;
  saveMessage: string | null;
  onCheckout: () => void;
  onSaveForLater: () => void;
}

export function TotalSummary({
  summary,
  totals,
  checkoutMessage,
  saveMessage,
  onCheckout,
  onSaveForLater,
}: TotalSummaryProps) {
  const savingsMessage = `Congrats! You're saving ${formatMoney(totals.savings)} on your security bundle!`;

  return (
    <div className="review-total-summary">
      <div className="review-total-summary__meta">
        <GuaranteeBadge />
        <span className="review-financing-pill">{summary.financingLabel}</span>
      </div>

      <div className="review-total-summary__amounts">
        {totals.compareTotal !== totals.activeTotal ? (
          <span className="review-total-summary__compare">
            {formatMoney(totals.compareTotal)}
          </span>
        ) : null}
        <span className="review-total-summary__active">
          {formatMoney(totals.activeTotal)}
        </span>
      </div>

      {totals.savings > 0 ? (
        <p className="review-savings-message">{savingsMessage}</p>
      ) : null}

      {checkoutMessage ? (
        <p className="review-inline-message" role="status">
          {checkoutMessage}
        </p>
      ) : null}

      <button type="button" className="review-checkout-button" onClick={onCheckout}>
        Checkout
      </button>

      <button
        type="button"
        className="review-save-link"
        onClick={onSaveForLater}
      >
        Save my system for later
      </button>

      {saveMessage ? (
        <p className="review-inline-message review-inline-message--save" role="status">
          {saveMessage}
        </p>
      ) : null}
    </div>
  );
}
