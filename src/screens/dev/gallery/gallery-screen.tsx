import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';
import { ThemeSwitcher } from '@/shared/ui/theme-switcher';

import { ColorsSection } from './colors-section';
import { ElevationSection } from './elevation-section';

/**
 * The design system on one page, for checking every component in both themes and at any text
 * size. Only reachable in development builds (the guard is in src/app/_layout.tsx).
 */
export function GalleryScreen() {
  return (
    <Screen scroll>
      <Text variant="title">Component gallery</Text>
      <Text variant="bodyMuted">
        Every component of the design system, in the theme chosen here.
      </Text>

      <ThemeSwitcher />
      <ColorsSection />
      <ElevationSection />
    </Screen>
  );
}
