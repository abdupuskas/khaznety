# Vault – Project Specification

## Overview

**Vault** is a personal budgeting mobile app targeting the Egyptian market. The name reflects security, control, and the idea of a place where your money is organized and protected.

Vault tracks expenses automatically via Apple Pay (iOS Shortcuts) and bank SMS notifications, and adds a robust budget management layer with hierarchical categories, rollover balances, and automated monthly income allocation.

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
- When a payment is made, the Shortcut fires a URL scheme or HTTP request to log the transaction in Vault
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
- Voice input: tap mic button inside the Expense tab, speak in Arabic or English, AI parses it (v2)

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

### Vault Pro (Paid)
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

### How to Apply This Schema

**Use the Supabase MCP server to run all migrations directly.** Do not write migration files manually or use the Supabase CLI for schema changes. Claude Code must connect to the Supabase MCP server and execute each SQL block below in order.

#### MCP Server Setup

```jsonc
// .cursor/mcp.json or mcp config
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "<YOUR_SUPABASE_URL>",
        "--supabase-service-role-key", "<YOUR_SERVICE_ROLE_KEY>"
      ]
    }
  }
}
```

#### Migration Instructions for Claude Code

When setting up the project database, Claude Code must:

1. Connect to the Supabase MCP server
2. Run each migration block below **in order** using the MCP `query` tool
3. Verify each table was created successfully before proceeding to the next
4. Enable RLS on every table immediately after creation
5. Apply the RLS policies defined below each table
6. Confirm all tables, indexes, and policies exist before closing the migration session

Never hand-edit tables in the Supabase dashboard. All schema changes must go through MCP-executed SQL so the migration history stays in the codebase.

---

### Migration Blocks (run in order via Supabase MCP)

#### 001 — users

```sql
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  locale      text not null default 'ar',
  currency    text not null default 'EGP',
  created_at  timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own row"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own row"
  on public.users for update
  using (auth.uid() = id);
```

#### 002 — user_settings

```sql
create table public.user_settings (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references public.users(id) on delete cascade,
  income_amount            bigint not null default 0,
  income_date              smallint not null default 1 check (income_date between 1 and 31),
  base_currency            text not null default 'EGP',
  rollover_default_behavior text not null default 'keep'
                             check (rollover_default_behavior in ('keep','savings','goal','redistribute','reset')),
  updated_at               timestamptz not null default now(),
  unique (user_id)
);

alter table public.user_settings enable row level security;

create policy "Users can manage own settings"
  on public.user_settings for all
  using (auth.uid() = user_id);
```

#### 003 — main_categories

```sql
create table public.main_categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  name        text not null,
  icon        text,
  color       text,
  sort_order  smallint not null default 0,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index idx_main_categories_user_id on public.main_categories(user_id);

alter table public.main_categories enable row level security;

create policy "Users can manage own main categories"
  on public.main_categories for all
  using (auth.uid() = user_id);
```

#### 004 — sub_categories

```sql
create table public.sub_categories (
  id                 uuid primary key default gen_random_uuid(),
  main_category_id   uuid not null references public.main_categories(id) on delete cascade,
  user_id            uuid not null references public.users(id) on delete cascade,
  name               text not null,
  monthly_budget     bigint not null default 0,
  rollover_enabled   boolean not null default true,
  rollover_behavior  text not null default 'keep'
                      check (rollover_behavior in ('keep','savings','goal','redistribute','reset')),
  created_at         timestamptz not null default now()
);

create index idx_sub_categories_user_id on public.sub_categories(user_id);
create index idx_sub_categories_main_category_id on public.sub_categories(main_category_id);

alter table public.sub_categories enable row level security;

create policy "Users can manage own sub categories"
  on public.sub_categories for all
  using (auth.uid() = user_id);
```

#### 005 — accounts

```sql
create table public.accounts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('bank','cash','credit','wallet')),
  balance     bigint not null default 0,
  currency    text not null default 'EGP',
  last_4      char(4),
  created_at  timestamptz not null default now()
);

create index idx_accounts_user_id on public.accounts(user_id);

alter table public.accounts enable row level security;

create policy "Users can manage own accounts"
  on public.accounts for all
  using (auth.uid() = user_id);
```

#### 006 — transactions

```sql
create table public.transactions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  sub_category_id  uuid references public.sub_categories(id) on delete set null,
  account_id       uuid references public.accounts(id) on delete set null,
  amount           bigint not null,
  currency         text not null default 'EGP',
  merchant         text,
  note             text,
  source           text not null check (source in ('manual','apple_pay','sms','voice')),
  idempotency_key  text unique,
  transaction_date date not null default current_date,
  created_at       timestamptz not null default now()
);

create index idx_transactions_user_id on public.transactions(user_id);
create index idx_transactions_transaction_date on public.transactions(transaction_date);
create index idx_transactions_sub_category_id on public.transactions(sub_category_id);

alter table public.transactions enable row level security;

create policy "Users can manage own transactions"
  on public.transactions for all
  using (auth.uid() = user_id);
```

#### 007 — monthly_budgets

```sql
create table public.monthly_budgets (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  sub_category_id  uuid not null references public.sub_categories(id) on delete cascade,
  month            char(7) not null,
  base_allocation  bigint not null default 0,
  rollover_amount  bigint not null default 0,
  total_available  bigint generated always as (base_allocation + rollover_amount) stored,
  spent            bigint not null default 0,
  unique (user_id, sub_category_id, month)
);

create index idx_monthly_budgets_user_month on public.monthly_budgets(user_id, month);

alter table public.monthly_budgets enable row level security;

create policy "Users can manage own monthly budgets"
  on public.monthly_budgets for all
  using (auth.uid() = user_id);
```

#### 008 — income_events

```sql
create table public.income_events (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  amount       bigint not null,
  currency     text not null default 'EGP',
  source_name  text,
  received_at  timestamptz not null default now()
);

create index idx_income_events_user_id on public.income_events(user_id);

alter table public.income_events enable row level security;

create policy "Users can manage own income events"
  on public.income_events for all
  using (auth.uid() = user_id);
```

