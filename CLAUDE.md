# Khaznety – Project Specification

## Overview

**Khaznety** is a personal budgeting mobile app targeting the Egyptian market. The name reflects security, control, and the idea of a place where your money is organized and protected.

Khaznety tracks expenses automatically via Apple Pay (iOS Shortcuts) and bank SMS notifications, and adds a robust budget management layer with hierarchical categories, rollover balances, and automated monthly income allocation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo (React Native) — managed workflow |
| Language | TypeScript |
| Backend | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| Subscriptions | RevenueCat (managing Apple IAP + Google Play Billing) |
| Payments | Apple In-App Purchase (iOS) / Google Play Billing (Android) — via RevenueCat |
| Navigation | Expo Router (file-based routing) |
| State Management | Local state (UI) · React Query (server data) · Zustand (small global state) · Redux Toolkit (app-wide complexity) |
| Styling | NativeWind v4 (Tailwind utilities for all layout, spacing, typography, color) |
| Animation | react-native-reanimated v3 |
| Gestures | react-native-gesture-handler |
| Bottom Sheets | @gorhom/bottom-sheet |
| Icons | lucide-react-native |
| Forms | React Hook Form + Zod |
| Charts | Victory Native XL (Skia-powered, 60fps) |
| Notifications | Expo Notifications |
| Localization | expo-localization + i18n-js (Arabic + English, RTL) |
| Voice Input | expo-speech-recognition (Arabic + English) |
| Export | expo-print + expo-sharing (CSV / PDF) |
| Paywall UI | react-native-purchases-ui (RevenueCat Paywalls) |

---

## Platform Targets

- iOS (primary — Apple Pay Shortcuts automation)
- Android (secondary — SMS permission-based auto-tracking)
- Minimum iOS: 16.0
- Minimum Android: API 26 (Android 8.0)

---

## Core Features

### 1. Automated Expense Tracking

#### Apple Pay (iOS)
- Uses **Apple Shortcuts** automation to detect Apple Pay transactions
- When a payment is made, the Shortcut fires a URL scheme or HTTP request to log the transaction in Khaznety
- The app receives: merchant name, amount, currency, timestamp
- Setup is a one-time guided flow in onboarding
- Guard against duplicate transactions (debounce + idempotency key)

#### Bank SMS Parsing (iOS + Android)
- **iOS**: Uses Apple Shortcuts' "Message received" trigger to parse bank SMS/iMessage notifications and forward transaction data to the app
- **Android**: Native SMS read permission to scan incoming bank messages
- AI/regex parser extracts: amount, currency, merchant/description, transaction type (debit/credit), account last 4 digits
- User can configure which senders (bank names/short codes) to monitor
- Merchant rules: user can define that SMS from sender "CIB" with keyword "Carrefour" maps to category "Groceries"

#### Manual Entry
- Expense/Income/Transfer entry via the `AddTransactionSheet` bottom sheet, triggered from the Home screen action buttons
- Voice input: tap mic button inside the Expense tab, speak in Arabic or English — `expo-speech-recognition` parses amount + merchant

---

### 2. Hierarchical Categories (Main + Sub-categories)

The budget and transaction system is built around a two-level category hierarchy.

#### Structure
```
Main Category
└── Sub-category
└── Sub-category
└── Sub-category
```

#### Default Main Categories (editable)
- **Living Expenses** → Groceries, Going Out, Gas, Subscriptions, Utilities, Household
- **Installments** → Car Installment, Phone Installment, Mortgage, Other Installments
- **Travel** → Flights, Hotels, Activities, Transport
- **Savings** → Emergency Fund, Investment, Goal-based savings
- **Health** → Pharmacy, Doctor, Gym
- **Education** → Courses, Books, School Fees

#### Rules
- Users can create, rename, reorder, and delete both main categories and sub-categories
- Each sub-category can have its own monthly budget limit
- Main category budget = sum of all its sub-category budgets (or manually overridden)
- Transactions are assigned to a sub-category; rolled up to main category in analytics
- A transaction can belong to only one sub-category

---

### 3. Budget Rollover

Unused budget at the end of a month does **not** disappear — it rolls over.

