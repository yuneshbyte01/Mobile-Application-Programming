import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/SettingsContext';
import { screenContainer, primaryButton, dangerButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import type { MainStackParamList } from '../navigation/types';
import { Space, Radius, Size } from '../styles/tokens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../constants/Icons';

export default function EditSubscriptionScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParamList, 'EditSubscription'>>();
  const { subscriptionId } = route.params;
  const { colors } = useTheme();
  const { subscriptions, updateSubscription, deleteSubscription } = useApp();
  const subscription = subscriptions.find((s) => s.id === subscriptionId);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingDateISO, setBillingDateISO] = useState('');
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setPrice(String(subscription.price));
      setBillingDateISO(new Date(subscription.billingDateISO).toISOString().slice(0, 10));
      setCycle(subscription.cycle);
      setIsActive(subscription.isActive);
    }
  }, [subscription]);

  const handleSave = async () => {
    setError('');
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a name.');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Please enter a valid price.');
      return;
    }
    const date = new Date(billingDateISO);
    if (isNaN(date.getTime())) {
      setError('Please enter a valid billing date (YYYY-MM-DD).');
      return;
    }
    setLoading(true);
    try {
      await updateSubscription(subscriptionId, {
        name: trimmed,
        price: numPrice,
        billingDateISO: date.toISOString(),
        cycle,
        isActive,
      });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteSubscription(subscriptionId);
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete.');
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <View style={[styles.container, screenContainer, { backgroundColor: colors.neutral.bg }]}>
        <Text style={styles.title}>Subscription not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[screenContainer, styles.content, { backgroundColor: colors.neutral.bg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>{Strings.subscriptions.name}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Netflix"
            placeholderTextColor={Colors.neutral.textSecondary}
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{Strings.subscriptions.price}</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={Colors.neutral.textSecondary}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{Strings.subscriptions.cycle}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.cycleBtn, cycle === 'monthly' && styles.cycleBtnActive]}
              onPress={() => setCycle('monthly')}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={[styles.cycleText, cycle === 'monthly' && styles.cycleTextActive]}>
                {Strings.subscriptions.monthly}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cycleBtn, cycle === 'yearly' && styles.cycleBtnActive]}
              onPress={() => setCycle('yearly')}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={[styles.cycleText, cycle === 'yearly' && styles.cycleTextActive]}>
                {Strings.subscriptions.yearly}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{Strings.subscriptions.billingDate}</Text>
          <TextInput
            style={styles.input}
            value={billingDateISO}
            onChangeText={setBillingDateISO}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.neutral.textSecondary}
            editable={!loading}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.cycleBtn, isActive && styles.cycleBtnActive]}
              onPress={() => setIsActive(true)}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={[styles.cycleText, isActive && styles.cycleTextActive]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cycleBtn, !isActive && styles.cycleBtnActive]}
              onPress={() => setIsActive(false)}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={[styles.cycleText, !isActive && styles.cycleTextActive]}>Paused</Text>
            </TouchableOpacity>
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[primaryButton, styles.saveBtn]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.neutral.surface} size="small" />
          ) : (
            <>
              <Ionicons name={Icons.action.save as any} size={20} color={Colors.neutral.surface} />
              <Text style={styles.saveText}>{Strings.subscriptions.save}</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[dangerButton, styles.deleteBtn]}
          onPress={handleDelete}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Ionicons name={Icons.action.delete as any} size={20} color={Colors.neutral.surface} />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scroll: { flex: 1 },
  container: { flex: 1 },
  content: { paddingHorizontal: Space.lg, paddingBottom: Space.xxl },
  section: { marginBottom: Space.xl },
  title: { ...Typography.h1, color: Colors.neutral.textPrimary },
  label: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginBottom: Space.xs,
    marginTop: 0,
  },
  input: {
    height: Size.inputHeight,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    backgroundColor: Colors.neutral.surface,
    paddingHorizontal: 12,
    ...Typography.body,
    color: Colors.neutral.textPrimary,
  },
  row: { flexDirection: 'row', gap: Space.md },
  cycleBtn: {
    flex: 1,
    height: Size.inputHeight,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleBtnActive: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primary,
  },
  cycleText: {
    ...Typography.button,
    color: Colors.neutral.textSecondary,
  },
  cycleTextActive: {
    color: Colors.neutral.surface,
  },
  error: {
    ...Typography.caption,
    color: Colors.status.error,
    marginTop: 12,
  },
  saveBtn: { marginTop: Space.lg },
  saveText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
  deleteBtn: { marginTop: Space.md },
  deleteText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
});
