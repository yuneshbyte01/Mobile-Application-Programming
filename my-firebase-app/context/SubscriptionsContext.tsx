import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type {
  Subscription,
  SubscriptionInput,
} from '@/lib/subscriptionService';
import {
  addSubscription as addSub,
  updateSubscription as updateSub,
  deleteSubscription as deleteSub,
  subscribeSubscriptions,
} from '@/lib/subscriptionService';
import { useAuth } from './AuthContext';

type SubscriptionsState = {
  subscriptions: Subscription[];
  loading: boolean;
  addSubscription: (input: SubscriptionInput) => Promise<Subscription>;
  updateSubscription: (
    id: string,
    input: Partial<SubscriptionInput>
  ) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
};

const SubscriptionsContext = createContext<SubscriptionsState | null>(null);

export function useSubscriptions() {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx) {
    throw new Error('useSubscriptions must be used within SubscriptionsProvider');
  }
  return ctx;
}

export function SubscriptionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeSubscriptions((list) => {
      setSubscriptions(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const addSubscription = useCallback(async (input: SubscriptionInput) => {
    return addSub(input);
  }, []);

  const updateSubscription = useCallback(
    async (id: string, input: Partial<SubscriptionInput>) => {
      await updateSub(id, input);
    },
    []
  );

  const deleteSubscription = useCallback(async (id: string) => {
    await deleteSub(id);
  }, []);

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        loading,
        addSubscription,
        updateSubscription,
        deleteSubscription,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
}
