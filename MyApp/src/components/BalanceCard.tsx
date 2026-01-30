import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNPR } from '../constants/dummyData';

interface BalanceCardProps {
  amount: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ amount }) => (
  <View style={styles.card}>
    <Text style={styles.label}>Total Balance</Text>
    <Text style={styles.amount}>{formatNPR(amount)}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default BalanceCard;
