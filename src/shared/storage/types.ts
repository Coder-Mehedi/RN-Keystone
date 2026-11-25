/** Synchronous key-value storage for data that is not secret: preferences, caches. */
export interface KeyValueStorage {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  contains(key: string): boolean;
  remove(key: string): void;
  clearAll(): void;
}
