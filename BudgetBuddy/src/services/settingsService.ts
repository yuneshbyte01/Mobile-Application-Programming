/**
 * Realtime Database settings. Path: users/{uid}/settings
 */
import database from '@react-native-firebase/database';

export const CURRENCIES = ['NPR', 'USD', 'EUR', 'INR', 'GBP'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_LABELS: Record<Currency, string> = {
  NPR: 'Nepalese Rupee (NPR)',
  USD: 'US Dollar (USD)',
  EUR: 'Euro (EUR)',
  INR: 'Indian Rupee (INR)',
  GBP: 'British Pound (GBP)',
};

export type Settings = {
  currency: Currency;
  darkMode: boolean;
  notifications: boolean;
  updatedAt: number;
};

const DEFAULT_SETTINGS: Omit<Settings, 'updatedAt'> = {
  currency: 'NPR',
  darkMode: false,
  notifications: true,
};

/**
 * Get settings for a user. Returns defaults if not found.
 */
export async function getSettings(uid: string): Promise<Settings> {
  const snapshot = await database().ref(`users/${uid}/settings`).once('value');
  const val = snapshot.val();
  const now = Date.now();
  if (!val) {
    return { ...DEFAULT_SETTINGS, updatedAt: now };
  }
  return {
    currency: CURRENCIES.includes(val.currency) ? val.currency : DEFAULT_SETTINGS.currency,
    darkMode: Boolean(val.darkMode),
    notifications: val.notifications !== false,
    updatedAt: val.updatedAt ?? now,
  };
}

/**
 * Update settings. Merges with existing.
 */
export async function updateSettings(
  uid: string,
  data: Partial<Pick<Settings, 'currency' | 'darkMode' | 'notifications'>>
): Promise<void> {
  const now = Date.now();
  const updates: Record<string, unknown> = { ...data, updatedAt: now };
  await database().ref(`users/${uid}/settings`).update(updates);
}

/**
 * Subscribe to settings changes.
 */
export function subscribeSettings(
  uid: string,
  callback: (settings: Settings) => void
): () => void {
  const ref = database().ref(`users/${uid}/settings`);
  const handler = ref.on('value', (snapshot) => {
    const val = snapshot.val();
    const now = Date.now();
    if (!val) {
      callback({ ...DEFAULT_SETTINGS, updatedAt: now });
      return;
    }
    callback({
      currency: CURRENCIES.includes(val.currency) ? val.currency : DEFAULT_SETTINGS.currency,
      darkMode: Boolean(val.darkMode),
      notifications: val.notifications !== false,
      updatedAt: val.updatedAt ?? now,
    });
  });
  return () => ref.off('value', handler);
}
