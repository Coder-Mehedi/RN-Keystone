import type { ReactNode } from 'react';

import { ThemeProvider } from '@/shared/theme';

/**
 * Everything a screen can rely on being there.
 * The app is wrapped once, at the root. Tests wrap components with it too.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
