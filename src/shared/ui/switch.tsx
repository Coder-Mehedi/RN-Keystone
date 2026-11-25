import { Switch as RNSwitch, type SwitchProps as RNSwitchProps, View } from 'react-native';

import { cn } from '@/shared/lib/cn';

import { Pressable } from './pressable';
import { Text } from './text';

export interface SwitchProps extends Omit<
  RNSwitchProps,
  | 'value'
  | 'onValueChange'
  | 'accessible'
  | 'pointerEvents'
  | 'thumbColor'
  | 'trackColor'
  | 'className'
> {
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** What the switch stands for. It is shown, and read out as it is shown. */
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

/** Turns one setting on or off, with the platform's own switch. The whole row is tappable. */
export function Switch({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  className,
  ...rest
}: SwitchProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      className={cn(
        'min-h-11 flex-row items-center justify-between gap-4 rounded-control active:opacity-70 disabled:opacity-50',
        className,
      )}
    >
      <View className="flex-1">
        <Text className="text-base">{label}</Text>
        {description ? <Text variant="caption">{description}</Text> : null}
      </View>
      <RNSwitch
        {...rest}
        // The row handles the press, so that the target is the whole row and not the switch alone.
        accessible={false}
        pointerEvents="none"
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        thumbColorClassName="accent-background"
        trackColorOnClassName="accent-primary"
        trackColorOffClassName="accent-input"
        ios_backgroundColorClassName="accent-input"
      />
    </Pressable>
  );
}
