import { Stack } from 'expo-router';

export default function PostsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="[id]" options={{ title: 'Post' }} />
    </Stack>
  );
}
