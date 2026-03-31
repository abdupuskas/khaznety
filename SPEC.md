# Khaznety — Technical Specification (Current State)

> This document describes the app **as it exists in the codebase today**. It is generated from reading the actual source files and supersedes any forward-looking notes in CLAUDE.md.
>
> Last updated: 2026-03-28

---

## App Identity

| Property | Value |
|----------|-------|
| App name | vault |
| Bundle ID (iOS) | com.abdupuskas.vault |
| Package (Android) | com.abdupuskas.vault |
| Version | 1.0.0 |
| URL scheme | `vault://` |
| Orientation | Portrait only |
| Interface style | Light only |
| Splash background | `#F0EEE9` |
| Min iOS | 16.0 |
| Min Android | API 26 (Android 8.0) |

---

## Repository Layout

```
/Users/abdallah/Vault/
├── CLAUDE.md           # Project spec + implementation reference
├── SPEC.md             # This file — current-state technical spec
└── vault/              # All app code lives here
    ├── app/            # Expo Router screens
    ├── components/     # React Native components
    ├── constants/      # Design tokens, categories, banks, subscriptions
    ├── hooks/          # Custom React Query / utility hooks
    ├── lib/            # Core utilities and engines
    ├── locales/        # en.json, ar.json (i18n translations)
    ├── plugins/        # Custom Expo config plugins
    ├── redux/          # Redux Toolkit store (onboarding only)
    ├── stores/         # Zustand stores
    ├── supabase/       # migrations.sql + edge functions
    ├── app.json        # Expo configuration
    ├── babel.config.js
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## Tech Stack

| Layer | Library | Version |
|-------|---------|---------|
| Framework | Expo | ~55.0.8 |
| Runtime | React Native | 0.83.2 |
| Language | TypeScript | ~5.9.2 |
| Navigation | expo-router | ~55.0.7 |
| Backend | @supabase/supabase-js | ^2.99.3 |
| Server state | @tanstack/react-query | ^5.91.3 |
| Global state | zustand | ^5.0.12 |
| Onboarding state | @reduxjs/toolkit | ^2.11.2 |
| Styling | nativewind + tailwindcss | ^4.2.3 / ^3.4.19 |
| Animation | react-native-reanimated | 4.2.1 |
| Gestures | react-native-gesture-handler | ~2.30.0 |
| Bottom sheets | @gorhom/bottom-sheet | ^5.2.8 |
| Icons | lucide-react-native | ^0.577.0 |
| Charts | victory-native + @shopify/react-native-skia | ^41.20.2 / 2.4.18 |
| Forms | react-hook-form + zod + @hookform/resolvers | ^7.71.2 / ^4.3.6 |
| Subscriptions | react-native-purchases | ^9.14.0 |
| Paywall UI | react-native-purchases-ui | ^9.14.0 |
| Notifications | expo-notifications | ~55.0.13 |
| Voice input | expo-speech-recognition | ^3.1.2 |
| Blur effect | expo-blur | ~55.0.10 |
| Localization | expo-localization + i18n-js | ~55.0.9 / ^4.5.3 |
| Fonts | @expo-google-fonts/cairo | ^0.4.2 |
| Secure storage | expo-secure-store | ~55.0.9 |
| Async storage | @react-native-async-storage/async-storage | 2.2.0 |
| Clipboard | expo-clipboard | ~55.0.9 |
| File system | expo-file-system | ~55.0.11 |
| Export | expo-print + expo-sharing | ~55.0.9 / ~55.0.14 |
| Date picker | @react-native-community/datetimepicker | 8.6.0 |
| SVG | react-native-svg | 15.15.3 |

---

## Navigation Map

All routes are file-based via Expo Router. The root layout (`app/_layout.tsx`) wraps everything in `GestureHandlerRootView`, `SafeAreaProvider`, `ReduxProvider`, and `QueryClientProvider`.

### Auth routes (`app/(auth)/`)

| File | Purpose |
|------|---------|
| `sign-in.tsx` | Email + password sign in; link to forgot-password and sign-up |
| `forgot-password.tsx` | Password reset via Supabase |

### Tab routes (`app/(tabs)/`)

| File | Purpose |
|------|---------|
| `index.tsx` | Home — hero balance, account switcher, quick actions, budgets, recent transactions, goals strip |
| `budget.tsx` | Budget — month selector, summary ring, segment tabs (Budgets / Goals / Rollovers) |
| `trends.tsx` | Trends — period selector, bar chart, category breakdown, top merchants, spending patterns |
| `subscriptions.tsx` | Subscriptions — summary cards, renewal calendar, active/paused lists |
| `settings.tsx` | Settings — profile, pro banner, budget/automation/app/account sections, referral panel |

### Stack routes

| File | Purpose |
|------|---------|
| `notifications.tsx` | In-app notification center (all types, mark-read, tap-to-navigate) |
| `paywall.tsx` | RevenueCat paywall modal (full-screen) |
| `accounts/add.tsx` | Add a new account (bank / cash / credit / wallet / savings) |
| `budget/add-goal.tsx` | Create a new savings goal |
| `budget/add-category.tsx` | Add a new main category |
| `budget/add-subcategory.tsx` | Add a new sub-category |
| `budget/set-budget.tsx` | Set monthly budget amounts per sub-category |
| `budget/goal/[id].tsx` | Goal detail — progress, contribution history, add funds |
| `transaction/[id].tsx` | Transaction detail — view/edit category, merchant, note |
| `transactions/index.tsx` | Full transaction list with filters |
| `subscriptions/add.tsx` | Subscription catalogue browser (60+ apps) + custom entry |
| `subscriptions/[id].tsx` | Edit existing subscription |
| `trends/[category].tsx` | Per-category spending drill-down |
| `settings/edit-profile.tsx` | Edit name, email |
| `settings/monthly-income.tsx` | Set monthly income amount |
| `settings/allocation.tsx` | Budget allocation template (% per category) |
| `settings/budget-reset-day.tsx` | Day-of-month income/reset day (1–31) |
| `settings/shortcut-setup.tsx` | iOS Shortcuts + SMS setup guide |
| `settings/merchant-categories.tsx` | SMS auto-categorization rules |
| `settings/currency.tsx` | Display currency selector |
| `settings/notifications.tsx` | Per-type notification toggles |
| `settings/about.tsx` | App info, privacy policy, contact |
| `settings/export.tsx` | Export transactions as CSV or PDF |
| `onboarding/welcome.tsx` | Step 1 — language toggle, logo, demo cards, CTA |
| `onboarding/name.tsx` | Step 2 — first name input |
| `onboarding/income.tsx` | Step 3 — monthly income amount |
| `onboarding/income-date.tsx` | Step 4 — salary arrival day (grid 1–31) |
| `onboarding/allocation.tsx` | Step 5 — % sliders per category |
| `onboarding/shortcut-setup.tsx` | Step 6 — unified shortcuts guide |
| `onboarding/complete.tsx` | Step 7 — celebration + summary + Go to Khaznety CTA |

---

## State Management

### Zustand Stores (`stores/`)

#### `auth.store.ts`
```ts
type AuthStore = {
  session: Session | null
  user: User | null
  loading: boolean
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
}
```
Used by `useAuth` hook for session lifecycle and route redirects.

#### `ui.store.ts`
```ts
type UIStore = {
  // Transaction sheet
  activeTransactionType: 'expense' | 'income' | 'transfer' | null
  isAddTransactionOpen: boolean
  openAddTransaction: (type) => void
  closeAddTransaction: () => void
  // Locale
  locale: 'en' | 'ar'
  setLocale: (locale) => void
  // Currency
  displayCurrency: string  // default 'EGP'
  setDisplayCurrency: (currency) => void
  // Exchange rates
  exchangeRates: Record<string, number> | null
  setExchangeRates: (rates) => void
}
```
Persists `locale` and `displayCurrency` to `AsyncStorage` (`vault-ui-preferences`).

#### `notifications.store.ts`
```ts
type NotificationsStore = {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clearAll: () => void
}
```
In-memory only. Push notifications arrive via Expo and are added here.

### Redux Store (`redux/`)

#### `onboardingSlice`
```ts
type OnboardingState = {
  step: 'welcome' | 'name' | 'income' | 'income-date' | 'shortcut-setup' | 'complete'
  firstName: string
  incomeAmount: number       // piastres
  incomeDate: number         // 1–31
  allocations: AllocationItem[]
  shortcutSkipped: boolean
}
```
Actions: `setStep`, `nextStep`, `prevStep`, `setFirstName`, `setIncomeAmount`, `setIncomeDate`, `setAllocations`, `setShortcutSkipped`, `resetOnboarding`.

Committed to Supabase only on the `complete` step — all prior steps are ephemeral Redux state.

### React Query

All server data uses React Query with these cache settings (configured in `app/_layout.tsx`):
- `staleTime`: 30 seconds
- `gcTime`: 10 minutes
- `retry`: 2 (mutations: 1)
- `retryDelay`: exponential backoff (max 10s)

---

## Database Schema

All amounts stored as **bigint piastres** (integers). Divide by 100 to display in EGP.
All tables have RLS enabled. All RLS policies use `(select auth.uid())` for performance (cached per query, not per row).

### Table Overview

| # | Table | Purpose |
|---|-------|---------|
| 1 | `users` | User profile (mirrors `auth.users`) |
| 2 | `user_settings` | Onboarding + preferences + notification toggles |
| 3 | `main_categories` | Top-level budget categories |
| 4 | `sub_categories` | Budget line items with rollover config |
| 5 | `accounts` | Bank / cash / credit / wallet / savings accounts |
| 6 | `transactions` | Individual debit/credit transactions |
| 7 | `monthly_budgets` | Budget vs spent tracking per sub-category per month |
| 8 | `income_events` | Income received history |
| 9 | `allocation_templates` | Budget allocation presets |
| 10 | `allocation_items` | Per-category amounts within a template |
| 11 | `subscriptions_tracked` | Recurring subscription tracker |
| 12 | `sms_rules` | User-defined SMS → category mapping rules |
| 13 | `user_subscriptions` | RevenueCat entitlement sync (webhook target) |
| 14 | `goals` | Savings goals linked to sub-categories |
| 15 | `goal_transactions` | Goal contribution / withdrawal history |
| 16 | `notifications` | Persistent in-app notifications |

### Key Column Notes

**`users`**
- `locale` — `'ar'` default
- `currency` — `'EGP'` default
- `push_token` — Expo push token (added migration 014)
- `referral_code` — unique, generated on signup (migration 023)
- `referred_by` — FK to `users.id` (migration 023)

**`user_settings`**
- `income_amount` — piastres
- `income_date` — 1–31
- `rollover_default_behavior` — `keep | savings | goal | redistribute | reset`
- `budget_total` — total across all allocated categories (migration 021)
- `notify_*` — per-type notification preferences (migration 025)

**`sub_categories`**
- `rollover_behavior` — per-category override of default rollover behavior
- `carry_forward_deficit` — if true, overspend is deducted from next month's budget (migration 022)

**`accounts`**
- `type` — `bank | cash | credit | wallet | savings`
- `starting_balance` — initial balance at account creation (migration 017)
- `metadata` — jsonb for extra bank-specific info (migration 017)

**`transactions`**
- `amount` — always positive piastres; use `type` for direction
- `type` — `debit | credit` (migration 015)
- `source` — `manual | apple_pay | sms | voice | transfer`
- `idempotency_key` — unique; prevents duplicate SMS imports

**`monthly_budgets`**
- `total_available` — generated column: `base_allocation + rollover_amount`
- `rollover_parked` — mid-month parked rollover not yet applied (migration 016)
- `month` — format `'YYYY-MM'`

**`goals`**
- `current_amount` — updated when goal_transactions are inserted

**`goal_transactions`**
- `type` — `contribution | withdrawal`
- `source_type` — `account | savings | rollover | manual`

**`notifications`**
- `type` — `info | budget_warning | subscription_renewal | goal_milestone | budget_applied | weekly_summary`

---

## Migrations Summary

All 25 migrations live in `vault/supabase/migrations.sql`. Run in order via Supabase MCP.

| # | Migration | Key change |
|---|-----------|------------|
| 001 | users | Base user profile table |
| 002 | user_settings | Income, rollover behavior, income date |
| 003 | main_categories | Top-level categories with icon/color/sort |
| 004 | sub_categories | Budget line items with rollover config |
| 005 | accounts | Bank/cash/credit/wallet accounts |
| 006 | transactions | Core transaction table with idempotency |
| 007 | monthly_budgets | Budget tracking per sub-cat per month, generated `total_available` |
| 008 | income_events | Income history |
| 009 | allocation_templates + allocation_items | Budget allocation presets |
| 010 | subscriptions_tracked | Recurring subscriptions |
| 011 | sms_rules | User-defined SMS categorization rules |
| 012 | user_subscriptions | RevenueCat webhook sync |
| 013 | goals | Savings goals |
| 014 | push_token | `push_token` column on `users` |
| 015 | transactions.type | Add `type` column (debit/credit) |
| 016 | rollover_parked | Add `rollover_parked` to `monthly_budgets` |
| 017 | accounts enhancements | `starting_balance` + `metadata` jsonb |
| 018 | accounts.type | Add `savings` to type constraint |
| 019 | transactions.source | Add `transfer` to source constraint |
| 020 | goal_transactions | Contribution/withdrawal history for goals |
| 021 | budget_total | `budget_total` on `user_settings` |
| 022 | carry_forward_deficit | `carry_forward_deficit` on `sub_categories` |
| 023 | referral | `referral_code` + `referred_by` on `users` |
| 024 | notifications | Persistent notification table |
| 025 | notification preferences | Per-type toggles on `user_settings` |

---

## API Layer — Custom Hooks (`hooks/`)

All hooks use React Query. Cache keys are listed where significant.

| Hook | Cache key | Returns |
|------|-----------|---------|
| `useAuth()` | — | Manages auth state, redirects based on onboarding completion |
| `useAuthStore()` | — | Zustand selector: `{ session, user, loading }` |
| `useAccounts()` | `['accounts', userId]` | `Account[]` ordered by created_at |
| `useCategories()` | `['categories', userId]` | `MainCategory[]` each with `sub_categories[]` |
| `useGoals()` | `['goals', userId]` | `Goal[]` active + complete |
| `useGoalTransactions(goalId)` | `['goal_transactions', goalId]` | `GoalTransaction[]` |
| `useIsPro()` | — | `{ isPro: boolean, loading, refresh() }` via RevenueCat |
| `useMonthlyBudgets(month?)` | `['monthly_budgets', userId, month]` | Budget rows with live spent calculation + currency conversion |
| `useNotifications()` | `['notifications', userId]` | `Notification[]` sorted by created_at desc |
| `usePushNotifications()` | — | Registers Expo push token, saves to `users.push_token` |
| `useSmsRules()` | `['sms_rules', userId]` | `SmsRule[]` + mutation to add/delete |
| `useSubscriptions()` | `['subscriptions', userId]` | `Subscription[]` active + paused |
| `useTransactions(monthKey?)` | `['transactions', userId, monthKey]` | `Transaction[]` with category joins |
| `useTransaction(id)` | `['transaction', id]` | Single `Transaction` |
| `useUpdateTransaction()` | — | Mutation: update category, merchant, note, amount |
| `useUserProfile()` | `['user_profile', userId]` | `{ user, settings }` |
| `useCurrency()` | — | `formatPiastres(amount, currency?) → string` |
| `useTranslation()` | — | `{ t(key, opts?), locale }` |
| `useFonts()` | — | `{ loaded: boolean }` for Cairo font |

---

## Lib / Utilities (`lib/`)

### `supabase.ts`
- Client initialized with `ExpoSecureStoreAdapter` (Keychain on iOS, EncryptedSharedPreferences on Android)
- Falls back to `localStorage` on web
- Auto token refresh + session persistence enabled

### `revenuecat.ts`
- Entitlement ID: **`"Khaznety Pro"`**
- Key exports: `initRevenueCat(userId?)`, `checkIsPro()`, `purchasePackage(pkg)`, `restorePurchases()`, `getOfferings()`, `onCustomerInfoUpdate(cb)`, `identifyUser(userId)`, `getManagementURL()`, `logOutRevenueCat()`
- SDK initialized in `app/_layout.tsx` `AuthGate` component; user identified after auth

### `currency.ts`
- Supported currencies: `EGP, USD, EUR, SAR, KWD, AED, QAR, BHD`
- Dual API fallback: `exchangerate.host` → `open.er-api.com`
- 24-hour cache: AsyncStorage (`vault-exchange-rates`) + in-memory
- Fallback rates hardcoded (March 2026 approximate)
- Key exports: `getExchangeRates()`, `convertFromEGP(piastres, toCurrency, rates)`, `formatPiastresToCurrency(piastres, currency, rates)`
- All internal amounts are piastres (bigint); display layer divides by 100

### `sms-parser.ts`
- Supported banks: CIB, ABK-Egypt, NBE, Banque Misr, QNB, HSBC Egypt, Alex Bank, AAIB, Fawry, Vodafone Cash, InstaPay, Orange Money
- Extracts: `amount` (piastres), `type` (debit/credit), `currency`, `merchant`, `accountLast4`, `balance`, `transactionDate`
- Arabic digit normalization (٠١٢٣٤٥٦٧٨٩ → 0123456789) + Arabic numeral separators
- Date format support: `DD/MM/YY` (Egyptian) and `M/D/YY` (ABK-style)
- Returns `ParsedTransaction | null`

### `sms-categorizer.ts`
- 4-tier confidence pipeline:
  1. **User SMS rules** (`sms_rules` table) — highest confidence
  2. **Merchant history** — learns from past categorizations
  3. **Keyword heuristics** — 170+ patterns (grocery, restaurants, gas, etc.)
  4. **Type fallback** — debit → "Uncategorized", credit → "Other Income"
- Returns `{ subCategoryId, confidence: 'high' | 'medium' | 'low' | 'none' }`

### `sms-processor.ts`
Main orchestration function: `processSMSMessage(userId, sender, body) → Promise<ProcessSMSResult>`

Flow:
1. Parse SMS via `parseSMS()`
2. Generate idempotency key (bank + amount + date + accountLast4 + balance + merchant hash)
3. Check for existing transaction with same idempotency key
4. Categorize via `categorizeSMS()`
5. Resolve account by `last_4`
6. Insert transaction (`source = 'sms'`)
7. Upsert `monthly_budgets.spent` (converts foreign currency to EGP)
8. Update `accounts.balance` if balance was parsed from SMS
9. Return `{ success, transactionId, confidence, isNew }`

**Important:** Raw SMS body is never stored in the database. Only parsed fields are persisted.

### `budget-engine.ts`
- `calculateRollovers(userId, month)` — groups unspent budget by main category from previous month
- Respects `rollover_enabled` and `carry_forward_deficit` flags per sub-category
- Handles month boundary edge cases (e.g., day 31 in a 30-day month)
- Returns `CategoryRolloverResult[]`

### `voice-parser.ts`
- `parseVoiceInput(text: string) → VoiceParsedTransaction`
- Extracts `amount` from spoken text (Western + Arabic numerals, formatted numbers like "1,250.50")
- Extracts `merchant` from directional keywords: "at", "في", "from", "من", "to", "لـ"
- Returns `{ amount: number, merchant: string | null, note: string | null, rawText: string }`

### `export.ts`
- Fetches transactions + budgets + goals + subscriptions for date range
- Date ranges: `this_month | last_3 | this_year | all_time`
- Converts all amounts to user's display currency
- Formats: **CSV** (downloadable file) and **PDF** (printable via `expo-print`)
- Shares via `expo-sharing`

### `i18n.ts`
- Initializes i18n-js with `en.json` and `ar.json`
- Auto-detects device locale on first run; defaults to `'ar'` for Egyptian market
- Exports: `t(key, options?)`, `setLocale(locale)`, `getLocale()`

---

## Constants (`constants/`)

### `tokens.ts`

```ts
colors = {
  pageBg: '#F0EEE9',           // outermost background
  surfacePrimary: '#FAFAF8',   // cards, modals, sheets
  surfaceSecondary: '#EEECE7', // input fields, icon backgrounds
  surfaceTertiary: '#E4DDD2',  // dividers, pressed states
  borderLight: '#E4DDD2',
  borderMedium: '#D8D4CC',
  textPrimary: '#1A1A1A',
  textSecondary: '#5C5850',
  textMuted: '#9C9485',
  accent: '#1A7A52',           // emerald — buttons, active tab, links
  accentDark: '#0D3D28',       // deep green — sign-in header, dark backgrounds
  accentLight: '#EAF4EE',
  accentBorder: '#B6DEC8',
  danger: '#C0392B',
  dangerLight: '#FEE2E2',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  success: '#1A7A52',          // same as accent
  successLight: '#EAF4EE',
}

