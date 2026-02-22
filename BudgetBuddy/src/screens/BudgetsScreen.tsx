import React, { useState } from 'react';
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
import { screenContainer, primaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import BudgetItem from '../components/BudgetItem';
import { Space, Shadow, Size } from '../styles/tokens';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function BudgetsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { budgets, transactions } = useApp();
  const now = new Date();

  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const monthLabel = `${MONTH_LABELS[selectedMonth]} ${selectedYear}`;
  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth();

  const goToAddBudget = () => {
    const parent = navigation.getParent?.();
    if (parent) (parent as any).navigate?.('AddBudget');
    else (navigation as any).navigate?.('AddBudget');
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: colors.neutral.textPrimary }]}>
        {Strings.budgets.emptyTitle}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.neutral.textSecondary }]}>
        {Strings.budgets.emptySubtitle}
      </Text>
      <TouchableOpacity
        style={[primaryButton, styles.addBtn]}
        onPress={goToAddBudget}
        activeOpacity={0.8}
      >
        <Ionicons name={Icons.action.add as any} size={20} color={Colors.neutral.surface} />
        <Text style={styles.addBtnText}>{Strings.budgets.addBudget}</Text>
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

        <Text style={[styles.title, { color: colors.neutral.textPrimary }]}>{Strings.tabs.Budgets}</Text>

        {/* Month selector */}
        <TouchableOpacity
          style={[styles.monthSelector, { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.border }]}
          onPress={() => setShowMonthPicker(!showMonthPicker)}
          activeOpacity={0.7}
        >
          <Text style={[styles.monthLabel, { color: colors.neutral.textPrimary }]}>{monthLabel}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.neutral.textSecondary} />
        </TouchableOpacity>

        {/* Month picker dropdown */}
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
                if (!isCurrentMonth) {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear((y) => y + 1);
                  } else setSelectedMonth((m) => m + 1);
                  setShowMonthPicker(false);
                }
              }}
              disabled={isCurrentMonth}
              style={styles.monthPickerBtn}
            >
              <Text
                style={[
                  styles.monthPickerText,
                  { color: isCurrentMonth ? colors.neutral.textSecondary : colors.brand.primary },
                ]}
              >
                Next ›
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {budgets.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={budgets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BudgetItem
                budget={item}
                transactions={transactions}
                year={selectedYear}
                month={selectedMonth}
                onPress={() => {
                  const parent = navigation.getParent?.();
                  (parent as any)?.navigate?.('EditBudget', { budgetId: item.id });
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
        onPress={goToAddBudget}
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
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.lg,
    paddingVertical: Space.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Space.xl,
  },
  monthLabel: {
    ...Typography.body,
  },
  monthPicker: {
    position: 'absolute',
    top: 180,
    left: Space.lg,
    right: Space.lg,
    zIndex: 10,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
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
