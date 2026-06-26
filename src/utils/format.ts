export function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function formatMoneyWithSuffix(
  value: number,
  suffix?: string,
): string {
  return `${formatMoney(value)}${suffix ?? ''}`;
}