radii = { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 }
spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 }
fontSizes = { xs: 10, sm: 11, base: 12, md: 13, lg: 15, xl: 18, xxl: 24, hero: 30 }
PILL_CLEARANCE = 80  // use as: paddingBottom = PILL_CLEARANCE + insets.bottom
```

### `categories.ts`

13 default main categories with emoji icons and hex colors:

| # | Name | Icon | Notable sub-categories |
|---|------|------|------------------------|
| 1 | Living Expenses | 🏠 | Groceries, Going Out, Gas, Subscriptions, Utilities, Household, Rent, Personal Care, Clothing |
| 2 | Installments | 📋 | Car, Phone, Mortgage, Appliances, Other |
| 3 | Travel | ✈️ | Flights, Hotels, Activities, Transport, Insurance |
| 4 | Investments | 📈 | Brokerage, Stocks, Crypto, Real Estate, Mutual Funds |
| 5 | Health | 💊 | Pharmacy, Doctor, Gym, Insurance, Dental, Mental Health |
| 6 | Education | 📚 | Courses, Books, School Fees, Tutoring, Supplies |
| 7 | Entertainment | 🎭 | Streaming, Gaming, Events, Hobbies |
| 8 | Dining | 🍽️ | Restaurants, Cafes, Fast Food, Delivery |
| 9 | Shopping | 🛍️ | Electronics, Fashion, Home & Garden, Gifts |
| 10 | Kids | 👶 | School, Activities, Clothing, Toys |
| 11 | Pets | 🐾 | Food, Vet, Grooming |
| 12 | Income | 💰 | Salary, Freelance, Investment Returns, Transfers Received, Other Income |
| 13 | Other | 📦 | Uncategorized |

### `banks.ts`

12 Egyptian banks and mobile wallets with:
- `senders` — SMS sender IDs for fast lookup
- `languages` — `['ar', 'en']` or subset
- `dateFormat` — e.g., `'DD/MM/YY'`
- `defaultAccountType` — `'bank'` or `'wallet'`

Banks: CIB, ABK-Egypt, NBE, Banque Misr, QNB Al Ahli, HSBC Egypt, Alex Bank, AAIB, Fawry, Vodafone Cash, InstaPay, Orange Money

`SMS_SENDER_MAP`: `Record<string, string>` — maps raw sender strings to bank IDs.

`MERCHANT_KEYWORDS`: 170+ regex patterns for automatic categorization (grocery stores, restaurants, pharmacies, gas stations, telecom, streaming, etc.).

### `subscriptions.ts`

60+ pre-configured subscription apps in 12 sections:

| Section | Apps (examples) |
|---------|----------------|
| Streaming | Netflix, Shahid, OSN+, Apple TV+, Disney+, YouTube Premium, StarzPlay, Crunchyroll |
| Music | Spotify, Apple Music, YouTube Music, Anghami, Tidal, Deezer |
| Productivity | ChatGPT Plus, Notion, Adobe CC, Microsoft 365, Slack, Zoom, Figma, 1Password, Canva |
| AI Tools | Claude Pro, Gemini Advanced, GitHub Copilot, Perplexity, Cursor, Midjourney, Grok |
| Cloud Storage | iCloud+, Google One, Dropbox, OneDrive |
| Gaming | PS Plus, Xbox Game Pass, Apple Arcade |
| Health & Wellness | Calm, Headspace, MyFitnessPal |
| Reading & News | Medium, Kindle Unlimited |
| VPN & Security | NordVPN, ExpressVPN |
| Telecom | Vodafone EG, Orange EG, Etisalat EG, WE Egypt |
| Egyptian Services | Anghami, Watch iT, TOD TV, Elmenus Plus, Talabat Pro, Swvl, Careem Plus, Uber One |
| Fitness & Gym | GymNation, Gold's Gym, Strava |

Each app has: `id`, `name`, `domain`, `bg` (brand color hex), `amount` (piastres), `currency`.

---

## Feature Implementations

### Transaction Ingestion

**SMS Flow** (`lib/sms-processor.ts`):
1. Deep link `vault://sms-import?sender=X&body=Y` received by `DeepLinkHandler` in root layout
2. Rate-limited to 1 per 3 seconds; body validated (max 500 chars)
3. `processSMSMessage(userId, sender, body)` called
4. SMS parsed → categorized → idempotency check → insert → budget update → balance update
5. React Query cache invalidated: `transactions`, `monthly_budgets`, `accounts`

