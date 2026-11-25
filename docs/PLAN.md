# React Native production starter — build plan

**Status:** agreed and in progress (written 2026-11-24)
**Purpose:** single source of truth for building a reusable skeleton for production Android and iOS apps.
**How we use it:** tick the boxes as each item lands. If a decision changes, edit the table in section 4 and add a note under `docs/adr/`.

## 1. Goal and principles

We are building a skeleton, not an app: the smallest repo in which every concern a production app needs has **one working, tested reference implementation** that you copy when you build a real feature.

1. **Stable releases only.** Nothing tagged RC, beta or alpha in the dependency graph.
2. **Vendors behind small interfaces.** Styling, HTTP, logging, monitoring and analytics each sit behind a thin in-repo facade, so one can be swapped without touching features.
3. **Routes are thin, features own their code.** Route files only compose. API, state and UI for a feature live in its own folder, and the import rules are enforced by lint.
4. **Native dependencies first.** Native builds are the slow, risky part, so the whole dependency graph is proven on both platforms before any feature work.
5. **One command tells the truth.** `bun run check` runs typecheck, lint, tests and `expo-doctor`.

## 2. Progress

| Phase | Scope | Status |
|---|---|---|
| 0 | Prerequisites, scaffold, first run on both platforms | done |
| 1 | Quality gates: lint, format, hooks, Jest foundation | done |
| 2 | App shell: config, environments, providers, navigation | done |
| 3 | Design system: tokens, theming, components | in progress |
| 4 | API layer and server state, reference feature | not started |
| 5 | Client state, storage, auth | not started |
| 6 | Forms | not started |
| 7 | Logging and monitoring | not started |
| 8 | End-to-end tests | not started |
| 9 | CI/CD, OTA updates, store readiness | not started |
| 10 | Docs, generators, final verification | not started |

## 3. What is current today, and what it means for this plan

Checked against the npm registry and the official docs on 2026-11-24.

- **Expo SDK 58 is the current stable SDK** (React Native 0.88.1, React 19.3, iOS 27 SDK, R8 on by default on Android). Its default template uses `src/app` for routes, has React Compiler and typed routes switched on, uses the native tab bar (`NativeTabs`) and ships `@expo/ui` (native SwiftUI / Jetpack Compose components, stable since SDK 56).
- **Expo Router no longer uses React Navigation packages.** Since SDK 58 its loaders, middleware, native tabs and toolbars are stable, and `@react-navigation/*` cannot be used next to it.
- **`expo/fetch` is the default `globalThis.fetch`** since SDK 56, so a fetch-based HTTP layer needs no extra runtime.
- **For Tailwind on React Native, the stable Tailwind v4 option is UniWind 1.14.** NativeWind 4.2.7 is stable but on Tailwind v3; NativeWind 5 (Tailwind v4) is `5.0.0-rc.1` and its own docs say it is not for production.
- **Expo documents Jest only** (Jest 30, `jest-expo` 58, Testing Library 14, `expo-router/testing-library`), and recommends Maestro for UI tests.
- **Environment files are restricted in SDK 58.** Only `.env`, `.env.local`, `.env.development` and `.env.production` (plus `.local` variants) are loaded, and every command forces `NODE_ENV`.
- **CI and OTA have new names.** Expo Workflows (YAML in `.eas/workflows/`), Expo Build and Expo Update.
- **TypeScript 7.0.2 is npm `latest`, but Expo's template still pins 6.0.3.** We follow the template.

## 4. Stack decisions

Versions are what was current on 2026-11-24. At build time we install whatever `npx expo install --fix` resolves for SDK 58.

