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
import { screenContainer, primaryButton, dangerButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import { TRANSACTION_CATEGORIES } from '../constants/transactionConstants';
import type { MainStackParamList } from '../navigation/types';
import { Space, Radius, Size } from '../styles/tokens';

export default function EditTransactionScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParamList, 'EditTransaction'>>();
  const { transactionId } = route.params;
  const { transactions, updateTransaction, deleteTransaction } = useApp();
  const transaction = transactions.find((t) => t.id === transactionId);

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState(TRANSACTION_CATEGORIES[0]);
  const [dateISO, setDateISO] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setAmount(String(transaction.amount));
      setType(transaction.type);
      setCategory(transaction.category);
      setDateISO(transaction.dateISO.slice(0, 10));
      setNotes(transaction.notes ?? '');
    }
  }, [transaction]);

  const handleSave = async () => {
    setError('');
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      await updateTransaction(transactionId, {
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTransaction(transactionId);
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete.');
    } finally {
      setLoading(false);
    }
  };

  if (!transaction) {
    return (
      <View style={[styles.container, screenContainer]}>
        <Text style={styles.title}>Transaction not found</Text>
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
        contentContainerStyle={[screenContainer, styles.content]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
        <Text style={styles.label}>{Strings.transactions.date}</Text>
        <TextInput
          style={styles.input}
          value={dateISO}
          onChangeText={setDateISO}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Colors.neutral.textSecondary}
          editable={!loading}
        />
        <Text style={styles.label}>{Strings.transactions.notes}</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Optional notes"
          placeholderTextColor={Colors.neutral.textSecondary}
          value={notes}
          onChangeText={setNotes}
          multiline
          editable={!loading}
        />
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
            <Text style={styles.saveText}>{Strings.transactions.save}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[dangerButton, styles.deleteBtn]}
          onPress={handleDelete}
          disabled={loading}
          activeOpacity={0.8}
        >
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
  content: { paddingHorizontal: 24, paddingBottom: 32 },
  title: { ...Typography.h1, color: Colors.neutral.textPrimary },
  label: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginBottom: 4,
    marginTop: 12,
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
  row: { flexDirection: 'row', gap: 12, marginTop: 4 },
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
  catScroll: { marginTop: 4, marginBottom: 8 },
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
  saveBtn: { marginTop: 24 },
  saveText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
  deleteBtn: {
    marginTop: 12,
    backgroundColor: Colors.status.error,
  },
  deleteText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
});
