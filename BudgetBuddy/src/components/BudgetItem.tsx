import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { Budget } from '../services/budgetService';
import { formatAmount } from '../utils/formatters';
import { getCategorySpent } from '../utils/budgetUtils';
import { getCategoryIcon } from '../utils/categoryIcons';
import type { Transaction } from '../services/transactionService';
import { useTheme } from '../context/SettingsContext';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import { Typography } from '../styles/tokens';
import { Space } from '../styles/tokens';
import { Radius } from '../styles/tokens';

type BudgetItemProps = {
  budget: Budget;
  transactions: Transaction[];
  year: number;
  month: number;
  onPress: () => void;
};

export default function BudgetItem({
  budget,
  transactions,
  year,
  month,
  onPress,
}: BudgetItemProps) {
  const { colors, settings } = useTheme();
  const spent = getCategorySpent(transactions, budget.category, year, month);
  const ratio = budget.monthlyLimit > 0 ? spent / budget.monthlyLimit : 0;
  const percent = Math.round(Math.min(ratio, 1) * 100);
  const isOver = ratio >= 1;
  const isWarning = ratio >= 0.85 && ratio < 1;

  const barColor = isOver
    ? Colors.status.error
    : isWarning
      ? Colors.status.warning
      : colors.brand.primary;

  const iconName = getCategoryIcon(budget.category);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.neutral.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.neutral.bg }]}>
          <Ionicons name={iconName as any} size={24} color={colors.brand.primary} />
        </View>
        <Text style={[styles.categoryName, { color: colors.neutral.textPrimary }]}>
          {budget.category}
        </Text>
      </View>
      <Text style={[styles.limitLabel, { color: colors.neutral.textSecondary }]}>
        {Strings.budgets.monthlyLimitLabel}: {formatAmount(budget.monthlyLimit, settings.currency)}
      </Text>
      <Text style={[styles.spentLabel, { color: colors.neutral.textSecondary }]}>
        {Strings.budgets.spentLabel}: {formatAmount(spent, settings.currency)} ({percent}%)
      </Text>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(percent, 100)}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Space.lg,
    borderRadius: Radius.lg,
    marginBottom: Space.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    marginBottom: Space.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    ...Typography.h3,
  },
  limitLabel: {
    ...Typography.body,
    marginBottom: Space.xs,
  },
  spentLabel: {
    ...Typography.body,
    marginBottom: Space.md,
  },
  progressTrack: {
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: '#E8EAF0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
