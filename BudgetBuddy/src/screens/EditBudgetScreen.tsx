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
import { TRANSACTION_CATEGORIES } from '../constants/transactionConstants';
import type { MainStackParamList } from '../navigation/types';
import { Space, Radius, Size } from '../styles/tokens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../constants/Icons';

export default function EditBudgetScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParamList, 'EditBudget'>>();
  const { budgetId } = route.params;
  const { colors } = useTheme();
  const { budgets, updateBudget, deleteBudget } = useApp();
  const budget = budgets.find((b) => b.id === budgetId);

  const [category, setCategory] = useState<string>(TRANSACTION_CATEGORIES[0]);
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setMonthlyLimit(String(budget.monthlyLimit));
    }
  }, [budget]);

  const handleSave = async () => {
    setError('');
    const limit = parseFloat(monthlyLimit);
    if (isNaN(limit) || limit <= 0) {
      setError('Please enter a valid monthly limit.');
      return;
    }
    setLoading(true);
    try {
      await updateBudget(budgetId, { category, monthlyLimit: limit });
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
      await deleteBudget(budgetId);
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete.');
    } finally {
      setLoading(false);
    }
  };

  if (!budget) {
    return (
      <View style={[styles.container, screenContainer, { backgroundColor: colors.neutral.bg }]}>
        <Text style={styles.title}>Budget not found</Text>
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
          <Text style={styles.label}>{Strings.budgets.category}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {TRANSACTION_CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.catBtn, category === c && styles.catBtnActive]}
                onPress={() => setCategory(c)}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{Strings.budgets.monthlyLimit}</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={Colors.neutral.textSecondary}
            value={monthlyLimit}
            onChangeText={setMonthlyLimit}
            keyboardType="decimal-pad"
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
              <Text style={styles.saveText}>{Strings.budgets.save}</Text>
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
