import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Strings } from '../constants/Strings';
import { useTheme } from '../context/SettingsContext';
import { Icons } from '../constants/Icons';

import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import BudgetsScreen from '../screens/BudgetsScreen';
import SubscriptionsScreen from '../screens/SubscriptionsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function TabIcon({
  focused,
  name,
  nameOutline,
  color,
}: {
  focused: boolean;
  name: string;
  nameOutline: string;
  color: string;
}) {
  return (
    <Ionicons
      name={focused ? (name as any) : (nameOutline as any)}
      size={24}
      color={color}
    />
  );
}

export default function BottomTabNavigator() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.brand.primary,
        tabBarInactiveTintColor: colors.neutral.textSecondary,
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.neutral.surface,
          borderTopColor: colors.neutral.border,
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
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={Icons.tab.dashboard}
              nameOutline={Icons.tab.dashboardOutline}
              color={focused ? colors.brand.primary : colors.neutral.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Strings.routes.Transactions}
        component={TransactionsScreen}
        options={{
          tabBarLabel: Strings.tabs.Transactions,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={Icons.tab.transactions}
              nameOutline={Icons.tab.transactionsOutline}
              color={focused ? colors.brand.primary : colors.neutral.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Strings.routes.Budgets}
        component={BudgetsScreen}
        options={{
          tabBarLabel: Strings.tabs.Budgets,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={Icons.tab.budgets}
              nameOutline={Icons.tab.budgetsOutline}
              color={focused ? colors.brand.primary : colors.neutral.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Strings.routes.Subscriptions}
        component={SubscriptionsScreen}
        options={{
          tabBarLabel: Strings.tabs.Subscriptions,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={Icons.tab.subscriptions}
              nameOutline={Icons.tab.subscriptionsOutline}
              color={focused ? colors.brand.primary : colors.neutral.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Strings.routes.Settings}
        component={SettingsScreen}
        options={{
          tabBarLabel: Strings.tabs.Settings,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={Icons.tab.settings}
              nameOutline={Icons.tab.settingsOutline}
              color={focused ? colors.brand.primary : colors.neutral.textSecondary}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
