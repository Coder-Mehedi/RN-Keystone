# React Native App

Expo/React Native starter app (Bun, TypeScript, Expo Router).

## Stack

- **Expo SDK 58** / React Native 0.88 / React 19 / TypeScript 6
- **Routing:** Expo Router (`src/app`)
- **Styling/UI:** Uniwind + Tailwind CSS 4, custom shared UI components
- **State/Storage:** Zustand, MMKV, SecureStore, NetInfo
- **Quality:** ESLint, Prettier, Jest, Knip, expo-doctor, Husky/commitlint
- **Native/Build:** EAS config, dev client, Sentry plugin, expo-updates

## Project Structure

```text
src/
  app/        # Route files only (Expo Router)
  screens/    # Screen composition
  features/   # Feature modules (public API via index.ts)
  entities/   # Shared business entities
  shared/     # api, ui, lib, config, storage, theme, providers
tests/        # Jest setup and tests
docs/         # Plan and ADRs
```

Import boundaries are enforced by ESLint (`eslint-plugin-boundaries`).

## Current App State

- Root app shell with providers, splash handling, error boundaries, offline banner.
- Route groups: `(app)`, `(auth)`, `(dev)`, `+not-found`.
- Native tabs for Home/Settings.
- Dev tools screens: menu, dependency check, component gallery.
- Theme support (system/light/dark) via shared theme provider.
- i18n has been removed; UI copy is currently hardcoded.

## Commands

```bash
bun install

bun run start          # Metro
bun run ios            # iOS dev build/simulator
bun run android        # Android dev build/emulator

bun run typecheck
bun run lint
bun run format:check
bun run test
bun run knip:check
bun run doctor
bun run check          # full verification
```

## Environment

- Committed: `.env.development`, `.env.production`
- Local overrides (ignored): `.env*.local`
- Env is validated in `src/shared/config/env.ts`; do not put secrets in `EXPO_PUBLIC_*`.

## Notes

- `ios/` and `android/` are generated (CNG) and gitignored; regenerate with `bunx expo prebuild --clean` after native/config changes.
- Install packages with `bunx expo install <package>` for SDK-compatible versions.
