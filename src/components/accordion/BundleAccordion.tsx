import { bundleData } from '../../data';
import type { BundleCardActions } from '../products/bundleCardActions';
import { AccordionStep } from './AccordionStep';

interface BundleAccordionProps {
  activeStepId: string;
  getStepSelectedCount: (stepId: string) => number;
  setActiveStep: (stepId: string) => void;
  goToNextStep: () => void;
  bundleCardActions: BundleCardActions;
}

export function BundleAccordion({
  activeStepId,
  getStepSelectedCount,
  setActiveStep,
  goToNextStep,
  bundleCardActions,
}: BundleAccordionProps) {
  const stepTotal = bundleData.steps.length;

  const handleNext = (stepIndex: number) => {
    const isLastStep = stepIndex === stepTotal - 1;

    if (isLastStep) {
      document
        .querySelector('.review-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
                isExpanded={isExpanded}
                selectedCount={getStepSelectedCount(step.id)}
                isLastStep={index === stepTotal - 1}
                headerId={headerId}
                panelId={panelId}
                bundleCardActions={bundleCardActions}
                onToggle={() => handleToggle(step.id)}
                onNext={() => handleNext(index)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
