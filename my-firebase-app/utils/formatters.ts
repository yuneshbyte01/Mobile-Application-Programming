/**
 * Formatting utilities for Budget Buddy.
 * Single place for currency and amount display (per .cursorrules).
 */

const DEFAULT_CURRENCY = 'USD';

export function formatAmount(
  amount: number,
  currency: string = DEFAULT_CURRENCY
): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAmountShort(
  amount: number,
  currency: string = 'USD'
): string {
  return formatAmount(amount, currency);
}