#### 009 — allocation_templates

```sql
create table public.allocation_templates (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  name           text not null,
  is_active      boolean not null default false,
  income_amount  bigint not null default 0,
  created_at     timestamptz not null default now()
);

create table public.allocation_items (
  id                  uuid primary key default gen_random_uuid(),
  template_id         uuid not null references public.allocation_templates(id) on delete cascade,
  main_category_id    uuid not null references public.main_categories(id) on delete cascade,
  amount              bigint not null default 0,
  percentage          numeric(5,2)
);

create index idx_allocation_templates_user_id on public.allocation_templates(user_id);

alter table public.allocation_templates enable row level security;
alter table public.allocation_items enable row level security;

create policy "Users can manage own allocation templates"
  on public.allocation_templates for all
  using (auth.uid() = user_id);

create policy "Users can manage own allocation items"
  on public.allocation_items for all
  using (
    exists (
      select 1 from public.allocation_templates t
      where t.id = allocation_items.template_id
        and t.user_id = auth.uid()
    )
  );
```

#### 010 — subscriptions_tracked

```sql
create table public.subscriptions_tracked (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  sub_category_id     uuid references public.sub_categories(id) on delete set null,
  name                text not null,
  amount              bigint not null,
  currency            text not null default 'EGP',
  billing_cycle       text not null check (billing_cycle in ('monthly','yearly')),
  next_renewal_date   date not null,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

create index idx_subscriptions_user_id on public.subscriptions_tracked(user_id);

alter table public.subscriptions_tracked enable row level security;

create policy "Users can manage own subscriptions"
  on public.subscriptions_tracked for all
  using (auth.uid() = user_id);
```

#### 011 — sms_rules

```sql
create table public.sms_rules (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  sender_name      text not null,
  keyword          text,
  sub_category_id  uuid references public.sub_categories(id) on delete set null,
  created_at       timestamptz not null default now()
);

create index idx_sms_rules_user_id on public.sms_rules(user_id);

alter table public.sms_rules enable row level security;

create policy "Users can manage own SMS rules"
  on public.sms_rules for all
  using (auth.uid() = user_id);
```

#### 012 — user_subscriptions (RevenueCat webhook target)

```sql
create table public.user_subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.users(id) on delete cascade,
  revenuecat_app_user_id text not null,
  entitlement          text not null default 'pro',
  is_active            boolean not null default false,
  expires_at           timestamptz,
  updated_at           timestamptz not null default now(),
  unique (user_id)
);

alter table public.user_subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);
```

---

### Post-Migration Checklist (run via MCP after all blocks)

Claude Code must verify the following using the Supabase MCP server after migrations complete:

```sql
-- Confirm all 12 tables exist
select table_name from information_schema.tables
where table_schema = 'public'
order by table_name;

-- Confirm RLS is enabled on all tables
select tablename, rowsecurity from pg_tables
where schemaname = 'public'
order by tablename;

-- Confirm all indexes exist
select indexname, tablename from pg_indexes
where schemaname = 'public'
order by tablename;
```

If any table, RLS flag, or index is missing — re-run the relevant migration block via MCP before proceeding.

---

## Project Structure

```
vault/
├── app/                        # Expo Router screens
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (auth)/
│   │   └── sign-in.tsx
│   ├── (tabs)/
│   │   ├── index.tsx           # Dashboard / Home
│   │   ├── budget.tsx          # Category budgets + rollovers + goals
│   │   ├── trends.tsx          # Analytics / spending trends
│   │   ├── subscriptions.tsx   # Subscription tracker + calendar
│   │   └── settings.tsx        # Profile, allocation, SMS rules
│   ├── transaction/
│   │   └── [id].tsx
│   ├── subscriptions/
│   │   ├── add.tsx             # Grid browser for adding subscriptions
│   │   └── [id].tsx            # Edit subscription screen
│   └── onboarding/
│       ├── welcome.tsx
│       ├── name.tsx
│       ├── income.tsx
│       ├── income-date.tsx
│       ├── allocation.tsx
│       ├── shortcut-setup.tsx  # Covers Apple Pay + Bank SMS + InstaPay in one screen
│       └── complete.tsx
├── components/
│   ├── ui/                     # Reusable primitives
│   ├── transactions/
│   ├── budget/
│   └── charts/
├── lib/
│   ├── supabase.ts
│   ├── revenuecat.ts
│   ├── sms-parser.ts           # Regex/AI SMS parsing logic
│   └── budget-engine.ts        # Rollover + allocation logic
├── stores/                     # Zustand stores (small global state)
│   ├── auth.store.ts
│   ├── budget.store.ts
│   └── transactions.store.ts
├── redux/                      # Redux Toolkit (app-wide complexity)
│   ├── store.ts
│   ├── slices/
│   │   ├── budgetSlice.ts
│   │   ├── categoriesSlice.ts
│   │   └── allocationSlice.ts
│   └── middleware/
├── hooks/
├── constants/
│   ├── categories.ts           # Default category definitions
│   └── banks.ts                # Egyptian bank SMS patterns
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

Vault's visual target is a Revolut-grade light theme: warm off-white surfaces, earthy neutral tones, and a single strong emerald accent. Every library below serves a specific role — do not substitute without good reason.

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
// Standard input — matches Vault's warm surface style
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

### Package Installation Summary

```bash
# Core styling & animation
npx expo install nativewind tailwindcss
npx expo install react-native-reanimated
npx expo install react-native-gesture-handler

# UI components
npx expo install @gorhom/bottom-sheet
npx expo install react-native-svg
npm install lucide-react-native

# Charts
npx expo install victory-native @shopify/react-native-skia

