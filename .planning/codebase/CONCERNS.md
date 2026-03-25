# Codebase Concerns

**Analysis Date:** 2026-03-25

## Tech Debt

**`as any` casts in budget engine:**
- Issue: Multiple `as any` type assertions defeat TypeScript strict mode
- Files: `lib/budget-engine.ts` (lines ~73, ~334, ~461)
- Why: Supabase query results have complex nested types that weren't properly typed
- Impact: Type errors can't be caught at compile time for budget calculations
- Fix approach: Define proper TypeScript interfaces matching Supabase schema joins

**No structured logging:**
- Issue: All logging via `console.log` with `__DEV__` guards; no production observability
- Files: Throughout `lib/`, `app/_layout.tsx`
- Why: Early development phase
- Impact: Can't debug production issues, no SMS parse success rate tracking
- Fix approach: Add lightweight logging service (e.g., Sentry for errors, custom analytics for SMS metrics)

**StyleSheet vs NativeWind inconsistency:**
- Issue: NativeWind installed and configured but components predominantly use `StyleSheet.create()`
- Files: All `components/ui/*.tsx` files
- Why: Likely evolved during development
- Impact: Two styling approaches coexist, unclear which to use for new code
- Fix approach: Standardize on one approach; CLAUDE.md spec says NativeWind `className`

## Security Considerations

**Hardcoded RevenueCat test API key:**
- Risk: Test key in source code; production key management unclear
- File: `lib/revenuecat.ts` (line ~11)
- Current mitigation: Key is a test key, not production
- Recommendations: Move to `EXPO_PUBLIC_REVENUECAT_API_KEY` env var; environment-based switching

**Missing .env.example:**
- Risk: New developers don't know which env vars are required; .env may be committed
- File: `.env` exists but no `.env.example` template
- Current mitigation: None
- Recommendations: Create `.env.example` with all required variables (without values)

**Silent SecureStore error handling:**
- Risk: Failed token persistence fails silently; auth may break without user awareness
- File: `lib/supabase.ts` (lines ~20-44)
- Current mitigation: Empty catch blocks
- Recommendations: Add error logging and fallback behavior

## Performance Bottlenecks

**N+1 query pattern in budget allocation:**
- Problem: Loops through allocation items and queries sub_categories per main category
- File: `lib/budget-engine.ts` (lines ~336-376)
- Cause: Sequential queries inside loop instead of batch fetch
- Improvement path: Fetch all sub_categories in single query, group client-side

**No query pagination for transactions:**
- Problem: Fetches up to 1000 transactions with hard limit
- File: `hooks/useTransactions.ts` (line ~40)
- Cause: Single query with `.limit(1000)`
- Improvement path: Implement cursor-based pagination with React Query infinite queries

**Individual budget updates per SMS:**
- Problem: Each SMS import triggers 1-2 separate queries to check/update monthly_budgets
- File: `lib/sms-processor.ts` (lines ~165-203)
- Cause: Check-then-update pattern instead of atomic upsert
- Improvement path: Use single upsert with conflict handling

## Fragile Areas

**SMS idempotency key composition:**
- Why fragile: Key includes merchant name and balance, which can vary for same transaction
- File: `lib/sms-processor.ts` (lines ~23-33)
- Common failures: Same transaction with slightly different balance = treated as new
- Safe modification: Use timestamp-based or sequence-based idempotency instead
- Test coverage: No tests for duplicate detection logic

**Account lookup by last 4 digits:**
- Why fragile: Multiple accounts across different banks can share same last 4 digits
- File: `lib/sms-processor.ts` (lines ~93-104)
- Common failures: Transaction assigned to wrong account
- Safe modification: Include bank name in account lookup query
- Test coverage: No tests for account matching

**Deep link SMS processing:**
- Why fragile: Single try/catch wraps entire pipeline; errors only logged in `__DEV__`
- File: `app/_layout.tsx` (lines ~61-86)
- Common failures: Parse error silently swallowed in production
- Safe modification: Add user notification on import failure
- Test coverage: No tests

## Test Coverage Gaps

**Budget engine (critical):**
- What's not tested: Rollover calculations, allocation application, deficit handling
- File: `lib/budget-engine.ts`
- Risk: Complex math logic with `as any` casts could break silently
- Priority: High
- Difficulty to test: Medium (pure functions, but complex state setup)

**SMS processor pipeline:**
- What's not tested: End-to-end flow (parse -> categorize -> insert -> update budget)
- File: `lib/sms-processor.ts`
- Risk: Duplicate detection, account matching, budget updates all untested
- Priority: High
- Difficulty to test: Medium (needs Supabase mock, but logic is testable)

**React Query hooks:**
- What's not tested: Data fetching, cache invalidation, error handling
- Files: All `hooks/*.ts` files
- Risk: Incorrect query keys or stale data could surface silently
- Priority: Medium
- Difficulty to test: Medium (need React Query test utils)

**RevenueCat integration:**
- What's not tested: Purchase flow, entitlement checking, user identification
- File: `lib/revenuecat.ts`
- Risk: Payment/subscription logic untested
- Priority: Medium
- Difficulty to test: Hard (requires SDK mocking)

## Missing Critical Features

**Production logging/telemetry:**
- Problem: No way to track errors, SMS parse rates, or user issues in production
- Current workaround: None (blind in production)
- Blocks: Debugging user-reported issues, improving SMS patterns
- Implementation complexity: Low (add Sentry or similar)

**Goal auto-funding from rollover:**
- Problem: Spec mentions "Fund a goal" as rollover option, but not implemented in budget engine
- File: `lib/budget-engine.ts` - `redistributeRollover` only supports category redistribution
- Blocks: Users can't automatically direct rollover to goals
- Implementation complexity: Medium

## Dependencies at Risk

**Mixed version pinning strategy:**
- Risk: Some deps pinned exactly (`react-native-reanimated": 4.2.1`), others with semver range (`zustand": "^5.0.12"`)
- File: `package.json`
- Impact: Inconsistent update behavior; `npm install` may pull different versions across machines
- Migration plan: Document strategy; consider using lockfile-only for consistency

---

*Concerns audit: 2026-03-25*
*Update as issues are fixed or new ones discovered*
