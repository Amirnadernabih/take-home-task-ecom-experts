import { useBundleState } from '../hooks/useBundleState';
import { BundleAccordion } from './accordion/BundleAccordion';

function ReviewPlaceholder() {
  const groups = ['Cameras', 'Sensors', 'Accessories', 'Plan'];

  return (
    <aside className="review-column" aria-label="Review">
      <div className="review-panel">
        <p className="text-section-label review-label">Review</p>
        <h2 className="review-title">Your security system</h2>
        <p className="review-description">
          Review your selected products and checkout when ready.
        </p>

        {groups.map((group) => (
          <div key={group} className="review-group">
            <p className="text-section-label review-group-label">{group}</p>
            <div className="review-line-placeholder">
              <span className="review-line-bar" aria-hidden />
              <span className="review-line-price" aria-hidden />
            </div>
            <div className="review-line-placeholder">
              <span className="review-line-bar" aria-hidden />
              <span className="review-line-price" aria-hidden />
            </div>
          </div>
        ))}

        <div className="review-total-placeholder">
          <div>
            <span className="review-line-bar" aria-hidden />
            <span className="review-total-bar" aria-hidden />
          </div>
          <button type="button" className="review-checkout-placeholder" disabled>
            Checkout
          </button>
        </div>
      </div>
    </aside>
  );
}

export function AppShell() {
  const { state, setActiveStep, goToNextStep, getStepSelectedCount } =
    useBundleState();

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
          />
          <ReviewPlaceholder />
        </div>
      </div>
    </div>
  );
}
