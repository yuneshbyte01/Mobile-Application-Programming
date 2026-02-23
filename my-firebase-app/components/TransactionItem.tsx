import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Transaction } from '@/lib/transactionService';
import { useSettings } from '@/context/SettingsContext';
import { formatAmountShort } from '@/utils/formatters';
import { formatDateShort } from '@/utils/dateUtils';

type TransactionItemProps = {
  transaction: Transaction;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function TransactionItem({
  transaction,
  onPress,
  onLongPress,
}: TransactionItemProps) {
  const { settings } = useSettings();
  const isIncome = transaction.type === 'income';
  const amountStr = formatAmountShort(
    isIncome ? transaction.amount : -transaction.amount,
    settings?.currency ?? 'USD'
  );

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Text style={styles.category}>{transaction.category}</Text>
        <Text style={styles.date}>{formatDateShort(transaction.dateISO)}</Text>
      </View>
      <Text
        style={[
          styles.amount,
          isIncome ? styles.amountIncome : styles.amountExpense,
        ]}
      >
        {amountStr}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  left: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  date: {
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountIncome: {
    color: '#4CAF50',
  },
  amountExpense: {
    color: '#F44336',
  },
});
