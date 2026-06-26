const STEPS = [
  {
    id: 'cameras',
    stepNumber: 1,
    title: 'Choose your cameras',
    icon: 'camera',
    selectedCount: 2,
    expanded: true,
  },
  {
    id: 'plan',
    stepNumber: 2,
    title: 'Choose your plan',
    icon: 'shield',
    selectedCount: 1,
    expanded: false,
  },
  {
    id: 'sensors',
    stepNumber: 3,
    title: 'Choose your sensors',
    icon: 'sensor',
    selectedCount: 2,
    expanded: false,
  },
  {
    id: 'accessories',
    stepNumber: 4,
    title: 'Add extra protection',
    icon: 'grid',
    selectedCount: 1,
    expanded: false,
  },
] as const;

function StepIcon({ type }: { type: string }) {
  const common = {
    className: 'step-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    'aria-hidden': true,
  } as const;

  switch (type) {
    case 'camera':
      return (
        <svg {...common}>
          <path d="M4 8.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5" />
          <path d="M8 6.5h8l1.5 2H6.5L8 6.5Z" />
          <circle cx="12" cy="12.5" r="2.75" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 4.5 5 7.5v5c0 4.2 3 7.4 7 8.5 4-1.1 7-4.3 7-8.5v-5L12 4.5Z" />
        </svg>
      );
    case 'sensor':
      return (
        <svg {...common}>
          <path d="M5 12a7 7 0 0 1 14 0" />
          <path d="M8.5 12a3.5 3.5 0 0 1 7 0" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="5" y="5" width="6" height="6" rx="1" />
          <rect x="13" y="5" width="6" height="6" rx="1" />
          <rect x="5" y="13" width="6" height="6" rx="1" />
          <rect x="13" y="13" width="6" height="6" rx="1" />
        </svg>
      );
  }
}

function BuilderPlaceholder() {
  return (
    <section className="builder-column" aria-label="Bundle builder">
      <div className="builder-panel">
        <div className="step-list">
          {STEPS.map((step) => (
            <article key={step.id} className="step-item">
              <button
                type="button"
                className="step-trigger"
                aria-expanded={step.expanded}
                disabled
              >
                <span className="step-trigger-main">
                  <StepIcon type={step.icon} />
                  <span className="step-copy">
                    <span className="text-step-label">
                      Step {step.stepNumber} of {STEPS.length}
                    </span>
                    <span className="text-title">{step.title}</span>
                  </span>
                </span>
                <span className="step-status">
                  {step.selectedCount} selected
                  <svg
                    className="step-chevron"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    aria-hidden
                  >
                    <path d={step.expanded ? 'M3 8 L6 5 L9 8' : 'M3 5 L6 8 L9 5'} />
                  </svg>
                </span>
              </button>

              {step.expanded ? (
                <div className="step-panel">
                  <div className="step-panel-inner">
                    <p className="step-panel-placeholder">
                      Product cards will render here
                    </p>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

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
  return (
    <div className="page">
      <div className="app-container">
        <header className="page-header page-header--mobile-only">
          <h1 className="text-page-title">Let&apos;s get started!</h1>
        </header>

        <div className="app-layout">
          <BuilderPlaceholder />
          <ReviewPlaceholder />
        </div>
      </div>
    </div>
  );
}
