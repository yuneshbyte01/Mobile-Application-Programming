/**
 * Business logic: totals, monthly filters for transactions.
 */
import type { Transaction } from '../services/transactionService';

/**
 * Get transactions for a given month (year, month 0-11).
 */
export function filterByMonth(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  return transactions.filter((t) => {
    const d = new Date(t.dateISO);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

/**
 * Total income for a list of transactions.
 */
export function totalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Total expense for a list of transactions.
 */
export function totalExpense(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Balance = income - expense.
 */
export function balance(transactions: Transaction[]): number {
  return totalIncome(transactions) - totalExpense(transactions);
}

/**
 * Monthly totals for current month.
 */
export function getMonthlyTotals(
  transactions: Transaction[],
  year: number,
  month: number
): { income: number; expense: number; balance: number } {
  const filtered = filterByMonth(transactions, year, month);
  const income = totalIncome(filtered);
  const expense = totalExpense(filtered);
  return { income, expense, balance: income - expense };
}