| Area | Choice | Why | Considered instead |
|---|---|---|---|
| Platform | Expo SDK 58 with prebuild and development builds | OTA updates, cloud builds and submission, config plugins, precompiled native binaries. Expo itself says Expo Go is not for production apps. | Bare React Native |
| Runtime | React Native 0.88.1, React 19.3, Hermes, New Architecture, React Compiler | What SDK 58 ships | — |
| Language | TypeScript 6, strict | The version the SDK template pins | TypeScript 7 (not yet what the SDK ships) |
| Routing | Expo Router 58 | File-based, typed routes, deep links built in, `Stack.Protected`, route-level error boundaries | React Navigation (cannot coexist with Expo Router) |
| Styling | **UniWind 1.14 + Tailwind CSS 4.3** | Stable, full Tailwind v4, no Babel plugin, CSS-variable theming, official Expo example | NativeWind 4 (Tailwind v3), NativeWind 5 (RC), Unistyles 3.8 (not Tailwind) |
| Components | We own the source: primitives seeded from React Native Reusables (MIT) | No UI-kit lock-in, accessible primitives | gluestack, Tamagui, Restyle |
| Native controls | `@expo/ui`, `NativeTabs`, `expo-symbols` | Platform-native feel for little cost (sheets, pickers, tab bar) | — |
| Server state | TanStack Query 5.108 | De facto standard: suspense, infinite queries, cache persistence. v6 is roadmap-only. | Apollo (only for GraphQL), Legend-State |
| Client state | Zustand 5.1 | Tiny, typed, persisted stores | Redux Toolkit, Jotai, TanStack Store (pre-1.0) |
| HTTP | `expo/fetch` behind an in-repo typed client with middleware | Full control of refresh, retry and the error model | axios 1.21, ky 2.2 (fetch hooks; React Native support unverified) |
| API contract | Zod 4 at the boundary; OpenAPI codegen (`openapi-typescript` 7.13 + `openapi-fetch` 0.17) when a spec exists | Type-safe without dictating the backend | Orval 8, Hey API 0.99 |
| Forms | React Hook Form 7.92 + Zod resolver | Most battle-tested on React Native | TanStack Form 1.33 |
| Storage | MMKV 4.3 for key-value, `expo-secure-store` for tokens; `expo-sqlite` optional | Fast synchronous KV; tokens in Keychain / Keystore | AsyncStorage (slow), `expo-sqlite/kv-store` (fallback) |
| i18n | removed (2026-11-25) | Not needed in this project | — |
| Animation | Reanimated 4.8, Worklets 0.14, Gesture Handler 3.5 | Shipped with the SDK | — |
| Lists | FlashList 2.3 | Recycling for long lists | FlatList for short lists |
| Logging and monitoring | In-repo logger and monitoring facade; Sentry adapter (`@sentry/react-native` 8.36) | Runs with no vendor configured | Expo Observe, Datadog, Bugsnag |
| Testing | Jest 30 + `jest-expo` 58 + Testing Library 14 + `expo-router/testing-library`; Maestro 2.1 for E2E | The setup Expo documents | Vitest (no official Expo guide), Detox |
| Lint and format | ESLint 9 (`eslint-config-expo`, flat config) + Prettier 3.10 + boundaries rules | Expo's supported path; includes React Compiler rules. ESLint 10 crashes Expo's preset, see `docs/adr/000-stack.md` | Biome 2.6, oxlint |
| Package manager | Bun 1.4 | Documented by Expo, fastest installs, already on your machine | npm, pnpm 12 (not installed) |
| CI/CD and OTA | Expo Workflows + Expo Build + Expo Update | Fingerprint-aware: publishes an update when nothing native changed, builds otherwise | GitHub Actions with `eas build` (kept as a documented fallback) |

## 5. Prerequisites on your machine

Checked 2026-11-24.

| # | Item | State | Action |
|---|---|---|---|
| 1 | Xcode license | Accepted 2026-11-24. Xcode's first-launch components were missing as well, which left no simulator support at all; `xcodebuild -runFirstLaunch` installed them without needing a password. The iOS simulator runtime then had to be downloaded. Xcode 27.2 with the iOS 27.2 runtime is installed, and a development build runs on the iPhone 17 simulator. | Done |
| 2 | Android emulator | Created from the command line: `medium_phone`, Android 16 (API 36), 1080x2400. | Done |
| 3 | Node.js | 24.15.0 via nvm. SDK 58 needs 24.3 or newer on the 24 line. | None |
| 4 | Bun, npm, Yarn | Bun 1.4.0, npm 11.12, Yarn Classic 1.22 | None |
| 5 | Java | Temurin 17 | None unless SDK 58's Gradle setup needs a newer JDK; I check in Phase 0 |
| 6 | Expo account | EAS CLI 27.11 is installed | `eas login` before Phase 9 (cloud builds, OTA); not needed for local development |
| 7 | GitHub CLI | Not installed | Optional, only if you want me to create the GitHub repo and PRs |
| 8 | Sentry | Unknown | Optional. The skeleton runs without it. |
| 9 | Maestro | 2.12.1, installed with Homebrew from Maestro's own tap (`mobile-dev-inc/tap/maestro`) | None. Its `openLink` step fails on this simulator, so flows navigate by tapping. Deep links are opened with `xcrun simctl openurl` and `adb shell am start` instead. |