**Voice Flow** (`lib/voice-parser.ts` + `expo-speech-recognition`):
1. User taps mic in `AddTransactionSheet` Expense tab
2. `expo-speech-recognition` captures utterance
3. `parseVoiceInput(text)` extracts amount + merchant
4. Sheet pre-fills fields; user confirms and saves

**Manual Flow** (`components/transactions/AddTransactionSheet.tsx`):
- Bottom sheet with 3 tabs: Expense / Income / Transfer
- Opened via `ui.store.openAddTransaction(type)` from Home screen quick-action buttons
- Category picker: 2-level accordion (main → sub)
- Amount input: large numeric display with currency prefix
- On save: inserts transaction, upserts `monthly_budgets.spent`, updates `accounts.balance`

**Transfer Flow**:
- Creates two transactions: debit on source account, credit on destination
- Both transactions linked with shared note; `source = 'transfer'`

### Budget Engine

**Monthly Budgets**:
- Each `sub_category` has a `monthly_budget` (base allocation)
- `monthly_budgets` rows are upserted for each month
- `total_available = base_allocation + rollover_amount` (generated column)
- `spent` is live-calculated from transactions (not stored — overridden at read time)

**Rollover**:
- At month end, for each sub-category with `rollover_enabled = true`:
  - `rollover = base_allocation − spent`
  - If positive, added to next month's `rollover_amount` per `rollover_behavior`
