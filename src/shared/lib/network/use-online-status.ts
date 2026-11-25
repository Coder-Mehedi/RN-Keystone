import { useNetInfo } from '@react-native-community/netinfo';

/**
 * False only once the device is known to be offline.
 * "Not known yet" counts as online, so the app does not flash an offline warning at launch.
 */
export function useIsOnline(): boolean {
  const { isConnected } = useNetInfo();

  return isConnected !== false;
}
