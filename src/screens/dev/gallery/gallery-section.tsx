import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Card } from '@/shared/ui/card';
import { Text } from '@/shared/ui/text';

export interface GallerySectionProps {
  title: string;
  /** One sentence on what to look for. */
  hint?: string;
  children: ReactNode;
}

/** One component family on the gallery page: a heading, what to look for, and the samples. */
export function GallerySection({ title, hint, children }: GallerySectionProps) {
  return (
    <View className="gap-3">
      <Text variant="heading">{title}</Text>
      {hint ? <Text variant="caption">{hint}</Text> : null}
      <Card className="gap-4">{children}</Card>
    </View>
  );
}
