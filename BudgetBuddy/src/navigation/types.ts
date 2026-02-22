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
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
