import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettings } from '@/context/SettingsContext';
import { useTransactions } from '@/context/TransactionsContext';
import {
  getCategoryBreakdown,
  getMonthlyTrend,
  type CategorySum,
  type MonthAggregate,
} from '@/utils/calculations';
import { getCurrentMonthISO } from '@/utils/dateUtils';
import { formatAmount } from '@/utils/formatters';

const CHART_COLORS = [
  '#6C63FF',
  '#2EC4B6',
  '#4D96FF',
  '#FF9800',
  '#9C27B0',
  '#4CAF50',
  '#F44336',
  '#607D8B',
];

export default function ReportsScreen() {
  const { settings } = useSettings();
  const { transactions, loading } = useTransactions();
  const [monthsBack, setMonthsBack] = useState(6);
  const { width } = useWindowDimensions();
  const barWidth = Math.max(20, (width - 32 - 48) / monthsBack - 8);

  const monthISO = getCurrentMonthISO();
  const categoryBreakdown = getCategoryBreakdown(transactions, monthISO);
  const monthlyTrend = getMonthlyTrend(transactions, monthsBack);

  const maxExpense = Math.max(
    ...monthlyTrend.map((m) => m.expense),
    1
  );
  const maxIncome = Math.max(
    ...monthlyTrend.map((m) => m.income),
    1
  );
  const totalExpense = categoryBreakdown.reduce((s, c) => s + c.total, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Reports</Text>

        {/* Month filter */}
        <View style={styles.filterRow}>
          <Text style={styles.sectionLabel}>Time range</Text>
          <View style={styles.filterChips}>
            {[3, 6, 12].map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.filterChip,
                  monthsBack === n && styles.filterChipActive,
                ]}
                onPress={() => setMonthsBack(n)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    monthsBack === n && styles.filterChipTextActive,
                  ]}
                >
                  Last {n} mo
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Category breakdown (this month)
          </Text>
          {categoryBreakdown.length === 0 ? (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyText}>No expenses this month</Text>
            </View>
          ) : (
            <>
              <View style={styles.barChart}>
                {categoryBreakdown.slice(0, 8).map((item, i) => (
                  <CategoryBar
                    key={item.category}
                    item={item}
                    maxTotal={totalExpense || 1}
                    color={CHART_COLORS[i % CHART_COLORS.length]!}
                    currency={settings?.currency ?? 'USD'}
                  />
                ))}
              </View>
              <View style={styles.legend}>
                {categoryBreakdown.slice(0, 8).map((item, i) => (
                  <View key={item.category} style={styles.legendRow}>
                    <View
                      style={[
                        styles.legendDot,
                        {
                          backgroundColor:
                            CHART_COLORS[i % CHART_COLORS.length],
                        },
                      ]}
                    />
                    <Text style={styles.legendText} numberOfLines={1}>
                      {item.category}: {formatAmount(item.total, settings?.currency ?? 'USD')}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Monthly trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly trend</Text>
          {monthlyTrend.every((m) => m.income === 0 && m.expense === 0) ? (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyText}>No data for this period</Text>
            </View>
          ) : (
            <View style={styles.trendChart}>
              {monthlyTrend.map((m) => (
                <TrendBar
                  key={m.monthISO}
                  month={m}
                  maxIncome={maxIncome}
                  maxExpense={maxExpense}
                  barWidth={barWidth}
                  currency={settings?.currency ?? 'USD'}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CategoryBar({
  item,
  maxTotal,
  color,
  currency,
}: {
  item: CategorySum;
  maxTotal: number;
  color: string;
  currency: string;
}) {
  const pct = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
  return (
    <View style={styles.categoryBarRow}>
      <Text style={styles.categoryBarLabel} numberOfLines={1}>
        {item.category}
      </Text>
      <View style={styles.categoryBarTrack}>
        <View
          style={[
            styles.categoryBarFill,
            {
              width: `${pct}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={styles.categoryBarValue}>{formatAmount(item.total, currency)}</Text>
    </View>
  );
}

function TrendBar({
  month,
  maxIncome,
  maxExpense,
  barWidth,
  currency,
}: {
  month: MonthAggregate;
  maxIncome: number;
  maxExpense: number;
  barWidth: number;
  currency: string;
}) {
  const incomeHeight = maxIncome > 0 ? (month.income / maxIncome) * 60 : 0;
  const expenseHeight = maxExpense > 0 ? (month.expense / maxExpense) * 60 : 0;

  return (
    <View style={[styles.trendBar, { width: barWidth }]}>
      <View style={styles.trendBars}>
        <View style={styles.trendBarGroup}>
          <View
            style={[
              styles.trendBarFill,
              {
                height: Math.max(incomeHeight, 2),
                backgroundColor: '#4CAF50',
              },
            ]}
          />
          <Text style={styles.trendBarValue}>
            {month.income > 0 ? formatAmount(month.income, currency) : ''}
          </Text>
        </View>
        <View style={styles.trendBarGroup}>
          <View
            style={[
              styles.trendBarFill,
              {
                height: Math.max(expenseHeight, 2),
                backgroundColor: '#F44336',
              },
            ]}
          />
          <Text style={styles.trendBarValue}>
            {month.expense > 0 ? formatAmount(month.expense, currency) : ''}
          </Text>
        </View>
      </View>
      <Text style={styles.trendBarLabel} numberOfLines={1}>
        {month.monthLabel}
      </Text>
    </View>
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
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  filterRow: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  filterChipText: { fontSize: 14, fontWeight: '500', color: '#333333' },
  filterChipTextActive: { color: '#FFFFFF' },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  emptyChart: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#777777',
  },
  barChart: {
    gap: 12,
    marginBottom: 16,
  },
  categoryBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBarLabel: {
    fontSize: 12,
    color: '#333333',
    width: 70,
  },
  categoryBarTrack: {
    flex: 1,
    height: 20,
    backgroundColor: '#E8EAF0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryBarValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    width: 60,
    textAlign: 'right',
  },
  legend: {
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#777777',
  },
  trendChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  trendBar: {
    alignItems: 'center',
  },
  trendBars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  trendBarGroup: {
    alignItems: 'center',
  },
  trendBarFill: {
    width: 14,
    borderRadius: 4,
    minHeight: 2,
  },
  trendBarValue: {
    fontSize: 9,
    color: '#777777',
  },
  trendBarLabel: {
    fontSize: 10,
    color: '#777777',
  },
});
