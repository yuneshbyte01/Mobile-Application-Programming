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
import { useAuth } from './AuthContext';

type AppContextValue = {
  transactions: Transaction[];
  addTransaction: (data: TransactionInput) => Promise<Transaction>;
  updateTransaction: (id: string, data: Partial<TransactionInput>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      return;
    }
    const unsubscribe = subscribeTransactions(user.uid, setTransactions);
    return unsubscribe;
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

  const value: AppContextValue = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
