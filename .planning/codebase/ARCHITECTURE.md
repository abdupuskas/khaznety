# Architecture

**Analysis Date:** 2026-03-25

## Pattern Overview

**Overall:** Expo Router File-Based Routing + Multi-Layer State Management

**Key Characteristics:**
- File-based routing with named groups (tabs, auth, onboarding)
- Hybrid state management: Redux (onboarding) + Zustand (UI) + React Query (server)
- Supabase as single backend (PostgreSQL + Auth + Realtime)
- SMS processing pipeline for automated transaction import
- RevenueCat-managed IAP/subscriptions

## Layers

**Screen Layer (app/):**
- Purpose: UI rendering and navigation
- Contains: Expo Router screens organized by named groups
- Depends on: hooks, components, stores, constants
- Used by: Expo Router (file-based)

**Hook Layer (hooks/):**
- Purpose: Data fetching orchestration via React Query
- Contains: `useTransactions`, `useCategories`, `useMonthlyBudgets`, `useGoals`, `useSubscriptions`, `useAccounts`, `useAuth`, `useIsPro`, `useCurrency`, `useTranslation`
- Depends on: lib (Supabase client), stores (auth state), @tanstack/react-query
- Used by: Screen layer, component layer

**Component Layer (components/):**
- Purpose: Reusable UI elements
- Contains: Atomic primitives (ui/), feature components (transactions/, budget/, subscriptions/)
- Depends on: constants (tokens), hooks, stores, react-native-reanimated
- Used by: Screen layer

**Service/Library Layer (lib/):**
- Purpose: Core business logic and external API clients
- Contains: `supabase.ts`, `sms-parser.ts`, `sms-categorizer.ts`, `sms-processor.ts`, `budget-engine.ts`, `revenuecat.ts`, `i18n.ts`, `currency.ts`, `export.ts`
- Depends on: Supabase SDK, RevenueCat SDK, constants
- Used by: Hook layer, screen layer (deep links)

**State Layer (stores/ + redux/):**
- Purpose: Global state management
- Contains: Zustand stores (`auth.store.ts`, `ui.store.ts`, `notifications.store.ts`), Redux (`onboardingSlice.ts`)
- Depends on: zustand, @reduxjs/toolkit
- Used by: All layers

**Constants Layer (constants/):**
- Purpose: Configuration data and design tokens
- Contains: `tokens.ts`, `categories.ts`, `banks.ts`, `subscriptions.ts`
- Depends on: Nothing
- Used by: All layers

## Data Flow

**Query (Read):**
1. UI component calls React Query hook (e.g., `useTransactions(month)`)
2. Hook calls async fetch function with Supabase client
3. Supabase returns data from PostgreSQL (RLS-filtered by user_id)
4. React Query caches result (staleTime: 5min)
5. Component re-renders with data

**Mutation (Write):**
1. User action triggers `useMutation` (e.g., add transaction)
2. Mutation calls Supabase `.insert()` / `.update()` / `.delete()`
3. `onSuccess` invalidates related query keys (e.g., `['transactions']`, `['monthly_budgets']`)
4. Queries refetch with fresh data

**SMS Import (Deep Link):**
1. iOS Shortcut fires `vault://sms-import?sender=CIB&body=...`
2. Deep link handler in `app/_layout.tsx` receives URL
3. `processSMSMessage()` orchestrates: parse -> categorize -> insert
4. `parseSMS()` extracts amount, merchant, type via bank-specific regex
5. `categorizeTransaction()` matches to sub-category via user rules
6. Transaction inserted into Supabase with idempotency key
7. Budget spent amount incremented in `monthly_budgets`
8. React Query caches invalidated

**Auth Flow:**
1. App launch -> `useAuth()` checks `supabase.auth.getSession()`
2. If session exists: check `user_settings` table
3. If settings exist: route to `/(tabs)` (main app)
4. If no settings: route to `/onboarding/income` (resume onboarding)
5. If no session: route to `/(auth)/sign-in`

**State Management:**
- React Query: Source of truth for all Supabase data
- Zustand: Auth session, UI toggles (locale, currency, active transaction type)
- Redux: Multi-step onboarding wizard state only
- useState: Component-local ephemeral state

## Key Abstractions

**React Query Hooks:**
- Purpose: Encapsulate data fetching with caching
- Examples: `hooks/useTransactions.ts`, `hooks/useCategories.ts`, `hooks/useMonthlyBudgets.ts`
- Pattern: `useQuery` for reads, `useMutation` with cache invalidation for writes

**Zustand Stores:**
- Purpose: Lightweight cross-component state
- Examples: `stores/auth.store.ts`, `stores/ui.store.ts`
- Pattern: `create<State>((set) => ({ state, actions }))`

**SMS Processing Pipeline:**
- Purpose: Parse bank SMS -> categorize -> create transaction
- Examples: `lib/sms-parser.ts` -> `lib/sms-categorizer.ts` -> `lib/sms-processor.ts`
- Pattern: Pipeline with idempotency guard

**Bottom Sheets:**
- Purpose: Modal interactions (Revolut-style)
- Examples: `components/transactions/AddTransactionSheet.tsx`
- Pattern: `@gorhom/bottom-sheet` with snap points

## Entry Points

**Root Layout:**
- Location: `app/_layout.tsx`
- Triggers: App launch
- Responsibilities: Provider wrapping (Gesture, SafeArea, Redux, QueryClient), font loading, auth listener, RevenueCat init, push notification setup, deep link handler

**Tab Layout:**
- Location: `app/(tabs)/_layout.tsx`
- Triggers: Authenticated user navigation
- Responsibilities: Tab navigator with custom `FloatingTabBar`, screen registration

**Auth Hook:**
- Location: `hooks/useAuth.ts`
- Triggers: Session state changes
- Responsibilities: Route to tabs/onboarding/sign-in based on auth + settings state

## Error Handling

**Strategy:** Try/catch at service boundaries, React Query error states at UI

**Patterns:**
- Supabase calls wrapped in try/catch in lib/ layer
- React Query propagates errors to components via `isError`
- SMS parser returns null on unparseable messages (graceful skip)
- Fallback categorization for unmatched SMS (-> "Uncategorized")
- Deep link errors logged in development mode

## Cross-Cutting Concerns

**Logging:**
- `console.log` / `console.warn` in development
- No production logging/telemetry framework (noted as concern)

**Validation:**
- Zod schemas for form inputs via react-hook-form
- Bank-specific regex validation in SMS parser
- RLS policies enforce data access at database level

**Authentication:**
- Supabase Auth (email/password)
- Secure token storage via `expo-secure-store` (OS keychain)
- Auto-refresh tokens enabled
- RevenueCat user identified by Supabase user ID

**Localization:**
- `i18n-js` with Arabic (primary) + English
- RTL support via `I18nManager.forceRTL()`
- Cairo font family for Arabic text

---

*Architecture analysis: 2026-03-25*
*Update when major patterns change*
