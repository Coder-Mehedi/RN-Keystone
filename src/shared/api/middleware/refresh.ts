import { ApiError } from '@/shared/api/errors';
import type { Middleware } from '@/shared/api/types';

export type RefreshToken = () => Promise<string | null>;

export function createRefreshMiddleware(refreshToken: RefreshToken): Middleware {
  let refreshPromise: Promise<string | null> | null = null;

  return async (request, next) => {
    try {
      return await next(request);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401 || request.auth === false)
        throw error;
      if (request.headers['x-auth-retry'] === '1') throw error;

      refreshPromise ??= refreshToken().finally(() => {
        refreshPromise = null;
      });
      const token = await refreshPromise;
      if (!token) throw error;

      return next({
        ...request,
        headers: {
          ...request.headers,
          Authorization: `Bearer ${token}`,
          'x-auth-retry': '1',
        },
      });
    }
  };
}
