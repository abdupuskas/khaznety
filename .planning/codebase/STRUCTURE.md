# Codebase Structure

**Analysis Date:** 2026-03-25

## Directory Layout

```
vault/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.tsx             # Root layout (providers, auth, deep links)
│   ├── (tabs)/                 # Main tab screens
│   │   ├── _layout.tsx         # FloatingTabBar setup
│   │   ├── index.tsx           # Home (balance, budgets, transactions)
│   │   ├── budget.tsx          # Budget management + goals + rollovers
│   │   ├── trends.tsx          # Analytics charts
│   │   ├── subscriptions.tsx   # Subscription tracker + calendar
│   │   └── settings.tsx        # Profile & app settings
│   ├── (auth)/                 # Auth screens
│   │   └── sign-in.tsx
│   ├── onboarding/             # Wizard steps
│   │   ├── welcome.tsx
│   │   ├── name.tsx
│   │   ├── income.tsx
│   │   ├── income-date.tsx
│   │   ├── allocation.tsx
│   │   ├── shortcut-setup.tsx
│   │   └── complete.tsx
│   ├── budget/                 # Budget feature screens
│   │   ├── add-goal.tsx
│   │   ├── add-category.tsx
│   │   ├── add-subcategory.tsx
│   │   ├── set-budget.tsx
│   │   └── goal/[id].tsx
│   ├── subscriptions/          # Subscription screens
│   │   ├── add.tsx
│   │   └── [id].tsx
│   ├── settings/               # Settings sub-screens
│   │   ├── monthly-income.tsx
│   │   ├── allocation.tsx
│   │   ├── budget-reset-day.tsx
│   │   ├── shortcut-setup.tsx
│   │   ├── currency.tsx
│   │   ├── edit-profile.tsx
│   │   ├── merchant-categories.tsx
│   │   ├── notifications.tsx
│   │   ├── export.tsx
│   │   └── about.tsx
│   ├── accounts/
│   │   └── add.tsx
│   ├── trends/
│   │   └── [category].tsx
│   ├── transaction/[id].tsx
│   ├── transactions/index.tsx
│   ├── paywall.tsx
│   ├── notifications.tsx
│   └── dev/sms-test.tsx        # Dev-only SMS parser test screen
├── components/                 # React components
│   ├── ui/                     # Atomic primitives
│   │   ├── Text.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── PressableScale.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── FloatingTabBar.tsx
│   │   ├── SegmentTabs.tsx
│   │   ├── MonthSelector.tsx
│   │   ├── ProgressDots.tsx
│   │   ├── RolloverAlertPill.tsx
│   │   ├── AccountSwitcher.tsx
│   │   ├── InfoCard.tsx
│   │   └── AppLogo.tsx
│   ├── transactions/           # Transaction feature components
│   │   ├── AddTransactionSheet.tsx
│   │   ├── CategoryAccordionPicker.tsx
│   │   └── TransactionRow.tsx
│   ├── budget/                 # Budget feature components
│   │   ├── CategoryRow.tsx
│   │   ├── MainCategoryAccordion.tsx
│   │   ├── GoalMiniCard.tsx
│   │   └── SummaryRing.tsx
│   ├── subscriptions/          # Subscription components
│   └── charts/                 # Chart components
├── lib/                        # Business logic & services
│   ├── supabase.ts             # Supabase client + secure token storage
│   ├── sms-parser.ts           # Bank SMS regex parsing
│   ├── sms-categorizer.ts      # Rule-based transaction categorization
│   ├── sms-processor.ts        # SMS pipeline orchestrator
│   ├── budget-engine.ts        # Rollover + allocation calculations
│   ├── revenuecat.ts           # RevenueCat SDK integration
│   ├── i18n.ts                 # Internationalization setup
│   ├── currency.ts             # Currency conversion/formatting
│   └── export.ts               # CSV/PDF export utilities
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts
│   ├── useTransactions.ts
│   ├── useCategories.ts
│   ├── useMonthlyBudgets.ts
│   ├── useGoals.ts
│   ├── useSubscriptions.ts
│   ├── useAccounts.ts
│   ├── useUserProfile.ts
│   ├── useSmsRules.ts
│   ├── useIsPro.ts
│   ├── useCurrency.ts
│   ├── useTranslation.ts
│   ├── useFonts.ts
│   └── useNotifications.ts
├── stores/                     # Zustand stores
│   ├── auth.store.ts
│   ├── ui.store.ts
│   └── notifications.store.ts
├── redux/                      # Redux Toolkit (onboarding only)
│   ├── store.ts
│   └── slices/
│       └── onboardingSlice.ts
├── constants/                  # Config & design tokens
│   ├── tokens.ts               # Colors, spacing, radii, fonts, PILL_CLEARANCE
│   ├── categories.ts           # Default category definitions
│   ├── banks.ts                # Egyptian bank SMS patterns + sender map
│   └── subscriptions.ts        # Popular subscription templates
├── locales/                    # i18n translations
│   ├── ar.json                 # Arabic
│   └── en.json                 # English
├── assets/                     # Images, icons, fonts
├── __tests__/                  # Jest tests
│   ├── __mocks__/
│   │   └── supabase.ts         # Mocked Supabase client
│   └── lib/
│       ├── sms-parser.test.ts
│       └── sms-categorizer.test.ts
├── supabase/                   # Database migrations
│   └── migrations.sql
├── plugins/                    # Custom Expo plugins
│   └── with-process-sms-intent.js
├── .env                        # Environment variables
├── app.json                    # Expo config
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
├── jest.config.js
├── global.css                  # Tailwind CSS import
├── nativewind-env.d.ts
└── package.json
```