- Rollover behaviors: `keep` (default) | `savings` | `goal` | `redistribute` | `reset`
- If `carry_forward_deficit = true` and `rollover < 0`: deficit deducted from next month's base allocation

### Subscription Tracking

- Live subscription list from `subscriptions_tracked` table
- Pre-built catalogue of 60+ apps in `constants/subscriptions.ts`
- Renewal calendar: next 14 days with dot indicators
- Monthly cost: all active subscriptions summed (non-EGP converted to EGP)
- Yearly projection: `monthly × 12` for monthly, `amount` for yearly subs
- Push reminder: N days before `next_renewal_date` (configurable per subscription)
- `reminder_enabled` + `reminder_days_before` on `subscriptions_tracked` (added migration 010)

### Goals

- Goal linked to a sub-category
- `goal_transactions` tracks every contribution and withdrawal
- `current_amount` updated on each transaction
- Progress percentage: `current_amount / target_amount`
- Estimated months: `(target_amount − current_amount) / monthly_contribution`
- Goal completion: Reanimated celebration animation when `is_complete` flips to true
- Rollover can be directed to a goal via `rollover_behavior = 'goal'`

### Multi-Currency

- All amounts stored as piastres in EGP base
- User selects display currency in Settings → Currency
- `ui.store.displayCurrency` + `ui.store.exchangeRates` used globally
- Exchange rates fetched on app launch and cached 24h in AsyncStorage
- Fallback rates hardcoded for offline use
- 8 currencies: EGP, USD, EUR, SAR, KWD, AED, QAR, BHD

