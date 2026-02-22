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
import { TRANSACTION_CATEGORIES } from '../constants/transactionConstants';
import { Space, Radius, Size } from '../styles/tokens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../constants/Icons';

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { addTransaction } = useApp();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState(TRANSACTION_CATEGORIES[0]);
  const [dateISO, setDateISO] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError('');
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      await addTransaction({
        amount: numAmount,
        type,
        category,
        dateISO: new Date(dateISO).toISOString(),
        notes: notes.trim(),
        isRecurring: false,
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
          <Text style={styles.label}>{Strings.transactions.amount}</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={Colors.neutral.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{Strings.transactions.type}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'income' && styles.typeBtnActive]}
              onPress={() => setType('income')}
              disabled={loading}
            >
              <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
                {Strings.transactions.income}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'expense' && styles.typeBtnActive]}
              onPress={() => setType('expense')}
              disabled={loading}
            >
              <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
                {Strings.transactions.expense}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{Strings.transactions.category}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {TRANSACTION_CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.catBtn, category === c && styles.catBtnActive]}
                onPress={() => setCategory(c)}
                disabled={loading}
              >
                <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{Strings.transactions.date}</Text>
          <TextInput
            style={styles.input}
            value={dateISO}
            onChangeText={setDateISO}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.neutral.textSecondary}
            editable={!loading}
          />
          <Text style={[styles.label, { marginTop: Space.md }]}>{Strings.transactions.notes}</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Optional notes"
            placeholderTextColor={Colors.neutral.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
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
              <Text style={styles.saveText}>{Strings.transactions.save}</Text>
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
  section: {
    marginBottom: Space.xl,
  },
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
  typeBtn: {
    flex: 1,
    height: Size.inputHeight,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBtnActive: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primary,
  },
  typeText: {
    ...Typography.button,
    color: Colors.neutral.textSecondary,
  },
  typeTextActive: {
    color: Colors.neutral.surface,
  },
  catScroll: { marginTop: Space.xs },
  catBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral.surface,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    marginRight: 8,
  },
  catBtnActive: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primary,
  },
  catText: {
    ...Typography.body,
    color: Colors.neutral.textPrimary,
  },
  catTextActive: {
    color: Colors.neutral.surface,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
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
