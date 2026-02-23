/**
 * Business logic: category sums, remaining budget from transactions.
 */
import type { Transaction } from '../services/transactionService';

/**
 * Sum of expenses by category for a given month.
 * Returns Record<category, totalSpent>.
 */
export function getExpenseByCategory(
  transactions: Transaction[],
  year: number,
  month: number
): Record<string, number> {
  const filtered = transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    const d = new Date(t.dateISO);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const result: Record<string, number> = {};
  for (const t of filtered) {
    result[t.category] = (result[t.category] ?? 0) + t.amount;
  }
  return result;
}

/**
 * Spent amount for a specific category in a month.
 */
export function getCategorySpent(
  transactions: Transaction[],
  category: string,
  year: number,
  month: number
): number {
  const byCategory = getExpenseByCategory(transactions, year, month);
  return byCategory[category] ?? 0;
}

/**
 * Remaining budget = limit - spent. Can be negative if over budget.
 */
export function getRemainingBudget(monthlyLimit: number, spent: number): number {
  return monthlyLimit - spent;
}
