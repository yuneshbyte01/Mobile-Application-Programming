import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Strings } from '../constants/Strings';
import { Colors } from '../constants/Colors';

import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import BudgetsScreen from '../screens/BudgetsScreen';
import SubscriptionsScreen from '../screens/SubscriptionsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Simple tab icon (no icon library): first letter of tab name
function TabIcon({ focused, label }: { focused: boolean; label: string }) {
  const letter = label.charAt(0);
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <Text style={{ fontSize: 18, fontWeight: '600', color: focused ? Colors.brand.primary : Colors.neutral.muted }}>
      {letter}
    </Text>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.brand.primary,
        tabBarInactiveTintColor: Colors.neutral.muted,
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.neutral.surface,
          borderTopColor: Colors.neutral.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name={Strings.routes.Dashboard}
        component={DashboardScreen}
        options={{
          tabBarLabel: Strings.tabs.Dashboard,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={Strings.tabs.Dashboard} />,
        }}
      />
      <Tab.Screen
        name={Strings.routes.Transactions}
        component={TransactionsScreen}
        options={{
          tabBarLabel: Strings.tabs.Transactions,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={Strings.tabs.Transactions} />,
        }}
      />
      <Tab.Screen
        name={Strings.routes.Budgets}
        component={BudgetsScreen}
        options={{
          tabBarLabel: Strings.tabs.Budgets,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={Strings.tabs.Budgets} />,
        }}
      />
      <Tab.Screen
        name={Strings.routes.Subscriptions}
        component={SubscriptionsScreen}
        options={{
          tabBarLabel: Strings.tabs.Subscriptions,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={Strings.tabs.Subscriptions} />,
        }}
      />
      <Tab.Screen
        name={Strings.routes.Reports}
        component={ReportsScreen}
        options={{
          tabBarLabel: Strings.tabs.Reports,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={Strings.tabs.Reports} />,
        }}
      />
      <Tab.Screen
        name={Strings.routes.Settings}
        component={SettingsScreen}
        options={{
          tabBarLabel: Strings.tabs.Settings,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={Strings.tabs.Settings} />,
        }}
      />
    </Tab.Navigator>
  );
}
