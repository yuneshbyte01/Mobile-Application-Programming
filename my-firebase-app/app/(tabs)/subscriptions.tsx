import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useSubscriptions } from '@/context/SubscriptionsContext';
import SubscriptionItem from '@/components/SubscriptionItem';

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { subscriptions, loading } = useSubscriptions();

  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => new Date(a.billingDateISO).getTime() - new Date(b.billingDateISO).getTime()
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No subscriptions yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your subscriptions to track recurring expenses and never miss a payment.
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-subscription')}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add Subscription</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscriptions</Text>
        <TouchableOpacity
          style={styles.addButtonSmall}
          onPress={() => router.push('/add-subscription')}
        >
          <Text style={styles.addButtonSmallText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionItem
            subscription={item}
            onPress={() =>
              router.push({
                pathname: '/edit-subscription',
                params: { id: item.id },
              })
            }
          />
        )}
        ItemSeparatorComponent={() => null}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  addButtonSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonSmallText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F7FA',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  addButton: {
    height: 48,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
