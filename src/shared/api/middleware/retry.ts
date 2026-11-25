import { ApiError, NetworkError, TimeoutError } from '@/shared/api/errors';
import type { Middleware } from '@/shared/api/types';

const IDEMPOTENT_METHODS = new Set(['GET', 'PUT', 'DELETE', 'HEAD', 'OPTIONS']);

function shouldRetry(
  error: unknown,
  attempt: number,
  maxAttempts: number,
  idempotent: boolean,
): boolean {
  if (attempt >= maxAttempts - 1 || !idempotent) return false;
  if (error instanceof NetworkError || error instanceof TimeoutError) return true;
  if (error instanceof ApiError) return error.status >= 500 || error.status === 429;
  return false;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createRetryMiddleware(maxAttempts = 3): Middleware {
  return async (request, next) => {
    const idempotent = request.idempotent ?? IDEMPOTENT_METHODS.has(request.method);
    let attempt = 0;

    for (;;) {
      try {
        return await next({ ...request, attempt });
      } catch (error) {
        if (!shouldRetry(error, attempt, maxAttempts, idempotent)) throw error;
        attempt += 1;
        await delay(200 * 2 ** (attempt - 1));
      }
    }
  };
}
