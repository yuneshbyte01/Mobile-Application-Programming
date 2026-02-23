import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useTransactions } from '@/context/TransactionsContext';
import { getMonthlyTotals } from '@/utils/calculations';
import { getCurrentMonthISO } from '@/utils/dateUtils';
import { formatAmount } from '@/utils/formatters';

function DashboardView({ displayName }: { displayName: string }) {
  const router = useRouter();
  const { settings } = useSettings();
  const { transactions, loading } = useTransactions();
  const monthISO = getCurrentMonthISO();
  const { income, expense, balance } = getMonthlyTotals(transactions, monthISO);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome, {displayName}!</Text>
      <Text style={[styles.tagline, styles.taglineCompact]}>This month</Text>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Income</Text>
          <Text style={[styles.cardAmount, styles.amountIncome]}>
            {formatAmount(income, settings?.currency ?? 'USD')}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Expense</Text>
          <Text style={[styles.cardAmount, styles.amountExpense]}>
            {formatAmount(expense, settings?.currency ?? 'USD')}
          </Text>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text
          style={[
            styles.balanceAmount,
            balance >= 0 ? styles.amountIncome : styles.amountExpense,
          ]}
        >
          {formatAmount(balance, settings?.currency ?? 'USD')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/add-transaction')}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Budget Buddy</Text>
        <Text style={styles.tagline}>
          Track spending. Set budgets. Take control of your finances.
        </Text>

        <Link href="/sign-up" asChild>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <Link href="/log-in" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return <DashboardView displayName={user.displayName || 'User'} />;
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  taglineCompact: {
    marginBottom: 8,
  },
  primaryButton: {
    width: '100%',
    maxWidth: 280,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  loginPrompt: {
    fontSize: 14,
    color: '#777777',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardLabel: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  amountIncome: { color: '#4CAF50' },
  amountExpense: { color: '#F44336' },
  balanceCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
});