# Forms
npm install react-hook-form zod @hookform/resolvers
```


---

### 8. Floating Pill Tab Bar

Vault uses a **transparent frosted floating pill** that levitates above the screen content and blends with the warm off-white UI. There is no footer, no background bar, no separator line — the pill is the only navigation element and it sits consistently above every screen.

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
export const PILL_CLEARANCE = 52 + 12 + 34 // pill height + offset + extra breathing room = ~98
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
| **App-Wide Complexity** | Redux Toolkit | Complex, interconnected state with business logic — budget engine state (allocation templates, rollover calculations across categories), multi-step onboarding wizard, offline queue of pending transactions |

### Rules
- Default to `useState` first. Only promote to a higher layer if state genuinely needs to be shared or persisted.
- React Query is the source of truth for anything that lives in Supabase. Do not duplicate server data into Zustand or Redux.
- Redux slices should contain pure reducer logic — no direct Supabase calls inside reducers. Use Redux Thunks or RTK Query for async if needed.
- Zustand stores should be small and focused — one store per domain (auth, UI preferences, filters).

---

---

---

## Egyptian Bank SMS Regex Patterns

All Egyptian bank SMS messages follow predictable structures. The parser lives in `lib/sms-parser.ts` and must handle both Arabic and English SMS formats since banks send both.

### Key Parser Rules

- All monetary amounts stored as **integers (piastres)** — multiply parsed float by 100
- Amount separators vary: `1,250.00` or `1250.50` or `١٬٢٥٠` (Arabic-Indic numerals)
- Always strip commas before parsing: `"1,250.00".replace(/,/g, '')`
- Arabic-Indic digits (`٠١٢٣٤٥٦٧٨٩`) must be normalized to Western digits before regex runs
- Transaction type: look for debit keywords first — if none found, treat as credit
- `account_last4` is optional — not all banks include it in every message

### Digit Normalizer (run on every SMS before any regex)

```ts
// lib/sms-parser.ts
export function normalizeArabicDigits(str: string): string {
  return str.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

export function parseAmount(raw: string): number {
  // returns integer piastres
  const cleaned = raw.replace(/,/g, '').trim()
  return Math.round(parseFloat(cleaned) * 100)
}
```

---

### Bank Patterns

#### CIB (Commercial International Bank)
- **SMS sender**: `CIB` or `CIB-Egypt`
- **Language**: English

```ts
// Debit — card purchase
// "Your CIB account XXXX1234 has been debited EGP 1,250.00 at CARREFOUR on 20/03/2026"
/your cib (?:account|card)[^\d]*(\d{4}).*?debited\s+egp\s+([\d,]+\.?\d*)\s+at\s+(.+?)\s+on/i

// Credit — incoming transfer or salary
// "Your CIB account XXXX1234 has been credited EGP 30,000.00 on 20/03/2026"
/your cib (?:account|card)[^\d]*(\d{4}).*?credited\s+egp\s+([\d,]+\.?\d*)/i

// Balance alert
// "CIB: Available balance for account XXXX1234 is EGP 24,350.50"
/available balance for (?:account|card)[^\d]*(\d{4}).*?egp\s+([\d,]+\.?\d*)/i
```

#### NBE (National Bank of Egypt)
- **SMS sender**: `NBE` or `19623`
- **Language**: Arabic and English

```ts
// Arabic debit
// "تم خصم مبلغ ١٬٢٥٠٫٠٠ ج.م من حسابك رقم XXXX1234 في CARREFOUR"
/تم خصم مبلغ\s*([\d,٠-٩٬٫]+)\s*ج\.?م.*?حساب[كـ]?\s*(?:رقم\s*)?(?:XXXX)?(\d{4})?.*?في\s+(.+)/

// Arabic credit
// "تم إيداع مبلغ ٣٠٬٠٠٠٫٠٠ ج.م في حسابك رقم XXXX1234"
/تم إيداع مبلغ\s*([\d,٠-٩٬٫]+)\s*ج\.?م.*?حساب[كـ]?\s*(?:رقم\s*)?(?:XXXX)?(\d{4})?/

// English debit
// "NBE: Your account XXXX1234 debited EGP 1,250.00 at CARREFOUR. Balance: EGP 23,100.00"
/your account[^\d]*(\d{4})\s+debited\s+egp\s+([\d,]+\.?\d*)\s+at\s+(.+?)(?:\.|balance)/i

// English credit
// "NBE: Your account XXXX1234 credited EGP 30,000.00."
/your account[^\d]*(\d{4})\s+credited\s+egp\s+([\d,]+\.?\d*)/i
```

#### Banque Misr
- **SMS sender**: `BanqueMisr` or `بنك مصر`
- **Language**: Arabic and English

```ts
// Arabic debit
// "بنك مصر: تم الخصم من حسابك ****1234 بمبلغ 850.00 جنيه في Starbucks"
/تم الخصم من حساب[كـ]?\s*\*{0,4}(\d{4})\s+بمبلغ\s*([\d,\.]+)\s*جنيه\s+في\s+(.+)/

// Arabic credit
// "بنك مصر: تم الإيداع في حسابك ****1234 بمبلغ 5,000.00 جنيه"
/تم الإيداع في حساب[كـ]?\s*\*{0,4}(\d{4})\s+بمبلغ\s*([\d,\.]+)\s*جنيه/

// English
// "Banque Misr: Debit EGP 850.00 from account ending 1234 at Starbucks. Bal: EGP 23,500.00"
/debit\s+egp\s+([\d,]+\.?\d*)\s+from account ending\s+(\d{4})\s+at\s+(.+?)(?:\.|bal)/i
```

#### QNB Al Ahli
- **SMS sender**: `QNBAlahli` or `QNB`
- **Language**: English (primarily)

```ts
// Debit
// "QNB Alahli: EGP 1,250.00 debited from your account *1234 at IKEA on 20/03/2026. Bal: EGP 18,750.00"
/egp\s+([\d,]+\.?\d*)\s+debited from your account[^\d]*(\d{4})\s+at\s+(.+?)\s+on/i

// Credit
// "QNB Alahli: EGP 30,000.00 credited to your account *1234 on 20/03/2026"
/egp\s+([\d,]+\.?\d*)\s+credited to your account[^\d]*(\d{4})/i
```

#### HSBC Egypt
- **SMS sender**: `HSBC`
- **Language**: English

```ts
// Debit
// "HSBC: A transaction of EGP 1,250.00 has been made on your card ending 1234 at CARREFOUR"
/transaction of egp\s+([\d,]+\.?\d*)\s+has been made on your card ending\s+(\d{4})\s+at\s+(.+)/i

// Credit
// "HSBC: EGP 30,000.00 has been deposited to your account ending 1234"
/egp\s+([\d,]+\.?\d*)\s+has been deposited to your account ending\s+(\d{4})/i
```

#### Alex Bank
- **SMS sender**: `AlexBank` or `Alex Bank`
- **Language**: Arabic and English

```ts
// Arabic debit
// "بنك الإسكندرية: خصم ١٬٢٥٠٫٠٠ ج.م من بطاقتك **** ١٢٣٤ في CARREFOUR"
/خصم\s*([\d,٠-٩٬٫]+)\s*ج\.?م\s+من\s+بطاقت[كـ]?\s*\*{0,4}\s*(\d{4})\s+في\s+(.+)/

// English debit
// "AlexBank: Debit EGP 1,250.00 on card *1234 at CARREFOUR. Available: EGP 18,750.00"
/debit egp\s+([\d,]+\.?\d*)\s+on card[^\d]*(\d{4})\s+at\s+(.+?)(?:\.|available)/i
```

#### Fawry
- **SMS sender**: `Fawry` or `15033`
- **Language**: Arabic and English

```ts
// Payment confirmation
// "Fawry: Payment of EGP 250.00 to Vodafone completed successfully. Ref: 123456789"
/payment of egp\s+([\d,]+\.?\d*)\s+to\s+(.+?)\s+completed/i

// Arabic payment
// "فوري: تم سداد 250.00 جنيه لـ فودافون بنجاح. رقم العملية: 123456789"
/تم سداد\s*([\d,\.]+)\s*جنيه\s+لـ?\s*(.+?)\s+بنجاح/
```

#### Vodafone Cash
- **SMS sender**: `VFCash` or `Vodafone`
- **Language**: Arabic and English

```ts
// Arabic transfer received
// "فودافون كاش: استلمت 500.00 جنيه من 01012345678 رصيدك 1,500.00 جنيه"
/استلمت\s*([\d,\.]+)\s*جنيه\s+من\s+(\d{11})/

// Arabic payment made
// "فودافون كاش: دفعت 250.00 جنيه لـ Carrefour رصيدك 1,250.00 جنيه"
/دفعت\s*([\d,\.]+)\s*جنيه\s+لـ?\s*(.+?)\s+رصيد[كـ]?/

// English
// "VF Cash: You sent EGP 500.00 to 01012345678. Your balance is EGP 1,500.00"
/you sent egp\s+([\d,]+\.?\d*)\s+to\s+(\d{11})/i
```

#### InstaPay
- **SMS sender**: `InstaPay` or `IPN`
- **Language**: Arabic and English

```ts
// Received
// "InstaPay: You received EGP 2,000.00 from Ahmed Mohamed. Balance: EGP 5,500.00"
/you received egp\s+([\d,]+\.?\d*)\s+from\s+(.+?)(?:\.|balance)/i

// Sent
// "InstaPay: You sent EGP 1,000.00 to Sara Ali. Balance: EGP 4,500.00"
/you sent egp\s+([\d,]+\.?\d*)\s+to\s+(.+?)(?:\.|balance)/i

// Arabic received
// "إنستاباي: استلمت 2,000.00 جنيه من أحمد محمد. رصيدك: 5,500.00 جنيه"
/استلمت\s*([\d,\.]+)\s*جنيه\s+من\s+(.+?)(?:\.|رصيد)/
```

---

### Full Parser Implementation

```ts
// lib/sms-parser.ts

export interface ParsedTransaction {
  amount: number          // integer piastres
  type: 'debit' | 'credit'
  merchant: string | null
  accountLast4: string | null
  bank: string
  rawMessage: string
}

const DEBIT_KEYWORDS = ['debited', 'debit', 'خصم', 'تم الخصم', 'دفعت', 'you sent', 'payment of']
const CREDIT_KEYWORDS = ['credited', 'credit', 'إيداع', 'تم الإيداع', 'استلمت', 'you received', 'deposited']

export function normalizeArabicDigits(str: string): string {
  return str.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
            .replace(/٬/g, ',')
            .replace(/٫/g, '.')
}

function detectType(body: string): 'debit' | 'credit' {
  const lower = body.toLowerCase()
  if (DEBIT_KEYWORDS.some(k => lower.includes(k))) return 'debit'
  if (CREDIT_KEYWORDS.some(k => lower.includes(k))) return 'credit'
  return 'debit' // safe default
}

function extractAmount(body: string): number | null {
  // Matches: 1,250.00 | 1250 | 1,250 | 30,000.50
  const match = body.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/)
  if (!match) return null
  return parseAmount(match[1])
}

