import { ApiError } from '@/shared/api/errors';
import type { ApiRequest, ApiResponse, Transport } from '@/shared/api/types';

type MockHandler = (request: ApiRequest) => Promise<unknown> | unknown;

interface MockRoute {
  method: string;
  pattern: RegExp;
  handler: MockHandler;
}

function pathToRegex(path: string): RegExp {
  const escaped = path
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/:([A-Za-z0-9_]+)/g, '(?<$1>[^/]+)');
  return new RegExp(`^${escaped}$`);
}

export function createMockTransport(routes: MockRoute[]): Transport {
  return async <T>(request: ApiRequest): Promise<ApiResponse<T>> => {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const url = new URL(request.url);
    const route = routes.find((r) => r.method === request.method && r.pattern.test(url.pathname));
    if (!route) {
      throw new ApiError({
        status: 404,
        code: 'NOT_FOUND',
        message: `No mock for ${request.method} ${url.pathname}`,
      });
    }
    const data = (await route.handler(request)) as T;
    return {
      data,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      request,
    };
  };
}

export function mockRoute(method: string, path: string, handler: MockHandler): MockRoute {
  return { method, pattern: pathToRegex(path), handler };
}
