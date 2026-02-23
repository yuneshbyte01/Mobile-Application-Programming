import { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useBudgets } from '@/context/BudgetsContext';

const BUDGET_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
];

export default function AddBudgetScreen() {
  const router = useRouter();
  const { addBudget, budgets } = useBudgets();
  const [category, setCategory] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const usedCategories = new Set(budgets.map((b) => b.category));

  const handleSubmit = async () => {
    setError('');
    const limitNum = parseFloat(monthlyLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      setError('Enter a valid monthly limit');
      return;
    }
    if (!category.trim()) {
      setError('Select a category');
      return;
    }
    if (usedCategories.has(category)) {
      setError('You already have a budget for this category');
      return;
    }

    setIsSubmitting(true);
    try {
      await addBudget({
        category: category.trim(),
        monthlyLimit: limitNum,
      });
      router.back();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Text style={styles.title}>Add Budget</Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {BUDGET_CATEGORIES.map((c) => {
                const disabled = usedCategories.has(c);
                return (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.categoryChip,
                      category === c && styles.categoryChipActive,
                      disabled && styles.categoryChipDisabled,
                    ]}
                    onPress={() => !disabled && setCategory(c)}
                    disabled={disabled}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === c && styles.categoryChipTextActive,
                        disabled && styles.categoryChipTextDisabled,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Monthly limit</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9AA0A6"
              value={monthlyLimit}
              onChangeText={setMonthlyLimit}
              keyboardType="decimal-pad"
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Add Budget</Text>
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
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  categoryChipDisabled: { opacity: 0.5 },
  categoryChipText: { fontSize: 14, color: '#333333', fontWeight: '500' },
  categoryChipTextActive: { color: '#FFFFFF' },
  categoryChipTextDisabled: { color: '#9AA0A6' },
  errorText: { fontSize: 14, color: '#F44336', marginBottom: 12 },
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
