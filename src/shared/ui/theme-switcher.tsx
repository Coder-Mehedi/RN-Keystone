import { useTheme, type ThemeMode } from '@/shared/theme';

import { Segmented, type SegmentedOption } from './segmented';

const OPTIONS: readonly SegmentedOption<ThemeMode>[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

/** Lets the user follow the device setting or fix the theme to light or dark. */
export function ThemeSwitcher() {
  const { mode, setMode } = useTheme();

  return <Segmented label="Theme" options={OPTIONS} value={mode} onChange={setMode} />;
}