function parseAmount(raw: string): number {
  return Math.round(parseFloat(raw.replace(/,/g, '')) * 100)
}

export function parseSMS(sender: string, body: string, bank: string): ParsedTransaction | null {
  const normalized = normalizeArabicDigits(body)
  const type = detectType(normalized)

  // Try bank-specific patterns first, fall back to generic extraction
  const amount = extractAmount(normalized)
  if (!amount || amount <= 0) return null

  // Extract merchant — text after "at", "في", "لـ", "to" keywords
  const merchantMatch = normalized.match(
    /(?:at|في|لـ?|to)\s+([A-Za-zأ-ي][A-Za-zأ-ي\s]{1,40}?)(?:\s+on|\s+\.|,|$)/i
  )
  const merchant = merchantMatch ? merchantMatch[1].trim() : null

  // Extract account last 4
  const last4Match = normalized.match(/(?:XXXX|\*{1,4})(\d{4})/)
  const accountLast4 = last4Match ? last4Match[1] : null

  return {
    amount,
    type,
    merchant,
    accountLast4,
    bank,
    rawMessage: body, // store original, not normalized — never store in DB
  }
}

// Sender → bank name mapping
export const SMS_SENDER_MAP: Record<string, string> = {
  'CIB':         'CIB',
  'CIB-Egypt':   'CIB',
  'NBE':         'NBE',
  '19623':       'NBE',
  'BanqueMisr':  'Banque Misr',
  'بنك مصر':    'Banque Misr',
  'QNBAlahli':   'QNB Al Ahli',
  'QNB':         'QNB Al Ahli',
  'HSBC':        'HSBC Egypt',
  'AlexBank':    'Alex Bank',
  'Fawry':       'Fawry',
  '15033':       'Fawry',
  'VFCash':      'Vodafone Cash',
  'InstaPay':    'InstaPay',
  'IPN':         'InstaPay',
}
```

> **Important**: The `rawMessage` field must **never** be stored in the database. Only the parsed fields (`amount`, `type`, `merchant`, `accountLast4`) go into the `transactions` table. This is a hard rule for user privacy.

---

## Screen-by-Screen Layout Descriptions

Every screen below is the single source of truth for layout. Claude Code must reference the Paper MCP file for exact spacing values, but use these descriptions to understand content hierarchy and component composition.

---

### Screen 1 — Home (index)

**Layout**: `ScrollView` with `pageBg` background. `paddingBottom: PILL_CLEARANCE + insets.bottom`.

```
StatusBar (light content)
│
├── Header Row                          [px-4, pt-2]
│   ├── Avatar circle (initials)        [w-9 h-9, bg-accent-light, accent text]
│   ├── "Good morning, [name]"          [flex-1, text-textSecondary, text-sm]
│   └── Bell icon button                [w-9 h-9, bg-surface rounded-full]
│
├── Hero Balance Card                   [mx-3 mt-3, bg-accent, rounded-xl, p-4]
│   ├── Label: "Total balance"          [text-white/70, text-xs]
│   ├── Amount: "EGP 24,350"            [text-white, text-3xl, font-bold]
│   ├── Sub: "March 2026"               [text-white/60, text-xs, mb-3]
│   └── Stats Row                       [flex-row, gap-2]
│       ├── Stat pill: Spent            [flex-1, bg-white/15, rounded-lg, p-2]
│       └── Stat pill: Saved            [flex-1, bg-white/15, rounded-lg, p-2]
│
├── Quick-Action Row                    [mx-3 mt-3, flex-row, gap-3]
│   ├── "+ Expense" button              [flex-1, bg-surface, rounded-card, p-3, items-center]
│   │   ├── Circle icon (ArrowUpRight)  [w-8 h-8, bg-danger-light, rounded-full]
│   │   └── Label: "Expense"            [text-xs, text-textSecondary, mt-1]
│   ├── "+ Income" button               [flex-1, bg-surface, rounded-card, p-3, items-center]
│   │   ├── Circle icon (ArrowDownLeft) [w-8 h-8, bg-accent-light, rounded-full]
│   │   └── Label: "Income"             [text-xs, text-textSecondary, mt-1]
│   └── "+ Transfer" button             [flex-1, bg-surface, rounded-card, p-3, items-center]
│       ├── Circle icon (ArrowLeftRight)[w-8 h-8, bg-surface-2, rounded-full]
│       └── Label: "Transfer"           [text-xs, text-textSecondary, mt-1]
│   (each button opens AddTransactionSheet with the matching tab pre-selected)
│
├── Rollover Alert (conditional)        [mx-3 mt-3, bg-accent-light, rounded-lg, p-3]
│   ├── Green dot                       [w-2 h-2, bg-accent, rounded-full]
│   └── "[Amount] rolled over in [Cat]" [text-accent, text-sm, flex-1]
│
├── Section: "Budgets"                  [section label style, px-4, mt-4]
│   └── Category Cards List            [mx-3, bg-surface, rounded-card, overflow-hidden]
│       └── CategoryRow (repeating)
│           ├── Icon circle             [w-8 h-8, rounded-lg, tinted bg]
│           ├── Name + sub-label        [flex-1]
│           ├── Amount remaining        [text-right]
│           └── Progress bar            [w-12, h-1, bg-border, rounded-full]
│               └── Fill               [bg-accent | bg-warning | bg-danger]
│
├── Section: "Recent transactions"      [section label style, px-4, mt-4]
│   └── Transaction List               [mx-3, bg-surface, rounded-card, overflow-hidden]
│       └── TransactionRow (repeating)
│           ├── Icon circle             [w-8 h-8, rounded-full, bg-accent-light]
│           ├── Merchant + date/cat     [flex-1]
│           ├── Amount                  [debit=danger, credit=accent]
│           └── Source badge           [bg-accent-light, text-accent, text-xs]
│
│
├── Section: "Goals"                    [section label style, px-4, mt-4]
│   └── Horizontal scroll (FlatList horizontal)
│       └── GoalMiniCard               [w-40, bg-surface, rounded-card, p-3]
│           ├── Goal name               [text-sm, font-medium, truncate]
│           ├── Mini progress bar       [h-1.5, bg-border, mt-2, rounded-full]
│           │   └── accent fill at goal % complete
│           └── "X,XXX / X,XXX EGP"    [text-xs, text-textMuted, mt-1]
│
├── Upcoming renewal alert (conditional — renewal within 7 days)
│   └── Alert pill                      [mx-3, bg-warning-light, border-warning/30, rounded-lg, p-3]
│       ├── Clock icon                  [text-warning, size-14]
│       └── "[App] renews in N days — EGP X,XXX" [text-sm, text-warning]
│
└── FloatingTabBar                      [absolute, bottom]
```

---

### Screen 2 — Budget

**Layout**: `ScrollView`, `pageBg`. Three internal segment tabs: Budgets · Goals · Rollovers.

```
StatusBar
│
├── Screen Title: "Budget"              [px-4, pt-4, text-xl, font-semibold]
├── Month Selector Row                  [px-4, flex-row, justify-between, mt-2]
│   ├── ChevronLeft button
│   ├── "March 2026"                    [text-base, font-medium]
│   └── ChevronRight button
│
├── Summary Ring Card                   [mx-3 mt-3, bg-surface, rounded-card, p-4]
│   ├── Circular progress ring          [Victory Native donut chart]
│   ├── Center: spent / total           [absolute center text]
│   └── Legend row: Spent · Remaining · Rollover
│
├── Segment Tabs                        [mx-3 mt-3, flex-row, bg-surface-2, rounded-full, p-1]
│   ├── "Budgets"   pill                [active: bg-surface, border-border]
│   ├── "Goals"     pill
│   └── "Rollovers" pill
│
│   ── BUDGETS TAB ──────────────────────────────────────
│   └── Accordion list                  [mx-3, bg-surface, rounded-card]
│       └── MainCategoryRow (tap to expand)
│           ├── Icon + name             [flex-row, items-center]
│           ├── Total available         [text-right]
│           ├── Wide progress bar       [h-1.5, full width]
│           │   Fill: accent <75% / warning 75-99% / danger 100%+
│           └── Expanded sub-cats       [pl-10, border-l border-border-light]
│               └── SubCategoryRow
│                   ├── Name
│                   ├── "X,XXX / X,XXX EGP"
│                   └── Mini progress bar
│
│   ── GOALS TAB ─────────────────────────────────────────
│   ├── "+ Add goal" CTA                [mx-3, dashed border, rounded-card, text-accent]
│   └── GoalCard list                   [mx-3, gap-3]
│       └── GoalCard                    [bg-surface, rounded-card, p-4]
│           ├── Goal name               [text-base, font-semibold]
│           ├── Linked category badge   [bg-accent-light, text-accent, text-xs]
│           ├── Progress bar            [h-2, bg-border fill to accent]
│           ├── "X,XXX / X,XXX EGP"    [text-sm]
│           ├── "~N months to go"       [text-textMuted, text-xs]
│           └── "+ Add funds" link      [text-accent, text-xs, align-end]
│
│   ── ROLLOVERS TAB ──────────────────────────────────────
│   └── RolloverCard list               [mx-3, gap-3]
│       └── RolloverCard                [bg-surface, rounded-card, p-4]
│           ├── Category icon + name
│           ├── Rollover amount         [text-accent, font-semibold]
│           ├── "Accumulated over N months" [text-textMuted, text-xs]
│           └── Action buttons          [flex-row, gap-2, mt-3, flex-wrap]
│               ├── "Keep"              [pill, bg-surface-2]
│               ├── "Move to Savings"   [pill, bg-surface-2]
│               ├── "Redistribute"      [pill, bg-surface-2]
│               └── "Reset"             [pill, bg-danger-light, text-danger]
│
└── FloatingTabBar
```

**Add Goal bottom sheet** (triggered by "+ Add goal"):
```
BottomSheet snap: ['60%', '88%']
├── Title: "New goal"
├── Goal name input
├── Target amount input                 [numeric, EGP]
├── Linked category picker              [chips — sub-category list]
├── Monthly contribution input          [auto-calculates months to complete]
├── "~N months to reach goal"           [live preview, text-textMuted]
└── CTA: "Create goal"                  [bg-accent]
```

**Goal data model** (add to Supabase migration 013):
```sql
create table public.goals (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users(id) on delete cascade,
  sub_category_id   uuid references public.sub_categories(id) on delete set null,
  name              text not null,
  target_amount     bigint not null,
  current_amount    bigint not null default 0,
  monthly_contribution bigint not null default 0,
  is_complete       boolean not null default false,
  created_at        timestamptz not null default now()
);
alter table public.goals enable row level security;
create policy "Users can manage own goals"
  on public.goals for all using (auth.uid() = user_id);
