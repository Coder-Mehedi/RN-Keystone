import { type ErrorBoundaryProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useSession } from '@/entities/session';
import { ErrorScreen, LoadingScreen } from '@/screens/system';
import { useUpdateReload } from '@/shared/lib/updates/use-update-reload';
import { AppProviders } from '@/shared/providers/app-providers';
import { OfflineBanner } from '@/shared/ui/offline-banner';

// Keep the native splash screen up until the session is known (see RootNavigator), so a user who
// is already signed in never sees the sign-in screen flash by. It has to run before anything
// renders, which is why it is here and not in a component.
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const session = useSession();
  const isHydrating = session.isHydrating;

  useUpdateReload();

  useEffect(() => {
    if (!isHydrating) {
      SplashScreen.hide();
    }
  }, [isHydrating]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Each group is available only while its guard holds. */}
        <Stack.Protected guard={session.isSignedIn}>
          <Stack.Screen name="(app)" />
          <Stack.Protected guard={__DEV__}>
            <Stack.Screen name="(dev)" />
          </Stack.Protected>
        </Stack.Protected>

        <Stack.Protected guard={!session.isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Screen name="+not-found" />
      </Stack>
      <OfflineBanner />
    </>
  );
}

/** Shown when a screen throws. The rest of the navigator stays mounted, so "back" still works. */
function ScreenErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorScreen {...props} />;
}

export const unstable_settings = {
  screenErrorBoundary: ScreenErrorBoundary,
};

/** Catches whatever no nearer boundary caught, including an error in this layout itself. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorScreen error={error} retry={retry} />;
}

/** Shown while a suspended screen loads its data. */
export function SuspenseFallback() {
  return <LoadingScreen />;
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
