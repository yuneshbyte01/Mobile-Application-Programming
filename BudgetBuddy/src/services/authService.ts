/**
 * Firebase Auth service. Screens call this instead of Firebase directly.
 * Returns friendly error messages for common auth failures.
 */
import auth from '@react-native-firebase/auth';

export type AuthUser = {
  uid: string;
  email: string | null;
};

/**
 * Turn Firebase auth error codes into user-friendly messages.
 */
function getFriendlyErrorMessage(errorCode: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email sign-in is not enabled. Please contact support.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
  };
  return messages[errorCode] ?? 'Something went wrong. Please try again.';
}

export async function signUp(email: string, password: string): Promise<AuthUser> {
  try {
    const cred = await auth().createUserWithEmailAndPassword(email, password);
    const user = cred.user;
    if (!user) throw new Error('User not returned');
    return { uid: user.uid, email: user.email ?? null };
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? String((err as { code: string }).code) : '';
    throw new Error(getFriendlyErrorMessage(code));
  }
}

export async function logIn(email: string, password: string): Promise<AuthUser> {
  try {
    const cred = await auth().signInWithEmailAndPassword(email, password);
    const user = cred.user;
    if (!user) throw new Error('User not returned');
    return { uid: user.uid, email: user.email ?? null };
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? String((err as { code: string }).code) : '';
    throw new Error(getFriendlyErrorMessage(code));
  }
}

export async function logOut(): Promise<void> {
  try {
    await auth().signOut();
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? String((err as { code: string }).code) : '';
    throw new Error(getFriendlyErrorMessage(code));
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await auth().sendPasswordResetEmail(email);
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? String((err as { code: string }).code) : '';
    throw new Error(getFriendlyErrorMessage(code));
  }
}

/**
 * Subscribe to auth state changes. Call the returned function to unsubscribe.
 */
export function onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
  const unsubscribe = auth().onAuthStateChanged((user) => {
    if (user) {
      callback({ uid: user.uid, email: user.email ?? null });
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}