## 6. Architecture

### 6.1 Folder structure

```
.
├─ app.config.ts              typed app config, one file for all variants
├─ eas.json                   build and submit profiles
├─ .eas/workflows/            CI definitions
├─ src/
│  ├─ app/                    Expo Router routes (thin: compose a screen, nothing else)
│  │  ├─ _layout.tsx          root providers, auth gate
│  │  ├─ (auth)/              public: sign-in, sign-up, forgot password
│  │  ├─ (app)/               protected: tabs and stacks
│  │  ├─ (dev)/               development builds only: component gallery
│  │  └─ +not-found.tsx
│  ├─ screens/<name>/         screen composition (UI + screen-specific hooks)
│  ├─ features/<name>/        api/ model/ ui/ index.ts  (the public API of the feature)
│  ├─ entities/<name>/        business entities shared across features
│  └─ shared/
│     ├─ api/                 http client, middleware, errors, OpenAPI types, mock transport
│     ├─ ui/                  design system: primitives and components
│     ├─ theme/               theme facade and token typings
│     ├─ storage/             MMKV and secure storage adapters
│     ├─ config/              validated environment
│     ├─ lib/                 logger, monitoring, analytics, hooks, utils
│     ├─ providers/           the provider tree
│     └─ global.css           Tailwind entry and design tokens
├─ tests/                     Jest setup, E2E flows
└─ docs/                      this plan, guides, ADRs
```

### 6.2 Import rules (enforced by `eslint-plugin-boundaries`)

| Layer | May import from |
|---|---|
| `shared` | nothing outside `shared` |
| `entities` | `shared` |
| `features` | `shared`, `entities`, other features only through their `index.ts` |
| `screens` | all of the above |
| `app` | `screens`, `features`, `entities`, `shared` |

### 6.3 Data flow

```
route (src/app)
  └─ screen (src/screens)
       └─ feature hook (src/features/<name>/model)
            ├─ TanStack Query ─▶ endpoint (features/<name>/api) ─▶ http client (shared/api) ─▶ expo/fetch
            │                      ▲                                   │ middleware: auth → refresh → retry → log
            │                 Zod schema                             └─ errors: ApiError / NetworkError / TimeoutError
            └─ Zustand store (session, settings) ─▶ storage (MMKV, SecureStore)
```

## 7. Phases

**Definition of done for the whole skeleton:** from a clean clone, `bun install` then `bun run check` is green; development builds run on iOS and Android; a user can sign in, browse the reference feature online and offline, switch theme and language; a pull request triggers CI.

### Phase 0 — Prerequisites, scaffold, first run

- [x] 0.1 You accept the Xcode license (section 5, item 1)
- [x] 0.2 An Android emulator exists (section 5, item 2)
- [x] 0.3 Scaffold from the official `default` template (SDK 58) into this folder; `git init`; pin Node 24 and Bun; keep only the chosen package manager's lockfile (`bun.lock`)
- [x] 0.4 Add the full native dependency set up front (UniWind, `react-native-svg`, FlashList, MMKV with Nitro, NetInfo, `expo-secure-store`, `expo-updates`, `expo-dev-client`, `expo-system-ui`, `expo-navigation-bar`, `expo-haptics`, Sentry) and run `bunx expo install --fix`
- [x] 0.5a Build and launch a development build on the Android Emulator
- [x] 0.5b Build and launch a development build on the iOS Simulator (iPhone 17, iOS 27.2)
- [x] 0.6 `bunx expo-doctor` is clean; record the resolved versions in `docs/adr/000-stack.md`

Done when the stock app plus every native dependency runs on both platforms from a development build. Nothing else is added yet.

