# ADR 000: The stack for the React Native production starter

- **Status:** accepted for Phase 0. Revisit at each Expo SDK release.
- **Date:** 2026-11-25
- **Plan:** [docs/PLAN.md](../PLAN.md), sections 3 and 4

## Context

The starter has to run production Android and iOS apps, so every dependency has to be a stable
release that is known to work together on the current Expo SDK. Versions below are what was
actually resolved and installed on 2026-11-24/25, not what the plan assumed.

## Decision

### Platform

|              | Version             | Note                                                                             |
| ------------ | ------------------- | -------------------------------------------------------------------------------- |
| Expo SDK     | 58 (`expo` 58.0.26) | Current stable SDK                                                               |
| React Native | 0.88.1              | New Architecture only                                                            |
| React        | 19.3.0              | React Compiler on by default from the template                                   |
| TypeScript   | 6.0.3               | Pinned by Expo's template. 7.0.2 is npm `latest` but not what the SDK ships with |
| Node.js      | 24 (24.15.0 here)   | SDK 58 requires 24.3 or newer on the 24 line                                     |
| Bun          | 1.4.0               | Package manager; version pinned in `package.json`                                |

### Application dependencies

| Area                   | Package                                                                            | Version                 |
| ---------------------- | ---------------------------------------------------------------------------------- | ----------------------- |
| Routing                | `expo-router`                                                                      | 58.0.32                 |
| Styling                | `uniwind` + `tailwindcss`                                                          | 1.14.0 + 4.3.5          |
| Icons                  | `lucide-react-native` + `react-native-svg`                                         | 1.79.0 + 15.16.0        |
| Animation and gestures | `react-native-reanimated`, `react-native-worklets`, `react-native-gesture-handler` | 4.7.1, 0.13.0, 3.3.0    |
| Screens and safe area  | `react-native-screens`, `react-native-safe-area-context`                           | 4.30.1, 5.11.1          |
| Lists                  | `@shopify/flash-list`                                                              | 2.3.2                   |
| Server state           | `@tanstack/react-query`                                                            | 5.108.4                 |
| Client state           | `zustand`                                                                          | 5.1.0                   |
| Validation             | `zod`                                                                              | 4.6.7                   |
| Forms                  | `react-hook-form` + `@hookform/resolvers`                                          | 7.92.0 + 7.0.9          |
| Storage                | `react-native-mmkv` + `react-native-nitro-modules`, `expo-secure-store`            | 4.3.2 + 0.37.2, 58.0.3  |
| Networking state       | `@react-native-community/netinfo`                                                  | 12.0.1                  |
| i18n                   | removed (2026-11-25)                                                               | —                       |
| Monitoring             | `@sentry/react-native`                                                             | 8.28.1                  |
| OTA updates            | `expo-updates`                                                                     | 58.0.22                 |
| Native UI              | `@expo/ui`, `expo-symbols`, `expo-glass-effect`                                    | 58.0.29, 58.0.5, 58.0.5 |
| Development            | `expo-dev-client`                                                                  | 58.0.21                 |

### Tooling

| Area                | Package                                                               | Version                        |
| ------------------- | --------------------------------------------------------------------- | ------------------------------ |
| Lint                | `eslint` + `eslint-config-expo`                                       | 9.39.5 + 58.0.4                |
| Architecture rules  | `eslint-plugin-boundaries`                                            | 7.4.4                          |
| Accessibility rules | `eslint-plugin-react-native-a11y`                                     | 3.5.1                          |
| Formatting          | `prettier` + `prettier-plugin-tailwindcss`                            | 3.10.1 + 0.8.1                 |
| Tests               | `jest`, `jest-expo`, `@testing-library/react-native`, `test-renderer` | 30.5.2, 58.0.15, 14.1.0, 1.3.1 |
| Dead code           | `knip`                                                                | 6.48.0                         |
| Git hooks           | `husky`, `lint-staged`, `@commitlint/cli`                             | 9.1.7, 17.6.2, 21.2.4          |
| Health              | `expo-doctor`                                                         | 1.21.8                         |

### Machine toolchain used for verification

Xcode 27.2 (iOS 27.2 SDK), CocoaPods 1.17.0, Gradle 9.4.1, Android Gradle Plugin 9.2.1,
Temurin JDK 17.0.20.1, Android 16 (API 36) emulator image.

## Evidence

| Check                                          | Result                                                                                                                                                                        |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expo install --fix`                           | Reported "Dependencies are up to date" after installation                                                                                                                     |
| `expo-doctor`                                  | 20 of 20 checks passed                                                                                                                                                        |
| JavaScript bundle (Android, production export) | 3,846 modules in about 10 s                                                                                                                                                   |
| iOS development build                          | Xcode: `Build Succeeded`, 0 errors                                                                                                                                            |
| Android debug build                            | Gradle: `BUILD SUCCESSFUL`, 662 tasks, 12 min 55 s on first run                                                                                                               |
| Android emulator (Android 16, arm64)           | App launched from the development build. MMKV `ok`, SecureStore `ok`, NetInfo online. Light and dark theme both render. No JavaScript errors and no crashes in the device log |
| iOS simulator                                  | Compiled. Run on a simulator is pending: the simulator runtime was still downloading when this was written                                                                    |
| `bun run check`                                | Passes: typecheck, lint, format, Jest, Knip, `expo-doctor`                                                                                                                    |
| Layer rules                                    | Ten deliberate violations are each rejected by ESLint; the allowed imports pass                                                                                               |

## What differs from the plan, and why

1. **ESLint 9, not 10.** Expo's preset bundles `eslint-plugin-react` 7.37, which crashes on
   ESLint 10 (`context.getFilename` no longer exists). Expo's own CLI installs `eslint@^9`.
2. **`@sentry/react-native` 8.28.1, not 8.36.** `expo install` pins the SDK-compatible range.
3. **Jest 30 with `test-renderer`, not `react-test-renderer`.** Testing Library 14 and Jest 30
   are required by `expo-router/testing-library`; `react-test-renderer` does not support React 19.
4. **ESLint 10 was in the plan's version table implicitly through "latest".** The plan now says 9.

## Things to know when working in this codebase

- `eslint-plugin-boundaries` skips imports between files of the same element unless the rule is
  given `checkInternals: true`. Without it, route files may import each other.
- TypeScript 6 does not load `@types` packages that are not listed in `compilerOptions.types`.
- `react-native-mmkv` v4 is created with `createMMKV()`. FlashList 2 has no `estimatedItemSize`.
- Packages that ship ESM (`@shopify/flash-list`, `uniwind`, `lucide-react-native`, `@tanstack/*`)
  must be listed in `jest.config.js` so Jest compiles them.

## To revisit

- **Unused packages.** Several template and planned packages are installed but not yet used; they
  are listed in `knip.jsonc` with the phase that will use them. Prune any that remain unused.
- **Android emulator image.** Two API 36 images are installed: `google_apis` (downloaded
  deliberately) and `google_apis_playstore` (fetched by the Android CLI when it created the
  emulator). Decide which to keep.
- **Web.** The template's web output is left untouched and untested. With UniWind the exported web
  stylesheet came out empty, so web needs its own setup before it is a target.
