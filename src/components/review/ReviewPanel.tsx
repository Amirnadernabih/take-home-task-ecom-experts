import { forwardRef, useEffect, useMemo, useState } from 'react';
import type {
  BundleSummary,
  BundleTotals,
  ProductCategory,
  ReviewLine,
} from '../../types/bundle';
import { shouldShowVariantLabelInReview } from '../../utils/pricing';
import { ReviewGroup } from './ReviewGroup';
import { ReviewLineItem, type ReviewLineActions } from './ReviewLineItem';
import { TotalSummary } from './TotalSummary';

const GROUP_ORDER: ProductCategory[] = [
  'cameras',
  'sensors',
  'accessories',
  'plan',
];

interface ReviewPanelProps {
  lines: ReviewLine[];
  totals: BundleTotals;
  summary: BundleSummary;
  actions: ReviewLineActions;
  onSaveForLater: () => void;
  saveStatus: 'idle' | 'saved' | 'error';
  hasRestoredSavedConfig: boolean;
}

export const ReviewPanel = forwardRef<HTMLDivElement, ReviewPanelProps>(
  function ReviewPanel(
    {
      lines,
      totals,
      summary,
      actions,
      onSaveForLater,
      saveStatus,
      hasRestoredSavedConfig,
    },
    ref,
  ) {
    const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
    const [restoreMessage, setRestoreMessage] = useState<string | null>(
      hasRestoredSavedConfig ? 'Your saved system was restored.' : null,
    );

    useEffect(() => {
      if (!hasRestoredSavedConfig) {
        return;
      }

      const timer = window.setTimeout(() => {
        setRestoreMessage(null);
      }, 3000);

      return () => window.clearTimeout(timer);
    }, [hasRestoredSavedConfig]);

    const merchandiseLines = useMemo(
      () => lines.filter((line) => line.category !== 'shipping'),
      [lines],
    );

    const shippingLine = useMemo(
      () => lines.find((line) => line.category === 'shipping'),
      [lines],
    );

    const linesByCategory = useMemo(() => {
      const grouped = new Map<ProductCategory, ReviewLine[]>();

      for (const category of GROUP_ORDER) {
        grouped.set(category, []);
      }

      for (const line of merchandiseLines) {
        if (line.category === 'shipping') {
          continue;
        }

        grouped.get(line.category)?.push(line);
      }

      return grouped;
    }, [merchandiseLines]);

    const showVariantLabelForLine = (line: ReviewLine) =>
      shouldShowVariantLabelInReview(merchandiseLines, line);

    const saveMessage =
      saveStatus === 'saved'
        ? 'System saved'
        : saveStatus === 'error'
          ? 'Unable to save your system. Please try again.'
          : null;

    const handleCheckout = () => {
      setCheckoutMessage('Checkout is a prototype action.');
    };

    return (
      <aside className="review-column" aria-label="Review">
        <div className="review-panel" ref={ref}>
          <div className="review-panel__header">
            <p className="text-section-label review-label">Review</p>
            <h2 className="review-title">Your security system</h2>
            <p className="review-description">
              Review your personalized protection system designed to keep what
              matters most safe.
            </p>
            {restoreMessage ? (
              <p className="review-inline-message" role="status">
                {restoreMessage}
              </p>
            ) : null}
          </div>

          <div className="review-panel__body">
            <div className="review-panel__items">
              {GROUP_ORDER.map((category) => (
                <ReviewGroup
                  key={category}
                  category={category}
                  lines={linesByCategory.get(category) ?? []}
                  showVariantLabelForLine={showVariantLabelForLine}
                  actions={actions}
                />
              ))}

              {shippingLine ? (
                <section
                  className="review-group review-group--shipping"
                  aria-label="Shipping"
                >
                  <div className="review-group__lines">
                    <ReviewLineItem
                      line={shippingLine}
                      showVariantLabel={false}
                      showStepper={false}
                      actions={actions}
                    />
                  </div>
                </section>
              ) : null}
            </div>

            <div className="review-panel__summary">
              <TotalSummary
                summary={summary}
                totals={totals}
                checkoutMessage={checkoutMessage}
                saveMessage={saveMessage}
                onCheckout={handleCheckout}
                onSaveForLater={onSaveForLater}
              />
            </div>
          </div>
        </div>
      </aside>
    );
  },
);
