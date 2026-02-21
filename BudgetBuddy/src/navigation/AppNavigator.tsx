import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Strings } from '../constants/Strings';

import BottomTabNavigator from './BottomTabNavigator';
import AddTransactionScreen from '../screens/AddTransactionScreen';

const Stack = createNativeStackNavigator();

/**
 * Root navigator: Stack with Main Tabs + action screens.
 * Auth flow will wrap this in Phase 1.
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
