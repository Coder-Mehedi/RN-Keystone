import { z } from 'zod';

import { apiClient } from '@/shared/api';

const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
});

const postsResponseSchema = z.object({
  items: z.array(postSchema),
  nextPage: z.string().nullable(),
});

export type Post = z.infer<typeof postSchema>;
export type PostsResponse = z.infer<typeof postsResponseSchema>;

export async function getPosts(): Promise<PostsResponse> {
  const response = await apiClient.get<unknown>('/posts');
  return postsResponseSchema.parse(response.data);
}

export async function getPost(id: string): Promise<Post> {
  const response = await apiClient.get<unknown>(`/posts/${id}`);
  return postSchema.parse(response.data);
}

export async function createPost(input: Pick<Post, 'title' | 'body'>): Promise<Post> {
  const response = await apiClient.post<unknown>('/posts', { body: input });
  return postSchema.parse(response.data);
}
