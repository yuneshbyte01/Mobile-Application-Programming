import type { Subscription, PieSegment, ExpenseItem } from '../types';

export const SUBSCRIPTIONS: Subscription[] = [
  { id: '1', name: 'Netflix', cost: 1499, dueDate: '2025-02-05' },
  { id: '2', name: 'Spotify', cost: 649, dueDate: '2025-02-10' },
  { id: '3', name: 'Gym (Fitness First)', cost: 3500, dueDate: '2025-02-15' },
  { id: '4', name: 'NTC Data Pack', cost: 499, dueDate: '2025-02-20' },
  { id: '5', name: 'Kantipur Digital', cost: 499, dueDate: '2025-02-25' },
];

export const PIE_DATA: PieSegment[] = [
  { value: 40, color: '#4caf50' },
  { value: 30, color: '#2196f3' },
  { value: 20, color: '#ff9800' },
  { value: 10, color: '#9c27b0' },
];

export const TOTAL_BALANCE = 125000;
export const TOTAL_EXPENSES = 42500;
export const TOTAL_SUBSCRIPTION_COST = 6646;

export const RECENT_EXPENSES: ExpenseItem[] = [
  { label: 'Groceries (Bhatbhateni)', amount: 12000 },
  { label: 'Transport (Pathao)', amount: 3500 },
  { label: 'Dining', amount: 4000 },
  { label: 'Electricity & Water', amount: 5500 },
];

export const CURRENCY_SYMBOL = 'Rs.';

export const formatNPR = (amount: number): string =>
  `${CURRENCY_SYMBOL} ${amount.toLocaleString('en-NP')}`;
