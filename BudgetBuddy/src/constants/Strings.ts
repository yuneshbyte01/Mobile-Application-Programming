/**
 * App strings: route names, tab labels, and common copy
 * Route names use PascalCase per .cursorrules
 */
export const Strings = {
  appName: 'Budget Buddy',

  // Route names (PascalCase)
  routes: {
    GetStarted: 'GetStarted',
    Dashboard: 'Dashboard',
    Transactions: 'Transactions',
    Budgets: 'Budgets',
    Subscriptions: 'Subscriptions',
    Reports: 'Reports',
    Settings: 'Settings',
    AddTransaction: 'AddTransaction',
    EditTransaction: 'EditTransaction',
    AddBudget: 'AddBudget',
    EditBudget: 'EditBudget',
    AddSubscription: 'AddSubscription',
    EditSubscription: 'EditSubscription',
    SignUp: 'SignUp',
    LogIn: 'LogIn',
    ForgotPassword: 'ForgotPassword',
  },

  // Auth copy
  auth: {
    getStartedTitle: 'Welcome to Budget Buddy',
    getStartedSubtitle: 'Track spending, set budgets, and manage subscriptions in one place.',
    signUp: 'Sign Up',
    logIn: 'Log In',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account? Sign up",
    hasAccount: 'Already have an account? Log in',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    resetPasswordTitle: 'Reset Password',
    resetPasswordSubtitle: 'Enter your email and we will send you a link to reset your password.',
    sendResetLink: 'Send Reset Link',
    backToLogIn: 'Back to Log In',
  },

  // Transaction copy
  transactions: {
    emptyTitle: 'No transactions yet',
    emptySubtitle: 'Tap below to add your first transaction.',
    addTransaction: 'Add Transaction',
    amount: 'Amount',
    type: 'Type',
    category: 'Category',
    date: 'Date',
    notes: 'Notes (optional)',
    income: 'Income',
    expense: 'Expense',
    save: 'Save',
  },

  // Dashboard copy
  dashboard: {
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    balance: 'Balance',
  },

  // Tab labels (shown under icons)
  tabs: {
    Dashboard: 'Dashboard',
    Transactions: 'Transactions',
    Budgets: 'Budgets',
    Subscriptions: 'Subscriptions',
    Reports: 'Reports',
    Settings: 'Settings',
  },
} as const;