#### How It Works
- At month end (or on the user's defined "budget reset day"), the system calculates:
  `Rollover = Budget Allocated − Amount Spent`
- If positive, the rollover is added to the next month's available balance for that category
- Example: Travel budget = 100,000 EGP/month. No travel for 3 months → 300,000 EGP available in Travel

#### Rollover Options (user-configurable per category)
When a rollover is detected, the user is notified and can choose:
1. **Keep in same category** — accumulates for future use (default)
2. **Move to Savings** — transfers the rollover amount to the Savings category
3. **Fund a goal** — directs the rollover to top up a specific goal's current amount
4. **Redistribute** — move to another category of their choice
5. **Reset** — discard the rollover (budget resets to base allocation)

#### UI
- Each category card shows: Base Budget + Accumulated Rollover = Total Available
- Rollover amount shown in a distinct color/label so users know how much is "extra"
- History log of all rollover events

---

### 4. Automated Monthly Budget Allocation

Users define an **Allocation Template** tied to their income.

#### Setup Flow
1. User inputs their monthly net income (e.g., 100,000 EGP)
2. User assigns a percentage or fixed amount to each main category:
   - Savings: 30,000
   - Installments: 20,000
   - Living Expenses: 30,000
   - Travel: 20,000
3. App validates that allocations ≤ income (warns if over-allocated)
4. User sets their income arrival date (e.g., 1st of each month, or 25th)

#### Auto-Apply Logic
- On the income date (or manually triggered), the app:
  - Resets base budget for each category to the defined allocation
  - **Preserves and adds** any existing rollover balance on top
  - Creates an "Income Received" transaction entry
- User gets a push notification: "Your monthly budget has been applied ✅"

#### Multiple Income Sources
- Support for irregular or multiple income sources (freelance, salary, side income)
- Each income source can have its own allocation template or feed into the same one

---

### 5. Dashboard & Analytics

#### Home Screen
- Current month overview: Total Spent / Total Budget (progress ring)
- Per-category spend cards with progress bars
- Recent transactions list
- Rollover alerts ("You have 15,000 EGP rolled over in Travel")

#### Trends Screen
- Monthly spending breakdown by main category (bar/pie chart)
- Sub-category drill-down
- Month-over-month comparison
- Top merchants
- Savings rate over time

#### Accounts Screen
- Multiple accounts (bank, cash, credit card, wallet)
- Account balances (manually updated or inferred from SMS)
- Transfer between accounts

---

### 6. Subscription Tracking (5th tab in floating pill)

Subscriptions is a first-class feature with its own tab, not a buried settings screen.

- Users log recurring subscriptions (Netflix, Spotify, iCloud, ChatGPT, Shahid, OSN+, etc.)
- Fields: name, amount, currency, billing cycle (monthly/yearly), next renewal date, linked sub-category, reminder toggle, reminder days before (1/3/7)
- **Renewal calendar**: horizontal date strip showing the next 14 days with dot indicators on days that have renewals — tap a day to see what renews
- **Monthly/yearly summary cards** at the top of the screen
- **Swipe-to-delete** on subscription rows (react-native-gesture-handler Swipeable)
- Active / Inactive sections — user can pause a subscription without deleting it
- Reminder push notification sent N days before renewal (via Expo Notifications)
- **Auto-creates an expense transaction** on the renewal date and assigns it to the linked sub-category
- Home screen shows an upcoming renewal alert pill if any subscription renews within 7 days

---

### 7. Goals

Goals allow users to save towards a specific target within a budget category.

- A goal is linked to a sub-category (e.g. "Travel Fund" linked to the Travel category)
- Fields: name, target amount (EGP), current amount, monthly contribution (optional)
- **Progress bar** shows % complete; estimated months to completion is calculated automatically: `months = (target - current) / monthly_contribution`
- Users can manually **add funds** to a goal at any time via a bottom sheet
- When a goal is 100% funded, it is marked complete with a celebration animation (Reanimated)
- Goals appear on:
  - The **Budget tab → Goals segment** (full management view)
  - The **Home screen** as a horizontal scroll widget (mini cards)
- Rollover amounts can optionally be directed to a specific goal (an additional rollover behavior option)

**Goal data model** — migration 013 (see Schema section for full SQL):
- `id`, `user_id`, `sub_category_id`, `name`, `target_amount`, `current_amount`, `monthly_contribution`, `is_complete`, `created_at`

---

### 8. Notifications

- Monthly budget applied confirmation
- Rollover available — action required
- Budget limit approaching (e.g., at 80% of a category)
- Subscription renewal reminders (N days before, configurable per subscription)
- Goal reached — celebration notification when a goal hits 100%
- Goal progress milestone — optional nudge at 50% and 75% of a goal
- Weekly spending summary (optional, Sunday evening)
- Upcoming renewal alert — if a subscription renews within 7 days

---

## Monetization — RevenueCat + IAP

### Free Plan
- Unlimited transaction tracking (manual + SMS + Apple Pay)
- Up to 3 custom sub-categories
- Basic analytics (current month only)
- 1 bank SMS sender configured
- No export

### Khaznety Pro (Paid)
- Unlimited categories and sub-categories
- Full rollover control with redistribution options
- Automated monthly allocation templates
- Full analytics & trends (all time)
- Subscription tracking
- CSV / PDF export
- Multiple income sources
- Priority support

### Pricing
- Monthly: ~49–79 EGP/month (set via RevenueCat, adjust per market)
- Annual: ~399–599 EGP/year (save ~30–40%)
- 7-day free trial on Pro

### RevenueCat Integration
- Use RevenueCat SDK (`react-native-purchases`) to manage entitlements
- Products defined in App Store Connect (iOS) and Google Play Console (Android)
- RevenueCat handles receipt validation, entitlement logic, and webhook events
- Supabase function listens to RevenueCat webhook to update `user_subscriptions` table
- Never gate core tracking behind paywall — automation and analytics are the paid value

---

## Supabase Schema & Migration

> All 031 migrations live in `vault/supabase/migrations.sql`. Apply via Supabase MCP only — never manually.
> Schema tables: users, user_settings, main_categories, sub_categories, accounts, transactions, monthly_budgets, income_events, allocation_templates, allocation_items, subscriptions_tracked, sms_rules, user_subscriptions, goals, goal_transactions, notifications.
> To apply: connect Supabase MCP server, run `vault/supabase/migrations.sql` blocks in order, enable RLS on every table.

---

## Project Structure

The app code lives inside the `vault/` subdirectory.

```
vault/
├── app/                              # Expo Router screens
│   ├── _layout.tsx                   # Root layout — providers, deep link handler, auth gate
│   ├── +not-found.tsx
│   ├── notifications.tsx             # In-app notification center
│   ├── paywall.tsx                   # RevenueCat paywall modal
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx               # Custom FloatingTabBar wiring
│   │   ├── index.tsx                 # Dashboard / Home
│   │   ├── budget.tsx                # Category budgets + rollovers + goals
│   │   ├── trends.tsx                # Analytics / spending trends
│   │   ├── subscriptions.tsx         # Subscription tracker + calendar
│   │   └── settings.tsx              # Profile, allocation, SMS rules
│   ├── accounts/
│   │   └── add.tsx                   # Add bank/wallet/cash account
│   ├── budget/
│   │   ├── add-goal.tsx
│   │   ├── add-category.tsx
│   │   ├── add-subcategory.tsx
│   │   ├── set-budget.tsx
│   │   └── goal/
│   │       └── [id].tsx              # Goal detail page
│   ├── transaction/
│   │   └── [id].tsx                  # Transaction detail
│   ├── transactions/
│   │   └── index.tsx                 # Full transaction list
│   ├── subscriptions/
│   │   ├── add.tsx                   # Catalogue browser for adding subscriptions
│   │   └── [id].tsx                  # Edit subscription screen
│   ├── trends/
│   │   └── [category].tsx            # Per-category drill-down
│   ├── settings/
│   │   ├── edit-profile.tsx
│   │   ├── monthly-income.tsx
│   │   ├── allocation.tsx
│   │   ├── budget-reset-day.tsx
│   │   ├── shortcut-setup.tsx
│   │   ├── merchant-categories.tsx
│   │   ├── currency.tsx
│   │   ├── notifications.tsx
│   │   ├── about.tsx
│   │   └── export.tsx
│   └── onboarding/
│       ├── welcome.tsx
│       ├── name.tsx
│       ├── income.tsx
│       ├── income-date.tsx
│       ├── allocation.tsx
│       ├── shortcut-setup.tsx        # Apple Pay + Bank SMS + InstaPay unified screen
│       └── complete.tsx
├── components/
│   ├── ui/                           # Reusable primitives (Text, Card, Badge, FloatingTabBar, etc.)
│   ├── transactions/                 # TransactionRow, AddTransactionSheet, CategoryAccordionPicker
│   ├── budget/                       # CategoryRow, MainCategoryAccordion, GoalMiniCard, SummaryRing
│   └── charts/
├── lib/
│   ├── supabase.ts                   # Supabase client with secure storage adapter
│   ├── revenuecat.ts                 # RevenueCat SDK wrapper
│   ├── sms-parser.ts                 # Bank SMS regex parsing (12 banks)
│   ├── sms-categorizer.ts            # 4-tier auto-categorization pipeline
│   ├── sms-processor.ts              # SMS orchestrator (parse → categorize → insert)
│   ├── budget-engine.ts              # Rollover + allocation logic
│   ├── currency.ts                   # Multi-currency exchange rates (8 currencies, 24h cache)
│   ├── export.ts                     # CSV / PDF export
│   ├── voice-parser.ts               # Speech-to-transaction parser
│   └── i18n.ts                       # i18n-js initialization
├── stores/                           # Zustand stores
│   ├── auth.store.ts                 # Session + user
│   ├── ui.store.ts                   # Locale, displayCurrency, exchangeRates, transaction sheet
│   └── notifications.store.ts        # In-app notification list + unread count
├── redux/                            # Redux Toolkit — onboarding only
│   ├── store.ts
│   └── slices/
│       └── onboardingSlice.ts
├── hooks/                            # 16 custom hooks (useTransactions, useMonthlyBudgets, etc.)
├── constants/
│   ├── tokens.ts                     # Design tokens (colors, spacing, radii, PILL_CLEARANCE)
│   ├── categories.ts                 # 13 default main categories + 50+ sub-categories
│   ├── banks.ts                      # 12 Egyptian banks + sender map + merchant keywords
│   └── subscriptions.ts              # 60+ app catalogue across 12 sections
├── locales/
│   ├── en.json
│   └── ar.json
├── supabase/
│   ├── migrations.sql                # All 25 migrations — single file, run in order
│   └── functions/
│       └── process-referral/
│           └── index.ts              # Edge function: grant 1 month Pro on referral
├── plugins/
│   └── with-process-sms-intent/      # Custom Expo plugin for Android SMS intent
└── CLAUDE.md
```

---

## Egyptian Market Specifics

- **Primary currency**: EGP (Egyptian Pound)
- **Common banks to support SMS from**: CIB, NBE (National Bank of Egypt), QNB, Banque Misr, HSBC Egypt, Alex Bank, Arab African International Bank (AAIB), Fawry, Vodafone Cash, Orange Money, InstaPay
- **Language**: App UI in Arabic (RTL) + English toggle
- **Locale**: Numbers formatted in Egyptian style; Hijri/Gregorian calendar option
- **Income timing**: Many Egyptian salaries arrive on the 25th–1st of month

---

---

## UI & Styling System

Khaznety's visual target is a Revolut-grade light theme: warm off-white surfaces, earthy neutral tones, and a single strong emerald accent. Every library below serves a specific role — do not substitute without good reason.

---

### Design Tokens (light theme only — no dark mode)

```ts
// constants/tokens.ts
export const colors = {
  // Surfaces
  pageBg:      '#F0EEE9',   // outermost page background (warm off-white)
  surfacePrimary:   '#FAFAF8',   // cards, modals, bottom sheets
  surfaceSecondary: '#EEECE7',   // input fields, icon circle backgrounds
  surfaceTertiary:  '#E4DDD2',   // dividers, pressed states

  // Borders
  borderLight:  '#E4DDD2',   // card borders, list separators
  borderMedium: '#D8D4CC',   // stronger borders, tab bar top

  // Text
  textPrimary:   '#1A1A1A',  // headings, amounts, primary labels
  textSecondary: '#5C5850',  // body text, descriptions
  textMuted:     '#9C9485',  // placeholders, section labels, timestamps

  // Accent — Emerald
  accent:        '#1A7A52',  // primary buttons, active tab, links, badges
  accentDark:    '#0D3D28',  // dark green used in sign-in header, deep backgrounds
  accentLight:   '#EAF4EE',  // tinted backgrounds on accent elements
  accentBorder:  '#B6DEC8',  // borders on accent-tinted cards

  // Semantic
  danger:        '#C0392B',  // overspent, debit amounts
  dangerLight:   '#FEE2E2',  // danger tinted background
  warning:       '#D97706',  // approaching budget limit
  warningLight:  '#FEF3C7',  // warning tinted background
  success:       '#1A7A52',  // same as accent — income, saved amounts
  successLight:  '#EAF4EE',
}

export const radii = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  full: 9999,
}

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24,
}

export const fontSizes = {
  xs: 10, sm: 11, base: 12, md: 13, lg: 15, xl: 18, xxl: 24, hero: 30,
}
```

---

### 1. NativeWind v4 — Styling Engine

**Role**: All layout, spacing, typography, and color via Tailwind utility classes.

```bash
npx expo install nativewind tailwindcss
```

```ts
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{tsx,ts}', './components/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        page:      '#F0EEE9',
        surface:   '#FAFAF8',
        'surface-2': '#EEECE7',
        border:    '#E4DDD2',
        text:      '#1A1A1A',
        muted:     '#9C9485',
        accent:    '#1A7A52',
        'accent-light': '#EAF4EE',
        danger:    '#C0392B',
        warning:   '#D97706',
      },
      borderRadius: {
        'card': '16px',
        'btn':  '12px',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}
```

Usage pattern:
```tsx
// Revolut-style card
<View className="bg-surface border border-border rounded-card px-4 py-3">
  <Text className="text-muted text-xs uppercase tracking-widest mb-1">Total balance</Text>
  <Text className="text-text text-3xl font-bold tracking-tight">EGP 24,350</Text>
</View>

// Accent hero card (like Revolut's dark header, but in emerald)
<View className="bg-accent rounded-card p-4 mx-3">
  <Text className="text-white/70 text-xs mb-1">Monthly budget</Text>
  <Text className="text-white text-3xl font-bold">EGP 30,000</Text>
</View>

// Circular quick-action button (Revolut style)
<TouchableOpacity className="w-11 h-11 rounded-full bg-surface-2 items-center justify-center">
  <PlusIcon size={18} color="#5C5850" />
</TouchableOpacity>
```

**Rules**:
- Never use `StyleSheet.create` alongside NativeWind — pick one approach per component
- Use `className` for all static styles; use inline `style` only for dynamic values (e.g. animated width from Reanimated)
- Light theme only — do not use `dark:` variants anywhere in this codebase

---

### 2. react-native-reanimated v3 — Animations

**Role**: All animations that need to feel premium — this is what separates Revolut from a generic finance app. Runs on the UI thread, never drops frames.

```bash
npx expo install react-native-reanimated
```

Use Reanimated for:

```tsx
// 1. Number counter animation (balance ticking up on screen load)
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated'

const AnimatedText = Animated.createAnimatedComponent(Text)
const balance = useSharedValue(0)
balance.value = withTiming(24350, { duration: 800 })

// 2. Card press feedback (physical feel on tap)
const scale = useSharedValue(1)
const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
const onPressIn = () => { scale.value = withTiming(0.97, { duration: 80 }) }
const onPressOut = () => { scale.value = withTiming(1, { duration: 120 }) }

// 3. Progress bar animation (budget spend bar filling in)
const progress = useSharedValue(0)
progress.value = withTiming(0.75, { duration: 600, easing: Easing.out(Easing.cubic) })
const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }))

// 4. Screen entrance (slide up + fade on mount)
const translateY = useSharedValue(24)
const opacity = useSharedValue(0)
useEffect(() => {
  translateY.value = withTiming(0, { duration: 300 })
  opacity.value = withTiming(1, { duration: 300 })
}, [])
```

**Rules**:
- Every monetary number on screen should animate in on mount — use `withTiming` with 600–900ms duration
- Every tappable card must have press scale feedback (0.97)
- Never use React Native's built-in `Animated` API — always use Reanimated
- Keep animation durations between 80ms (micro) and 900ms (entrance). Nothing slower.

---

### 3. react-native-gesture-handler — Gestures

**Role**: Handles all swipe, drag, and pan interactions. Required peer dependency for Reanimated and Bottom Sheet.

```bash
npx expo install react-native-gesture-handler
```

Use for:

```tsx
// Swipe-to-delete on transaction rows (Revolut pattern)
import { Swipeable } from 'react-native-gesture-handler'

<Swipeable
  renderRightActions={() => (
    <TouchableOpacity className="bg-danger w-16 items-center justify-center rounded-r-card">
      <TrashIcon size={18} color="white" />
    </TouchableOpacity>
  )}
>
  <TransactionRow transaction={tx} />
</Swipeable>

// Wrap entire app at root (required)
// app/_layout.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler'
<GestureHandlerRootView style={{ flex: 1 }}>
  <Stack />
</GestureHandlerRootView>
```

---

### 4. @gorhom/bottom-sheet — Bottom Sheets

**Role**: Revolut uses bottom sheets everywhere — transaction details, rollover management, add expense, category picker. This library provides the fluid, gesture-driven sheets.

```bash
npx expo install @gorhom/bottom-sheet
```

```tsx
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'

const sheetRef = useRef<BottomSheet>(null)
const snapPoints = useMemo(() => ['40%', '85%'], [])

<BottomSheet
  ref={sheetRef}
  snapPoints={snapPoints}
  backgroundStyle={{ backgroundColor: colors.surfacePrimary, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
  handleIndicatorStyle={{ backgroundColor: colors.borderMedium, width: 36 }}
>
  <BottomSheetView className="px-4 pt-2">
    <Text className="text-text text-lg font-semibold">Manage rollover</Text>
    {/* rollover options */}
  </BottomSheetView>
</BottomSheet>
```

Use bottom sheets for:
- Transaction detail view
- Add / edit expense form
- Rollover action picker (keep / move to savings / redistribute / reset)
- Category picker when adding a transaction
- Filter panel on the transactions screen

---

### 5. lucide-react-native — Icons

**Role**: Single icon library used across the entire app. Consistent stroke weight and style. Do not mix with any other icon set.

```bash
npm install lucide-react-native
npx expo install react-native-svg
```

```tsx
import { Home, TrendingUp, CreditCard, Settings, Plus, ChevronRight, Trash2 } from 'lucide-react-native'

// Always pass explicit size and color — never rely on inherited styles
<Home size={20} color={colors.accent} strokeWidth={1.75} />
<Plus size={18} color={colors.textSecondary} strokeWidth={2} />
```

Icon sizing standards:
- Tab bar icons: `size={22}`
- Quick action circles: `size={18}`
- List row trailing arrows: `size={14}` color `textMuted`
- Hero section decorative: `size={24}`
- Always `strokeWidth={1.75}` for a clean, modern weight

---

### 6. Victory Native XL — Charts

**Role**: Analytics screen — spending breakdown by category, month-over-month bar charts, savings rate line chart. Skia-powered for 60fps with touch interactions.

```bash
npx expo install victory-native
npx expo install @shopify/react-native-skia
```

```tsx
import { CartesianChart, Bar, Line, useChartPressState } from 'victory-native'
import { LinearGradient, vec } from '@shopify/react-native-skia'

// Monthly spending bar chart
<CartesianChart
  data={monthlyData}
  xKey="month"
  yKeys={['spent', 'budget']}
  domainPadding={{ left: 20, right: 20 }}
>
  {({ points, chartBounds }) => (
    <>
      <Bar points={points.budget} chartBounds={chartBounds}
        color={colors.surfaceTertiary} roundedCorners={{ topLeft: 4, topRight: 4 }} />
      <Bar points={points.spent} chartBounds={chartBounds}
        color={colors.accent} roundedCorners={{ topLeft: 4, topRight: 4 }} />
    </>
  )}
</CartesianChart>
```

Chart color conventions:
- Spent amounts: `accent` (#1A7A52)
- Budget ceiling: `surfaceTertiary` (#E4DDD2) — shown behind spent bar
- Over-budget: `danger` (#C0392B)
- Savings line: `accent` with light fill

---

### 7. React Hook Form + Zod — Forms

**Role**: All user input forms — add expense, income setup, allocation template, SMS rule creation.

```bash
npm install react-hook-form zod @hookform/resolvers
```

```tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  amount:     z.number({ invalid_type_error: 'Enter a valid amount' }).positive(),
  merchant:   z.string().min(1, 'Merchant is required'),
  categoryId: z.string().uuid(),
  note:       z.string().optional(),
  date:       z.date().default(() => new Date()),
})

type AddExpenseForm = z.infer<typeof schema>

const { control, handleSubmit, formState: { errors } } = useForm<AddExpenseForm>({
  resolver: zodResolver(schema),
})
```

Form input style (NativeWind):
```tsx
// Standard input — matches Khaznety's warm surface style
<Controller
  control={control}
  name="merchant"
  render={({ field: { onChange, value } }) => (
    <View>
      <Text className="text-muted text-xs uppercase tracking-widest mb-1">Merchant</Text>
      <TextInput
        className="bg-surface-2 rounded-btn px-3 py-2.5 text-text text-sm"
        placeholderTextColor={colors.textMuted}
        onChangeText={onChange}
        value={value}
      />
      {errors.merchant && (
        <Text className="text-danger text-xs mt-1">{errors.merchant.message}</Text>
      )}
    </View>
  )}
/>
```

---

### Revolut UI Patterns to Implement

These specific patterns define the Revolut aesthetic and must be replicated consistently:

| Pattern | Implementation |
|---|---|
| Circular quick-action buttons | `rounded-full bg-surface-2 w-11 h-11` + `lucide` icon |
| Hero accent card | `bg-accent rounded-card p-4` with white text |
| Animated balance counter | Reanimated `withTiming` on mount, 800ms |
| Card press feedback | Reanimated scale to 0.97 on `onPressIn` |
| Section label style | `text-muted text-xs uppercase tracking-widest` |
| Swipe-to-delete rows | `react-native-gesture-handler` `Swipeable` |
| Transaction source badge | `bg-accent-light text-accent text-xs px-1.5 py-0.5 rounded` |
| Bottom sheet for actions | `@gorhom/bottom-sheet` at 40% / 85% snap points |
| Progress bar (budget) | Reanimated animated width on `View` with `bg-accent` |
| Promo/rollover pill | `bg-accent-light border border-accent/20 rounded-lg p-2.5` |

---



---

### 8. Floating Pill Tab Bar

Khaznety uses a **transparent frosted floating pill** that levitates above the screen content and blends with the warm off-white UI. There is no footer, no background bar, no separator line — the pill is the only navigation element and it sits consistently above every screen.

#### Core Rules
- **No tab bar container** — never render a background view, footer, or bar behind the pill
- **No border, no line, no footer background** of any kind
- The outer pill is **translucent frosted warm white** — `rgba(250,248,244,0.72)` with a `BlurView` underneath for the frosted glass effect
- The pill has a **hairline border** `rgba(212,205,194,0.6)` so it reads as a distinct element without being heavy
- **Active tab**: fully opaque `#FAFAF8` inner pill with hairline border + accent green icon + label
- **Inactive tabs**: icon only in `textMuted` (`#9C9485`) — no background, no label
- Positioned `absolute`, `alignSelf: center`, `bottom: insets.bottom + 12`
- Every screen's `ScrollView` must have `paddingBottom: PILL_CLEARANCE` — export this constant from `constants/tokens.ts`

#### Dependencies

```bash
npx expo install expo-blur
```

#### Component

```tsx
// components/ui/FloatingTabBar.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, BarChart2, RefreshCw, Activity, User } from 'lucide-react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { colors } from '@/constants/tokens'

const TABS = [
  { name: 'index',         label: 'Home',    Icon: Home },
  { name: 'budget',        label: 'Budget',  Icon: BarChart2 },
  { name: 'trends',        label: 'Trends',  Icon: Activity },
  { name: 'subscriptions', label: 'Subs',    Icon: RefreshCw },
  { name: 'settings',      label: 'Profile', Icon: User },
]

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <BlurView
      intensity={60}
      tint="light"
      style={[styles.pill, { bottom: insets.bottom + 12 }]}
    >
      {TABS.map((tab, index) => {
        const isActive = state.index === index
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.75}
          >
            <View style={[styles.tabItem, isActive && styles.tabItemActive]}>
              <tab.Icon
                size={18}
                color={isActive ? colors.accent : colors.textMuted}
                strokeWidth={1.75}
              />
              {isActive && (
                <Text style={styles.label}>{tab.label}</Text>
              )}
            </View>
          </TouchableOpacity>
        )
      })}
    </BlurView>
  )
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250,248,244,0.72)',
    borderRadius: 9999,
    borderWidth: 0.5,
    borderColor: 'rgba(212,205,194,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 2,
    overflow: 'hidden',         // required for BlurView to clip to pill shape
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    // Shadow (Android)
    elevation: 6,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderRadius: 9999,
    paddingHorizontal: 12,
    gap: 5,
  },
  tabItemActive: {
    backgroundColor: '#FAFAF8',
    borderWidth: 0.5,
    borderColor: '#E4DDD2',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,       // accent green, matches active icon
  },
})
```

#### Wiring into Expo Router

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { FloatingTabBar } from '@/components/ui/FloatingTabBar'

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // eliminate any default tab bar remnant
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="budget" />
      <Tabs.Screen name="subscriptions" />
      <Tabs.Screen name="trends" />
      <Tabs.Screen name="settings" />
    </Tabs>
  )
}
```

#### Screen-level Bottom Padding (required on every screen)

Export a shared constant so every screen uses the same value — never hardcode it:

```ts
// constants/tokens.ts
export const PILL_CLEARANCE = 80 // pill height (36) + bottom offset (12) + extra (16) + safe area handled separately
// Use as: contentContainerStyle={{ paddingBottom: PILL_CLEARANCE + insets.bottom }}
```

```tsx
// Every screen with scrollable content
import { PILL_CLEARANCE } from '@/constants/tokens'
const insets = useSafeAreaInsets()

<ScrollView
  contentContainerStyle={{ paddingBottom: PILL_CLEARANCE + insets.bottom }}
  showsVerticalScrollIndicator={false}
>
  {/* screen content */}
</ScrollView>
```

#### Token Reference

| Property | Value |
|---|---|
| Outer pill background | `rgba(250,248,244,0.72)` — translucent warm white |
| Outer pill border | `rgba(212,205,194,0.6)` — soft hairline |
| Blur intensity | `60` via `expo-blur` `BlurView`, `tint="light"` |
| Active inner pill background | `#FAFAF8` — fully opaque warm white |
| Active inner pill border | `#E4DDD2` — hairline |
| Active icon + label color | `#1A7A52` — accent emerald |
| Inactive icon color | `#9C9485` — textMuted, same as placeholders |
| Outer pill border radius | `9999` — fully round |
| Inner pill height | `36px` |
| Icon size | `18px` |
| Icon stroke width | `1.75` |
| Label size | `12px / weight 600` |
| Bottom offset | `insets.bottom + 12` |
| Shadow opacity | `0.08` — subtle, not heavy |
| No footer, no border, no background bar | — |

---

## State Management Guidelines

Use the right tool for the right scope — do not reach for a heavier solution when a lighter one is sufficient.

| Layer | Tool | When to Use |
|---|---|---|
| **UI / Local** | `useState` / `useReducer` | Component-level ephemeral state — modals open/closed, form input, loading spinners, tab selection |
| **Server Data** | React Query (`@tanstack/react-query`) | All data fetched from Supabase — transactions, categories, budgets. Handles caching, background refetch, pagination, and optimistic updates |
| **Small Global** | Zustand | Lightweight cross-component state that doesn't belong to the server — current selected month, active account filter, notification badge count, auth user object |
| **Multi-Step Flows** | Redux Toolkit | Multi-step onboarding wizard state — captures firstName, incomeAmount, incomeDate, allocations, shortcutSkipped across screens before committing to Supabase |

### Rules
- Default to `useState` first. Only promote to a higher layer if state genuinely needs to be shared or persisted.
- React Query is the source of truth for anything that lives in Supabase. Do not duplicate server data into Zustand or Redux.
- Redux is used **only** for the onboarding slice (`onboardingSlice`). Budget logic runs client-side in `lib/budget-engine.ts` and writes directly to Supabase via React Query mutations.
- Zustand stores are small and focused: `auth.store` (session/user), `ui.store` (locale, currency, exchange rates, transaction sheet state), `notifications.store` (in-app alerts).

---

---

---

## Egyptian Bank SMS Regex Patterns

> Full implementation in `vault/lib/sms-parser.ts`. Supports: CIB, NBE (National Bank of Egypt), Banque Misr, QNB Al Ahli, HSBC Egypt, Alex Bank, Fawry, Vodafone Cash, InstaPay.
> Key rules: amounts stored as integers (piastres × 100); Arabic-Indic digits normalised before parsing; `rawMessage` is never stored in DB — only parsed fields go to `transactions`.

---

## Screen Map

All screens are implemented. Reference these files when editing UI:

| Screen | File | Notes |
|---|---|---|
| Home (Dashboard) | `app/(tabs)/index.tsx` | Balance hero, quick actions, category cards, recent transactions, goals scroll, renewal alert |
| Budget | `app/(tabs)/budget.tsx` | Segments: Budgets · Goals · Rollovers; month selector; summary ring |
| Trends | `app/(tabs)/trends.tsx` | Period selector; bar chart; category breakdown; top merchants; savings line chart |
| Subscriptions + Bills | `app/(tabs)/subscriptions.tsx` | Segments: Subscriptions · Bills; renewal calendar strip |
| Settings | `app/(tabs)/settings.tsx` | Profile header; budget, automation, app, account sections |
| Add Transaction | `components/transactions/AddTransactionSheet.tsx` | Bottom sheet, snap 55%/92%, tabs: Expense · Income · Transfer |
| Goal Detail | `app/budget/goal/[id].tsx` | Progress, contribution history, add funds sheet |
| Transaction Detail | `app/transaction/[id].tsx` | |
| Add Bill | `app/subscriptions/add-bill.tsx` | Provider catalogue grid + ref input (number-pad) |

---

## Onboarding Flow

> Implemented in `app/onboarding/`. 7 steps managed by `redux/slices/onboardingSlice.ts`.
> Steps: welcome → name → income → income-date → allocation → shortcut-setup → complete.
> "complete" step writes user_settings + default categories to Supabase, then routes to `/(tabs)`.
> FloatingTabBar hidden during onboarding. Progress shown via `components/ui/ProgressDots.tsx`.

---

## RTL & Arabic Component Guidelines

Arabic (`ar`) is the primary locale. English (`en`) is a toggle. The app must be fully RTL-correct in Arabic mode without any screen looking like a mirrored-English UI.

### Setup

```ts
// app/_layout.tsx
import { I18nManager } from 'react-native'
import { useLocale } from '@/hooks/useLocale'

const { locale } = useLocale()
const isRTL = locale === 'ar'

useEffect(() => {
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL)
    // Requires app reload — prompt user or handle via expo-updates
  }
}, [isRTL])
```

### Rule 1 — Never use `left`/`right` directional styles

```ts
// ❌ Wrong — breaks RTL
style={{ marginLeft: 12, textAlign: 'left' }}

// ✅ Correct — flips automatically
style={{ marginStart: 12, textAlign: 'auto' }}

// In NativeWind: use ms-* / me-* (margin-start / margin-end), not ml-* / mr-*
className="ms-3 me-4"   // ✅
className="ml-3 mr-4"   // ❌
```

### Rule 2 — Text alignment

```ts
// Always 'auto' for body text — React Native respects RTL automatically
<Text style={{ textAlign: 'auto' }}>النص هنا</Text>

// Only use explicit alignment for centered UI elements (amounts, heroes)
<Text style={{ textAlign: 'center' }}>EGP 24,350</Text>
```

### Rule 3 — Icons that imply direction must flip

```ts
// ChevronRight becomes ChevronLeft in RTL — or use transform
import { I18nManager } from 'react-native'

<ChevronRight
  size={14}
  color={colors.textMuted}
  style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
/>

// Applies to: ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, Back arrows
```

### Rule 4 — Row layouts reverse automatically

```ts
// flex-row reverses in RTL automatically — do not fight this
// ✅ This row will show: [Avatar] [Name] in LTR, [Name] [Avatar] in RTL
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
  <Avatar />
  <Text>{name}</Text>
</View>

// ❌ Do not add manual reversal logic — it creates double-flip
```

### Rule 5 — Numbers are always LTR

```ts
// Monetary amounts, dates, and numbers are always displayed LTR
// Wrap in a LTR-forced Text for amounts
<Text style={{ writingDirection: 'ltr', textAlign: 'right' }}>
  {formatCurrency(amount)}  {/* "EGP 24,350" stays LTR */}
</Text>
```

### Rule 6 — Arabic font considerations

```ts
// constants/tokens.ts — add font family
export const fonts = {
  arabic: 'Cairo',      // or 'Tajawal' — both support Arabic + Latin
  latin:  'System',
}

// Load via expo-font
import { useFonts } from 'expo-font'
const [loaded] = useFonts({
  Cairo: require('../assets/fonts/Cairo-Regular.ttf'),
  'Cairo-SemiBold': require('../assets/fonts/Cairo-SemiBold.ttf'),
  'Cairo-Bold': require('../assets/fonts/Cairo-Bold.ttf'),
})

// Apply in NativeWind via fontFamily override when locale === 'ar'
```

### Rule 7 — FloatingTabBar in RTL

The floating pill reverses tab order in RTL automatically because `flex-row` flips. This is correct behaviour — do not override it. The active pill label will also render right-to-left correctly.

### Rule 8 — Progress bars

```ts
// Progress bars must fill from the correct end
// In RTL, a "start" fill should come from the right
<View style={{ flexDirection: 'row' }}>
  <View style={{
    width: `${percent}%`,
    height: 4,
    backgroundColor: colors.accent,
    borderRadius: 2,
    // No left/right — width % fills from the start edge, which RTL handles
  }} />
</View>
```

### RTL Test Checklist

Run this checklist on every new screen before marking it complete:

- [ ] All `ml-`/`mr-` replaced with `ms-`/`me-`
- [ ] Directional icons (chevrons, arrows) have `scaleX` flip
- [ ] Monetary amounts wrapped in `writingDirection: 'ltr'`
- [ ] Row layouts look correct in both locales (do not hardcode reversal)
- [ ] Arabic text uses Cairo/Tajawal font family
- [ ] Section labels and input labels render correctly in Arabic
- [ ] Bottom sheet handle and snap behavior unchanged in RTL

## Paper MCP — Design Reference

Khaznety uses **Paper** (paper.design) as its design tool. The Paper MCP server connects Claude Code directly to the open Paper design file, giving it live context on layouts, tokens, spacing, and component structure while building UI.

### Setup (Claude Code)

Run this once in your terminal to register the Paper MCP server:

```bash
claude mcp add paper --transport http http://127.0.0.1:29979/mcp --scope user
```

Then open your Khaznety design file in **Paper Desktop** — the MCP server starts automatically in the background when a file is open.

Verify the connection is working by running `/mcp` inside a Claude Code session. Paper should appear in the list of available servers.

### How It Works

1. Open the Khaznety `.paper` design file in Paper Desktop
2. Start a Claude Code session
3. Claude Code can now call Paper MCP tools to read the open file — frames, layers, tokens, and component structure
4. When building any screen or component, instruct Claude Code to reference the Paper file first before writing code

### Required Workflow for UI Components

Whenever Claude Code is building or updating a screen, it must:

1. Use the Paper MCP to read the relevant frame from the design file
2. Extract exact values — colors, radii, spacing, font sizes, icon sizes — from the Paper file rather than inferring from this spec
3. If a value in the Paper file conflicts with a token in `constants/tokens.ts`, **Paper is the source of truth** — update the token file to match
4. After building the component, use Paper MCP to verify the rendered output matches the design frame visually

### Useful Paper MCP Prompts for Claude Code

```
"Read the Home screen frame from the Paper file and build the matching React Native screen"

"Check the FloatingTabBar frame in Paper and verify our implementation matches exactly"

"Pull the color tokens from the Paper design system page and update constants/tokens.ts to match"

"Read the Add Expense bottom sheet frame and implement it using @gorhom/bottom-sheet"
```

### Troubleshooting

- If Paper MCP is shown as connected but Claude Code says it has no access — restart the Claude Code session
- If the MCP server is not starting — make sure Paper Desktop is open with a file loaded
- Long-running agent sessions can lose the MCP connection — restart the session to re-establish it
- On Windows WSL: enable mirrored mode networking (`networkingMode: mirrored` in WSL settings) to reach `http://127.0.0.1:29979/mcp`

## Development Guidelines

- All API calls to Supabase must be wrapped in try/catch with user-facing error states
- Use Row Level Security (RLS) on all Supabase tables — users only access their own data
- Never store raw SMS content in the database — only the parsed transaction fields
- Apple Pay Shortcut URL scheme must use an idempotency key (timestamp + amount hash) to prevent duplicate transactions
- RevenueCat entitlement checks should be done server-side via webhook, not client-side only
- All monetary amounts stored as integers (piastres / fils) to avoid floating point issues — display layer divides by 100
- Budget engine (rollover + allocation) runs as a Supabase Edge Function triggered by a cron job at month end
- Prefer optimistic UI updates for transaction add/edit — sync to Supabase in background
- RTL layout support must be tested on every new screen

---

## Implemented Beyond Original Spec

These features were added and are live in the codebase:

- **Multi-currency display** — 8 currencies (EGP, USD, EUR, SAR, KWD, AED, QAR, BHD) with 24h-cached exchange rates
- **Voice input** — `expo-speech-recognition` parses spoken transactions in Arabic + English
- **Export** — CSV and PDF export via `expo-print` + `expo-sharing`
- **Referral system** — unique `referral_code` per user; edge function grants 1 month Pro on successful referral (max 3 rewards)
- **Goal transactions** — full contribution/withdrawal history for each goal
- **Notification preferences** — per-type toggles on `user_settings`
- **Account sub-type `savings`** — added to accounts.type check constraint
- **`carry_forward_deficit`** — toggle per sub-category to carry over overspend into next month's budget
- **`rollover_parked`** — column on monthly_budgets to track mid-month parked rollovers

## Out of Scope (still v1)

- Bank account syncing via open banking / Plaid (no Egyptian open banking infrastructure yet)
- Receipt scanning / OCR
- Shared budgets / family accounts
- Web dashboard
