This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

The same goes for the other dependencies: read the installed package's type definitions under `node_modules` before using an API you have not used in this project.

## Commands

This project uses Bun (`bun.lock`). Run everything through the scripts in `package.json`:

```bash
bun run check        # what a pull request must pass: typecheck, lint, format, tests, dead code, expo-doctor
bun run typecheck    # also generates the Expo and Uniwind type files first
bun run lint         # ESLint, zero warnings allowed ("bun run lint:fix" to auto-fix)
bun run format       # Prettier
bun run test         # Jest ("bun run test:watch" while developing)
bun run start        # Metro dev server
bun run ios          # build and run the development build on a simulator
bun run android      # build and run the development build on an emulator
```

Install packages with `bunx expo install <package>`, which resolves SDK-compatible versions. Do not use `bun add`, `npm install`, `yarn add` or `pnpm add`.

Run `bun run check` before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- `ios/` and `android/` are generated and git-ignored (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.config.ts` and config plugins.
- `bun run ios` and `bun run android` only generate `ios/` and `android/` when they are missing. After changing `app.config.ts`, a config plugin or a native dependency, run `bunx expo prebuild --clean` first, or the build silently uses the stale native project.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `bun run ios` or `bun run android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Project structure

Code lives in layers under `src/`. ESLint enforces who may import whom (`eslint-plugin-boundaries` in `eslint.config.js`), so a violation fails `bun run lint`.

| Layer                 | Holds                                                                                   | May import from                                                |
| --------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `src/app`             | Route files only. They render a screen and nothing else.                                | screens, features, entities, shared (never another route file) |
| `src/screens/<name>`  | One screen: its UI and screen-specific state                                            | features, entities, shared                                     |
| `src/features/<name>` | One feature: `api/`, `model/`, `ui/`, and `index.ts`                                    | shared, entities, other features through their `index.ts`      |
| `src/entities/<name>` | A business object shared by several features                                            | shared                                                         |
| `src/shared`          | Building blocks with no app knowledge: `api`, `ui`, `lib`, `config`, `storage`, `theme` | nothing outside `shared`                                       |

- A feature or an entity is used from outside only through its `index.ts`. Put its public API there and import from the folder, never from a file inside it.
- Tests live next to the code they cover, named `*.test.ts(x)`. Jest's setup and shared mocks are in `tests/`.

## Things that have already caught us out

- ESLint is held at 9. Expo's preset bundles `eslint-plugin-react` 7.37, which crashes on ESLint 10.
- TypeScript 6 only loads `@types` packages that are listed in `compilerOptions.types`.
- `react-native-mmkv` v4 is created with `createMMKV()`. There is no `new MMKV()`.
- FlashList 2 has no `estimatedItemSize` prop.
- Under Jest, query through what `renderRouter` returns. Testing Library's global `screen` is not connected to the router's tree.
- Testing Library 14: `renderHook` and `act` return promises. Always `await` them. An `act` that is not awaited leaves React's queue dirty for the next test.
- A screen can render more than once while it fails, because React retries a failed render synchronously. In a test, keep the throw-or-not switch outside the component.
- Files under `src/app/` are all loaded as routes by the router, including in tests. Never put a test or a helper there.
- `className` works on components imported from `react-native` only in the Metro bundle: Uniwind's Metro config redirects those imports to its own wrapped components. Jest does not, so styles do not apply in unit tests. Test behaviour, not appearance.
- React Native's scroll-view insets (`contentInset`, `contentInsetAdjustmentBehavior`, `automaticallyAdjustContentInsets`) are iOS-only. On Android, add the space for the status bar by hand, as `Screen` does. The host of the native tabs keeps tab content clear of the tab bar on both platforms; do not add to it.
- In a development build, React Native's red error overlay covers an error boundary's screen. Dismiss it to see the screen a release build would show.
- A Metro server left running overnight can serve stale bundles after the Mac sleeps. Start it again with `bunx expo start --clear`.
- Two development builds on one emulator both register `exp+app://`, so Android asks which to open and `bun run android` stalls. Uninstall the old one.
- Native tabs run in one JavaScript runtime and one React tree, even though each tab's views are hosted natively. State and context providers at the root reach every tab. Render an overlay that must cover the tab bar (a toast, the offline banner) next to the navigator in `src/app/_layout.tsx`, not inside a `Modal`: a modal on Android swallows every touch while it is up.
- A deep link opens a screen only when the app is already running. From cold, the development client shows its launcher first: start the bundle, then open the link.
