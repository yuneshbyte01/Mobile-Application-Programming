/**
 * Report utils: category breakdown, monthly trend, date filtering.
 */
import type { Transaction } from '../services/transactionService';
import { filterByMonth, totalIncome, totalExpense } from './transactionUtils';

export type CategoryBreakdownItem = {
  category: string;
  amount: number;
  percent: number;
};

export type MonthlyTrendItem = {
  label: string;
  year: number;
  month: number;
  income: number;
  expense: number;
  balance: number;
};

/**
 * Expense by category for a given month. Returns sorted by amount (desc).
 */
export function getCategoryBreakdown(
  transactions: Transaction[],
  year: number,
  month: number
): CategoryBreakdownItem[] {
  const filtered = filterByMonth(transactions, year, month).filter(
    (t) => t.type === 'expense'
  );
  const byCategory: Record<string, number> = {};
  for (const t of filtered) {
    byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
  }
  const total = Object.values(byCategory).reduce((a, b) => a + b, 0);
  return Object.entries(byCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percent: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Monthly trend for the last N months (including current).
 */
export function getMonthlyTrend(
  transactions: Transaction[],
  count: number = 6
): MonthlyTrendItem[] {
  const now = new Date();
  const result: MonthlyTrendItem[] = [];
  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const filtered = filterByMonth(transactions, year, month);
    const income = totalIncome(filtered);
    const expense = totalExpense(filtered);
    result.push({
      label: `${monthLabels[month]} ${year}`,
      year,
      month,
      income,
      expense,
      balance: income - expense,
    });
  }
  return result;
}

/**
 * Filter transactions by date range (inclusive).
 */
export function filterByDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return transactions.filter((t) => {
    const ts = new Date(t.dateISO).getTime();
    return ts >= start && ts <= end;
  });
}

/**
 * Get transactions for a specific month, limited to N results (most recent first).
 */
export function getTransactionsForMonth(
  transactions: Transaction[],
  year: number,
  month: number,
  limit?: number
): Transaction[] {
  const filtered = filterByMonth(transactions, year, month).sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );
  return limit != null ? filtered.slice(0, limit) : filtered;
}
