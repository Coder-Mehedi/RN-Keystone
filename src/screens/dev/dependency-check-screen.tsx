import * as NetInfo from '@react-native-community/netinfo';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';
import { Rocket } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createMMKV } from 'react-native-mmkv';

import { useThemeColor } from '@/shared/theme';
import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

const ROWS = Array.from({ length: 200 }, (_, index) => `Row ${index + 1}`);

type Checks = Record<string, string>;

/**
 * Each check calls a library directly, bypassing the app's own wrappers, so it proves that the
 * native module itself works on this device.
 */
async function runChecks(): Promise<Checks> {
  const checks: Checks = {};

  const attempt = async (name: string, run: () => Promise<string> | string) => {
    try {
      checks[name] = await run();
    } catch (error) {
      checks[name] = `FAILED: ${error instanceof Error ? error.message : String(error)}`;
    }
  };

  await attempt('MMKV', () => {
    const instance = createMMKV({ id: 'dependency-check' });
    instance.set('string', 'round-trip');
    instance.set('number', 42);
    const ok = instance.getString('string') === 'round-trip' && instance.getNumber('number') === 42;
    instance.clearAll();
    return ok ? 'ok' : 'unexpected value';
  });

  await attempt('SecureStore', async () => {
    await SecureStore.setItemAsync('dependency-check', 'round-trip');
    const ok = (await SecureStore.getItemAsync('dependency-check')) === 'round-trip';
    await SecureStore.deleteItemAsync('dependency-check');
    return ok ? 'ok' : 'unexpected value';
  });

  await attempt('NetInfo', async () => {
    const state = await NetInfo.fetch();
    return `${state.type ?? 'unknown'}, ${state.isConnected ? 'online' : 'offline'}`;
  });

  return checks;
}

export function DependencyCheckScreen() {
  const [checks, setChecks] = useState<Checks>({});
  const [primary] = useThemeColor('primary');

  useEffect(() => {
    void runChecks().then(setChecks);
  }, []);

  return (
    <Screen>
      <Text variant="title">Dependency check</Text>
      <Text variant="bodyMuted">Each line proves one native dependency works on this device.</Text>

      {/* React Native SVG */}
      <View className="flex-row items-center gap-2">
        <Rocket size={24} color={primary} accessible={false} />
        <Text>react-native-svg</Text>
      </View>

      {Object.entries(checks).map(([name, result]) => (
        <View key={name} className="flex-row items-center justify-between gap-4">
          <Text>{name}</Text>
          <Text className={result === 'ok' ? 'text-success' : 'text-muted-foreground'}>
            {result}
          </Text>
        </View>
      ))}

      <Button variant="outline" onPress={() => void Haptics.impactAsync()}>
        Haptics
      </Button>

      <Text variant="heading">List</Text>
      <FlashList
        className="flex-1"
        data={ROWS}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text className="py-1.5">{item}</Text>}
      />
    </Screen>
  );
}
