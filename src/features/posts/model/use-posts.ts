import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPost, getPost, getPosts, type Post } from '@/features/posts/api/posts';
import { postsKeys } from '@/features/posts/model/keys';

export function usePostsQuery() {
  return useQuery({
    queryKey: postsKeys.list(),
    queryFn: getPosts,
  });
}

export function usePostQuery(id: string) {
  return useQuery({
    queryKey: postsKeys.detail(id),
    queryFn: () => getPost(id),
    enabled: Boolean(id),
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: postsKeys.list() });
      const previous = queryClient.getQueryData<{ items: Post[]; nextPage: string | null }>(
        postsKeys.list(),
      );
      const optimistic: Post = {
        id: `optimistic-${Date.now()}`,
        title: input.title,
        body: input.body,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData(postsKeys.list(), {
        items: [optimistic, ...(previous?.items ?? [])],
        nextPage: previous?.nextPage ?? null,
      });
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(postsKeys.list(), context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: postsKeys.list() });
    },
  });
}
