import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useIsOnline } from '@/shared/lib/network/use-online-status';

import { Text } from './text';

/**
 * A strip across the top of the app, shown while the device is offline.
 * Render it once, next to the root navigator.
 */
export function OfflineBanner() {
  const isOnline = useIsOnline();
  const insets = useSafeAreaInsets();

  if (isOnline) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="absolute inset-x-0 z-50 items-center bg-foreground px-4 pb-2"
      // Sits below the status bar, so it needs a number rather than a class.
      style={{ top: insets.top }}
    >
      <Text className="text-sm font-medium text-background">You are offline</Text>
    </View>
  );
}
