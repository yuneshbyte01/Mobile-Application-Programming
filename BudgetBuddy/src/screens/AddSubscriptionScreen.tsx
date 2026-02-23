import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/SettingsContext';
import { screenContainer, primaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import { Space, Radius, Size } from '../styles/tokens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../constants/Icons';

export default function AddSubscriptionScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { addSubscription } = useApp();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingDateISO, setBillingDateISO] = useState(new Date().toISOString().slice(0, 10));
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      await addSubscription({
        name: trimmed,
        price: numPrice,
        billingDateISO: date.toISOString(),
        cycle,
        isActive: true,
      });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setLoading(false);
    }
  };

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Space.lg, paddingBottom: Space.xxl },
  section: { marginBottom: Space.xl },
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
});
