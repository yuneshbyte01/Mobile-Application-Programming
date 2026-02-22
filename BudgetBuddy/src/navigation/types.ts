export type AuthStackParamList = {
  GetStarted: undefined;
  SignUp: undefined;
  LogIn: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  AddTransaction: undefined;
  EditTransaction: { transactionId: string };
  AddBudget: undefined;
  EditBudget: { budgetId: string };
  AddSubscription: undefined;
  EditSubscription: { subscriptionId: string };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
