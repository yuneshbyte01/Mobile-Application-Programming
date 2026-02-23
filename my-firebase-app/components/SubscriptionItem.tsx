import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import type { Subscription } from '@/lib/subscriptionService';
import { useSettings } from '@/context/SettingsContext';
import { formatAmount } from '@/utils/formatters';
import { formatDateShort } from '@/utils/dateUtils';

type SubscriptionItemProps = {
  subscription: Subscription;
  onPress: () => void;
};

export default function SubscriptionItem({
  subscription,
  onPress,
}: SubscriptionItemProps) {
  const { settings } = useSettings();
  const cycleLabel = subscription.cycle === 'monthly' ? '/mo' : '/yr';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{subscription.name}</Text>
        <Text style={styles.price}>
          {formatAmount(subscription.price, settings?.currency ?? 'USD')}
          <Text style={styles.cycle}>{cycleLabel}</Text>
        </Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.date}>
          Bills on {formatDateShort(subscription.billingDateISO)}
        </Text>
        {!subscription.isActive && (
          <View style={styles.inactiveBadge}>
            <Text style={styles.inactiveText}>Paused</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
  },
  cycle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#777777',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: '#777777',
  },
  inactiveBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inactiveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
