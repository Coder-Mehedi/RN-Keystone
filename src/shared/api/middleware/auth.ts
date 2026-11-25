import type { Middleware } from '@/shared/api/types';

export type AccessTokenProvider = () => string | null | Promise<string | null>;

export function createAuthMiddleware(getAccessToken: AccessTokenProvider): Middleware {
  return async (request, next) => {
    if (request.auth === false) return next(request);
    const token = await getAccessToken();
    if (!token) return next(request);
    return next({
      ...request,
      headers: { ...request.headers, Authorization: `Bearer ${token}` },
    });
  };
}