## Directory Purposes

**app/:**
- Purpose: Expo Router screens (file-based routing)
- Contains: `.tsx` screen files organized by named groups
- Key files: `_layout.tsx` (root), `(tabs)/_layout.tsx` (tab navigation)
- Subdirectories: `(tabs)/`, `(auth)/`, `onboarding/`, `budget/`, `settings/`, `subscriptions/`, `accounts/`, `trends/`, `transaction/`, `transactions/`, `dev/`

**components/ui/:**
- Purpose: Atomic reusable primitives
- Contains: Generic components used across all features
- Key files: `FloatingTabBar.tsx`, `Text.tsx`, `Card.tsx`, `PressableScale.tsx`, `ProgressBar.tsx`

**components/{feature}/:**
- Purpose: Feature-specific components
- Contains: Domain-bound components (transactions, budget, subscriptions)
- Key files: `AddTransactionSheet.tsx`, `CategoryAccordionPicker.tsx`, `MainCategoryAccordion.tsx`

**lib/:**
- Purpose: Business logic, services, external API clients
- Contains: Core utilities and service integrations
- Key files: `supabase.ts`, `sms-parser.ts`, `sms-processor.ts`, `budget-engine.ts`, `revenuecat.ts`

**hooks/:**
- Purpose: React Query data fetching + custom hooks
- Contains: All Supabase data access, auth, and utility hooks
- Key files: `useTransactions.ts`, `useCategories.ts`, `useAuth.ts`, `useMonthlyBudgets.ts`

**stores/:**
- Purpose: Zustand global state (lightweight)
- Contains: Auth session, UI preferences, notification queue
- Key files: `auth.store.ts`, `ui.store.ts`, `notifications.store.ts`

**redux/:**
- Purpose: Redux Toolkit for complex multi-step state
- Contains: Only onboarding wizard state
- Key files: `store.ts`, `slices/onboardingSlice.ts`

**constants/:**
- Purpose: Design tokens, configuration data
- Contains: Colors, spacing, bank patterns, default categories
- Key files: `tokens.ts`, `banks.ts`, `categories.ts`, `subscriptions.ts`

## Key File Locations

**Entry Points:**
- `app/_layout.tsx` - Root layout (providers, auth, deep links)
- `app/(tabs)/_layout.tsx` - Tab navigator with FloatingTabBar
- `hooks/useAuth.ts` - Auth state machine and routing

**Configuration:**
- `tsconfig.json` - TypeScript strict mode + `@/*` path alias
- `babel.config.js` - NativeWind JSX transform + Reanimated plugin
- `tailwind.config.js` - Tailwind theme (colors, radii)
- `app.json` - Expo plugins, orientation, platform config
- `jest.config.js` - Test runner with Supabase mock

**Core Logic:**
- `lib/supabase.ts` - Database client with secure token storage
- `lib/sms-parser.ts` - Bank SMS regex parsing engine
- `lib/sms-processor.ts` - SMS import pipeline
- `lib/budget-engine.ts` - Rollover + allocation calculations
- `lib/revenuecat.ts` - IAP subscription management

**Testing:**
- `__tests__/lib/sms-parser.test.ts` - 499-line parser test suite
- `__tests__/lib/sms-categorizer.test.ts` - 144-line categorizer tests
- `__tests__/__mocks__/supabase.ts` - Mocked Supabase client

## Naming Conventions

**Files:**
- PascalCase for React components: `FloatingTabBar.tsx`, `Card.tsx`, `AddTransactionSheet.tsx`
- kebab-case for utilities/lib: `sms-parser.ts`, `budget-engine.ts`
- camelCase with `use` prefix for hooks: `useTransactions.ts`, `useAuth.ts`
- camelCase with `.store.ts` suffix for Zustand: `ui.store.ts`, `auth.store.ts`
- kebab-case for screen routes: `shortcut-setup.tsx`, `budget-reset-day.tsx`
- `*.test.ts` for tests: `sms-parser.test.ts`

**Directories:**
- kebab-case for all directories
- Plural for collections: `stores/`, `hooks/`, `constants/`, `components/`
- Parenthesized for Expo Router groups: `(tabs)/`, `(auth)/`

## Where to Add New Code

**New Screen:**
- Screen file: `app/{feature}/{screen-name}.tsx`
- If tab: `app/(tabs)/{name}.tsx` + register in `(tabs)/_layout.tsx`

**New Feature Component:**
- Implementation: `components/{feature}/{ComponentName}.tsx`
- If atomic/reusable: `components/ui/{ComponentName}.tsx`

**New Data Hook:**
- Implementation: `hooks/use{Domain}.ts`
- Pattern: React Query `useQuery` + `useMutation` with cache invalidation

**New Business Logic:**
- Implementation: `lib/{module-name}.ts`
- Tests: `__tests__/lib/{module-name}.test.ts`

**New Store:**
- Zustand: `stores/{name}.store.ts`
- Redux slice: `redux/slices/{name}Slice.ts` (only if complex multi-step)

**New Constants:**
- Implementation: `constants/{name}.ts`

## Special Directories

**__tests__/:**
- Purpose: Jest test files (root-level, not co-located)
- Mirrors: source structure under `__tests__/lib/`, `__tests__/constants/`
- Committed: Yes

**supabase/:**
- Purpose: Database migration SQL
- Contains: `migrations.sql` with all schema DDL
- Committed: Yes

**plugins/:**
- Purpose: Custom Expo config plugins
- Contains: `with-process-sms-intent.js` (Android SMS intent)
- Committed: Yes

---

*Structure analysis: 2026-03-25*
*Update when directory structure changes*
