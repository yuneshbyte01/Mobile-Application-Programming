import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNPR } from '../constants/dummyData';
import type { Subscription } from '../types';

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions }) => (
  <View style={styles.section}>
    <Text style={styles.title}>Upcoming Subscriptions</Text>
    {subscriptions.map((sub) => (
      <View key={sub.id} style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.name}>{sub.name}</Text>
          <Text style={styles.cost}>{formatNPR(sub.cost)}</Text>
        </View>
        <Text style={styles.due}>Due: {sub.dueDate}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  cost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
  },
  due: {
    fontSize: 13,
    color: '#666',
  },
});

export default SubscriptionList;
