import { Stack } from 'expo-router';

/** Developer tools. Each screen gets the native header and back button. */
export default function DevLayout() {
  return (
    <Stack>
      <Stack.Screen name="menu" options={{ title: 'Developer tools' }} />
      <Stack.Screen name="dependency-check" options={{ title: 'Dependency check' }} />
      <Stack.Screen name="gallery" options={{ title: 'Component gallery' }} />
    </Stack>
  );
}
