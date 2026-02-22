import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { Subscription } from '../services/subscriptionService';
import { formatAmount } from '../utils/formatters';
import { getNextBillingInMonth, subscriptionBillsInMonth } from '../utils/dashboardUtils';
import { getSubscriptionIcon } from '../utils/subscriptionIcons';
import { useTheme } from '../context/SettingsContext';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import { Typography } from '../styles/tokens';
import { Space, Radius } from '../styles/tokens';

type SubscriptionItemProps = {
  subscription: Subscription;
  year: number;
  month: number;
  totalMonthlyBudget: number;
  onPress: () => void;
};

export default function SubscriptionItem({
  subscription,
  year,
  month,
  totalMonthlyBudget,
  onPress,
}: SubscriptionItemProps) {
  const { colors, settings } = useTheme();
  const displayPrice = subscription.cycle === 'yearly' ? subscription.price / 12 : subscription.price;
  const billsThisMonth = subscriptionBillsInMonth(subscription, year, month);
  const spent = billsThisMonth ? displayPrice : 0;
  const percent =
    totalMonthlyBudget > 0 ? Math.round(Math.min((spent / totalMonthlyBudget) * 100, 100)) : 0;
  const iconName = getSubscriptionIcon(subscription.name);
  const nextBilling = getNextBillingInMonth(subscription, year, month);

  const isOver = totalMonthlyBudget > 0 && spent >= totalMonthlyBudget;
  const barColor = isOver ? Colors.status.error : colors.brand.primary;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.neutral.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: colors.neutral.bg }]}>
          <Ionicons name={iconName as any} size={24} color={colors.brand.primary} />
        </View>
        <View style={styles.content}>
          <Text
            style={[
              styles.name,
              { color: colors.neutral.textPrimary },
              !subscription.isActive && { color: colors.neutral.textSecondary },
            ]}
          >
            {subscription.name}
          </Text>
          <Text style={[styles.nextBilling, { color: colors.neutral.textSecondary }]}>
            {Strings.subscriptions.nextBilling} {nextBilling}
          </Text>
          <Text style={[styles.spent, { color: colors.neutral.textSecondary }]}>
            {Strings.subscriptions.spentLabel}: {formatAmount(spent, settings.currency)} ({percent}%)
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: colors.neutral.bg }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(percent, 100)}%`, backgroundColor: barColor },
              ]}
            />
          </View>
        </View>
        <Text style={[styles.amount, { color: colors.status.error }]}>
          {formatAmount(-displayPrice, settings.currency)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Space.lg,
    borderRadius: Radius.lg,
    marginBottom: Space.lg,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Space.md,
  },
  content: {
    flex: 1,
  },
  name: {
    ...Typography.h3,
    marginBottom: Space.xs,
  },
  nextBilling: {
    ...Typography.caption,
    marginBottom: Space.xs,
  },
  spent: {
    ...Typography.caption,
    marginBottom: Space.sm,
  },
  progressTrack: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  amount: {
    ...Typography.body,
    fontWeight: '600',
    marginLeft: Space.md,
  },
});
