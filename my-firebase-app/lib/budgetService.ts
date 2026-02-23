import { ref, set, update, remove, onValue, off } from 'firebase/database';

import app, { auth, database } from './firebase';

export type Budget = {
  id: string;
  category: string;
  monthlyLimit: number;
  createdAt: string;
  updatedAt: string;
};

export type BudgetInput = Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>;

function getUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');
  return user.uid;
}

export async function addBudget(input: BudgetInput): Promise<Budget> {
  const uid = getUid();
  const id = `bg_${Date.now()}`;
  const now = new Date().toISOString();
  const budget: Budget = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const dbRef = ref(database, `users/${uid}/budgets/${id}`);
    await set(dbRef, budget);
    return budget;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('_checkNotDeleted') || msg.includes('undefined')) {
      const idToken = await auth.currentUser!.getIdToken();
      const databaseURL = app.options.databaseURL;
      if (databaseURL && idToken) {
        const res = await fetch(
          `${databaseURL}/users/${uid}/budgets/${id}.json?auth=${idToken}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budget),
          }
        );
        if (!res.ok) throw new Error('Failed to save budget');
      }
    }
    throw err;
  }
}

export async function updateBudget(
  id: string,
  input: Partial<BudgetInput>
): Promise<void> {
  const uid = getUid();
  const now = new Date().toISOString();
  const dbRef = ref(database, `users/${uid}/budgets/${id}`);
  await update(dbRef, { ...input, updatedAt: now });
}

export async function deleteBudget(id: string): Promise<void> {
  const uid = getUid();
  const dbRef = ref(database, `users/${uid}/budgets/${id}`);
  await remove(dbRef);
}

export function subscribeBudgets(
  callback: (budgets: Budget[]) => void
): () => void {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    callback([]);
    return () => {};
  }

  const dbRef = ref(database, `users/${uid}/budgets`);
  onValue(
    dbRef,
    (snapshot) => {
      const data = snapshot.val();
      const list: Budget[] = data ? Object.values(data) : [];
      callback(list);
    },
    (err) => {
      console.error('Budget listener error:', err);
      callback([]);
    }
  );
  return () => off(dbRef);
}
