# Technology Stack

**Analysis Date:** 2026-03-25

## Languages

**Primary:**
- TypeScript ~5.9.2 - All application code (`package.json`, `tsconfig.json`)

**Secondary:**
- JavaScript - Build scripts, config files (`babel.config.js`, `metro.config.js`, `jest.config.js`)

## Runtime

**Environment:**
- Node.js (inferred from npm/Expo) - No `.nvmrc` found
- React Native 0.83.2 - Mobile runtime (`package.json`)
- Expo SDK 55 - Managed workflow (`app.json`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present
- Postinstall: `patch-package` for patching node_modules

## Frameworks

**Core:**
- Expo ~55.0.8 - React Native managed workflow (`package.json`)
- Expo Router ~55.0.7 - File-based navigation (`app/` directory)
- React 19.2.0 - UI library
- React Native 0.83.2 - Mobile framework

**Testing:**
- Jest ^29.7.0 - Unit test runner (`jest.config.js`)
- jest-expo ^55.0.11 - Expo testing preset

**Build/Dev:**
- Metro bundler via `@expo/metro-runtime` (`metro.config.js`)
- babel-preset-expo with NativeWind JSX transform (`babel.config.js`)
- TypeScript ~5.9.2 compiler (`tsconfig.json`)

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` ^2.99.3 - Backend (PostgreSQL, Auth, Realtime) (`lib/supabase.ts`)
- `react-native-purchases` ^9.14.0 - RevenueCat IAP/subscriptions (`lib/revenuecat.ts`)
- `@tanstack/react-query` ^5.91.3 - Server state management (`hooks/`)
- `zustand` ^5.0.12 - Lightweight global state (`stores/`)
- `@reduxjs/toolkit` ^2.11.2 - Complex state (onboarding wizard) (`redux/`)

**UI:**
- `nativewind` ^4.2.3 + `tailwindcss` ^3.4.19 - Styling (`tailwind.config.js`)
- `react-native-reanimated` 4.2.1 - 60fps animations
- `@gorhom/bottom-sheet` ^5.2.8 - Modal sheets
- `lucide-react-native` ^0.577.0 - Icon library
- `victory-native` ^41.20.2 + `@shopify/react-native-skia` 2.4.18 - Charts
- `expo-blur` ~55.0.10 - Frosted glass effects (FloatingTabBar)

**Forms:**
- `react-hook-form` ^7.71.2 + `@hookform/resolvers` ^5.2.2 + `zod` ^4.3.6

**Localization:**
- `i18n-js` ^4.5.3 + `expo-localization` ~55.0.9 - Arabic/English RTL (`lib/i18n.ts`)
- `@expo-google-fonts/cairo` ^0.4.2 - Arabic typography

**Infrastructure:**
- `react-native-gesture-handler` ~2.30.0 - Swipe/pan gestures
- `react-native-safe-area-context` ~5.6.2 - Safe area insets
- `react-native-screens` ~4.23.0 - Native screen management
- `expo-secure-store` ~55.0.9 - Keychain token storage
- `expo-notifications` ~55.0.13 - Push notifications

## Configuration

**Environment:**
- `.env` file with `EXPO_PUBLIC_` prefixed variables
- Required: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- No `.env.example` template exists (concern noted in CONCERNS.md)

**Build:**
- `tsconfig.json` - Strict mode, `@/*` path alias mapping to root
- `babel.config.js` - Expo preset + NativeWind JSX source + Reanimated plugin
- `metro.config.js` - Custom Metro config with NativeWind integration
- `tailwind.config.js` - Content paths, custom colors/radii, no dark mode
- `app.json` - Expo app config (plugins, orientation, platform settings)

## Platform Requirements

**Development:**
- macOS/Linux/Windows with Node.js
- Expo CLI (`npx expo start`)
- iOS Simulator or Android Emulator

**Production:**
- iOS 16.0+ (primary - Apple Pay Shortcuts)
- Android API 26+ (secondary - SMS permissions)
- Distributed via App Store / Google Play
- Supabase cloud backend

---

*Stack analysis: 2026-03-25*
*Update after major dependency changes*
