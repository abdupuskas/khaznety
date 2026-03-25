# External Integrations

**Analysis Date:** 2026-03-25

## APIs & External Services

**Backend (Supabase):**
- Supabase - PostgreSQL database, Auth, Realtime, Storage
  - SDK/Client: `@supabase/supabase-js` v2.99.3 (`lib/supabase.ts`)
  - Auth: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` env vars
  - Token storage: `expo-secure-store` (OS keychain)
  - Session: Auto-refresh enabled, persistent storage

**Payment Processing (RevenueCat):**
- RevenueCat - In-App Purchase management (Apple IAP + Google Play Billing)
  - SDK/Client: `react-native-purchases` v9.14.0 + `react-native-purchases-ui` v9.14.0 (`lib/revenuecat.ts`)
  - Auth: API key (currently hardcoded test key in `lib/revenuecat.ts`)
  - Entitlement: "Vault Pro"
  - Functions: `initRevenueCat()`, `checkIsPro()`, `getOfferings()`, `purchasePackage()`, `restorePurchases()`, `identifyUser()`
  - User linking: RevenueCat customer identified by Supabase user ID via `Purchases.logIn(userId)`

**Push Notifications (Expo):**
- Expo Notifications - Push notification service
  - SDK/Client: `expo-notifications` v55.0.13 (`hooks/useNotifications.ts`)
  - Token: Stored in `users` table as `push_token` column

## Data Storage

**Databases:**
- PostgreSQL on Supabase - Primary data store
  - Connection: via `EXPO_PUBLIC_SUPABASE_URL` env var
  - Client: `@supabase/supabase-js` v2.99.3
  - Migrations: `supabase/migrations.sql` (14 tables)
  - Tables: users, user_settings, main_categories, sub_categories, accounts, transactions, monthly_budgets, income_events, allocation_templates, allocation_items, subscriptions_tracked, sms_rules, user_subscriptions, goals

**Local Storage:**
- `expo-secure-store` - Auth tokens (Keychain / EncryptedSharedPreferences)
- `@react-native-async-storage/async-storage` - General local persistence

**File Storage:**
- Expo FileSystem (`expo-file-system`) - Temporary export files
- No Supabase Storage buckets configured for user uploads

**Caching:**
- React Query in-memory cache (staleTime: 5min, gcTime: 10min)
- No Redis or external caching

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Email/password signup
  - Implementation: Supabase client SDK with secure token adapter
  - Token storage: `expo-secure-store` (`lib/supabase.ts`)
  - Session management: JWT refresh tokens (auto-refresh enabled)

**RevenueCat Identity:**
- Linked via `Purchases.logIn(userId)` using Supabase user ID
- Synced on auth state change

**OAuth Integrations:**
- Not configured (email/password only currently)

## Monitoring & Observability

**Error Tracking:**
- None configured (no Sentry, Bugsnag, etc.)

**Analytics:**
- None configured (no Mixpanel, Amplitude, etc.)

**Logs:**
- `console.log` only, `__DEV__` guarded
- No production logging service

## CI/CD & Deployment

**Hosting:**
- Supabase cloud for backend
- App distributed via App Store (iOS) / Google Play (Android)

**CI Pipeline:**
- Not configured (no GitHub Actions, etc.)

**Build:**
- Expo managed workflow (`expo start`)
- EAS Build expected for production (not configured in repo)

## Environment Configuration

**Development:**
- Required env vars: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Secrets location: `.env` file (gitignored status unknown)
- Missing: `.env.example` template
- RevenueCat: Test API key hardcoded in `lib/revenuecat.ts`

**Production:**
- Supabase production project
- RevenueCat production API key (needs env var switch)
- Push notification credentials via Expo

## Webhooks & Callbacks

**Incoming:**
- RevenueCat webhook -> Supabase Edge Function (planned)
  - Target: Updates `user_subscriptions` table
  - Events: Subscription purchased, renewed, cancelled, expired

**Outgoing:**
- None

**Deep Links:**
- `vault://sms-import?sender={sender}&body={body}` - SMS import from iOS Shortcuts
  - Handler: `app/_layout.tsx` deep link listener
  - Processing: `lib/sms-processor.ts` pipeline

## SMS Integration (Egypt-specific)

**iOS:**
- Apple Shortcuts automation for Apple Pay + bank SMS
- Deep link URL scheme: `vault://sms-import`
- One-time setup guided in onboarding (`app/onboarding/shortcut-setup.tsx`)

**Android:**
- Custom Expo plugin: `plugins/with-process-sms-intent.js`
- Native SMS read permission for bank message parsing

**Supported Banks:**
- CIB, NBE, Banque Misr, QNB Al Ahli, HSBC Egypt, Alex Bank, ABK-Egypt
- Fawry, Vodafone Cash, InstaPay, Orange Money
- Sender mapping: `constants/banks.ts`
- Parser: `lib/sms-parser.ts`

## Export Integration

**PDF Generation:**
- `expo-print` - HTML-to-PDF conversion (`lib/export.ts`)

**File Sharing:**
- `expo-sharing` - Native share dialog for exported files

**Formats:**
- CSV and PDF export supported
- Date range filtering (this_month, last_3, this_year, all_time)

---

*Integration audit: 2026-03-25*
*Update when adding/removing external services*
