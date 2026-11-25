import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

import { Text } from './text';

export interface FormFieldProps extends ViewProps {
  label?: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
}

/** Wraps a control with label, helper text, and error message. */
export function FormField({
  label,
  helperText,
  error,
  children,
  className,
  ...rest
}: FormFieldProps) {
  const message = error ?? helperText;
  const hasError = Boolean(error);

  return (
    <View {...rest} className={cn('gap-1.5', className)}>
      {label ? (
        <Text variant="label" className={hasError ? 'text-destructive' : undefined}>
          {label}
        </Text>
      ) : null}
      {children}
      {message ? (
        <Text variant="caption" className={hasError ? 'text-destructive' : undefined}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}
