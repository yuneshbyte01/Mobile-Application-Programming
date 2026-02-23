/**
 * Realtime Database CRUD for subscriptions. Path: users/{uid}/subscriptions/{id}
 */
import database from '@react-native-firebase/database';

export type Subscription = {
  id: string;
  name: string;
  price: number;
  billingDateISO: string;
  cycle: 'monthly' | 'yearly';
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

export type SubscriptionInput = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>;

export async function addSubscription(
  uid: string,
  data: SubscriptionInput
): Promise<Subscription> {
  const now = Date.now();
  const ref = database().ref(`users/${uid}/subscriptions`).push();
  const id = ref.key ?? `sub_${now}`;
  const subscription: Subscription = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(subscription);
  return subscription;
}

export async function updateSubscription(
  uid: string,
  id: string,
  data: Partial<SubscriptionInput>
): Promise<void> {
  const now = Date.now();
  const updates: Record<string, unknown> = { ...data, updatedAt: now };
  await database().ref(`users/${uid}/subscriptions/${id}`).update(updates);
}

export async function deleteSubscription(uid: string, id: string): Promise<void> {
  await database().ref(`users/${uid}/subscriptions/${id}`).remove();
}

export async function loadSubscriptions(uid: string): Promise<Subscription[]> {
  const snapshot = await database().ref(`users/${uid}/subscriptions`).once('value');
  const val = snapshot.val();
  if (!val) return [];
  return Object.values(val) as Subscription[];
}

export function subscribeSubscriptions(
  uid: string,
  callback: (subscriptions: Subscription[]) => void
): () => void {
  const ref = database().ref(`users/${uid}/subscriptions`);
  const handler = ref.on('value', (snapshot) => {
    const val = snapshot.val();
    const list = val ? (Object.values(val) as Subscription[]) : [];
    callback(list);
  });
  return () => ref.off('value', handler);
}
