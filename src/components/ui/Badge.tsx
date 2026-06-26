interface BadgeProps {
  label: string;
}

export function Badge({ label }: BadgeProps) {
  return (
    <span className="product-badge" role="status">
      {label}
    </span>
  );
}
