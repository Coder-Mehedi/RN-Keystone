import { View } from 'react-native';

import { Text } from '@/shared/ui/text';

import { GallerySection } from './gallery-section';

const SAMPLES = ['shadow-none', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl'] as const;

/** The shadow sizes of the design system, on a card and in the current theme. */
export function ElevationSection() {
  return (
    <GallerySection
      title="Elevation"
      hint="Each shadow size on a card. Shadows are subtle by design and nearly invisible in the dark theme."
    >
      <View className="flex-row justify-between gap-3">
        {SAMPLES.map((shadow) => (
          <View key={shadow} className="flex-1 items-center gap-2">
            <View className={`h-16 w-full rounded-card bg-card ${shadow}`} />
            <Text variant="caption" className="font-mono">
              {shadow}
            </Text>
          </View>
        ))}
      </View>
    </GallerySection>
  );
}
