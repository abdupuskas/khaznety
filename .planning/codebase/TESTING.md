# Testing Patterns

**Analysis Date:** 2026-03-25

## Test Framework

**Runner:**
- Jest ^29.7.0
- Config: `jest.config.js` in project root

**Preset:**
- jest-expo ^55.0.11 (Expo-specific transforms)

**Assertion Library:**
- Jest built-in `expect`
- Matchers: `toBe`, `toEqual`, `not.toBeNull`, `toContain`

**Run Commands:**
```bash
npm test                              # Run all tests
npm run test:watch                    # Watch mode
npm run test:coverage                 # Coverage report
```

## Test File Organization

**Location:**
- Root-level `__tests__/` directory (NOT co-located with source)
- Mirrors source structure: `__tests__/lib/` for `lib/` files

**Naming:**
- `{module-name}.test.ts` matching source filename

**Structure:**
```
__tests__/
├── __mocks__/
│   └── supabase.ts          # Mocked Supabase client
└── lib/
    ├── sms-parser.test.ts   # 499 lines — comprehensive parser tests
    └── sms-categorizer.test.ts  # 144 lines — categorization tests
```

## Jest Configuration

```js
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/lib/supabase$': '<rootDir>/__tests__/__mocks__/supabase',
    '^@/(.*)$': '<rootDir>/$1',
  },
}
```

Key details:
- Tests only run from `__tests__/` directory
- `@/lib/supabase` imports automatically redirected to mock
- All other `@/` imports resolve to actual source

## Test Structure

**Suite Organization:**
```typescript
import { parseSMS, normalizeArabicDigits, parseAmount } from '@/lib/sms-parser'

// Grouped by functionality
describe('normalizeArabicDigits', () => {
  it('converts Arabic-Indic numerals to Western', () => {
    expect(normalizeArabicDigits('١٢٣')).toBe('123')
  })
})

// Grouped by bank
describe('CIB parser', () => {
  it('parses English debit SMS', () => {
    const result = parseSMS('CIB', '...message...', 'CIB')
    expect(result).not.toBeNull()
    expect(result!.amount).toBe(125000)
    expect(result!.type).toBe('debit')
  })
})

// Edge cases separate
describe('Edge cases', () => {
  it('returns null for promotional SMS', () => { ... })
  it('handles empty body', () => { ... })
})
```

**Patterns:**
- `describe` blocks grouped by function or domain (per-bank)
- Descriptive `it` strings that read as English sentences
- ASCII section dividers: `// ── Utility Tests ───────────────────`
- Non-null assertions (`result!.field`) after null check
- Real bank SMS messages used as test data

## Mocking

**Framework:**
- Jest built-in mocking (`jest.fn()`, `mockReturnThis()`, `mockResolvedValue()`)

**Supabase Mock (`__tests__/__mocks__/supabase.ts`):**
```typescript
// Chainable query mock
const mockChain = () => ({
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
  // ...etc
})

export const supabase = {
  from: jest.fn(() => mockChain()),
}
```

**What to Mock:**
- Supabase client (auto-mocked via moduleNameMapper)
- External service calls

**What NOT to Mock:**
- Pure functions (SMS parser, normalizers, categorization logic)
- Constants and configuration data

## Fixtures and Factories

**Test Data:**
- Real bank SMS messages used directly in test cases
- No shared factory functions or fixture files yet
- Test data inline in `it()` blocks

**Location:**
- All test data inline within test files
- No `__tests__/fixtures/` directory

## Coverage

**Requirements:**
- No enforced coverage target
- Coverage available via `npm run test:coverage`

**Current Coverage:**
- `lib/sms-parser.ts` — Well tested (499-line test suite)
- `lib/sms-categorizer.ts` — Tested (144-line test suite)
- All other modules — No tests

## Test Types

**Unit Tests:**
- Scope: Pure function testing (parsers, categorizers, normalizers)
- Real data: Actual bank SMS messages from Egyptian banks
- Edge cases: Empty strings, invalid inputs, unknown senders, promotional messages

**Integration Tests:**
- Not present

**E2E Tests:**
- Not present

## Common Patterns

**Assertion on Parsed Results:**
```typescript
it('parses CIB debit correctly', () => {
  const result = parseSMS('CIB', smsBody, 'CIB')
  expect(result).not.toBeNull()
  expect(result!.amount).toBe(125000)  // integer piastres
  expect(result!.type).toBe('debit')
  expect(result!.merchant).toBe('CARREFOUR')
  expect(result!.accountLast4).toBe('1234')
})
```

**Null Result Testing:**
```typescript
it('returns null for promotional SMS', () => {
  const result = parseSMS('CIB', 'Congratulations! You won...', 'CIB')
  expect(result).toBeNull()
})
```

**Arabic/English Variants:**
```typescript
describe('NBE parser', () => {
  it('parses Arabic debit SMS', () => { ... })
  it('parses English debit SMS', () => { ... })
})
```

---

*Testing analysis: 2026-03-25*
*Update when test patterns change*
