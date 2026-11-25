import { router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

/**
 * Development tools. The route is only reachable in development builds (the guard is in
 * src/app/_layout.tsx), so this screen may do things a user must never be able to do.
 */
export function DevMenuScreen() {
  const [shouldThrowWhileRendering, setShouldThrowWhileRendering] = useState(false);
  const [shouldThrowInEffect, setShouldThrowInEffect] = useState(false);

  useEffect(() => {
    if (shouldThrowInEffect) {
      throw new Error('Deliberate error, thrown from an effect by the developer menu.');
    }
  }, [shouldThrowInEffect]);

  if (shouldThrowWhileRendering) {
    throw new Error('Deliberate error, thrown while rendering by the developer menu.');
  }

  return (
    <Screen scroll>
      <Text variant="title">Developer tools</Text>
      <Text variant="bodyMuted">Only available in development builds.</Text>

      <Button variant="outline" onPress={() => router.push('/dependency-check')}>
        Check native dependencies
      </Button>
      <Button variant="outline" onPress={() => router.push('/gallery')}>
        Component gallery
      </Button>
      <Button variant="outline" onPress={() => setShouldThrowWhileRendering(true)}>
        Throw an error while rendering
      </Button>
      <Button variant="outline" onPress={() => setShouldThrowInEffect(true)}>
        Throw an error in an effect
      </Button>
      <Button variant="outline" onPress={() => router.push('/this-page-does-not-exist' as Href)}>
        Open a page that does not exist
      </Button>
    </Screen>
  );
}
