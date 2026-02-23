import type { Transaction } from '@/lib/transactionService';
import { isInMonth } from './dateUtils';

export type CategorySum = { category: string; total: number };

export function getCategoryBreakdown(
  transactions: Transaction[],
  monthISO: string
): CategorySum[] {
  const map = new Map<string, number>();
  for (const tx of transactions) {
    if (!isInMonth(tx.dateISO, monthISO)) continue;
    if (tx.type === 'expense') {
      const prev = map.get(tx.category) ?? 0;
      map.set(tx.category, prev + tx.amount);
    }
  }
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export type MonthAggregate = {
  monthISO: string;
  monthLabel: string;
  income: number;
  expense: number;
};

export function getMonthlyTrend(
  transactions: Transaction[],
  monthsBack: number
): MonthAggregate[] {
  const result: MonthAggregate[] = [];
  const now = new Date();
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 15);
    const monthISO = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    const { income, expense } = getMonthlyTotals(transactions, monthISO);
    const monthLabel = d.toLocaleDateString(undefined, {
      month: 'short',
      year: '2-digit',
    });
    result.push({ monthISO, monthLabel, income, expense });
  }
  return result;
}

export function getCategoryExpenseForMonth(
  transactions: Transaction[],
  category: string,
  monthISO: string
): number {
  let total = 0;
  for (const tx of transactions) {
    if (!isInMonth(tx.dateISO, monthISO)) continue;
    if (tx.type === 'expense' && tx.category === category) {
      total += tx.amount;
    }
  }
  return total;
}

export function getMonthlyTotals(
  transactions: Transaction[],
  monthISO: string
): { income: number; expense: number; balance: number } {
  let income = 0;
  let expense = 0;

  for (const tx of transactions) {
    if (!isInMonth(tx.dateISO, monthISO)) continue;
    if (tx.type === 'income') income += tx.amount;
    else expense += tx.amount;
  }

  return {
    income,
    expense,
    balance: income - expense,
  };
}
