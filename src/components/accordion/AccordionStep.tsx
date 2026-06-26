import type { KeyboardEvent } from 'react';
import type { BundleStep } from '../../types/bundle';
import type { BundleCardActions } from '../products/bundleCardActions';
import { ProductGrid } from '../products/ProductGrid';
import { Icon } from '../ui/Icon';

interface AccordionStepProps {
  step: BundleStep;
  stepTotal: number;
  stepIndex: number;
  isExpanded: boolean;
  selectedCount: number;
  isLastStep: boolean;
  headerId: string;
  panelId: string;
  bundleCardActions: BundleCardActions;
  onToggle: () => void;
  onNext: () => void;
  onHeaderKeyDown: (event: KeyboardEvent<HTMLButtonElement>, stepIndex: number) => void;
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className="accordion-chevron"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d={expanded ? 'M3 8 L6 5 L9 8' : 'M3 5 L6 8 L9 5'} />
    </svg>
  );
}

export function AccordionStep({
  step,
  stepTotal,
  stepIndex,
  isExpanded,
  selectedCount,
  isLastStep,
  headerId,
  panelId,
  bundleCardActions,
  onToggle,
  onNext,
  onHeaderKeyDown,
}: AccordionStepProps) {
  const statusLabel =
    selectedCount === 1 ? '1 selected' : `${selectedCount} selected`;
  const nextButtonLabel = isLastStep ? 'Review your system' : step.nextLabel;

  return (
    <article
      className={`accordion-step${isExpanded ? ' accordion-step--expanded' : ''}`}
    >
      <h3 className="accordion-heading">
        <button
          type="button"
          id={headerId}
          className="accordion-trigger"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={(event) => onHeaderKeyDown(event, stepIndex)}
        >
          <span className="accordion-trigger-main">
            <span className="accordion-icon-wrap" aria-hidden>
              <Icon name={step.icon} className="accordion-icon" />
            </span>
            <span className="accordion-copy">
              <span className="text-step-label">
                Step {step.stepNumber} of {stepTotal}
              </span>
              <span className="text-title">{step.title}</span>
            </span>
          </span>
          <span className="accordion-status">
            {isExpanded ? (
              <span className="accordion-selected-count" aria-hidden>
                {statusLabel}
              </span>
            ) : null}
            <span className="visually-hidden">{statusLabel}</span>
            <Chevron expanded={isExpanded} />
          </span>
        </button>
      </h3>

      {isExpanded ? (
        <div
          id={panelId}
          className="accordion-panel"
          role="region"
          aria-labelledby={headerId}
        >
          <div className="accordion-panel-inner">
            <ProductGrid
              products={step.products}
              stepId={step.id}
              actions={bundleCardActions}
            />
          </div>

          <button
            type="button"
            className="accordion-next-button"
            onClick={onNext}
            aria-label={`${nextButtonLabel}, ${step.title}`}
          >
            {nextButtonLabel}
          </button>
        </div>
      ) : null}
    </article>
  );
}
