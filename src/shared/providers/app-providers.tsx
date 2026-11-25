import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { createQueryClient } from '@/shared/api/query-client';
import { ThemeProvider } from '@/shared/theme';
import { ToastProvider } from '@/shared/ui/toast';

/**
 * Everything a screen can rely on being there.
 * The app is wrapped once, at the root. Tests wrap components with it too.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
