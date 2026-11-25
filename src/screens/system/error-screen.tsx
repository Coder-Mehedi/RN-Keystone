import { TriangleAlert } from 'lucide-react-native';
import { View } from 'react-native';

import { useThemeColor } from '@/shared/theme';
import { Button } from '@/shared/ui/button';
import { StateView } from '@/shared/ui/state-view';
import { Text } from '@/shared/ui/text';

interface ErrorScreenProps {
  /** The error that was thrown, when there is one. */
  error?: unknown;
  /** Renders the failed screen again. */
  retry: () => void | Promise<void>;
}

/**
 * What a user sees when a screen fails to render. Shown by the route error boundaries, so it
 * must not depend on anything that could itself have failed.
 */
export function ErrorScreen({ error, retry }: ErrorScreenProps) {
  const [destructive] = useThemeColor('destructive');
  const message = error instanceof Error ? error.message : undefined;
  const stack = error instanceof Error ? error.stack : undefined;

  return (
    <StateView
      title="Something went wrong"
      description={__DEV__ && message ? message : 'An unexpected error occurred. Try again.'}
      icon={<TriangleAlert size={48} color={destructive} accessible={false} />}
      action={<Button onPress={() => void retry()}>Try again</Button>}
    >
      {__DEV__ && stack ? (
        <View className="max-h-48 w-full gap-1 rounded-card bg-muted p-3">
          <Text className="text-xs text-muted-foreground">{stack}</Text>
        </View>
      ) : null}
    </StateView>
  );
}
