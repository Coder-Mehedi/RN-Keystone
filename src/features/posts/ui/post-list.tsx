import { router } from 'expo-router';
import { View } from 'react-native';

import { useCreatePostMutation, usePostsQuery } from '@/features/posts/model/use-posts';
import { getErrorMessage } from '@/shared/api';
import { useIsOnline } from '@/shared/lib/network/use-online-status';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { List } from '@/shared/ui/list';
import { Pressable } from '@/shared/ui/pressable';
import { Text } from '@/shared/ui/text';

export function PostList() {
  const query = usePostsQuery();
  const createPost = useCreatePostMutation();
  const isOnline = useIsOnline();

  return (
    <View className="flex-1 gap-4">
      <Button
        loading={createPost.isPending}
        onPress={() =>
          createPost.mutate({
            title: `New post ${new Date().toLocaleTimeString()}`,
            body: 'Created from the reference feature.',
          })
        }
      >
        Create post
      </Button>

      <List
        data={query.data?.items}
        loading={query.isLoading}
        error={query.error ? getErrorMessage(query.error) : null}
        offline={!isOnline}
        onRetry={() => void query.refetch()}
        keyExtractor={(item) => item.id}
        emptyTitle="No posts yet"
        emptyDescription="Create one to verify the API layer."
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open post ${item.title}`}
            onPress={() => router.push({ pathname: '/posts/[id]', params: { id: item.id } })}
          >
            <Card className="mb-3 gap-1">
              <Text variant="heading">{item.title}</Text>
              <Text variant="bodyMuted">{item.body}</Text>
              <Text variant="caption">{new Date(item.createdAt).toLocaleString()}</Text>
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}
