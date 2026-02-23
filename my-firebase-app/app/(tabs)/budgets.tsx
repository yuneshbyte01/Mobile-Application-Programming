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

import { useBudgets } from '@/context/BudgetsContext';
import { useSettings } from '@/context/SettingsContext';
import { useTransactions } from '@/context/TransactionsContext';
import BudgetProgressBar from '@/components/BudgetProgressBar';
import { getCategoryExpenseForMonth } from '@/utils/calculations';
import { getCurrentMonthISO } from '@/utils/dateUtils';
import { formatAmount } from '@/utils/formatters';

export default function BudgetsScreen() {
  const router = useRouter();
  const { budgets, loading } = useBudgets();
  const { settings } = useSettings();
  const { transactions } = useTransactions();
  const monthISO = getCurrentMonthISO();

  const getBudgetWithSpent = (budget: { id: string; category: string; monthlyLimit: number }) => ({
    ...budget,
    spent: getCategoryExpenseForMonth(transactions, budget.category, monthISO),
  });

  const budgetsWithSpent = budgets.map(getBudgetWithSpent);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  if (budgets.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No budgets yet</Text>
        <Text style={styles.emptySubtitle}>
          Create a budget to track spending by category and stay on track.
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-budget')}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add Budget</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budgets</Text>
        <TouchableOpacity
          style={styles.addButtonSmall}
          onPress={() => router.push('/add-budget')}
        >
          <Text style={styles.addButtonSmallText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={budgetsWithSpent}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.budgetCard}
            onPress={() =>
              router.push({ pathname: '/edit-budget', params: { id: item.id } })
            }
            activeOpacity={0.8}
          >
            <View style={styles.budgetHeader}>
              <Text style={styles.categoryText}>{item.category}</Text>
              <Text style={styles.amountText}>
                {formatAmount(item.spent, settings?.currency ?? 'USD')} / {formatAmount(item.monthlyLimit, settings?.currency ?? 'USD')}
              </Text>
            </View>
            <BudgetProgressBar spent={item.spent} limit={item.monthlyLimit} />
          </TouchableOpacity>
        )}
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
    padding: 16,
    paddingBottom: 24,
  },
  list: { flex: 1 },
  separator: { height: 12 },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  amountText: {
    fontSize: 14,
    color: '#777777',
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
