import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { screenContainer } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';

export default function AddTransactionScreen() {
  return (
    <View style={[styles.container, screenContainer]}>
      <Text style={styles.title}>Add Transaction</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...Typography.h1,
    color: Colors.neutral.textPrimary,
  },
});
