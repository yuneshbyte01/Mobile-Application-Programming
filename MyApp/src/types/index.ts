export interface Subscription {
  id: string;
  name: string;
  cost: number;
  dueDate: string;
}

export interface PieSegment {
  value: number;
  color: string;
}

export interface ExpenseItem {
  label: string;
  amount: number;
}
