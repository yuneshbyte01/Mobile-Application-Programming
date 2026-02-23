import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { ref, set } from 'firebase/database';

import app, { auth, database } from './firebase';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use':
    'This email is already registered. Please log in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/operation-not-allowed':
    'Email sign-up is not enabled. Please contact support.',
  'auth/configuration-not-found':
    'Auth is not configured. Enable Email/Password in Firebase Console.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/invalid-action-code': 'This link has expired. Please request a new one.',
};

export function getAuthErrorMessage(code: string): string {
  return AUTH_ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.';
}

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName: name.trim() });

  const profileData = {
    name: name.trim(),
    email: email.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const profileRef = ref(database, `users/${user.uid}/profile`);
    await set(profileRef, profileData);
  } catch (dbErr: unknown) {
    const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
    if (errMsg.includes('_checkNotDeleted') || errMsg.includes('undefined')) {
      const idToken = await user.getIdToken();
      const databaseURL = app.options.databaseURL;
      if (databaseURL && idToken) {
        const res = await fetch(
          `${databaseURL}/users/${user.uid}/profile.json?auth=${idToken}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
          }
        );
        if (!res.ok) throw new Error('Failed to save profile.');
      } else {
        throw dbErr;
      }
    } else {
      throw dbErr;
    }
  }

  return user;
}

export async function logIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  return userCredential.user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}
