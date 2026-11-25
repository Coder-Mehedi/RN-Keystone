import { createApiClient } from '@/shared/api/client';
import { createAuthMiddleware } from '@/shared/api/middleware/auth';
import { loggingMiddleware } from '@/shared/api/middleware/logging';
import { createRefreshMiddleware } from '@/shared/api/middleware/refresh';
import { createRetryMiddleware } from '@/shared/api/middleware/retry';
import { createMockTransport, mockRoute } from '@/shared/api/mock-transport';
import { env } from '@/shared/config/env';

let accessToken: string | null = null;

const mockTransport = createMockTransport([
  mockRoute('GET', '/posts', () => ({
    items: [
      {
        id: '1',
        title: 'First post',
        body: 'Hello from the mock API.',
        createdAt: '2026-11-24T10:00:00Z',
      },
      {
        id: '2',
        title: 'Second post',
        body: 'Offline-friendly content.',
        createdAt: '2026-11-24T11:00:00Z',
      },
    ],
    nextPage: null,
  })),
  mockRoute('GET', '/posts/:id', (request) => {
    const id = new URL(request.url).pathname.split('/').pop();
    return {
      id,
      title: `Post ${id}`,
      body: 'Post details from mock.',
      createdAt: '2026-11-24T10:00:00Z',
    };
  }),
  mockRoute('POST', '/posts', (request) => {
    const body = request.body as { title?: string; body?: string };
    return {
      id: String(Date.now()),
      title: body.title ?? 'Untitled',
      body: body.body ?? '',
      createdAt: new Date().toISOString(),
    };
  }),
]);

export const apiClient = createApiClient(
  [
    createAuthMiddleware(() => accessToken),
    createRefreshMiddleware(async () => null),
    createRetryMiddleware(),
    loggingMiddleware,
  ],
  env.EXPO_PUBLIC_API_MOCK ? mockTransport : undefined,
);

export * from '@/shared/api/errors';