### Phase 1 — Quality gates

- [x] 1.1 ESLint flat config from `eslint-config-expo/flat`, plus layer boundaries, import ordering and accessibility rules. ESLint is held at 9, not 10; see `docs/adr/000-stack.md`
- [x] 1.2 Prettier with Tailwind class sorting
- [x] 1.3 Git hooks: lint-staged and commitlint (conventional commits)
- [x] 1.4 Jest foundation: Jest 30, `jest-expo`, Testing Library 14, `expo-router/testing-library`; setup file. (`renderWithProviders` is added in Phase 2 together with the providers)
- [x] 1.5 Scripts: `check`, `typecheck`, `lint`, `format`, `test`, `test:watch`, `knip:check`, `doctor` (`gen:api` arrives in Phase 4, `test:e2e` in Phase 8, `generate` in Phase 10)
- [x] 1.6 `AGENTS.md` and `CLAUDE.md` holding the project conventions

Done when `bun run check` passes on a clean install and a deliberate boundary violation fails lint.

### Phase 2 — App shell, config, environments

- [x] 2.1 `app.config.ts` with three variants (development, preview, production): name, slug, bundle ID, scheme, icons
- [x] 2.2 Environment handling: committed `.env.development` and `.env.production`, ignored `.env*.local`, Zod-validated `env.ts` read once at startup, no secrets in `EXPO_PUBLIC_*`
- [x] 2.3 Provider tree: theme and router. The query client joins in Phase 4, toasts in Phase 3 and the session store in Phase 5; each lands in the same `AppProviders`. Splash hidden only when the app is ready
- [x] 2.4 Navigation skeleton: root stack, `(auth)`, `(app)` with native tabs, `(dev)`, `+not-found`
- [x] 2.5 Root error boundary and per-screen fallbacks, offline banner, "update available, reload" via `expo-updates`
- [x] 2.6 (removed 2026-11-25) i18n foundation removed at project owner's request
- [x] 2.7 `eas.json`: development (simulator and device), preview and production profiles; channels; fingerprint runtime version; Bun version pinned

Done when the app boots to a placeholder tab screen in light and dark, and a thrown render error shows an error screen with retry instead of crashing. **Verified on 2026-11-25** on an Android 16 emulator and an iPhone 17 simulator (iOS 27.2), in light and dark, with the system setting and with the in-app override. See section 12 for what the device runs changed.

### Phase 3 — Design system

- [ ] 3.1 Tailwind v4 with UniWind; design tokens in `global.css` (`@theme`): semantic colors, spacing, radius, type scale, shadows, dark theme
- [ ] 3.2 Theme facade (`ThemeProvider`, `useTheme`, `useThemeColor`, `cn`): system, light and dark, persisted; status bar, navigation bar and system UI follow it
- [ ] 3.3 Primitives with owned source: Text, Box, Button, Pressable with haptics, Input, FormField, Checkbox, Switch, Badge, Avatar, Card, Separator, Skeleton, Spinner, Toast, Dialog, Sheet, Icon, Image
- [ ] 3.4 Composite components: Screen (safe area, edge-to-edge, keyboard), List (FlashList with empty, error and offline states)
- [ ] 3.5 Native controls from `@expo/ui` where they beat custom UI: bottom sheet, picker, segmented control, date and time picker
- [ ] 3.6 Accessibility: roles and labels, 44pt touch targets, font scaling, contrast-checked tokens, RTL
- [ ] 3.7 Component gallery screen in `(dev)` with theme and font-scale switchers

Done when the gallery renders on iOS and Android in light and dark, and switching theme at runtime updates the whole tree.

### Phase 4 — API layer and server state

