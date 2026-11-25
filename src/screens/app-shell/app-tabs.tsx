import { NativeTabs } from 'expo-router/native-tabs';

import { useThemeColor } from '@/shared/theme';

/**
 * The tab bar of the signed-in area. It is the platform's own tab bar, so it behaves and
 * animates like the rest of the system. Tabs are listed one by one, and Android allows at most five.
 */
export function AppTabs() {
  const [primary] = useThemeColor('primary');

  return (
    <NativeTabs
      // Without this each platform tints the selected tab with its own colour, not the brand's.
      tintColor={primary}
      iconColor={{ selected: primary }}
      labelStyle={{ selected: { color: primary } }}
      indicatorColor={primary}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
