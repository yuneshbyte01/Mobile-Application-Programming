import { ref, set, update, remove, onValue, off } from 'firebase/database';

import app, { auth, database } from './firebase';

export type Subscription = {
  id: string;
  name: string;
  price: number;
  billingDateISO: string;
  cycle: 'monthly' | 'yearly';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionInput = Omit<
  Subscription,
  'id' | 'createdAt' | 'updatedAt'
>;

function getUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');
  return user.uid;
}

export async function addSubscription(
  input: SubscriptionInput
): Promise<Subscription> {
  const uid = getUid();
  const id = `sub_${Date.now()}`;
  const now = new Date().toISOString();
  const subscription: Subscription = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const dbRef = ref(database, `users/${uid}/subscriptions/${id}`);
    await set(dbRef, subscription);
    return subscription;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('_checkNotDeleted') || msg.includes('undefined')) {
      const idToken = await auth.currentUser!.getIdToken();
      const databaseURL = app.options.databaseURL;
      if (databaseURL && idToken) {
        const res = await fetch(
          `${databaseURL}/users/${uid}/subscriptions/${id}.json?auth=${idToken}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
          }
        );
        if (!res.ok) throw new Error('Failed to save subscription');
      }
    }
    throw err;
  }
}

export async function updateSubscription(
  id: string,
  input: Partial<SubscriptionInput>
): Promise<void> {
  const uid = getUid();
  const now = new Date().toISOString();
  const dbRef = ref(database, `users/${uid}/subscriptions/${id}`);
  await update(dbRef, { ...input, updatedAt: now });
}

export async function deleteSubscription(id: string): Promise<void> {
  const uid = getUid();
  const dbRef = ref(database, `users/${uid}/subscriptions/${id}`);
  await remove(dbRef);
}

export function subscribeSubscriptions(
  callback: (subscriptions: Subscription[]) => void
): () => void {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    callback([]);
    return () => {};
  }

  const dbRef = ref(database, `users/${uid}/subscriptions`);
  onValue(
    dbRef,
    (snapshot) => {
      const data = snapshot.val();
      const list: Subscription[] = data ? Object.values(data) : [];
      callback(list);
    },
    (err) => {
      console.error('Subscription listener error:', err);
      callback([]);
    }
  );
  return () => off(dbRef);
}
