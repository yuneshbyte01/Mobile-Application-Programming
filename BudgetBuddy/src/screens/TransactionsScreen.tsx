import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../constants/Icons';
import { useNavigation } from '@react-navigation/native';
import SafeScreenView from '../components/SafeScreenView';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/SettingsContext';
import { filterByMonth } from '../utils/transactionUtils';
import { screenContainer, primaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import TransactionItem from '../components/TransactionItem';
import { Space, Radius, Shadow, Size } from '../styles/tokens';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type FilterType = 'all' | 'income' | 'expense';

export default function TransactionsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { transactions } = useApp();
  const now = new Date();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const filtered = useMemo(() => {
    let list = filterByMonth(transactions, selectedYear, selectedMonth);
    if (filterType === 'income') list = list.filter((t) => t.type === 'income');
    if (filterType === 'expense') list = list.filter((t) => t.type === 'expense');
    return list.sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
  }, [transactions, filterType, selectedYear, selectedMonth]);

  const typeLabel =
    filterType === 'all'
      ? Strings.transactions.allTransactions
      : filterType === 'income'
        ? Strings.transactions.income
        : Strings.transactions.expense;

  const monthLabel = `${MONTH_LABELS[selectedMonth]} ${selectedYear}`;

  const goToAddTransaction = () => {
    const parent = navigation.getParent?.();
    if (parent) (parent as any).navigate?.('AddTransaction');
    else (navigation as any).navigate?.('AddTransaction');
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: colors.neutral.textPrimary }]}>
        {Strings.transactions.emptyTitle}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.neutral.textSecondary }]}>
        {Strings.transactions.emptySubtitle}
      </Text>
      <TouchableOpacity
        style={[primaryButton, styles.addBtn]}
        onPress={goToAddTransaction}
        activeOpacity={0.8}
      >
        <Ionicons name={Icons.action.add as any} size={20} color={Colors.neutral.surface} />
        <Text style={styles.addBtnText}>{Strings.transactions.addTransaction}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeScreenView>
      <View style={[styles.container, screenContainer, { backgroundColor: colors.neutral.bg }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require('../../icons/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.appName, { color: colors.neutral.textPrimary }]}>{Strings.appName}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => {}} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color={colors.neutral.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.title, { color: colors.neutral.textPrimary }]}>{Strings.tabs.Transactions}</Text>

        {/* Filters */}
        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filterBtn, { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.border }]}
            onPress={() => {
              setShowMonthPicker(false);
              setShowTypePicker(!showTypePicker);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, { color: colors.neutral.textPrimary }]} numberOfLines={1}>
              {typeLabel}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.neutral.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.border }]}
            onPress={() => {
              setShowTypePicker(false);
              setShowMonthPicker(!showMonthPicker);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, { color: colors.neutral.textPrimary }]}>{monthLabel}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.neutral.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Type picker dropdown */}
        {showTypePicker && (
          <View style={[styles.pickerDropdown, { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.border }]}>
            {(['all', 'income', 'expense'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.pickerItem, filterType === t && { backgroundColor: colors.neutral.bg }]}
                onPress={() => {
                  setFilterType(t);
                  setShowTypePicker(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    { color: colors.neutral.textPrimary },
                    filterType === t && { color: colors.brand.primary, fontWeight: '600' },
                  ]}
                >
                  {t === 'all'
                    ? Strings.transactions.allTransactions
                    : t === 'income'
                      ? Strings.transactions.income
                      : Strings.transactions.expense}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Month picker (prev/next) */}
        {showMonthPicker && (
          <View style={[styles.monthPicker, { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.border }]}>
            <TouchableOpacity
              onPress={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear((y) => y - 1);
                } else setSelectedMonth((m) => m - 1);
                setShowMonthPicker(false);
              }}
              style={styles.monthPickerBtn}
            >
              <Text style={[styles.monthPickerText, { color: colors.brand.primary }]}>‹ Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear((y) => y + 1);
                } else setSelectedMonth((m) => m + 1);
                const isCurrent = selectedYear === now.getFullYear() && selectedMonth === now.getMonth();
                if (isCurrent) setShowMonthPicker(false);
              }}
              disabled={selectedYear === now.getFullYear() && selectedMonth === now.getMonth()}
              style={styles.monthPickerBtn}
            >
              <Text
                style={[
                  styles.monthPickerText,
                  {
                    color:
                      selectedYear === now.getFullYear() && selectedMonth === now.getMonth()
                        ? colors.neutral.textSecondary
                        : colors.brand.primary,
                  },
                ]}
              >
                Next ›
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {filtered.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionItem
                transaction={item}
                onPress={() => {
                  const parent = navigation.getParent?.();
                  (parent as any)?.navigate?.('EditTransaction', { transactionId: item.id });
                }}
              />
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.bottomSpacer} />
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.brand.primary }, Shadow.fab]}
        onPress={goToAddTransaction}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={28} color={Colors.neutral.surface} />
      </TouchableOpacity>
    </SafeScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Space.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  logo: {
    width: 36,
    height: 36,
  },
  appName: {
    ...Typography.h2,
  },
  bellBtn: {
    padding: Space.xs,
  },
  title: {
    ...Typography.h1,
    marginBottom: Space.lg,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Space.md,
    marginBottom: Space.lg,
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.lg,
    paddingVertical: Space.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  filterText: {
    ...Typography.body,
    flex: 1,
  },
  pickerDropdown: {
    position: 'absolute',
    top: 140,
    left: Space.lg,
    right: Space.lg,
    zIndex: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...(Platform.OS === 'android' ? { elevation: 8 } : {}),
  },
  pickerItem: {
    padding: Space.lg,
  },
  pickerItemText: {
    ...Typography.body,
  },
  monthPicker: {
    position: 'absolute',
    top: 140,
    right: Space.lg,
    zIndex: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    minWidth: 140,
    ...(Platform.OS === 'android' ? { elevation: 8 } : {}),
  },
  monthPickerBtn: {
    padding: Space.lg,
  },
  monthPickerText: {
    ...Typography.body,
  },
  list: { flex: 1 },
  listContent: { paddingBottom: Space.xxl, paddingTop: Space.xs },
  bottomSpacer: { height: 80 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Space.xl,
  },
  emptyTitle: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: Space.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Space.xl,
    lineHeight: 22,
  },
  addBtn: {
    minWidth: 200,
  },
  addBtnText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: Size.fab,
    height: Size.fab,
    borderRadius: Size.fab / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