### Export

`lib/export.ts` exports `generateExport(userId, dateRange, displayCurrency, rates)`:
- Fetches transactions, budgets, goals, subscriptions
- Converts all amounts to `displayCurrency`
- CSV: pipe-delimited, one row per transaction, downloadable via `expo-sharing`
- PDF: HTML template rendered via `expo-print`, shareable/printable

### Referral System

- Each user gets a unique `referral_code` generated at signup
- Referral link: `https://getvault.app/join?ref=CODE` (or in-app share)
- Settings screen shows referral code with copy + share buttons + referral count
- Edge function `supabase/functions/process-referral/index.ts`:
  - Called when a referred user completes signup
  - Grants 1 month Pro via RevenueCat API to referrer
  - Rate limited: max 3 rewards per referrer

### Push Notifications

- `usePushNotifications()` hook registers Expo push token on login
- Token saved to `users.push_token`
- Notification types: `budget_warning`, `subscription_renewal`, `goal_milestone`, `budget_applied`, `weekly_summary`
- Per-type user toggles in `user_settings.notify_*`
- In-app notification center (`notifications.tsx`) reads from `notifications` table
- In-memory store (`notifications.store.ts`) for real-time badge count

### Onboarding

7-step Redux-managed wizard (`onboardingSlice`):
1. **Welcome** — language toggle, feature pitch
2. **Name** — first name (stored in Redux)
3. **Income** — monthly income amount in piastres
4. **Income Date** — day of month (1–31 grid)
5. **Allocation** — percentage sliders per main category (must sum to 100%)
6. **Shortcut Setup** — iOS Shortcuts guide (skippable)
7. **Complete** — celebration animation + summary card + writes to Supabase:
   - Inserts `users` row, `user_settings`, default `main_categories`, default `sub_categories`, `allocation_templates` + `allocation_items`, initial `monthly_budgets`

