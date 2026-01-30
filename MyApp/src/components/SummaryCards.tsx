import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNPR } from '../constants/dummyData';

interface SummaryCardsProps {
  totalExpenses: number;
  totalSubscriptions: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalExpenses,
  totalSubscriptions,
}) => (
  <View style={styles.row}>
    <View style={styles.card}>
      <Text style={styles.label}>Total Expenses</Text>
      <Text style={styles.value}>{formatNPR(totalExpenses)}</Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.label}>Subscriptions</Text>
      <Text style={styles.value}>{formatNPR(totalSubscriptions)}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
});

export default SummaryCards;
