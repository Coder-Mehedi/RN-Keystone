import { ActivityIndicator, View } from 'react-native';

import { useThemeColor } from '@/shared/theme';
import { Text } from '@/shared/ui/text';

export function LoadingScreen() {
  const [primary] = useThemeColor('primary');

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <ActivityIndicator size="large" color={primary} />
      <Text variant="bodyMuted">Loading</Text>
    </View>
  );
}
