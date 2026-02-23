import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { UserSettings } from '@/lib/settingsService';
import {
  updateSettings as updateSettingsService,
  subscribeSettings,
} from '@/lib/settingsService';
import { useAuth } from './AuthContext';

type SettingsState = {
  settings: UserSettings;
  loading: boolean;
  updateSettings: (
    updates: Partial<Omit<UserSettings, 'updatedAt'>>
  ) => Promise<void>;
};

const defaultSettings: UserSettings = {
  currency: 'USD',
  darkMode: false,
  notificationsEnabled: true,
  updatedAt: new Date().toISOString(),
};

const SettingsContext = createContext<SettingsState | null>(null);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}

export function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSettings(defaultSettings);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeSettings((s) => {
      setSettings(s);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const updateSettings = useCallback(
    async (updates: Partial<Omit<UserSettings, 'updatedAt'>>) => {
      await updateSettingsService(updates);
    },
    []
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