- [ ] 4.1 HTTP client on `expo/fetch`: typed requests, JSON handling, timeout, cancellation, correlation ID
- [ ] 4.2 Middleware chain: auth header, single-flight token refresh on 401 with queued replay, retry with backoff for idempotent requests and network errors, redacted logging in development
- [ ] 4.3 Error model: `ApiError` (status, machine-readable code, field errors), `NetworkError`, `TimeoutError`, mapped to translation keys
- [ ] 4.4 Zod validation at the boundary, schemas next to endpoints
- [ ] 4.5 TanStack Query setup: defaults, `queryOptions` convention, key factories, suspense on screens, infinite queries, optimistic mutations with rollback, offline cache persistence, `onlineManager` bound to NetInfo
- [ ] 4.6 Mock transport for development builds, tests and E2E (fixtures, latency, failure switches), selected by `EXPO_PUBLIC_API_MOCK`
- [ ] 4.7 OpenAPI path: `gen:api` script with a sample spec
- [ ] 4.8 Reference feature `posts`: list (paged, pull to refresh, offline, empty and error states), detail, create (form with optimistic update)

Done when the reference feature works against the mock with the network on and off, and refresh and retry behaviour are unit-tested.

### Phase 5 — Client state, storage, auth

- [ ] 5.1 Storage adapters behind one `Storage` interface: MMKV for ordinary values, SecureStore for tokens
- [ ] 5.2 Zustand stores (`session`, `settings`) with typed selectors, persistence and reset on logout
- [ ] 5.3 Auth feature: sign-in, sign-up and forgot-password screens against the mock (swap in the real API by replacing `features/auth/api`)
- [ ] 5.4 Route protection with `Stack.Protected`, redirect back to the originally requested route (deep links)

Done when a signed-out user cannot reach `(app)`, token refresh is invisible, and logout returns to `(auth)` with caches cleared.

### Phase 6 — Forms

- [ ] 6.1 React Hook Form with Zod: `Form` and `FormField`, schema-driven rules, localized errors, submit state, server-side field errors

Done when a validated form with server-side field errors works against the mock.

### Phase 7 — Logging and monitoring

- [ ] 7.1 Logger with levels and redaction: console in development, forwarded to monitoring in production
- [ ] 7.2 Monitoring facade (`captureException`, breadcrumbs, screen tracking) with a Sentry adapter that initialises only when a DSN is set; `@sentry/react-native/expo` plugin so EAS Build uploads source maps and debug symbols
- [ ] 7.3 Analytics facade with a typed event list and a no-op adapter

Done when the app runs unchanged with no DSN, and with a DSN a test error and screen views arrive in Sentry.

### Phase 8 — End-to-end tests

- [ ] 8.1 Maestro flows: sign in, list, detail, create, theme switch
- [ ] 8.2 `test:e2e` script that prepares development builds, boots a simulator or emulator and runs the flows

Done when `bun run test:e2e` passes on both platforms.

### Phase 9 — CI/CD, OTA updates, store readiness

- [ ] 9.1 Expo Workflows: `ci.yml` on pull requests, `preview.yml` on main (fingerprint, then update or build), `production.yml` on tag
- [ ] 9.2 Update channels per variant; rollback and rollout procedure documented
- [ ] 9.3 Store readiness: icons, adaptive icon, splash, permission strings, privacy manifest, tracking prompt, credentials guide, `eas submit`
- [ ] 9.4 GitHub Actions fallback documented

Done when a pull request triggers CI, a preview build installs on a device, and an OTA update reaches it.

### Phase 10 — Docs, generators, final verification

- [ ] 10.1 README, architecture guide, "add a feature", "add a native dependency", release and upgrade guides, ADRs
- [ ] 10.2 `bun run generate feature <name>` scaffolds a slice, a route and tests
- [ ] 10.3 `bun run setup` re-identities the skeleton for a new app (name, slug, bundle ID, scheme)
- [ ] 10.4 Clean-clone verification on both platforms; `check`, `expo-doctor` and E2E all green

Done when someone who has never seen the repo can follow the README to a running app on both platforms.

## 8. Defaults I chose — tell me if you want any changed

| # | Decision | Default | Alternative |
|---|---|---|---|
| 1 | Styling engine | UniWind | NativeWind 4 (stable, Tailwind v3), NativeWind 5 (RC), Unistyles (not Tailwind) |
| 2 | Package manager | Bun | npm |
| 3 | API contract | Typed endpoints with Zod; OpenAPI codegen when a spec exists | If your backend exposes OpenAPI, we make codegen the default from day one |
| 4 | Auth | Email and password with access and refresh tokens, against a mock | Social login (Google, Apple) added as a recipe later |
| 5 | Tab bar | Native tab bar (`NativeTabs`) | JavaScript `Tabs` for a fully custom design |
| 6 | Repo layout | This folder is the repo root, single app | Monorepo if several apps will share one design system |
| 7 | Monitoring vendor | Sentry adapter, inactive until a DSN is set | Expo Observe, none |
| 8 | Web | Not a target; template web config left untouched and untested | Add web later |

