import { router } from 'expo-router';

import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

export function HomeScreen() {
  return (
    <Screen scroll>
      <Text variant="display">Home</Text>
      <Text variant="bodyMuted">This is the starting point of the app.</Text>
      <Text variant="caption">Screens go in src/screens, features in src/features.</Text>

      {__DEV__ ? (
        <Button variant="outline" className="self-start" onPress={() => router.push('/menu')}>
          Developer tools
        </Button>
      ) : null}
    </Screen>
  );
}
