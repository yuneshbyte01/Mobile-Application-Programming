import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const ActionButtons: React.FC = () => {
  const handleAddExpense = () => {
    Alert.alert('Add Expense', 'Add expense screen would open here.');
  };

  const handleAddSubscription = () => {
    Alert.alert('Add Subscription', 'Add subscription screen would open here.');
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAddSubscription}>
        <Text style={styles.buttonText}>Add Subscription</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ActionButtons;
