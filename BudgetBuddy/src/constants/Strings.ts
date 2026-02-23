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
    getStarted: 'Get Started',
    signUp: 'Sign Up',
    logIn: 'Log In',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account? ",
    noAccountLink: 'Sign Up',
    hasAccount: 'Already have an account? ',
    hasAccountLink: 'Log In',
    name: 'Name',
    fullName: 'Full Name',
    email: 'Email',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createAccount: 'Create Account',
    resetPasswordTitle: 'Reset Password',
    resetPasswordSubtitle: 'Enter your email and we will send you a link to reset your password.',
    sendResetLink: 'Send Reset Link',
    backToLogIn: 'Back to Log In',
  },

  // Transaction copy
  transactions: {
    allTransactions: 'All Transactions',
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

  // Budget copy
  budgets: {
    emptyTitle: 'No budgets yet',
    emptySubtitle: 'Set a monthly limit per category to track your spending.',
    addBudget: 'Add Budget',
    monthlyLimit: 'Monthly Limit',
    monthlyLimitLabel: 'Monthly limit',
    spentLabel: 'Spent',
    category: 'Category',
    save: 'Save',
  },

  // Subscription copy
  subscriptions: {
    emptyTitle: 'No subscriptions yet',
    emptySubtitle: 'Track your recurring bills and subscriptions.',
    addSubscription: 'Add Subscription',
    name: 'Name',
    price: 'Price',
    billingDate: 'Billing Date',
    cycle: 'Cycle',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save: 'Save',
    nextBilling: 'Next billing',
    spentLabel: 'Spent',
  },

  // Reports copy
  reports: {
    categoryBreakdown: 'Category Breakdown',
    monthlyTrend: 'Monthly Trend',
    selectMonth: 'Month',
    selectYear: 'Year',
    noData: 'No data for this period',
    income: 'Income',
    expense: 'Expense',
    balance: 'Balance',
    lastMonths: 'Last {{count}} months',
  },

  // Settings copy
  settings: {
    currency: 'Currency',
    theme: 'Theme',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    notifications: 'Notifications',
    logOut: 'Log Out',
    myProfile: 'My Profile',
    manageSubscriptions: 'Manage Subscriptions',
    categories: 'Categories',
  },

  // Dashboard copy
  dashboard: {
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    balance: 'Balance',
    totalBalance: 'Total Balance',
    monthlyBudget: 'Monthly Budget',
    savings: 'Savings',
    budgetUsage: 'Budget Usage',
    subscriptionsThisMonth: 'Subscriptions this month',
    viewAll: 'View All',
    recentTransactions: 'Recent Transactions',
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    nextBilling: 'Next billing',
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
