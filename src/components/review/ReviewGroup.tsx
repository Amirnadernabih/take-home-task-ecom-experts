import type { ProductCategory, ReviewLine } from '../../types/bundle';
import { ReviewLineItem, type ReviewLineActions } from './ReviewLineItem';

const GROUP_LABELS: Record<ProductCategory, string> = {
  cameras: 'Cameras',
  sensors: 'Sensors',
  accessories: 'Accessories',
  plan: 'Home monitoring plan',
};

interface ReviewGroupProps {
  category: ProductCategory;
  lines: ReviewLine[];
  showVariantLabelForLine: (line: ReviewLine) => boolean;
  actions: ReviewLineActions;
}

export function ReviewGroup({
  category,
  lines,
  showVariantLabelForLine,
  actions,
}: ReviewGroupProps) {
  if (lines.length === 0) {
    return null;
  }

  return (
    <section className="review-group" aria-label={GROUP_LABELS[category]}>
      <h3 className="text-section-label review-group-label">
        {GROUP_LABELS[category]}
      </h3>
      <div className="review-group__lines">
        {lines.map((line) => (
          <ReviewLineItem
            key={line.id}
            line={line}
            showVariantLabel={showVariantLabelForLine(line)}
            showStepper
            actions={actions}
          />
        ))}
      </div>
    </section>
  );
}
