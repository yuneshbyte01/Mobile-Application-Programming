import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useSubscriptions } from '@/context/SubscriptionsContext';
import { todayISO } from '@/utils/dateUtils';

const CYCLES = ['monthly', 'yearly'] as const;

export default function EditSubscriptionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    subscriptions,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();
  const subscription = subscriptions.find((s) => s.id === id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingDateISO, setBillingDateISO] = useState(todayISO());
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setPrice(subscription.price.toString());
      setBillingDateISO(subscription.billingDateISO);
      setCycle(subscription.cycle);
      setIsActive(subscription.isActive);
    }
  }, [subscription]);

  const handleSave = async () => {
    setError('');
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Enter a valid price');
      return;
    }
    if (!name.trim()) {
      setError('Enter a name');
      return;
    }
    if (!billingDateISO.trim()) {
      setError('Enter a billing date');
      return;
    }
    if (isNaN(new Date(billingDateISO).getTime())) {
      setError('Enter a valid date (YYYY-MM-DD)');
      return;
    }
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateSubscription(id, {
        name: name.trim(),
        price: priceNum,
        billingDateISO: billingDateISO.trim(),
        cycle,
        isActive,
      });
      router.back();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Subscription',
      'Are you sure you want to delete this subscription?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            try {
              await deleteSubscription(id);
              router.back();
            } catch {
              setError('Failed to delete');
            }
          },
        },
      ]
    );
  };

  if (!id || (!subscription && subscriptions.length > 0)) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Subscription not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Subscription</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Netflix, Spotify, etc."
              placeholderTextColor="#9AA0A6"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9AA0A6"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Billing date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9AA0A6"
              value={billingDateISO}
              onChangeText={setBillingDateISO}
            />

            <Text style={styles.label}>Cycle</Text>
            <View style={styles.cycleRow}>
              {CYCLES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.cycleBtn, cycle === c && styles.cycleBtnActive]}
                  onPress={() => setCycle(c)}
                >
                  <Text
                    style={[
                      styles.cycleBtnText,
                      cycle === c && styles.cycleBtnTextActive,
                    ]}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.activeRow}>
              <Text style={styles.label}>Active</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#E0E0E0', true: '#6C63FF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FA' },
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backBtn: { minWidth: 44, minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 16, color: '#6C63FF', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '600', color: '#333333' },
  deleteBtn: { padding: 8 },
  deleteText: { fontSize: 16, color: '#F44336', fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  cycleRow: { flexDirection: 'row', gap: 12 },
  cycleBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  cycleBtnText: { fontSize: 16, fontWeight: '600', color: '#333333' },
  cycleBtnTextActive: { color: '#FFFFFF' },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    marginBottom: 12,
  },
  submitBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