```

---

### Screen 3 — Trends (Analytics)

**Layout**: `ScrollView`, `pageBg`.

```
StatusBar
│
├── Screen Title: "Trends"
├── Period Selector                     [pill tabs: Week · Month · Year]
│
├── Spending Bar Chart                  [mx-3, bg-surface, rounded-card, p-4]
│   └── Victory Native CartesianChart  [bar: spent=accent, budget=border]
│
├── Section: "By category"
│   └── Category breakdown list        [mx-3, bg-surface, rounded-card]
│       └── Row: icon · name · bar · amount + %
│
├── Section: "Top merchants"
│   └── Merchant list                  [mx-3, bg-surface, rounded-card]
│       └── Row: initials circle · name · count · total amount
│
├── Section: "Savings rate"
│   └── Line chart                     [mx-3, bg-surface, rounded-card, p-4]
│       └── Victory Native Line        [color=accent]
│
└── FloatingTabBar
```

---

### Screen 4 — AddTransactionSheet (triggered from Home, NOT a tab)

**Component**: `components/transactions/AddTransactionSheet.tsx`
**Trigger**: "Expense", "Income", or "Transfer" buttons on the Home screen action row.
**Container**: `@gorhom/bottom-sheet`, snap points `['55%', '92%']`.
One sheet, three tab views. Opens with the matching tab active based on which button was tapped.
`ui.store.ts` holds `activeTransactionType: 'expense' | 'income' | 'transfer' | null`.

```
Bottom Sheet (over dark overlay)
│
├── Handle indicator                    [w-9 h-1, bg-border, self-center, mt-2]
│
├── Tab Toggle                          [mx-4, mt-2, flex-row, bg-surface-2, rounded-full, p-1]
│   ├── "Expense" pill                  [active: bg-surface border-border text-textPrimary]
│   ├── "Income"  pill
│   └── "Transfer" pill
│
├── Amount Display                      [text-center, pt-4, pb-2]
│   ├── Currency label: "EGP"           [text-textMuted, text-base]
│   └── Amount: "0"                     [text-4xl, font-bold, numeric keyboard]
│
│   ── EXPENSE TAB ────────────────────────────────────────
├── "MERCHANT" text input               [px-4, mt-2]
├── "CATEGORY" accordion picker         [CategoryAccordionPicker]
│   └── Main category rows (tap to expand → sub-category chips)
│       Living Expenses expanded by default
├── Note + date row                     [px-4, mt-2]
├── CTA: "Save expense"                 [mx-4, mt-4, bg-accent, rounded-btn]
└── Voice mic button                    [small green circle, bottom-right; stub v1]
│
│   ── INCOME TAB ─────────────────────────────────────────
├── "SOURCE" text input                 [e.g. "Monthly Salary"]
├── "TO ACCOUNT" picker                 [loads from accounts table]
├── Note + date row
└── CTA: "Save income"                  [also inserts income_events row]
│
│   ── TRANSFER TAB ───────────────────────────────────────
├── Sub-label: "Move money between your own accounts"
├── FROM account card                   [account name, ····last4, balance]
├── Swap arrow button                   [swaps FROM/TO]
├── TO account card
├── Note + date row
└── CTA: "Transfer [amount] EGP"        [amount-specific label]
```

---

### Screen 5 — Subscriptions (4th tab)

**Layout**: `ScrollView`, `pageBg`. This is the **4th tab** in the floating pill — a first-class screen, not buried in settings.

```
StatusBar
│
├── Screen Title: "Subscriptions"       [px-4, pt-4, text-xl, font-semibold]
├── "+ Add subscription" button         [top-right, text-accent, text-sm]
│
├── Summary Row                         [mx-3 mt-3, flex-row, gap-3]
│   ├── Metric card: "Monthly total"    [flex-1, bg-surface, rounded-card]
│   │   └── "EGP 1,250 / mo"
│   └── Metric card: "Yearly total"     [flex-1, bg-surface, rounded-card]
│       └── "EGP 9,800 / yr"
│
├── Renewal Calendar                    [mx-3 mt-3, bg-surface, rounded-card, p-4]
│   ├── Label: "UPCOMING RENEWALS"      [section label]
│   ├── Horizontal date strip           [flat list of next 14 days]
│   │   └── Day cell: date number + dot if renewal that day
│   └── Renewals on selected day        [list below strip]
│       └── Row: icon · name · amount · days until
│
├── Section: "Active"                   [section label, mt-4]
│   └── Subscription list               [mx-3, bg-surface, rounded-card]
│       └── SubscriptionRow (Swipeable — swipe left to delete)
│           ├── App icon circle         [w-9 h-9, rounded-xl, bg-surface-2]
│           ├── Name + billing cycle    [flex-1]
│           ├── Next renewal date       [text-textMuted, text-xs]
│           └── Amount                  [text-base, font-semibold]
│               monthly shown as "/mo", yearly as "/yr"
│
├── Section: "Inactive / paused"        [section label, mt-4, if any exist]
│   └── Same SubscriptionRow but muted opacity (0.5)
│
└── FloatingTabBar
```

**Add Subscription bottom sheet** (triggered by "+ Add subscription"):
```
BottomSheet snap: ['65%', '92%']
├── Title: "Add subscription"
├── Name input                          [e.g. Netflix, Spotify, ChatGPT]
├── Amount input                        [numeric, EGP]
├── Billing cycle picker                [Monthly / Yearly — pill toggle]
├── Next renewal date picker            [date wheel]
├── Linked sub-category picker          [chips]
├── Reminder toggle                     [N days before renewal]
│   └── Days selector (1 / 3 / 7)       [shown when toggle on]
└── CTA: "Save subscription"            [bg-accent]
```

**Subscription data model** — already in migration 010 (`subscriptions_tracked`). Add reminder fields:
```sql
-- Migration 010 amendment — run via Supabase MCP
alter table public.subscriptions_tracked
  add column reminder_enabled boolean not null default true,
  add column reminder_days_before smallint not null default 3;
