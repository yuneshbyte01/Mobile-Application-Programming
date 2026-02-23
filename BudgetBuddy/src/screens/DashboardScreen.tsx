import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../constants/Icons';
import SafeScreenView from '../components/SafeScreenView';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/SettingsContext';
import { getMonthlyTotals } from '../utils/transactionUtils';
import { getExpenseByCategory } from '../utils/budgetUtils';
import { getGreeting, getNextBillingLabel } from '../utils/dashboardUtils';
import { formatAmount, formatDate } from '../utils/formatters';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import { Space, Radius, Shadow, Size } from '../styles/tokens';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { colors, settings } = useTheme();
  const { transactions, budgets, subscriptions } = useApp();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const { balance } = getMonthlyTotals(transactions, year, month);
  const monthlyBudgetTotal = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const savings = balance > 0 ? balance : 0;
  const expenseByCategory = getExpenseByCategory(transactions, year, month);

  const greetingKey = getGreeting();
  const greeting = Strings.dashboard[greetingKey];

  const budgetUsageData = budgets
    .map((b) => {
      const spent = expenseByCategory[b.category] ?? 0;
      const pct = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;
      return { category: b.category, spent, limit: b.monthlyLimit, percent: Math.min(pct, 100) };
    })
    .slice(0, 5);

  const activeSubscriptions = subscriptions
    .filter((s) => s.isActive)
    .sort((a, b) => new Date(a.billingDateISO).getTime() - new Date(b.billingDateISO).getTime())
    .slice(0, 3);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
    .slice(0, 5);

  const goToAddTransaction = () => {
    const parent = navigation.getParent?.();
    if (parent) {
      (parent as any).navigate?.('AddTransaction');
    } else {
      (navigation as any).navigate?.('AddTransaction');
    }
  };

  return (
    <SafeScreenView>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { backgroundColor: colors.neutral.bg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require('../../icons/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.appName, { color: colors.neutral.textPrimary }]}>{Strings.appName}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => {}} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color={colors.neutral.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingRow}>
          <Text style={[styles.greeting, { color: colors.neutral.textPrimary }]}>{greeting}</Text>
          <Text style={styles.wave}>👋</Text>
        </View>

        {/* Total Balance Card */}
        <TouchableOpacity
          style={[styles.totalBalanceCard, { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.border }]}
          activeOpacity={0.9}
        >
          <Text style={[styles.cardLabel, { color: colors.neutral.textSecondary }]}>{Strings.dashboard.totalBalance}</Text>
          <View style={styles.totalBalanceRow}>
            <Text style={[styles.totalBalanceAmount, { color: colors.neutral.textPrimary }]}>
              {formatAmount(balance, settings.currency)}
            </Text>
            <Ionicons name="chevron-forward" size={22} color={colors.neutral.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* Monthly Budget & Savings */}
        <View style={styles.twoCardRow}>
          <View style={[styles.smallCard, { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.border }]}>
            <Ionicons name="wallet-outline" size={24} color={colors.brand.primary} style={styles.smallCardIcon} />
            <Text style={[styles.cardLabel, { color: colors.neutral.textSecondary }]}>{Strings.dashboard.monthlyBudget}</Text>
            <Text style={[styles.smallCardAmount, { color: colors.neutral.textPrimary }]}>
              {formatAmount(monthlyBudgetTotal, settings.currency)}
            </Text>
          </View>
          <View style={[styles.smallCard, { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.border }]}>
            <Ionicons name="wallet" size={24} color={Colors.status.success} style={styles.smallCardIcon} />
            <Text style={[styles.cardLabel, { color: colors.neutral.textSecondary }]}>{Strings.dashboard.savings}</Text>
            <Text style={[styles.smallCardAmount, { color: colors.neutral.textPrimary }]}>
              {formatAmount(savings, settings.currency)}
            </Text>
          </View>
        </View>

        {/* Budget Usage */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.budgetUsageTitle, { color: colors.neutral.textPrimary }]}>{Strings.dashboard.budgetUsage}</Text>
          {budgetUsageData.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.neutral.textSecondary }]}>No budgets set</Text>
          ) : (
            budgetUsageData.map((item) => (
              <View key={item.category} style={styles.progressRow}>
                <Text style={[styles.progressLabel, { color: colors.neutral.textPrimary }]}>{item.category}</Text>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${item.percent}%`,
                        backgroundColor: item.percent >= 90 ? Colors.status.error : colors.brand.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.progressPct, { color: colors.neutral.textSecondary }]}>{item.percent}%</Text>
              </View>
            ))
          )}
        </View>

        {/* Subscriptions this month */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.neutral.textPrimary }]}>{Strings.dashboard.subscriptionsThisMonth}</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Subscriptions')} activeOpacity={0.7}>
              <Text style={[styles.viewAll, { color: colors.brand.primary }]}>{Strings.dashboard.viewAll} &gt;</Text>
            </TouchableOpacity>
          </View>
          {activeSubscriptions.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.neutral.textSecondary }]}>No subscriptions</Text>
          ) : (
            activeSubscriptions.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                style={[styles.subRow, { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.border }]}
                onPress={() => {
                  const parent = navigation.getParent?.();
                  (parent as any)?.navigate?.('EditSubscription', { subscriptionId: sub.id });
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.subIconCircle, { backgroundColor: colors.neutral.bg }]}>
                  <Ionicons name={Icons.tab.subscriptions as any} size={20} color={colors.brand.primary} />
                </View>
                <View style={styles.subMiddle}>
                  <Text style={[styles.subName, { color: colors.neutral.textPrimary }]}>{sub.name}</Text>
                  <Text style={[styles.subBilling, { color: colors.neutral.textSecondary }]}>
                    {Strings.dashboard.nextBilling} {getNextBillingLabel(sub)}
                  </Text>
                </View>
                <View style={styles.subRight}>
                  <Text style={[styles.subAmount, { color: Colors.status.error }]}>
                    - {formatAmount(sub.price, settings.currency)}
                  </Text>
                  <Text style={[styles.subDate, { color: colors.neutral.textSecondary }]}>
                    {formatDate(sub.billingDateISO)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Recent Transactions */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.neutral.textPrimary }]}>{Strings.dashboard.recentTransactions}</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Transactions')} activeOpacity={0.7}>
              <Text style={[styles.viewAll, { color: colors.brand.primary }]}>{Strings.dashboard.viewAll} &gt;</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.neutral.textSecondary }]}>No transactions yet</Text>
          ) : (
            recentTransactions.map((tx) => (
              <View key={tx.id} style={[styles.txRow, { borderBottomColor: colors.neutral.border }]}>
                <View style={[styles.txIconCircle, { backgroundColor: colors.neutral.bg }]}>
                  <Ionicons
                    name={(tx.type === 'income' ? Icons.transaction.income : Icons.transaction.expense) as any}
                    size={20}
                    color={tx.type === 'income' ? Colors.status.success : Colors.status.error}
                  />
                </View>
                <View style={styles.txMiddle}>
                  <Text style={[styles.txCategory, { color: colors.neutral.textPrimary }]}>{tx.category}</Text>
                  <Text style={[styles.txDate, { color: colors.neutral.textSecondary }]}>{formatDate(tx.dateISO)}</Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.type === 'income' ? Colors.status.success : Colors.status.error },
                  ]}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount, settings.currency)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.brand.primary }, Shadow.fab]}
        onPress={goToAddTransaction}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={28} color={Colors.neutral.surface} />
      </TouchableOpacity>
    </SafeScreenView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    padding: Space.lg,
    paddingBottom: Space.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Space.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  logo: {
    width: 36,
    height: 36,
  },
  appName: {
    ...Typography.h2,
  },
  bellBtn: {
    padding: Space.xs,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    marginBottom: Space.xl,
  },
  greeting: {
    ...Typography.h1,
  },
  wave: {
    fontSize: 24,
  },
  totalBalanceCard: {
    padding: Space.xl,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Space.lg,
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }
      : { elevation: 2 }),
  },
  cardLabel: {
    ...Typography.caption,
    marginBottom: Space.xs,
  },
  totalBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalBalanceAmount: {
    fontSize: 28,
    fontWeight: '700',
  },
  twoCardRow: {
    flexDirection: 'row',
    gap: Space.lg,
    marginBottom: Space.xl,
  },
  smallCard: {
    flex: 1,
    padding: Space.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 }
      : { elevation: 2 }),
  },
  smallCardIcon: {
    marginBottom: Space.xs,
  },
  smallCardAmount: {
    ...Typography.h2,
  },
  section: {
    marginBottom: Space.xl,
  },
  lastSection: {
    marginBottom: Space.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Space.md,
  },
  sectionTitle: {
    ...Typography.h2,
  },
  budgetUsageTitle: {
    marginBottom: Space.md,
  },
  viewAll: {
    ...Typography.body,
    fontWeight: '600',
  },
  emptyText: {
    ...Typography.body,
    fontStyle: 'italic',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Space.md,
    gap: Space.md,
  },
  progressLabel: {
    ...Typography.body,
    width: 70,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: '#E8EAF0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  progressPct: {
    ...Typography.caption,
    width: 36,
    textAlign: 'right',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Space.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Space.sm,
    gap: Space.md,
  },
  subIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subMiddle: {
    flex: 1,
  },
  subName: {
    ...Typography.body,
    fontWeight: '600',
  },
  subBilling: {
    ...Typography.caption,
    marginTop: 2,
  },
  subRight: {
    alignItems: 'flex-end',
  },
  subAmount: {
    ...Typography.body,
    fontWeight: '600',
  },
  subDate: {
    ...Typography.caption,
    marginTop: 2,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Space.md,
    borderBottomWidth: 1,
    gap: Space.md,
  },
  txIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txMiddle: {
    flex: 1,
  },
  txCategory: {
    ...Typography.body,
    fontWeight: '600',
  },
  txDate: {
    ...Typography.caption,
    marginTop: 2,
  },
  txAmount: {
    ...Typography.body,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: Size.fab,
    height: Size.fab,
    borderRadius: Size.fab / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
