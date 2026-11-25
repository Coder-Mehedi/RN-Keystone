import { useState, type ReactNode } from 'react';
import { TextInput, type TextInputProps, View, type ViewProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

import { Text } from './text';

export interface InputProps
  extends
    Omit<TextInputProps, 'style' | 'editable' | 'className' | 'multiline'>,
    Pick<ViewProps, 'className'> {
  /** The name of the field, shown above it. Give every field one. */
  label?: string;
  /** One sentence on what to enter. Replaced by the error while there is one. */
  helperText?: string;
  /** Shown in place of the helper text, and marks the field as invalid. */
  error?: string;
  /** A single line by default. `multiline` makes a taller field that grows with its text. */
  multiline?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
}

/** A field for text the user types. For a choice between options, use a picker. */
export function Input({
  label,
  helperText,
  error,
  multiline = false,
  leftIcon,
  rightIcon,
  disabled = false,
  className,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);
  const message = error ?? helperText;

  return (
    <View className={cn('gap-1.5', disabled && 'opacity-50', className)}>
      {label ? (
        // The field announces the label itself, so the visible one is kept out of the way.
        <Text
          accessible={false}
          variant="label"
          className={hasError ? 'text-destructive' : undefined}
        >
          {label}
        </Text>
      ) : null}

      <View
        className={cn(
          'flex-row items-center gap-3 rounded-control border bg-background px-3',
          multiline ? 'min-h-24 items-start py-2' : 'min-h-12',
          hasError ? 'border-destructive' : 'border-input',
          isFocused && !hasError && 'border-ring',
        )}
      >
        {leftIcon}
        <TextInput
          {...rest}
          className={cn('flex-1 text-base text-foreground', multiline ? 'min-h-20' : 'min-h-12')}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          placeholderTextColorClassName="accent-muted-foreground"
          cursorColorClassName="accent-primary"
          selectionColorClassName="accent-primary"
          selectionHandleColorClassName="accent-primary"
          editable={!disabled}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
        />
        {rightIcon}
      </View>

      {message ? (
        <Text variant="caption" className={hasError ? 'text-destructive' : undefined}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}
