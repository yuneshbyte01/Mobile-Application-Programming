/**
 * Main stack: Bottom tabs + action screens (Add Transaction, etc.).
 * Shown only when user is logged in.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Strings } from '../constants/Strings';
import type { MainStackParamList } from './types';

import BottomTabNavigator from './BottomTabNavigator';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import EditTransactionScreen from '../screens/EditTransactionScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Strings.routes.AddTransaction}
        component={AddTransactionScreen}
        options={{ title: 'Add Transaction' }}
      />
      <Stack.Screen
        name={Strings.routes.EditTransaction}
        component={EditTransactionScreen}
        options={{ title: 'Edit Transaction' }}
      />
    </Stack.Navigator>
  );
}
