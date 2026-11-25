import type { StateStorage } from 'zustand/middleware';

import { storage } from './mmkv';

/** The app's key-value storage in the shape Zustand's `persist` middleware expects. */
export const zustandStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.remove(name),
};
