/**
 * Realtime Database profile operations. Path: users/{uid}/profile
 */
import database from '@react-native-firebase/database';

export type Profile = {
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
};

/**
 * Create or overwrite profile for a user. Called after signup.
 */
export async function createProfile(uid: string, data: { name: string; email: string }): Promise<void> {
  const now = Date.now();
  const profile: Profile = {
    name: data.name.trim(),
    email: data.email.trim(),
    createdAt: now,
    updatedAt: now,
  };
  await database().ref(`users/${uid}/profile`).set(profile);
}

/**
 * Get profile for a user. Returns null if not found.
 */
export async function getProfile(uid: string): Promise<Profile | null> {
  const snapshot = await database().ref(`users/${uid}/profile`).once('value');
  return snapshot.val();
}
