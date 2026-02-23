import { ref, get, set, onValue, off } from 'firebase/database';

import app, { auth, database } from './firebase';

export type UserSettings = {
  currency: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  updatedAt: string;
};

const DEFAULTS: UserSettings = {
  currency: 'USD',
  darkMode: false,
  notificationsEnabled: true,
  updatedAt: new Date().toISOString(),
};

function getUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');
  return user.uid;
}

export async function getSettings(): Promise<UserSettings> {
  const uid = getUid();
  const dbRef = ref(database, `users/${uid}/settings/profile`);
  const snapshot = await get(dbRef);
  const data = snapshot.val();
  if (!data) return { ...DEFAULTS };
  return { ...DEFAULTS, ...data };
}

export async function updateSettings(
  updates: Partial<Omit<UserSettings, 'updatedAt'>>
): Promise<void> {
  const uid = getUid();
  const now = new Date().toISOString();
  const dbRef = ref(database, `users/${uid}/settings/profile`);

  const snapshot = await get(dbRef);
  const current = snapshot.val() ?? { ...DEFAULTS };
  const merged = { ...current, ...updates, updatedAt: now };

  await set(dbRef, merged);
}

export function subscribeSettings(
  callback: (settings: UserSettings) => void
): () => void {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    callback(DEFAULTS);
    return () => {};
  }

  const dbRef = ref(database, `users/${uid}/settings/profile`);
  onValue(
    dbRef,
    (snapshot) => {
      const data = snapshot.val();
      const settings: UserSettings = data
        ? { ...DEFAULTS, ...data }
        : { ...DEFAULTS };
      callback(settings);
    },
    (err) => {
      console.error('Settings listener error:', err);
      callback(DEFAULTS);
    }
  );
  return () => off(dbRef);
}
