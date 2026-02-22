import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SafeScreenView from '../components/SafeScreenView';
import { useApp } from '../context/AppContext';
import { getMonthlyTotals } from '../utils/transactionUtils';
import { formatAmount } from '../utils/formatters';
import { screenContainer, cardStyle } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import { Space } from '../styles/tokens';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DashboardScreen() {
  const { transactions } = useApp();
  const now = new Date();
  const { income, expense, balance } = getMonthlyTotals(
    transactions,
    now.getFullYear(),
    now.getMonth()
  );
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <SafeScreenView>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, screenContainer]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{Strings.tabs.Dashboard}</Text>
        <Text style={styles.subtitle}>{monthLabel}</Text>
        <View style={[styles.card, cardStyle]}>
        <Text style={styles.cardLabel}>{Strings.dashboard.totalIncome}</Text>
        <Text style={[styles.cardAmount, { color: Colors.status.success }]}>
          +{formatAmount(income)}
        </Text>
        </View>
        <View style={[styles.card, cardStyle]}>
        <Text style={styles.cardLabel}>{Strings.dashboard.totalExpense}</Text>
        <Text style={[styles.cardAmount, { color: Colors.status.error }]}>
          -{formatAmount(expense)}
        </Text>
        </View>
        <View style={[styles.card, cardStyle, styles.balanceCard]}>
        <Text style={styles.cardLabel}>{Strings.dashboard.balance}</Text>
        <Text
          style={[
            styles.cardAmount,
            styles.balanceAmount,
            { color: balance >= 0 ? Colors.status.success : Colors.status.error },
          ]}
        >
          {formatAmount(balance)}
        </Text>
        </View>
      </ScrollView>
    </SafeScreenView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    paddingBottom: Space.xxl,
  },
  title: {
    ...Typography.h1,
    color: Colors.neutral.textPrimary,
    marginBottom: Space.xs,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginBottom: Space.xl,
  },
  card: {
    marginBottom: Space.md,
  },
  balanceCard: {
    marginTop: Space.xs,
  },
  cardLabel: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginBottom: Space.xs,
  },
  cardAmount: {
    ...Typography.h2,
    color: Colors.neutral.textPrimary,
  },
  balanceAmount: {
    ...Typography.h1,
    fontWeight: '700',
  },
});
