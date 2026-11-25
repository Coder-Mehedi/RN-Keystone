// In-memory replacement for react-native-mmkv under Jest.
// Mirrors the parts of the real interface the app uses. Extend it when a test needs more.
import type { MMKV } from 'react-native-mmkv';

type Value = boolean | string | number | ArrayBuffer;

interface Configuration {
  id?: string;
}

interface Listener {
  remove: () => void;
}

// One store per MMKV id, like the native implementation. Instances with the same id share data.
const stores = new Map<string, Map<string, Value>>();

function storeFor(configuration?: Configuration): Map<string, Value> {
  const id = configuration?.id ?? 'mmkv.default';
  let store = stores.get(id);
  if (!store) {
    store = new Map();
    stores.set(id, store);
  }
  return store;
}

/** Empties every store. Call it from a `beforeEach` when a test must not see earlier data. */
export function resetAllMMKV(): void {
  stores.clear();
}

export function createMMKV(configuration?: Configuration): MMKV {
  const store = storeFor(configuration);
  const listeners = new Set<(key: string) => void>();

  const instance = {
    id: configuration?.id ?? 'mmkv.default',
    get length() {
      return store.size;
    },
    get size() {
      return store.size;
    },
    get byteSize() {
      return store.size;
    },
    isReadOnly: false,
    isEncrypted: false,

    set(key: string, value: Value): void {
      store.set(key, value);
      listeners.forEach((listener) => listener(key));
    },
    getBoolean: (key: string) => store.get(key) as boolean | undefined,
    getString: (key: string) => store.get(key) as string | undefined,
    getNumber: (key: string) => store.get(key) as number | undefined,
    getBuffer: (key: string) => store.get(key) as ArrayBuffer | undefined,
    contains: (key: string) => store.has(key),
    remove: (key: string) => store.delete(key),
    getAllKeys: () => [...store.keys()],
    clearAll(): void {
      store.clear();
      listeners.forEach((listener) => listener(''));
    },
    recrypt(): void {},
    encrypt(): void {},
    decrypt(): void {},
    trim(): void {},
    checkContentChanged(): void {},
    addOnValueChangedListener(onValueChanged: (key: string) => void): Listener {
      listeners.add(onValueChanged);
      return { remove: () => listeners.delete(onValueChanged) };
    },
    importAllFrom(): number {
      return 0;
    },
  };

  // The real object also carries Nitro's HybridObject members, which tests never touch.
  return instance as unknown as MMKV;
}

export function existsMMKV(configuration: Configuration): boolean {
  return stores.has(configuration.id ?? 'mmkv.default');
}

export function deleteMMKV(configuration: Configuration): boolean {
  return stores.delete(configuration.id ?? 'mmkv.default');
}
