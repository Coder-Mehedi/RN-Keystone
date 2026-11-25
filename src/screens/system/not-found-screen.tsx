import { router } from 'expo-router';
import { FileQuestion } from 'lucide-react-native';

import { useThemeColor } from '@/shared/theme';
import { Button } from '@/shared/ui/button';
import { StateView } from '@/shared/ui/state-view';

export function NotFoundScreen() {
  const [muted] = useThemeColor('muted-foreground');

  return (
    <StateView
      title="Page not found"
      description="The page you are looking for does not exist."
      icon={<FileQuestion size={48} color={muted} accessible={false} />}
      action={<Button onPress={() => router.replace('/')}>Go to the start</Button>}
    />
  );
}
