import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { Transaction, TransactionInput } from '@/lib/transactionService';
import {
  addTransaction as addTx,
  updateTransaction as updateTx,
  deleteTransaction as deleteTx,
  subscribeTransactions,
} from '@/lib/transactionService';
import { useAuth } from './AuthContext';

type TransactionsState = {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (input: TransactionInput) => Promise<Transaction>;
  updateTransaction: (id: string, input: Partial<TransactionInput>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
};

const TransactionsContext = createContext<TransactionsState | null>(null);

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error('useTransactions must be used within TransactionsProvider');
  }
  return ctx;
}

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeTransactions((list) => {
      setTransactions(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const addTransaction = useCallback(async (input: TransactionInput) => {
    return addTx(input);
  }, []);

  const updateTransaction = useCallback(
    async (id: string, input: Partial<TransactionInput>) => {
      await updateTx(id, input);
    },
    []
  );

  const deleteTransaction = useCallback(async (id: string) => {
    await deleteTx(id);
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
