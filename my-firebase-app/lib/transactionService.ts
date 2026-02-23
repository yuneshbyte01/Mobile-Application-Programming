import { ref, set, update, remove, onValue, off } from 'firebase/database';

import app, { auth, database } from './firebase';

export type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  dateISO: string;
  notes: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TransactionInput = Omit<
  Transaction,
  'id' | 'createdAt' | 'updatedAt'
>;

function getUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');
  return user.uid;
}

export async function addTransaction(
  input: TransactionInput
): Promise<Transaction> {
  const uid = getUid();
  const id = `tx_${Date.now()}`;
  const now = new Date().toISOString();
  const transaction: Transaction = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const dbRef = ref(database, `users/${uid}/transactions/${id}`);
    await set(dbRef, transaction);
    return transaction;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('_checkNotDeleted') || msg.includes('undefined')) {
      const idToken = await auth.currentUser!.getIdToken();
      const databaseURL = app.options.databaseURL;
      if (databaseURL && idToken) {
        const res = await fetch(
          `${databaseURL}/users/${uid}/transactions/${id}.json?auth=${idToken}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction),
          }
        );
        if (!res.ok) throw new Error('Failed to save transaction');
      }
    }
    throw err;
  }
}

export async function updateTransaction(
  id: string,
  input: Partial<TransactionInput>
): Promise<void> {
  const uid = getUid();
  const now = new Date().toISOString();
  const dbRef = ref(database, `users/${uid}/transactions/${id}`);
  await update(dbRef, { ...input, updatedAt: now });
}

export async function deleteTransaction(id: string): Promise<void> {
  const uid = getUid();
  const dbRef = ref(database, `users/${uid}/transactions/${id}`);
  await remove(dbRef);
}

export function subscribeTransactions(
  callback: (transactions: Transaction[]) => void
): () => void {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    callback([]);
    return () => {};
  }

  const dbRef = ref(database, `users/${uid}/transactions`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unsub = onValue(
    dbRef,
    (snapshot) => {
      const data = snapshot.val();
      const list: Transaction[] = data
        ? Object.values(data)
        : [];
      callback(list);
    },
    (err) => {
      console.error('Transaction listener error:', err);
      callback([]);
    }
  );
  return () => off(dbRef);
}
