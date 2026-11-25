import type { ImageSource } from 'expo-image';
import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';

import { Image } from './image';
import { Text } from './text';

/** The first letters of the first two words: "Ada Lovelace" → "AL", "ada" → "A". */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

export interface AvatarProps {
  /**
   * Who this is. The initials stand in for the picture until it has loaded, and when there is none.
   */
  name: string;
  source?: ImageSource | null;
  className?: string;
}

/**
 * A person's picture in a circle. Decoration: the name next to it is what screen readers use.
 */
export function Avatar({ name, source, className }: AvatarProps) {
  return (
    <View
      accessible={false}
      className={cn(
        'size-10 items-center justify-center overflow-hidden rounded-full bg-muted',
        className,
      )}
    >
      <Text className="text-sm font-semibold text-muted-foreground">{initialsOf(name)}</Text>
      {source ? (
        <Image source={source} className="absolute inset-0 size-full" accessible={false} />
      ) : null}
    </View>
  );
}
