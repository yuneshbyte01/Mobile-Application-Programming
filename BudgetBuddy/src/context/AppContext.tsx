/**
 * App context: transactions state and actions. Uses auth uid for user-scoped data.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  subscribeTransactions,
  addTransaction as addTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
  type Transaction,
  type TransactionInput,
} from '../services/transactionService';
import {
  subscribeBudgets,
  addBudget as addBudgetService,
  updateBudget as updateBudgetService,
  deleteBudget as deleteBudgetService,
  type Budget,
  type BudgetInput,
} from '../services/budgetService';
import {
  subscribeSubscriptions,
  addSubscription as addSubscriptionService,
  updateSubscription as updateSubscriptionService,
  deleteSubscription as deleteSubscriptionService,
  type Subscription,
  type SubscriptionInput,
} from '../services/subscriptionService';
import { useAuth } from './AuthContext';

type AppContextValue = {
  transactions: Transaction[];
  budgets: Budget[];
  subscriptions: Subscription[];
  addTransaction: (data: TransactionInput) => Promise<Transaction>;
  updateTransaction: (id: string, data: Partial<TransactionInput>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (data: BudgetInput) => Promise<Budget>;
  updateBudget: (id: string, data: Partial<BudgetInput>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addSubscription: (data: SubscriptionInput) => Promise<Subscription>;
  updateSubscription: (id: string, data: Partial<SubscriptionInput>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      setBudgets([]);
      setSubscriptions([]);
      return;
    }
    const unsubTx = subscribeTransactions(user.uid, setTransactions);
    const unsubBudgets = subscribeBudgets(user.uid, setBudgets);
    const unsubSubs = subscribeSubscriptions(user.uid, setSubscriptions);
    return () => {
      unsubTx();
      unsubBudgets();
      unsubSubs();
    };
  }, [user?.uid]);

  const addTransaction = async (data: TransactionInput): Promise<Transaction> => {
    if (!user?.uid) throw new Error('Not logged in');
    return addTransactionService(user.uid, data);
  };

  const updateTransaction = async (id: string, data: Partial<TransactionInput>): Promise<void> => {
    if (!user?.uid) throw new Error('Not logged in');
    return updateTransactionService(user.uid, id, data);
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    if (!user?.uid) throw new Error('Not logged in');
    return deleteTransactionService(user.uid, id);
  };

  const addBudget = async (data: BudgetInput): Promise<Budget> => {
    if (!user?.uid) throw new Error('Not logged in');
    return addBudgetService(user.uid, data);
  };

  const updateBudget = async (id: string, data: Partial<BudgetInput>): Promise<void> => {
    if (!user?.uid) throw new Error('Not logged in');
    return updateBudgetService(user.uid, id, data);
  };

  const deleteBudget = async (id: string): Promise<void> => {
    if (!user?.uid) throw new Error('Not logged in');
    return deleteBudgetService(user.uid, id);
  };

  const addSubscription = async (data: SubscriptionInput): Promise<Subscription> => {
    if (!user?.uid) throw new Error('Not logged in');
    return addSubscriptionService(user.uid, data);
  };

  const updateSubscription = async (
    id: string,
    data: Partial<SubscriptionInput>
  ): Promise<void> => {
    if (!user?.uid) throw new Error('Not logged in');
    return updateSubscriptionService(user.uid, id, data);
  };

  const deleteSubscription = async (id: string): Promise<void> => {
    if (!user?.uid) throw new Error('Not logged in');
    return deleteSubscriptionService(user.uid, id);
  };

  const value: AppContextValue = {
    transactions,
    budgets,
    subscriptions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
