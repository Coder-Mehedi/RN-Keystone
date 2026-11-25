import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';

import { Pressable } from './pressable';
import { Text } from './text';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** What is being chosen, for screen readers: "Theme". */
  label: string;
  disabled?: boolean;
  className?: string;
}

/**
 * One choice out of a few short options, all visible at once: "System | Light | Dark".
 * With more than five options, or long labels, use a picker instead.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  disabled = false,
  className,
}: SegmentedProps<T>) {
  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="radiogroup"
      className={cn(
        'flex-row gap-1 rounded-control bg-muted p-1',
        disabled && 'opacity-50',
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected, disabled }}
            disabled={disabled}
            onPress={() => {
              if (!selected) {
                onChange(option.value);
              }
            }}
            className={cn(
              'min-h-9 flex-1 items-center justify-center rounded-control px-3 active:opacity-70',
              selected && 'bg-background shadow-sm',
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                selected ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
