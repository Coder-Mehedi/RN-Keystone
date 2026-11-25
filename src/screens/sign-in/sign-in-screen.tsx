import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

export function SignInScreen() {
  return (
    <Screen>
      <Text variant="display">Sign in</Text>
      <Text variant="bodyMuted">Sign-in is connected to the session in a later phase.</Text>
    </Screen>
  );
}
