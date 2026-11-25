// Must be loaded before anything renders: it is what makes `className` work.
import '@/global.css';

import { NavigationBar } from 'expo-navigation-bar';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  type Theme,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, type ReactNode } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { Uniwind, useCSSVariable } from 'uniwind';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/shared/storage/zustand-storage';

/** What the user asked for. `system` follows the device setting. */
export type ThemeMode = 'system' | 'light' | 'dark';
/** The theme that is actually applied. */
export type ResolvedTheme = 'light' | 'dark';

interface ThemePreferenceState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

/** The user's theme choice, persisted. Components should read it through `useTheme` instead. */
export const useThemePreference = create<ThemePreferenceState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => {
        Uniwind.setTheme(mode);
        set({ mode });
      },
    }),
    {
      name: 'theme-preference',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);

// Apply the saved choice before anything renders, so the app opens in the right theme.
Uniwind.setTheme(useThemePreference.getState().mode);

/** Resolves the user's choice against the device setting. */
function useResolvedTheme(mode: ThemeMode): ResolvedTheme {
  const systemScheme = useColorScheme();

  if (mode === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

/** Colours of the native headers (titles, back buttons, tint), taken from the design tokens. */
function useNavigationTheme(resolved: ResolvedTheme): Theme {
  const [primary, background, card, text, border] = useCSSVariable([
    '--color-primary',
    '--color-background',
    '--color-card',
    '--color-foreground',
    '--color-border',
  ]);

  const base = resolved === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: typeof primary === 'string' ? primary : base.colors.primary,
      background: typeof background === 'string' ? background : base.colors.background,
      card: typeof card === 'string' ? card : base.colors.card,
      text: typeof text === 'string' ? text : base.colors.text,
      border: typeof border === 'string' ? border : base.colors.border,
    },
  };
}

/** Reads a design token as a colour, or undefined when it is not available. */
function useThemeColorValue(token: string): string | undefined {
  const value = useCSSVariable(token);
  return typeof value === 'string' ? value : undefined;
}

/**
 * Applies the theme everywhere: component styles, native headers, the status bar and the
 * navigation bar. Wrap the app once, near the root.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemePreference((state) => state.mode);
  const resolved = useResolvedTheme(mode);
  const navigationTheme = useNavigationTheme(resolved);
  const background = useThemeColorValue('--color-background');

  // The colour behind everything, visible during transitions and when content is shorter than a page.
  useEffect(() => {
    if (background) {
      void SystemUI.setBackgroundColorAsync(background);
    }
  }, [background]);

  return (
    <>
      <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
      {Platform.OS === 'android' ? (
        <NavigationBar style={resolved === 'dark' ? 'light' : 'dark'} />
      ) : null}
      <NavigationThemeProvider value={navigationTheme}>{children}</NavigationThemeProvider>
    </>
  );
}
