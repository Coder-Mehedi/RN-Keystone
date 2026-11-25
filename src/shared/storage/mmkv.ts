import { createMMKV } from 'react-native-mmkv';

import type { KeyValueStorage } from './types';

/**
 * Storage for data that is not secret: preferences, caches.
 *
 * It is not encrypted, so never keep tokens, passwords or keys in it. Secrets belong in the
 * device's secure storage (Keychain, Keystore).
 */
export const storage: KeyValueStorage = createMMKV({ id: 'app-storage' });
