import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { formatNPR } from '../constants/dummyData';
import type { ExpenseItem } from '../types';

interface ExpenseToggleProps {
  showDetails: boolean;
  onToggle: (value: boolean) => void;
  expenses: ExpenseItem[];
}

const ExpenseToggle: React.FC<ExpenseToggleProps> = ({
  showDetails,
  onToggle,
  expenses,
}) => (
  <>
    <View style={styles.row}>
      <Text style={styles.label}>Show detailed expenses</Text>
      <Switch
        value={showDetails}
        onValueChange={onToggle}
        trackColor={{ false: '#ccc', true: '#4caf50' }}
        thumbColor={showDetails ? '#2e7d32' : '#f4f3f4'}
      />
    </View>
    {showDetails && (
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Recent Expenses</Text>
        {expenses.map((item, index) => (
          <Text key={index} style={styles.detailItem}>
            {item.label}: {formatNPR(item.amount)}
          </Text>
        ))}
      </View>
    )}
  </>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  detailItem: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
});

export default ExpenseToggle;
