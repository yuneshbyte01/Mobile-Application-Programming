import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  BalanceCard,
  SummaryCards,
  PieChart,
  ExpenseToggle,
  SubscriptionList,
  ActionButtons,
} from '../components';
import {
  SUBSCRIPTIONS,
  PIE_DATA,
  TOTAL_BALANCE,
  TOTAL_EXPENSES,
  TOTAL_SUBSCRIPTION_COST,
  RECENT_EXPENSES,
} from '../constants/dummyData';

const Dashboard: React.FC = () => {
  const [showDetailedExpenses, setShowDetailedExpenses] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Budget & Subscription Manager</Text>

          <BalanceCard amount={TOTAL_BALANCE} />

          <SummaryCards
            totalExpenses={TOTAL_EXPENSES}
            totalSubscriptions={TOTAL_SUBSCRIPTION_COST}
          />

          <PieChart data={PIE_DATA} />

          <ExpenseToggle
            showDetails={showDetailedExpenses}
            onToggle={setShowDetailedExpenses}
            expenses={RECENT_EXPENSES}
          />

          <SubscriptionList subscriptions={SUBSCRIPTIONS} />

          <ActionButtons />

          <View style={styles.spacer} />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 20,
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
});

export default Dashboard;
