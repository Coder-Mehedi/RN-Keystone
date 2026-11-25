import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/shared/lib/cn';

import { Pressable } from './pressable';
import { Text } from './text';

type ToastVariant = 'default' | 'success' | 'destructive';

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastState extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClassName: Record<ToastVariant, string> = {
  default: 'bg-foreground',
  success: 'bg-success',
  destructive: 'bg-destructive',
};

const variantTextClassName: Record<ToastVariant, string> = {
  default: 'text-background',
  success: 'text-success-foreground',
  destructive: 'text-destructive-foreground',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const insets = useSafeAreaInsets();

  const show = useCallback((options: ToastOptions) => {
    const id = Date.now();
    setToast({ id, variant: 'default', duration: 2500, ...options });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, options.duration ?? 2500);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View
          pointerEvents="box-none"
          className="absolute inset-x-0 z-50 px-4"
          style={{ bottom: insets.bottom + 16 }}
        >
          <Pressable
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            onPress={() => setToast(null)}
            className={cn(
              'rounded-card px-4 py-3 shadow-lg',
              variantClassName[toast.variant ?? 'default'],
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                variantTextClassName[toast.variant ?? 'default'],
              )}
            >
              {toast.message}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