### RevenueCat ("Khaznety Pro")

- Entitlement ID: `"Khaznety Pro"` (with space)
- Packages: monthly + yearly (defined in App Store Connect / Google Play)
- `useIsPro()` hook checks entitlement in real time via `onCustomerInfoUpdate` listener
- Paywall: `app/paywall.tsx` uses `react-native-purchases-ui` Paywalls
- Manage subscription: redirects to `getManagementURL()` (App Store or Play Store)
- Restore purchases: `restorePurchases()` on settings screen
- Webhook to Supabase edge function updates `user_subscriptions` table

---

## UI System

### Design Tokens

See `constants/tokens.ts` — Colors, radii, spacing, font sizes all listed above in the Constants section.

### Floating Pill Tab Bar (`components/ui/FloatingTabBar.tsx`)

- 5 tabs: Home (`index`), Budget, Trends, Subscriptions, Settings
- Rendered as a `BlurView` with `intensity={60}` and `tint="light"`
- Positioned `absolute`, `alignSelf: center`, `bottom: insets.bottom + 12`
- Active tab: inner pill `#FAFAF8` with hairline border + accent icon + label
- Inactive tabs: icon only in `#9C9485` (textMuted)
- Hidden when `AddTransactionSheet` is open
- Every scrollable screen must use `paddingBottom: PILL_CLEARANCE + insets.bottom`

