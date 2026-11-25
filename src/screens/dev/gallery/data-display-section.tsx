import { View } from 'react-native';

import { Avatar } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';
import { Spinner } from '@/shared/ui/spinner';
import { Text } from '@/shared/ui/text';

import { GallerySection } from './gallery-section';

export function DataDisplaySection() {
  return (
    <GallerySection title="Data display" hint="Badges, avatars, separators, loading states.">
      <View className="flex-row flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </View>

      <View className="flex-row items-center gap-3">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
        <Text variant="bodyMuted">Avatars with initials fallback</Text>
      </View>

      <Separator />

      <View className="flex-row items-center gap-3">
        <Spinner label="Loading" />
        <Text variant="bodyMuted">Spinner</Text>
      </View>

      <Card className="gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
      </Card>
    </GallerySection>
  );
}
