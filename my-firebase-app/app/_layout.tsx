import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';
import { BudgetsProvider } from '@/context/BudgetsContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { SubscriptionsProvider } from '@/context/SubscriptionsContext';
import { TransactionsProvider } from '@/context/TransactionsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettings } from '@/context/SettingsContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const systemScheme = useColorScheme();
  const isDark =
    settings?.darkMode ?? (systemScheme === 'dark');
  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
      <ThemeWrapper>
        <TransactionsProvider>
        <BudgetsProvider>
        <SubscriptionsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="log-in" options={{ headerShown: false }} />
          <Stack.Screen
            name="forgot-password"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="add-transaction" options={{ headerShown: false }} />
          <Stack.Screen name="edit-transaction" options={{ headerShown: false }} />
          <Stack.Screen name="add-budget" options={{ headerShown: false }} />
          <Stack.Screen name="edit-budget" options={{ headerShown: false }} />
          <Stack.Screen name="add-subscription" options={{ headerShown: false }} />
          <Stack.Screen name="edit-subscription" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        </SubscriptionsProvider>
        </BudgetsProvider>
        </TransactionsProvider>
      </ThemeWrapper>
      </SettingsProvider>
    </AuthProvider>
  );
}
