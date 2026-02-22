import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Transaction } from '../services/transactionService';
import { formatAmount, formatDate } from '../utils/formatters';
import { Colors } from '../constants/Colors';
import { listCardStyle } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Space } from '../styles/tokens';

type TransactionItemProps = {
  transaction: Transaction;
  onPress: () => void;
};

export default function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? Colors.status.success : Colors.status.error;

  return (
    <TouchableOpacity style={[styles.row, listCardStyle]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.category}>{transaction.category}</Text>
        <Text style={styles.date}>{formatDate(transaction.dateISO)}</Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 64,
  },
  left: { flex: 1 },
  category: {
    ...Typography.h3,
    color: Colors.neutral.textPrimary,
  },
  date: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginTop: Space.xs,
  },
  amount: {
    ...Typography.h3,
  },
});
