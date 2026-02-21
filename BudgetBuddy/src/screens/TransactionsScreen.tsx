import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { screenContainer, primaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';

type RootStackParamList = {
  MainTabs: undefined;
  AddTransaction: undefined;
};

export default function TransactionsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'MainTabs'>>();

  return (
    <View style={[styles.container, screenContainer]}>
      <Text style={styles.title}>Transactions</Text>
      <TouchableOpacity
        style={[primaryButton, styles.addButton]}
        onPress={() => navigation.navigate(Strings.routes.AddTransaction)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Add Transaction</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  buttonText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
});
