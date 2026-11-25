// Runs once per test file, after Jest and the jest-expo preset are installed.
//
// jest-expo already replaces every `expo-*` native module with a stub. The mocks below cover the
// third-party native modules that have no JavaScript fallback.

// In-memory replacement for react-native-mmkv (Nitro has no runtime under Jest).
jest.mock('react-native-mmkv', () => require('./mocks/react-native-mmkv'));

// The library ships its own mock; it resolves "online" by default.
jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock'),
);
