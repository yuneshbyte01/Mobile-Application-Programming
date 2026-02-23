# Budget Buddy — Detailed To-Do Roadmap

A phased development plan combining `Project.md`, `visualstyle.json`, and `.cursorrules`.

### Progress Summary
| Phase | Status  | Notes                                              |
|-------|---------|----------------------------------------------------|
| 0     | Partial | Firebase configured; src/ structure pending        |
| 1     | Done    | Auth flow complete: Get Started, Sign Up, Log In, Forgot Password, AuthProvider, auth gate, Log out |
| 2     | Done    | Transactions: list, add/edit, dashboard totals, Transactions tab |
| 3     | Done    | Budgets: list with progress bars, add/edit, Budgets tab |
| 4     | Done    | Subscriptions: list, add/edit, Subscriptions tab |
| 5     | Done    | Reports: category breakdown, monthly trend, date filters |
| 6     | Done    | Settings: currency, dark mode, notifications |
| 7     | Pending | Testing & Polish |

---

## Phase 0: Setup & Foundation

### 0.1 Project Structure
- [ ] Create `src/` folder structure:
  ```
  src/
  ├── screens/
  ├── components/
  ├── context/
  ├── hooks/
  ├── navigation/
  ├── services/
  ├── utils/
  ├── constants/
  ├── styles/
  └── data/
  ```
- [ ] Move/refactor existing `lib/firebase.ts` → `src/services/firebaseService.ts` (or keep lib, ensure services import from it)
- **Files:** Create dirs, `src/constants/Colors.ts`, `src/constants/Strings.ts`

### 0.2 Design Tokens (visualstyle.json)
- [ ] Create `src/constants/Colors.ts` from `tokens.color`:
  - brand: primary `#6C63FF`, secondary `#2EC4B6`, accent `#4D96FF`
  - neutral: bg, surface, textPrimary, textSecondary, border, muted
  - status: success, warning, error, info
  - dark: bg, surface, textPrimary, textSecondary, border
- [ ] Create `src/constants/Typography.ts` from `tokens.typography`:
  - h1 (24/700), h2 (18/600), h3 (16/600), body (14/400), caption (12/400), button (16/600)
- [ ] Create `src/constants/Spacing.ts`: grid 8pt, xs(4), sm(8), md(12), lg(16), xl(24), xxl(32)
- [ ] Create `src/constants/Radius.ts`: sm(8), md(12), lg(16), pill(999)
- [ ] Create `src/constants/Size.ts`: touchMin(44), inputHeight(48), headerHeight(56), fab(56), tabIcon(24)
- **UX:** touch target ≥ 44px, avoid text below 12px

### 0.3 Base Components (componentStyles from visualstyle.json)
- [ ] `PrimaryButton`, `SecondaryButton`, `DangerButton` — use `tokens.size.inputHeight`, `tokens.radius.md`, brand colors
- [ ] `Card` — padding 16, radius lg, surface bg, border, shadow.card
- [ ] `Input` (default + error) — height 48, radius md, border, placeholder styling
- [ ] `Screen` wrapper — padding 16, bg token
- [ ] `Header` — height 56, border-bottom, h2 title style

### 0.4 Navigation Skeleton
- [ ] Bottom Tabs: Dashboard, Transactions, Budgets, Subscriptions, Reports, Settings (labels on, per UI rules)
- [ ] Stack for Add/Edit screens
- [ ] Auth gate: unauthenticated → auth flow only
- **Files:** `src/navigation/AppNavigator.tsx`, `src/navigation/BottomTabNavigator.tsx`, route constants

### 0.5 Firebase Config
- [x] Ensure Firebase Auth + Realtime DB configured
- [x] Realtime DB rules: auth required, user-scoped paths (`users/{uid}/*`)
- **Note:** Using Realtime DB (not Firestore) per current setup.

---

## Phase 1: Auth Flow

### 1.1 Auth Screens
| Screen           | Route            | Fields / Actions                                                                 | Status   |
|------------------|------------------|-----------------------------------------------------------------------------------|----------|
| Get Started      | `/(tabs)` index  | Logo, "Get Started" CTA → Sign Up                                                 | [x] Done |
| Sign Up          | `sign-up`        | name, email, password; Firebase Auth; profile → RTDB; link to Log In              | [x] Done |
| Log In           | `log-in`         | email, password; Firebase Auth; link to Sign Up                                   | [x] Done |
| Forgot Password  | `forgot-password`| email; sendPasswordResetEmail; link back to Log In                                 | [x] Done |

