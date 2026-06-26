import type { BundleStep } from '../../types/bundle';
import { Icon } from '../ui/Icon';

interface AccordionStepProps {
  step: BundleStep;
  stepTotal: number;
  isExpanded: boolean;
  selectedCount: number;
  isLastStep: boolean;
  headerId: string;
  panelId: string;
  onToggle: () => void;
  onNext: () => void;
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
  isExpanded,
  selectedCount,
  isLastStep,
  headerId,
  panelId,
  onToggle,
  onNext,
}: AccordionStepProps) {
  const statusLabel =
    selectedCount === 1 ? '1 selected' : `${selectedCount} selected`;

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
              <span className="accordion-selected-count">{statusLabel}</span>
            ) : null}
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
            <p className="accordion-panel-placeholder">
              Product cards will render here
            </p>
          </div>

          <button type="button" className="accordion-next-button" onClick={onNext}>
            {isLastStep ? 'Review your system' : step.nextLabel}
          </button>
        </div>
      ) : null}
    </article>
  );
}
