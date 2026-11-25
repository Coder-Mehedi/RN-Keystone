import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { useThemeColor, type ThemeColorToken } from '@/shared/theme';

import { Pressable, type PressableProps } from './pressable';
import { Spinner } from './spinner';
import { Text } from './text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

const containerClassName: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  outline: 'border border-border bg-background',
  ghost: 'bg-transparent',
  destructive: 'bg-destructive',
};

const labelClassName: Record<ButtonVariant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  outline: 'text-foreground',
  ghost: 'text-foreground',
  destructive: 'text-destructive-foreground',
};

/** The token that colours the label. The spinner uses it too. */
const labelToken: Record<ButtonVariant, ThemeColorToken> = {
  primary: 'primary-foreground',
  secondary: 'secondary-foreground',
  outline: 'foreground',
  ghost: 'foreground',
  destructive: 'destructive-foreground',
};

// Every size meets the 44pt minimum touch target. Heights are minimums, so a button grows with
// the user's text size instead of cutting the label off.
const sizeClassName: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-3 py-1.5',
  md: 'min-h-11 px-4 py-2',
  lg: 'min-h-12 px-6 py-2.5',
};

const sizeLabelClassName: Record<ButtonSize, string> = {
  sm: 'text-sm font-medium',
  md: 'text-base font-semibold',
  lg: 'text-base font-semibold',
};

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner beside the label and makes the button ignore presses. */
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

/** The main control for an action. For navigation, use a `Link`. */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  children,
  onPress,
  ...rest
}: ButtonProps) {
  const [tint] = useThemeColor(labelToken[variant]);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      // The button has its own feedback: it dims while pressed.
      haptics={false}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-control active:opacity-80 disabled:opacity-50',
        containerClassName[variant],
        sizeClassName[size],
        className,
      )}
    >
      {loading ? <Spinner size="small" color={tint} accessible={false} /> : null}
      {typeof children === 'string' ? (
        <Text className={cn(sizeLabelClassName[size], labelClassName[variant])}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
