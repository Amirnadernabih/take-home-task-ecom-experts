import type { KeyboardEvent } from 'react';
import { bundleData } from '../../data';
import type { BundleCardActions } from '../products/bundleCardActions';
import { AccordionStep } from './AccordionStep';

interface BundleAccordionProps {
  activeStepId: string;
  getStepSelectedCount: (stepId: string) => number;
  setActiveStep: (stepId: string) => void;
  goToNextStep: () => void;
  bundleCardActions: BundleCardActions;
  onScrollToReview: () => void;
}

export function BundleAccordion({
  activeStepId,
  getStepSelectedCount,
  setActiveStep,
  goToNextStep,
  bundleCardActions,
  onScrollToReview,
}: BundleAccordionProps) {
  const stepTotal = bundleData.steps.length;

  const handleNext = (stepIndex: number) => {
    const isLastStep = stepIndex === stepTotal - 1;

    if (isLastStep) {
      onScrollToReview();
      return;
    }

    goToNextStep();
  };

  const handleToggle = (stepId: string) => {
    if (stepId === activeStepId) {
      return;
    }

    setActiveStep(stepId);
  };

  const handleHeaderKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    stepIndex: number,
  ) => {
    const lastIndex = stepTotal - 1;
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowDown':
        nextIndex = stepIndex === lastIndex ? 0 : stepIndex + 1;
        break;
      case 'ArrowUp':
        nextIndex = stepIndex === 0 ? lastIndex : stepIndex - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = lastIndex;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextStep = bundleData.steps[nextIndex];
    if (!nextStep) {
      return;
    }

    document.getElementById(`accordion-header-${nextStep.id}`)?.focus();
  };

  return (
    <section className="builder-column" aria-label="Bundle builder">
      <div className="builder-panel">
        <div className="accordion-list">
          {bundleData.steps.map((step, index) => {
            const isExpanded = step.id === activeStepId;
            const headerId = `accordion-header-${step.id}`;
            const panelId = `accordion-panel-${step.id}`;

            return (
              <AccordionStep
                key={step.id}
                step={step}
                stepTotal={stepTotal}
                stepIndex={index}
                isExpanded={isExpanded}
                selectedCount={getStepSelectedCount(step.id)}
                isLastStep={index === stepTotal - 1}
                headerId={headerId}
                panelId={panelId}
                bundleCardActions={bundleCardActions}
                onToggle={() => handleToggle(step.id)}
                onNext={() => handleNext(index)}
                onHeaderKeyDown={handleHeaderKeyDown}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
