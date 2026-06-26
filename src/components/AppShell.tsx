import { useBundleState } from '../hooks/useBundleState';
import { BundleAccordion } from './accordion/BundleAccordion';
import { ReviewPanel } from './review/ReviewPanel';

export function AppShell() {
  const {
    state,
    summary,
    setActiveStep,
    goToNextStep,
    getStepSelectedCount,
    getActiveVariant,
    getQuantity,
    getProductTotalQuantity,
    selectVariant,
    increment,
    decrement,
    canIncrement,
    canDecrement,
    getReviewLines,
    getTotals,
    saveConfiguration,
  } = useBundleState();

  const bundleCardActions = {
    getActiveVariant,
    getQuantity,
    getProductTotalQuantity,
    selectVariant,
    increment,
    decrement,
    canIncrement,
    canDecrement,
  };

  const reviewLineActions = {
    increment,
    decrement,
    canIncrement,
    canDecrement,
  };

  return (
    <div className="page">
      <div className="app-container">
        <header className="page-header page-header--mobile-only">
          <h1 className="text-page-title">Let&apos;s get started!</h1>
        </header>

        <div className="app-layout">
          <BundleAccordion
            activeStepId={state.activeStepId}
            getStepSelectedCount={getStepSelectedCount}
            setActiveStep={setActiveStep}
            goToNextStep={goToNextStep}
            bundleCardActions={bundleCardActions}
          />
          <ReviewPanel
            lines={getReviewLines()}
            totals={getTotals()}
            summary={summary}
            actions={reviewLineActions}
            onSaveForLater={saveConfiguration}
            saveStatus={state.saveStatus}
          />
        </div>
      </div>
    </div>
  );
}
