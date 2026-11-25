import { useState } from 'react';
import { View } from 'react-native';

import { Segmented, type SegmentedOption } from '@/shared/ui/segmented';
import { Text } from '@/shared/ui/text';

import { GallerySection } from './gallery-section';

type Scale = '0.85' | '1' | '1.15' | '1.3';

const OPTIONS: readonly SegmentedOption<Scale>[] = [
  { value: '0.85', label: 'S' },
  { value: '1', label: 'Default' },
  { value: '1.15', label: 'L' },
  { value: '1.3', label: 'XL' },
];

export function FontScaleSection() {
  const [scale, setScale] = useState<Scale>('1');
  const multiplier = Number(scale);

  return (
    <GallerySection title="Font scale" hint="Preview text at different font scales.">
      <Segmented label="Font scale" options={OPTIONS} value={scale} onChange={setScale} />
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 16 * multiplier, lineHeight: 24 * multiplier }}>
          Body preview at {scale}x
        </Text>
        <Text
          variant="bodyMuted"
          style={{ fontSize: 14 * multiplier, lineHeight: 20 * multiplier }}
        >
          Use OS accessibility settings for real app scaling.
        </Text>
      </View>
    </GallerySection>
  );
}
