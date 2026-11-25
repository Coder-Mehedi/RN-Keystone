import { useLocalSearchParams } from 'expo-router';

import { usePostQuery } from '@/features/posts';
import { getErrorMessage } from '@/shared/api';
import { Screen } from '@/shared/ui/screen';
import { Spinner } from '@/shared/ui/spinner';
import { StateView } from '@/shared/ui/state-view';
import { Text } from '@/shared/ui/text';

export function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = usePostQuery(id ?? '');

  if (query.isLoading) {
    return (
      <Screen className="items-center justify-center">
        <Spinner label="Loading post" />
      </Screen>
    );
  }

  if (query.error || !query.data) {
    return (
      <StateView
        title="Could not load post"
        description={query.error ? getErrorMessage(query.error) : 'Post not found'}
      />
    );
  }

  return (
    <Screen scroll>
      <Text variant="display">{query.data.title}a</Text>
      <Text variant="caption">{new Date(query.data.createdAt).toLocaleString()}</Text>
      <Text variant="body">{query.data.body}</Text>
    </Screen>
  );
}
