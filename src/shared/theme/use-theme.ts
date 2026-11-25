import { useColorScheme } from 'react-native';
import { useCSSVariable } from 'uniwind';

import type { ThemeColorToken } from './color-tokens';
import { useThemePreference, type ResolvedTheme, type ThemeMode } from './theme-provider';

interface Theme {
  /** What the user asked for. */
  mode: ThemeMode;
  /** What is applied: the user's choice, or the device setting when the mode is `system`. */
  theme: ResolvedTheme;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

/** The one place the rest of the app reads the theme from. */
export function useTheme(): Theme {
  const mode = useThemePreference((state) => state.mode);
  const setMode = useThemePreference((state) => state.setMode);
  const systemScheme = useColorScheme();
  const theme: ResolvedTheme =
    mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  return { mode, theme, isDark: theme === 'dark', setMode };
}

/**
 * Current values of colour tokens, in the order they were asked for. Use them for props that
 * need a colour and cannot take a class, such as an icon tint or an activity indicator.
 *
 * A token reads as undefined until it is available.
 */
export function useThemeColor(...tokens: ThemeColorToken[]): (string | undefined)[] {
  return useCSSVariable(tokens.map((token) => `--color-${token}`)).map((value) =>
    typeof value === 'string' ? value : undefined,
  );
}
