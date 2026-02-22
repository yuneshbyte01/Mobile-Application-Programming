import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SafeScreenView from '../components/SafeScreenView';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { screenContainer, primaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import TransactionItem from '../components/TransactionItem';
import type { MainStackParamList } from '../navigation/types';
import { Space } from '../styles/tokens';

type Nav = NativeStackNavigationProp<MainStackParamList, 'MainTabs'>;

export default function TransactionsScreen() {
  const navigation = useNavigation<Nav>();
  const { transactions } = useApp();

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{Strings.transactions.emptyTitle}</Text>
      <Text style={styles.emptySubtitle}>{Strings.transactions.emptySubtitle}</Text>
      <TouchableOpacity
        style={[primaryButton, styles.addBtn]}
        onPress={() => navigation.navigate('AddTransaction')}
        activeOpacity={0.8}
      >
        <Text style={styles.addBtnText}>{Strings.transactions.addTransaction}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeScreenView>
      <View style={[styles.container, screenContainer]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{Strings.tabs.Transactions}</Text>
            <Text style={styles.count}>
              {sorted.length} {sorted.length === 1 ? 'transaction' : 'transactions'}
            </Text>
          </View>
          <TouchableOpacity
          style={[primaryButton, styles.addButton]}
            onPress={() => navigation.navigate('AddTransaction')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{Strings.transactions.addTransaction}</Text>
          </TouchableOpacity>
        </View>
        {sorted.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionItem
                transaction={item}
                onPress={() => navigation.navigate('EditTransaction', { transactionId: item.id })}
              />
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
    alignItems: 'flex-end',
    marginBottom: Space.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.neutral.textPrimary,
  },
  count: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginTop: Space.xs,
  },
  addButton: {
    paddingHorizontal: Space.lg,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.neutral.surface,
  },
  list: { flex: 1 },
  listContent: { paddingBottom: Space.xxl, paddingTop: Space.xs },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Space.xl,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.neutral.textPrimary,
    textAlign: 'center',
    marginBottom: Space.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.neutral.textSecondary,
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
});