### 1.2 Auth Tasks
- [x] `authService.ts`: signUp, logIn, logOut, resetPassword, getAuthErrorMessage
- [x] `AuthProvider` + `AuthContext` — state: `{ user, loading }`
- [x] Route protection: tab bar hidden when !user; auth screens redirect when user
- [x] Error handling: map Firebase auth errors → friendly messages
- [x] Use visualstyle: primary #6C63FF, input height 48, radius 12, 8pt spacing

### 1.3 Manual Test Checklist
- [x] Sign up → user created, redirect to main app
- [x] Log in → redirect to main app
- [x] Log out → redirect to auth
- [x] Forgot password → email sent
- [x] Invalid credentials → friendly error

---

## Phase 2: Transactions

### 2.1 Data Model (RTDB)
```
users/{uid}/transactions/{transactionId}
  - id, amount, type("income"|"expense"), category, dateISO, notes, isRecurring, createdAt, updatedAt
```

### 2.2 Screens
| Screen              | Route           | Purpose                                                 | Status |
|---------------------|-----------------|---------------------------------------------------------|--------|
| Transactions List  | `(tabs)/transactions` | List transactions; empty state + CTA "Add Transaction" | [x] Done |
| Add Transaction     | `add-transaction`| Form: amount, type, category, date, notes, isRecurring  | [x] Done |
| Edit Transaction    | `edit-transaction`   | Same form, pre-filled; Delete button                   | [x] Done |

### 2.3 Service & Utils
- [x] `transactionService.ts`: `addTransaction`, `updateTransaction`, `deleteTransaction`, `subscribeTransactions` (RTDB onValue)
- [x] `utils/dateUtils.ts`: parse/format dateISO, monthly filters, getCurrentMonthISO
- [x] `utils/formatters.ts`: currency, amount display (single place, per .cursorrules)
- [x] `utils/calculations.ts`: getMonthlyTotals

### 2.4 Components
- [x] `TransactionItem` — row, minHeight 64, divider, per list.row in visualstyle
- [x] Category picker (in add/edit forms)

### 2.5 State
- [x] TransactionsContext: `transactions[]`, `addTransaction`, `updateTransaction`, `deleteTransaction`, `subscribeTransactions`

### 2.6 Dashboard Totals
- [x] Dashboard derives totals from transactions (income - expense)
- [x] Use `utils/` for calculations, not in screen
- [x] Add Transaction button on Dashboard

### 2.7 Manual Test Checklist
- [ ] Add transaction → appears in list and dashboard
- [ ] Edit transaction → list + dashboard update
- [ ] Delete transaction → removed, totals update
- [ ] Empty state shows CTA

---

## Phase 3: Budgets

### 3.1 Data Model
```
users/{uid}/budgets/{budgetId}
  - id, category, monthlyLimit, createdAt, updatedAt
```

### 3.2 Screens
| Screen       | Route        | Purpose                                                   | Status |
|-------------|--------------|-----------------------------------------------------------|--------|
| Budgets List| `(tabs)/budgets` | List budgets with progress bars; empty state + CTA   | [x] Done |
| Add Budget  | `add-budget` | category, monthlyLimit                                    | [x] Done |
| Edit Budget | `edit-budget`| Same, pre-filled; Delete button                           | [x] Done |

### 3.3 Logic
- [x] Budget progress = monthly expense for category / monthlyLimit
- [x] Use `utils/calculations.ts` getCategoryExpenseForMonth, getCurrentMonthISO
- [x] Progress bar: height 10, radius pill, track #E8EAF0, fill #2EC4B6, thresholds warning 85%, error 100%

### 3.4 Components
- [x] `BudgetProgressBar` — per visualstyle.progress.budgetBar

### 3.5 Service & State
- [x] `budgetService.ts`: addBudget, updateBudget, deleteBudget, subscribeBudgets
- [x] BudgetsContext: `budgets[]`, addBudget, updateBudget, deleteBudget

### 3.6 Manual Test Checklist
- [ ] Add budget → appears with 0% progress
- [ ] Add expense in same category → progress updates
- [ ] Edit/delete budget → list updates

---

## Phase 4: Subscriptions

