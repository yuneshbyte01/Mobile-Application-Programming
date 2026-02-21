/**
 * App strings: route names, tab labels, and common copy
 * Route names use PascalCase per .cursorrules
 */
export const Strings = {
  appName: 'Budget Buddy',

  // Route names (PascalCase)
  routes: {
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
