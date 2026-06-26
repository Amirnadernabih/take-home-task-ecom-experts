interface QuantityStepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  canDecrement: boolean;
  canIncrement: boolean;
  decrementLabel: string;
  incrementLabel: string;
}

export function QuantityStepper({
  value,
  onDecrement,
  onIncrement,
  canDecrement,
  canIncrement,
  decrementLabel,
  incrementLabel,
}: QuantityStepperProps) {
  return (
    <div className="quantity-stepper">
      <button
        type="button"
        className="quantity-stepper__button"
        onClick={onDecrement}
        disabled={!canDecrement}
        aria-label={decrementLabel}
      >
        −
      </button>
      <span className="quantity-stepper__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="quantity-stepper__button"
        onClick={onIncrement}
        disabled={!canIncrement}
        aria-label={incrementLabel}
      >
        +
      </button>
    </div>
  );
}
