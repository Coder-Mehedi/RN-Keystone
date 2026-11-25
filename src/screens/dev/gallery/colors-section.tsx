import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { COLOR_TOKEN_CLASS, THEME_COLOR_TOKENS, useThemeColor } from '@/shared/theme';
import { Text } from '@/shared/ui/text';

import { GallerySection } from './gallery-section';

/**
 * Every colour token, twice. The left half is coloured by its class and the right half by the
 * value that `useThemeColor` returns, so a token that cannot be read stands out at once.
 */
export function ColorsSection() {
  const values = useThemeColor(...THEME_COLOR_TOKENS);

  return (
    <GallerySection
      title="Colours"
      hint="Left: coloured by a class. Right: coloured by the value read in JavaScript. Both halves must match."
    >
      {THEME_COLOR_TOKENS.map((token, index) => (
        <View key={token} className="flex-row items-center gap-3">
          <View
            accessible={false}
            className={cn(
              'h-10 w-14 rounded-l-control border border-border',
              COLOR_TOKEN_CLASS[token],
            )}
          />
          <View
            accessible={false}
            className="h-10 w-14 rounded-r-control border border-l-0 border-border"
            style={{ backgroundColor: values[index] }}
          />
          <View className="flex-1">
            <Text variant="label">{token}</Text>
            <Text variant="caption" className="font-mono">
              {values[index] ?? 'not available'}
            </Text>
          </View>
        </View>
      ))}
    </GallerySection>
  );
}
