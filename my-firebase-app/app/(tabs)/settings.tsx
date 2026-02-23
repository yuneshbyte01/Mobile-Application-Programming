import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useSettings } from '@/context/SettingsContext';
import { logOut } from '@/lib/authService';

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'GBP', label: 'British Pound (GBP)' },
  { code: 'NPR', label: 'Nepalese Rupee (NPR)' },
  { code: 'INR', label: 'Indian Rupee (INR)' },
  { code: 'JPY', label: 'Japanese Yen (JPY)' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, loading, updateSettings } = useSettings();

  const handleLogOut = async () => {
    await logOut();
    router.replace('/(tabs)');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency</Text>
        <Text style={styles.sectionSubtitle}>
          Used for displaying amounts across the app
        </Text>
        <View style={styles.options}>
          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c.code}
              style={[
                styles.optionRow,
                settings?.currency === c.code && styles.optionRowActive,
              ]}
              onPress={() => updateSettings({ currency: c.code })}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  settings?.currency === c.code && styles.optionTextActive,
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark mode</Text>
          <Switch
            value={settings?.darkMode ?? false}
            onValueChange={(v) => updateSettings({ darkMode: v })}
            trackColor={{ false: '#E0E0E0', true: '#6C63FF' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable notifications</Text>
          <Switch
            value={settings?.notificationsEnabled ?? false}
            onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
            trackColor={{ false: '#E0E0E0', true: '#6C63FF' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={handleLogOut}
            activeOpacity={0.7}
          >
            <Text style={styles.logOutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 12,
  },
  options: {
    gap: 4,
  },
  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionRowActive: {
    backgroundColor: '#EEECFF',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  optionText: {
    fontSize: 14,
    color: '#333333',
  },
  optionTextActive: {
    fontWeight: '600',
    color: '#6C63FF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingLabel: {
    fontSize: 14,
    color: '#333333',
  },
  logOutButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
});
