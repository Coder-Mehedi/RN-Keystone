import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';
import { Text } from '@/shared/ui/text';

import { GallerySection } from './gallery-section';

export function ControlsSection() {
  const [checked, setChecked] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [value, setValue] = useState('');

  return (
    <GallerySection title="Controls" hint="Buttons, inputs, and toggles.">
      <View className="flex-row flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button loading>Loading</Button>
      </View>

      <Input
        label="Email"
        placeholder="you@example.com"
        helperText="We'll never share it."
        value={value}
        onChangeText={setValue}
      />
      <Input label="With error" placeholder="Required" error="This field is required." />

      <Checkbox checked={checked} onCheckedChange={setChecked} label="Accept terms" />
      <Switch value={enabled} onValueChange={setEnabled} label="Enable notifications" />
      <Text variant="caption">
        Checked: {String(checked)} · Enabled: {String(enabled)}
      </Text>
    </GallerySection>
  );
}
