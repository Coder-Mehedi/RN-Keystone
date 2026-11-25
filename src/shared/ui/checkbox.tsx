import { Check } from 'lucide-react-native';
import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { useThemeColor } from '@/shared/theme';

import { Pressable } from './pressable';
import { Text } from './text';

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** What the checkbox stands for. It is shown, and read out as it is shown. */
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

/** Turns one option on or off. For a choice between options, use a segmented control or a picker. */
export function Checkbox({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
}: CheckboxProps) {
  const [checkColor] = useThemeColor('primary-foreground');

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      className={cn(
        'min-h-11 flex-row items-center gap-3 rounded-control active:opacity-70 disabled:opacity-50',
        className,
      )}
    >
      <View
        accessible={false}
        className={cn(
          'h-5.5 w-5.5 shrink-0 items-center justify-center rounded-control border',
          checked ? 'border-primary bg-primary' : 'border-input bg-background',
        )}
      >
        {checked ? <Check size={16} strokeWidth={3} color={checkColor} accessible={false} /> : null}
      </View>
      <View className="flex-1">
        <Text className="text-base">{label}</Text>
        {description ? <Text variant="caption">{description}</Text> : null}
      </View>
    </Pressable>
  );
}
