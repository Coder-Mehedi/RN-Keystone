import { BottomSheet } from '@expo/ui/community/bottom-sheet';
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { Picker } from '@expo/ui/community/picker';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

import { GallerySection } from './gallery-section';

const OPTIONS = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
] as const;

export function NativeControlsSection() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pickerValue, setPickerValue] = useState<(typeof OPTIONS)[number]['value']>('a');
  const [date, setDate] = useState(new Date());

  return (
    <GallerySection title="Native controls" hint="@expo/ui controls where they beat custom UI.">
      <View className="gap-2">
        <Text variant="label">Picker</Text>
        <Picker selectedValue={pickerValue} onValueChange={setPickerValue}>
          {OPTIONS.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      <View className="gap-2">
        <Text variant="label">Date and time</Text>
        <DateTimePicker value={date} onValueChange={(_e, next) => setDate(next)} mode="date" />
      </View>

      <Button variant="outline" onPress={() => setSheetOpen(true)}>
        Open native bottom sheet
      </Button>
      <BottomSheet
        index={sheetOpen ? 0 : -1}
        onClose={() => setSheetOpen(false)}
        snapPoints={[260]}
      >
        <View className="gap-3 p-4">
          <Text variant="heading">Native sheet</Text>
          <Text variant="bodyMuted">Rendered by @expo/ui.</Text>
          <Button onPress={() => setSheetOpen(false)}>Close</Button>
        </View>
      </BottomSheet>
    </GallerySection>
  );
}
