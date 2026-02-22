import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../constants/Icons';
import type { Transaction } from '../services/transactionService';
import { formatAmount, formatRelativeDate } from '../utils/formatters';
import { Colors } from '../constants/Colors';
import { useTheme } from '../context/SettingsContext';
import { Typography } from '../styles/tokens';
import { Space } from '../styles/tokens';

type TransactionItemProps = {
  transaction: Transaction;
  onPress: () => void;
};

export default function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const { colors, settings } = useTheme();
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? Colors.status.success : Colors.status.error;
  const typeIcon = isIncome ? Icons.transaction.income : Icons.transaction.expense;

  const displayName = transaction.notes
    ? `${transaction.category} - ${transaction.notes}`
    : transaction.category;

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.neutral.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={[styles.iconCircle, { backgroundColor: colors.neutral.bg }]}>
          <Ionicons name={typeIcon as any} size={22} color={amountColor} />
        </View>
        <View style={styles.middle}>
          <Text style={[styles.category, { color: colors.neutral.textPrimary }]} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={[styles.date, { color: colors.neutral.textSecondary }]}>
            {formatRelativeDate(transaction.dateISO)}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isIncome ? '+' : '-'}{formatAmount(transaction.amount, settings.currency)}
        </Text>
        <Text style={[styles.dateRight, { color: colors.neutral.textSecondary }]}>
          {formatRelativeDate(transaction.dateISO)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Space.lg,
    marginBottom: Space.sm,
    borderRadius: 12,
    minHeight: 72,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Space.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middle: {
    flex: 1,
  },
  category: {
    ...Typography.h3,
  },
  date: {
    ...Typography.caption,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    ...Typography.h3,
  },
  dateRight: {
    ...Typography.caption,
    marginTop: 2,
  },
});
