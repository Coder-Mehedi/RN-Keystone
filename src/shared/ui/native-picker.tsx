import { Picker as ExpoPicker } from '@expo/ui/community/picker';
import type { PickerItemValue } from '@expo/ui/community/picker';
import { View } from 'react-native';

import { Text } from './text';

export interface NativePickerOption<T extends PickerItemValue> {
  label: string;
  value: T;
}

export interface NativePickerProps<T extends PickerItemValue> {
  label: string;
  value: T;
  options: readonly NativePickerOption<T>[];
  onChange: (value: T) => void;
}

export function NativePicker<T extends PickerItemValue>({
  label,
  value,
  options,
  onChange,
}: NativePickerProps<T>) {
  return (
    <View className="gap-1.5">
      <Text variant="label">{label}</Text>
      <ExpoPicker selectedValue={value} onValueChange={onChange}>
        {options.map((option) => (
          <ExpoPicker.Item key={String(option.value)} label={option.label} value={option.value} />
        ))}
      </ExpoPicker>
    </View>
  );
}
