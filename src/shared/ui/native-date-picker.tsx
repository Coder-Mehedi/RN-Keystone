import { DateTimePicker, type DateTimePickerEvent } from '@expo/ui/community/datetime-picker';
import { Platform } from 'react-native';

export interface NativeDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
}

export function NativeDatePicker({
  value,
  onChange,
  mode = 'date',
  minimumDate,
  maximumDate,
}: NativeDatePickerProps) {
  return (
    <DateTimePicker
      value={value}
      mode={mode}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      onChange={(_event: DateTimePickerEvent, date?: Date) => {
        if (date) onChange(date);
      }}
      display={Platform.OS === 'ios' ? 'compact' : 'default'}
    />
  );
}
