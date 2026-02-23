/**
 * Settings context: user preferences (currency, theme, notifications).
 * Provides theme-aware colors for dark mode.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Colors } from '../constants/Colors';
import { useAuth } from './AuthContext';
import {
  subscribeSettings,
  updateSettings as updateSettingsService,
  type Settings,
  type Currency,
} from '../services/settingsService';

type ThemeColors = typeof Colors;

function getThemeColors(isDark: boolean): ThemeColors {
  if (!isDark) return Colors;
  return {
    ...Colors,
    neutral: {
      ...Colors.neutral,
      bg: Colors.dark.bg,
      surface: Colors.dark.surface,
      textPrimary: Colors.dark.textPrimary,
      textSecondary: Colors.dark.textSecondary,
      border: Colors.dark.border,
      muted: Colors.dark.textSecondary,
    },
  };
}

type SettingsContextValue = {
  settings: Settings;
  updateSettings: (data: Partial<Pick<Settings, 'currency' | 'darkMode' | 'notifications'>>) => Promise<void>;
  colors: ThemeColors;
  isDark: boolean;
};

const defaultSettings: Settings = {
  currency: 'NPR',
  darkMode: false,
  notifications: true,
  updatedAt: 0,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    if (!user?.uid) {
      setSettings(defaultSettings);
      return;
    }
    const unsub = subscribeSettings(user.uid, setSettings);
    return unsub;
  }, [user?.uid]);

  const updateSettings = async (
    data: Partial<Pick<Settings, 'currency' | 'darkMode' | 'notifications'>>
  ): Promise<void> => {
    if (!user?.uid) return;
    await updateSettingsService(user.uid, data);
  };

  const colors = getThemeColors(settings.darkMode);
  const value: SettingsContextValue = {
    settings,
    updateSettings,
    colors,
    isDark: settings.darkMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}

export function useTheme() {
  return useSettings();
}