```

---

### Screen 6 — Settings

**Layout**: `ScrollView`, `pageBg`.

```
StatusBar
│
├── Avatar + Name header                [px-4, pt-4, flex-row, items-center, gap-3]
│   ├── Large avatar circle            [w-14 h-14]
│   └── Name + email
│
├── Section: "Budget"
│   └── Settings list card             [mx-3, bg-surface, rounded-card]
│       ├── Row: Monthly income         → navigate to income setup
│       ├── Row: Allocation template    → navigate to allocation screen
│       └── Row: Budget reset day       → inline picker
│
├── Section: "Automation"
│   └── Settings list card
│       ├── Row: Apple Pay setup        → onboarding flow re-entry
│       ├── Row: SMS rules              → sms-rules screen
│       └── Row: Bank senders           → configure sender list
│
├── Section: "Subscription tracking"
│   └── Settings list card
│       └── Row: Manage subscriptions   → subscriptions screen
│
├── Section: "App"
│   └── Settings list card
│       ├── Row: Language (AR / EN)
│       ├── Row: Currency
│       └── Row: Notifications
│
├── Section: "Account"
│   └── Settings list card
│       ├── Row: Vault Pro              → paywall (RevenueCat)
│       ├── Row: Restore purchases
│       └── Row: Sign out               [text-danger]
│
└── FloatingTabBar
```

---

### Screen 7 — Onboarding Flow

See full breakdown in the Onboarding section below.

---

## Onboarding Flow — Step by Step

Onboarding is a **multi-step wizard** managed by Redux (`onboardingSlice`). Each step is a full screen with no tab bar — the `FloatingTabBar` is hidden during onboarding. Progress is shown as a thin dot indicator at the top.

### Step structure

```ts
// redux/slices/onboardingSlice.ts
type OnboardingStep =
  | 'welcome'
  | 'name'
  | 'income'
  | 'income-date'
  | 'allocation'
  | 'shortcut-setup'    // Apple Pay + Bank SMS + InstaPay — one unified setup screen
  | 'complete'          // writes all data to Supabase, routes to (tabs)
