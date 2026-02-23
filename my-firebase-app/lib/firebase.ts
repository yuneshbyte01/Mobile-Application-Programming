import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// getReactNativePersistence is in @firebase/auth RN build but not in main types
const {
  getReactNativePersistence,
  initializeAuth,
} =
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- RN persistence not in firebase/auth types
  require('@firebase/auth') as {
  getReactNativePersistence: (storage: unknown) => { _persistence: unknown };
  initializeAuth: (app: unknown, deps?: { persistence?: unknown }) => ReturnType<typeof getAuth>;
};

const firebaseConfig = {
  apiKey: 'AIzaSyAQ9ZrozA-AMZ3Tj19tPs_wA2COD7clzHA',
  authDomain: 'test-project-a83ce.firebaseapp.com',
  databaseURL: 'https://test-project-a83ce-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'test-project-a83ce',
  storageBucket: 'test-project-a83ce.firebasestorage.app',
  messagingSenderId: '469433209063',
  appId: '1:469433209063:web:912c7fd47a7de666389242',
  measurementId: 'G-EK6MLNQTZB',
};

// Avoid re-initializing on hot reload
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;

// Use AsyncStorage persistence on React Native; default persistence on web
// On hot reload, auth may already be initialized - use getAuth to avoid auth/already-initialized
function getAuthInstance() {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    const msg = err instanceof Error ? err.message : String(err);
    if (
      code === 'auth/already-initialized' ||
      msg.includes('already-initialized')
    ) {
      return getAuth(app);
    }
    throw err;
  }
}
export const auth = getAuthInstance();
export const database = getDatabase(app);
export default app;
