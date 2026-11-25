import { PostList } from '@/features/posts';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

export function PostsScreen() {
  return (
    <Screen className="flex-1">
      <Text variant="display">Posts</Text>
      <Text variant="bodyMuted">Reference feature using the API layer and TanStack Query.</Text>
      <PostList />
    </Screen>
  );
}
