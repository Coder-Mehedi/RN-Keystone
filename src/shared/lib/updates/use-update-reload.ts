import * as Updates from 'expo-updates';
import { useEffect } from 'react';

/**
 * Restarts the app into an over-the-air update once it has been downloaded.
 *
 * Updates do not run in development builds or when started from Metro, where this kind of
 * reload is rejected, so the hook does nothing there.
 */
export function useUpdateReload(): void {
  const { isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled || !isUpdatePending) {
      return;
    }
    void Updates.reloadAsync();
  }, [isUpdatePending]);
}
