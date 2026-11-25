import Constants from 'expo-constants';
import { View } from 'react-native';

import { env } from '@/shared/config/env';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';
import { ThemeSwitcher } from '@/shared/ui/theme-switcher';

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className="flex-1">{label}</Text>
      <Text variant="bodyMuted" className="shrink-0">
        {value}
      </Text>
    </View>
  );
}

export function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? '';

  return (
    <Screen scroll>
      <Text variant="display">Settings</Text>

      <Text variant="heading">Appearance</Text>
      <ThemeSwitcher />

      <Text variant="heading">About</Text>
      <View className="gap-3 rounded-card border border-border bg-card p-4">
        <SettingRow label="Version" value={version} />
        <SettingRow label="Environment" value={env.appVariant} />
        <SettingRow label="Mock API" value={env.EXPO_PUBLIC_API_MOCK ? 'Yes' : 'No'} />
      </View>
    </Screen>
  );
}
