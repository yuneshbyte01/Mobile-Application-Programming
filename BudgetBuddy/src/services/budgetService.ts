/**
 * Realtime Database CRUD for budgets. Path: users/{uid}/budgets/{id}
 */
import database from '@react-native-firebase/database';

export type Budget = {
  id: string;
  category: string;
  monthlyLimit: number;
  createdAt: number;
  updatedAt: number;
};

export type BudgetInput = Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>;

export async function addBudget(uid: string, data: BudgetInput): Promise<Budget> {
  const now = Date.now();
  const ref = database().ref(`users/${uid}/budgets`).push();
  const id = ref.key ?? `b_${now}`;
  const budget: Budget = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(budget);
  return budget;
}

export async function updateBudget(
  uid: string,
  id: string,
  data: Partial<BudgetInput>
): Promise<void> {
  const now = Date.now();
  const updates: Record<string, unknown> = { ...data, updatedAt: now };
  await database().ref(`users/${uid}/budgets/${id}`).update(updates);
}

export async function deleteBudget(uid: string, id: string): Promise<void> {
  await database().ref(`users/${uid}/budgets/${id}`).remove();
}

export async function loadBudgets(uid: string): Promise<Budget[]> {
  const snapshot = await database().ref(`users/${uid}/budgets`).once('value');
  const val = snapshot.val();
  if (!val) return [];
  return Object.values(val) as Budget[];
}

export function subscribeBudgets(uid: string, callback: (budgets: Budget[]) => void): () => void {
  const ref = database().ref(`users/${uid}/budgets`);
  const handler = ref.on('value', (snapshot) => {
    const val = snapshot.val();
    const list = val ? (Object.values(val) as Budget[]) : [];
    callback(list);
  });
  return () => ref.off('value', handler);
}