```

---

### Step 1 — Welcome

```
Full screen, pageBg
│
├── Vault logo mark                     [center, mt-20, w-16 h-16]
├── Headline: "Meet Vault"              [text-3xl, font-bold, text-center, mt-6]
├── Sub: "Your money, finally clear."  [text-textSecondary, text-center, mt-2, px-8]
│
├── Feature pills (3 rows)             [mt-10, px-6, gap-3]
│   ├── "✦  Auto-tracks Apple Pay"
│   ├── "✦  Reads your bank SMS"
│   └── "✦  Budgets that roll over"
│
└── CTA: "Get started"                 [mx-6, mt-auto, mb-10, bg-accent, rounded-btn]
```

---

### Step 2 — Your Name

```
│
├── Back arrow                          [top-left]
├── Progress dots                       [top-center]
├── Headline: "What should we call you?"
├── TextInput (first name)              [large, centered, bg-surface-2]
│
└── CTA: "Continue"                    [bottom, disabled until non-empty]
```

---

### Step 3 — Monthly Income

```
│
├── Headline: "What's your monthly income?"
├── Sub: "We use this to set up your budget automatically"
│
├── Amount input                        [large centered number input]
│   ├── Currency: "EGP"
│   └── TextInput (numeric keyboard)
│
├── Helper: "This stays on your device" [text-textMuted, text-xs, text-center]
│
└── CTA: "Continue"
```

---

### Step 4 — Income Arrival Date

```
│
├── Headline: "When does your salary arrive?"
│
├── Date picker grid (1–31)             [mx-4, grid 7 cols, rounded day buttons]
│   └── Selected day                    [bg-accent, text-white]
│
├── Helper: "We'll automatically apply your budget on this day each month"
│
└── CTA: "Continue"
```

---

### Step 5 — Budget Allocation

```
│
├── Headline: "How do you want to split [income] EGP?"
├── Sub: "Drag to adjust. Must total 100%."
│
├── Allocation sliders (per main category)
│   └── Row per category:
│       ├── Icon + name
│       ├── Slider (Reanimated)
│       └── Amount display (updates live)
│
├── Total bar                           [shows remaining unallocated]
│   ├── Green fill = allocated
│   └── "23,000 EGP remaining"
│
└── CTA: "Looks good"                  [disabled until 100% allocated]
```

---

### Step 6 — Shortcut Setup

Covers Apple Pay, Bank SMS, InstaPay, and Fawry in a single unified screen. No separate SMS or Apple Pay steps.

```
│
├── Back arrow
├── Progress dots                       [6 dots, 6th active]
│
├── Illustration                        [4 transaction source cards arranged around Vault logo]
│   ├── CIB BANK card — "Debited EGP 850 at Carrefour"
│   ├── APPLE PAY card — "EGP 120 at Starbucks"
│   ├── INSTAPAY card — "Received EGP 2,000 from Sara"
│   └── FAWRY card — "Payment EGP 250 to Vodafone"
│   └── Vault lock icon [center, bg-accent, rounded-xl]
│
├── Headline: "One shortcut,\neverything tracked."
├── Sub: "Vault reads notifications from your bank, Apple Pay,\nInstaPay, and Fawry — all automatically."
│
├── Numbered step list
│   ├── 1  "Download the Vault Shortcut"    [sub: "Tap 'Get Shortcut' — opens Shortcuts app"]
│   │                                        [trailing "Get" link — accent color]
│   ├── 2  "Tap 'Add Shortcut' and allow access"
│   └── 3  "Make a test transaction to verify"
│
├── Privacy note: "No bank login. Your messages are never stored."
│   [ShieldCheck icon, text-textMuted, text-xs]
│
├── CTA: "I've set it up"               [bg-accent, full-width, bottom]
└── Skip link: "Skip for now"           [text-textMuted, text-center, below CTA]
```

---

### Step 7 — Complete

```
│
├── Checkmark circle animation          [Reanimated scale + opacity, bg-accent, white check]
│   └── Outer glow ring                 [bg-accentLight, larger circle behind]
│
├── Headline: "You're all set,"         [text-textPrimary, bold]
│   └── "[name]!"                       [text-accent, bold — on same line or line below]
├── Sub: "Your first budget starts today."  [text-textMuted, text-center]
│
├── Summary card                        [mx-4, bg-surface, rounded-card, p-4, gap between rows]
│   ├── Row: $ icon · "Monthly income"  · "[amount] EGP"   [right-aligned, font-semibold]
│   ├── Row: calendar icon · "Budget resets on" · "[date] of month"
│   └── Row: shield icon · "Auto-tracking" · chips [Apple Pay] [Bank SMS] [InstaPay]
│       chips: [bg-accentLight, text-accent, text-xs, rounded-full, px-2 py-0.5]
│
└── CTA: "Go to Vault"                 [bg-accent → writes user_settings + default categories
                                        to Supabase, then router.replace('/(tabs)')]
```

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

Vault uses **Paper** (paper.design) as its design tool. The Paper MCP server connects Claude Code directly to the open Paper design file, giving it live context on layouts, tokens, spacing, and component structure while building UI.

### Setup (Claude Code)

Run this once in your terminal to register the Paper MCP server:

```bash
claude mcp add paper --transport http http://127.0.0.1:29979/mcp --scope user
```

Then open your Vault design file in **Paper Desktop** — the MCP server starts automatically in the background when a file is open.

Verify the connection is working by running `/mcp` inside a Claude Code session. Paper should appear in the list of available servers.

### How It Works

1. Open the Vault `.paper` design file in Paper Desktop
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

## Out of Scope (v1)

- Bank account syncing via open banking / Plaid (no Egyptian open banking infrastructure yet)
- Receipt scanning / OCR
- Shared budgets / family accounts
- Web dashboard
- Investment tracking
