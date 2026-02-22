/**
 * Shared formatting helpers. No duplicated formatting logic in screens.
 */

/**
 * Format amount as currency. Uses simple locale-neutral format.
 */
export function formatAmount(amount: number, currency = 'NPR'): string {
  const abs = Math.abs(amount);
  const formatted = abs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const prefix = amount < 0 ? '-' : '';
  return `${prefix}${currency} ${formatted}`;
}

/**
 * Format dateISO to display string (e.g. "Jan 15, 2025").
 */
export function formatDate(dateISO: string): string {
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
