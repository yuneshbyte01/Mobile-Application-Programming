/**
 * Realtime Database CRUD for transactions. Path: users/{uid}/transactions/{id}
 */
import database from '@react-native-firebase/database';

export type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  dateISO: string;
  notes: string;
  isRecurring: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

export async function addTransaction(uid: string, data: TransactionInput): Promise<Transaction> {
  const now = Date.now();
  const ref = database().ref(`users/${uid}/transactions`).push();
  const id = ref.key ?? `tx_${now}`;
  const transaction: Transaction = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(transaction);
  return transaction;
}

export async function updateTransaction(
  uid: string,
  id: string,
  data: Partial<TransactionInput>
): Promise<void> {
  const now = Date.now();
  const updates: Record<string, unknown> = { ...data, updatedAt: now };
  await database().ref(`users/${uid}/transactions/${id}`).update(updates);
}

export async function deleteTransaction(uid: string, id: string): Promise<void> {
  await database().ref(`users/${uid}/transactions/${id}`).remove();
}

export async function loadTransactions(uid: string): Promise<Transaction[]> {
  const snapshot = await database().ref(`users/${uid}/transactions`).once('value');
  const val = snapshot.val();
  if (!val) return [];
  return Object.values(val) as Transaction[];
}

/**
 * Subscribe to transactions. Returns unsubscribe function.
 */
export function subscribeTransactions(
  uid: string,
  callback: (transactions: Transaction[]) => void
): () => void {
  const ref = database().ref(`users/${uid}/transactions`);
  const handler = ref.on('value', (snapshot) => {
    const val = snapshot.val();
    const list = val ? (Object.values(val) as Transaction[]) : [];
    callback(list);
  });
  return () => ref.off('value', handler);
}
