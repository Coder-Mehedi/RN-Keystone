import { Text } from '@/shared/ui/text';

import { GallerySection } from './gallery-section';

export function TypographySection() {
  return (
    <GallerySection title="Typography" hint="The text scale used across the app.">
      <Text variant="display">Display</Text>
      <Text variant="title">Title</Text>
      <Text variant="heading">Heading</Text>
      <Text variant="bodyStrong">Body strong</Text>
      <Text variant="body">Body</Text>
      <Text variant="bodyMuted">Body muted</Text>
      <Text variant="label">Label</Text>
      <Text variant="caption">Caption</Text>
    </GallerySection>
  );
}
