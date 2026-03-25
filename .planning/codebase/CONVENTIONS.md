# Coding Conventions

**Analysis Date:** 2026-03-25

## Naming Patterns

**Files:**
- PascalCase for React components (`FloatingTabBar.tsx`, `Card.tsx`, `PressableScale.tsx`)
- kebab-case for utilities and lib files (`sms-parser.ts`, `budget-engine.ts`, `sms-categorizer.ts`)
- camelCase with `use` prefix for hooks (`useTransactions.ts`, `useAuth.ts`, `useCategories.ts`)
- camelCase with `.store.ts` suffix for Zustand stores (`ui.store.ts`, `auth.store.ts`)
- kebab-case for screen routes (`shortcut-setup.tsx`, `budget-reset-day.tsx`, `edit-profile.tsx`)
- `*.test.ts` for test files, mirroring source name (`sms-parser.test.ts`)

**Functions:**
- camelCase for all functions (`normalizeArabicDigits`, `parseAmount`, `detectType`, `matchSmsRule`)
- PascalCase for React components (`FloatingTabBar`, `Card`, `Badge`)
- `use` prefix for hooks (`useUIStore`, `useTransactions`, `useAuth`)
- `fetch` prefix for async data functions (`fetchTransactions`, `fetchCategories`)
- `is` / `get` prefix for boolean/getter helpers (`isActive`, `isRTL`, `getInitials`, `getMonthLabel`)

**Variables:**
- camelCase for variables and instances
- UPPER_SNAKE_CASE for constant registries (`BANKS`, `TABS`, `PRESETS`, `DEBIT_KEYWORDS`)
- camelCase for config/token objects (`colors`, `radii`, `spacing`, `fontSizes`)

**Types:**
- PascalCase for interfaces (`ParsedTransaction`, `BankConfig`, `CardProps`, `VaultTextProps`)
- PascalCase for type aliases (`TransactionType`, `AppLocale`, `BadgeVariant`, `DateFilter`)
- Literal unions for discriminated types (`'debit' | 'credit'`, `'expense' | 'income' | 'transfer'`)
- Props interfaces extend native props (`CardProps extends ViewProps`)

## Code Style

**Formatting:**
- 2-space indentation consistently
- Single quotes for strings and imports
- Semicolons required at end of statements
- Trailing commas in multi-line object/array literals
- ~100 character line length (inferred)
- No explicit Prettier or ESLint config files found

**Linting:**
- No `.eslintrc` or `.prettierrc` configured
- Conventions enforced by code consistency, not tooling
- TypeScript `strict: true` in `tsconfig.json`

## Import Organization

**Order:**
1. React Native imports: `import { View, Text, ... } from 'react-native'`
2. Third-party libraries: `import { BlurView } from 'expo-blur'`
3. Internal `@/` imports: `import { colors } from '@/constants/tokens'`
4. Type imports: `import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'`

**Grouping:**
- Logical grouping by source (RN, third-party, internal)
- Type imports typically last or inline with source

**Path Aliases:**
- `@/` maps to project root (configured in `tsconfig.json`)
- Used everywhere: `@/lib/supabase`, `@/constants/tokens`, `@/hooks/useAuth`

## Error Handling

**Patterns:**
- Try/catch at service boundaries (`lib/` layer)
- React Query propagates errors via `isError` state
- SMS parser returns `null` on unparseable messages (graceful skip)
- Fallback categorization for unmatched SMS
- Silent catches in SecureStore operations (noted as concern)

**Error Types:**
- Throw on critical failures (Supabase connection, auth)
- Return null for expected parse failures (unrecognized SMS)
- `__DEV__` conditional logging for deep link errors

## Logging

**Framework:**
- `console.log` / `console.warn` / `console.error` (no structured logging)
- `__DEV__` guards for development-only logs

**Patterns:**
- Log SMS processing results in development
- No production logging/telemetry (gap noted in CONCERNS.md)

## Comments

**When to Comment:**
- ASCII divider sections: `// ── Section Name ──────────────────────`
- Inline explanations for non-obvious logic: `// safe default — most SMS are debits`
- JSDoc for public APIs: `/** Secure storage adapter for Supabase auth tokens. */`

**TODO Comments:**
- Format: `// TODO: description` or `// v2` markers
- No issue linking convention

## Function Design

**Size:**
- Most functions under 50 lines
- Budget engine has larger functions (complex business logic)

**Parameters:**
- Destructured props in component signatures
- Options objects for hooks (React Query config)
- Explicit return types on exported functions

**Return Values:**
- React Query hooks return `{ data, isLoading, isError }`
- Parser returns `ParsedTransaction | null`
- Mutations return via React Query `useMutation`

## Module Design

**Exports:**
- Named exports for hooks and utilities
- Default exports for screen components (Expo Router convention)
- `export function` style (not `const ... = () =>`)

**Barrel Files:**
- Not used; direct imports to specific files via `@/` alias

## Styling Approach

**Primary:** `StyleSheet.create()` for component styles (not NativeWind className)
- Colors sourced from `constants/tokens.ts`
- Variant-based styling via mapped objects: `Record<Variant, { bg: string; text: string }>`
- Dynamic styles via array syntax: `style={[styles.base, isActive && styles.active, style]}`
- Inline `style` only for dynamic/animated values (Reanimated)

**Note:** Despite NativeWind being installed and configured in Babel/Metro, actual components use `StyleSheet.create()` predominantly. Some screens may use `className` for layout.

---

*Convention analysis: 2026-03-25*
*Update when patterns change*