### 4.1 Data Model
```
users/{uid}/subscriptions/{subscriptionId}
  - id, name, price, billingDateISO, cycle("monthly"|"yearly"), isActive, createdAt, updatedAt
```

### 4.2 Screens
| Screen               | Route              | Purpose                              | Status |
|----------------------|--------------------|--------------------------------------|--------|
| Subscriptions List   | `(tabs)/subscriptions` | List; empty state + CTA         | [x] Done |
| Add Subscription     | `add-subscription` | name, price, billingDateISO, cycle, isActive | [x] Done |
| Edit Subscription    | `edit-subscription`| Same, pre-filled; Delete button      | [x] Done |

### 4.3 Service & State
- [x] `subscriptionService.ts`: addSubscription, updateSubscription, deleteSubscription, subscribeSubscriptions
- [x] SubscriptionsContext: `subscriptions[]`, add/update/delete

### 4.4 Components
- [x] `SubscriptionItem` — show name, price (/mo or /yr), billing date, isActive badge

### 4.5 Manual Test Checklist
- [ ] Add subscription → appears in list
- [ ] Edit/delete → updates

---

## Phase 5: Reports

### 5.1 Screens
| Screen  | Route           | Purpose                                                     | Status |
|---------|-----------------|-------------------------------------------------------------|--------|
| Reports | `(tabs)/reports`| Category breakdown + monthly trend; time range filter      | [x] Done |

### 5.2 Logic
- [x] Time range filter: Last 3/6/12 months
- [x] Category breakdown (horizontal bars) from expenses this month
- [x] Monthly trend (income vs expense bars) over time

### 5.3 Libraries
- [x] Custom View-based charts (no external dependency)

### 5.4 Utils
- [x] `getCategoryBreakdown(transactions, monthISO)` — category sums
- [x] `getMonthlyTrend(transactions, monthsBack)` — monthly aggregates

### 5.5 Manual Test Checklist
- [ ] Charts render with real data
- [ ] Time range filter changes data

---

## Phase 6: Settings

### 6.1 Data Model
```
users/{uid}/settings/profile
  - currency, darkMode, notificationsEnabled, updatedAt
```

### 6.2 Screens
| Screen  | Route           | Purpose                                                | Status |
|---------|-----------------|--------------------------------------------------------|--------|
| Settings| `(tabs)/settings` | Currency picker, dark mode toggle, notifications toggle | [x] Done |

### 6.3 Service & State
- [x] `settingsService.ts`: getSettings, updateSettings, subscribeSettings
- [x] SettingsContext: `settings{}`, `updateSettings`
- [x] Theme: ThemeWrapper uses settings.darkMode for DarkTheme/DefaultTheme

### 6.4 Components
- [x] Switch for dark mode and notifications
- [x] Currency selector (USD, EUR, GBP, NPR, INR, JPY)

### 6.5 Optional
- [ ] Data export (later)

### 6.6 Manual Test Checklist
- [ ] Change currency → reflected in amounts
- [ ] Dark mode toggle → theme switches
- [ ] Notifications toggle → persists

---

## Phase 7: Testing & Polish

### 7.1 Testing
- [ ] Mock `authService`, `transactionService`, etc. in tests
- [ ] Critical flow: Add transaction → list updates → dashboard totals update
- [ ] Jest + React Native Testing Library

### 7.2 UI Polish
- [ ] All screens use visualstyle tokens
- [ ] Empty states + CTA everywhere
- [ ] Touch targets ≥ 44px
- [ ] Contrast check (light + dark)

### 7.3 Performance
- [ ] Limit/date-range queries for reports
- [ ] Avoid unnecessary listeners
- [ ] Review bundle size

---

## Quick Reference

### Design Tokens
| Token  | Values                                              |
|--------|-----------------------------------------------------|
| Spacing| 8pt grid; xs4, sm8, md12, lg16, xl24, xxl32        |
| Radius | sm8, md12, lg16, pill999                            |
| Primary| #6C63FF                                             |
| Secondary| #2EC4B6                                          |

### Naming
- Components: PascalCase
- Files: PascalCase (components), camelCase (utils/services)
- Services: `*Service.ts`
- Context: `*Provider.tsx`, `*Context.ts`

### Critical Flow
1. Auth → main app
2. Add transaction → list + dashboard
3. Add budget → progress from expenses
4. Settings → currency, theme

---

*Generated from Project.md, visualstyle.json, .cursorrules*
