/**
 * Main stack: Bottom tabs + action screens (Add Transaction, etc.).
 * Shown only when user is logged in.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Strings } from '../constants/Strings';
import { useTheme } from '../context/SettingsContext';
import type { MainStackParamList } from './types';

import BottomTabNavigator from './BottomTabNavigator';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import EditTransactionScreen from '../screens/EditTransactionScreen';
import AddBudgetScreen from '../screens/AddBudgetScreen';
import EditBudgetScreen from '../screens/EditBudgetScreen';
import AddSubscriptionScreen from '../screens/AddSubscriptionScreen';
import EditSubscriptionScreen from '../screens/EditSubscriptionScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStackNavigator() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.neutral.surface },
        headerTintColor: colors.neutral.textPrimary,
      }}
    >
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
      <Stack.Screen
        name={Strings.routes.AddBudget}
        component={AddBudgetScreen}
        options={{ title: 'Add Budget' }}
      />
      <Stack.Screen
        name={Strings.routes.EditBudget}
        component={EditBudgetScreen}
        options={{ title: 'Edit Budget' }}
      />
      <Stack.Screen
        name={Strings.routes.AddSubscription}
        component={AddSubscriptionScreen}
        options={{ title: 'Add Subscription' }}
      />
      <Stack.Screen
        name={Strings.routes.EditSubscription}
        component={EditSubscriptionScreen}
        options={{ title: 'Edit Subscription' }}
      />
    </Stack.Navigator>
  );
}