### NativeWind Configuration (`tailwind.config.js`)

Custom colors mapped: `page`, `surface`, `surface-2`, `border`, `text`, `muted`, `accent`, `accent-light`, `danger`, `warning`.

Custom border radii: `card` (16px), `btn` (12px), `pill` (9999px).

### Cairo Font

Loaded via `@expo-google-fonts/cairo` (`hooks/useFonts.ts`). Weights used: 400 (regular), 600 (semibold), 700 (bold). Applied globally.

### RTL Support

- `ui.store.setLocale('ar')` calls `I18nManager.forceRTL(true)` (requires app reload)
- All layout uses `flexDirection: 'row'` (flips automatically in RTL)
- Directional styles use `marginStart`/`marginEnd` (never `marginLeft`/`marginRight`)
- Chevron/arrow icons flip with `scaleX: I18nManager.isRTL ? -1 : 1`
- Monetary amounts wrapped in `writingDirection: 'ltr'`

---

## Environment Variables

Required in `.env` at `vault/`:

```
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
EXPO_PUBLIC_REVENUECAT_API_KEY=<revenuecat_key>
```

All three are required at build time. The Supabase anon key is safe to expose (RLS enforces user isolation). The RevenueCat key is platform-specific (iOS vs Android key may differ — use the public API key).

---

## Deep Link Protocol

`vault://sms-import?sender=<sender_id>&body=<url_encoded_sms_body>`

Used by iOS Shortcuts to forward bank SMS messages to the app. Rate limited to 1 per 3 seconds. Body validated to max 500 characters. Input sanitized before processing.

---

## Security Notes

- Raw SMS text is **never stored in the database** — only parsed fields (amount, type, merchant, accountLast4)
- All Supabase queries are RLS-protected — users can only read/write their own rows
- Auth tokens stored in iOS Keychain / Android EncryptedSharedPreferences via `expo-secure-store`
- RevenueCat entitlement verified server-side via webhook (not client-side only)
- Idempotency keys prevent duplicate transaction imports from SMS/Apple Pay
