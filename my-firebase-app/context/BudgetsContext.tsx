import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { Budget, BudgetInput } from '@/lib/budgetService';
import {
  addBudget as addBg,
  updateBudget as updateBg,
  deleteBudget as deleteBg,
  subscribeBudgets,
} from '@/lib/budgetService';
import { useAuth } from './AuthContext';

type BudgetsState = {
  budgets: Budget[];
  loading: boolean;
  addBudget: (input: BudgetInput) => Promise<Budget>;
  updateBudget: (id: string, input: Partial<BudgetInput>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
};

const BudgetsContext = createContext<BudgetsState | null>(null);

export function useBudgets() {
  const ctx = useContext(BudgetsContext);
  if (!ctx) {
    throw new Error('useBudgets must be used within BudgetsProvider');
  }
  return ctx;
}

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeBudgets((list) => {
      setBudgets(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const addBudget = useCallback(async (input: BudgetInput) => {
    return addBg(input);
  }, []);

  const updateBudget = useCallback(
    async (id: string, input: Partial<BudgetInput>) => {
      await updateBg(id, input);
    },
    []
  );

  const deleteBudget = useCallback(async (id: string) => {
    await deleteBg(id);
  }, []);

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        loading,
        addBudget,
        updateBudget,
        deleteBudget,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
}