## 9. Out of scope for the first pass (recipes to add when needed)

Push notifications, payments (RevenueCat, Stripe), maps, camera and media, local database with Drizzle or a local-first sync engine, widgets, App Intents, biometric lock, Storybook (the in-app gallery comes first), web.

## 10. Risks

| Risk | Mitigation |
|---|---|
| UniWind is young (first release July 2025, one organisation behind it, free and paid tiers). | Class names are standard Tailwind, so they port to NativeWind 5 when it is stable; theme access goes through our facade. |
| Expo SDK 58 is recent, so some community libraries may lag support for React Native 0.88. | Phase 0 installs every native dependency and builds on both platforms before any feature work. Expo modules are the fallback (for example `expo-sqlite/kv-store` instead of MMKV). |
| Xcode 27 changed tooling (Device Hub replaces Simulator.app, scene-based life cycle). | Verified in Phase 0.5; follow Expo's migration notes. |
| Bun-specific build issues (blocked postinstall scripts, fingerprint mismatches). | `trustedDependencies` for Sentry's CLI, `.fingerprintignore` for `.bun-tag-*`, Bun version pinned in `eas.json`. |
| Expo services are usage-priced. | GitHub Actions fallback documented in Phase 9. |
| React Compiler changes how memoization works. | Its lint rules ship with `eslint-config-expo`; opt out per component with `'use no memo'`. |
| React Native Reusables changed owners (now `founded-labs`). | Confirm its UniWind registry in Phase 0; if it is not healthy, we hand-roll the primitives. |

## 11. Sources

- Expo SDK 58 changelog: https://expo.dev/changelog/sdk-58 and https://expo.dev/changelog/sdk-58-beta
- Expo SDK 57 and 56 changelogs: https://expo.dev/changelog/sdk-57 and https://expo.dev/changelog/sdk-56
- React Native releases: https://github.com/facebook/react-native/releases
- Expo template `expo-template-default` 58.0.35 (npm)
- Expo docs: Router (protected routes, error handling, testing), unit testing, Bun, environment variables, Workflows, Expo Update, Tailwind, React Compiler, ESLint — https://docs.expo.dev
- Sentry for Expo: https://docs.sentry.io/platforms/react-native/manual-setup/expo/
- NativeWind v5 (release candidate): https://www.nativewind.dev/v5
- UniWind docs: https://docs.uniwind.dev
- React Native Reusables: https://github.com/founded-labs/react-native-reusables
- react-native-unistyles releases: https://github.com/jpudysz/react-native-unistyles/releases
- TanStack Query v6 roadmap: https://github.com/TanStack/query/discussions/12669

## 12. Changes to the plan as it is executed

Each entry says what was planned, what was found, and what is done instead.

1. **Scrolling pages and the status bar (Phase 2, found on the device).** The first `Screen` left React Native's automatic inset to handle the status bar. That works on iOS only: React Native documents `contentInset`, `contentInsetAdjustmentBehavior` and `automaticallyAdjustContentInsets` as iOS-only, and on Android the page title was drawn under the clock. `Screen` now adds the space by hand on Android and leaves it to iOS. It also asks the router whether a native header sits above the page, because a header already keeps the status bar clear.
2. **Space under the tab bar (Phase 2).** The host of the native tabs already keeps tab content clear of the tab bar on both platforms: on Android it wraps each tab in a safe-area view, on iOS it adjusts the first scroll view. `Screen` does not add anything for it. Adding an inset by hand there doubled it on iOS.
3. **Native tab bar colour (Phase 3).** The tab bar is tinted with the device's system colour, not the brand colour. Tinting it from the theme is part of Phase 3.2.
4. **Maestro is 2.12.1**, not the 2.1 the plan was written against. One flow file runs unchanged on Android and iOS because both builds use the identifier `com.example.app.dev`.
