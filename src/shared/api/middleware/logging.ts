import type { Middleware } from '@/shared/api/types';

function redactHeaders(headers: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    result[key] = key.toLowerCase() === 'authorization' ? '[redacted]' : value;
  }
  return result;
}

export const loggingMiddleware: Middleware = async (request, next) => {
  if (!__DEV__) return next(request);
  const start = Date.now();
  try {
    const response = await next(request);
    console.debug(
      '[api]',
      request.method,
      request.url,
      response.status,
      `${Date.now() - start}ms`,
      {
        correlationId: request.correlationId,
        headers: redactHeaders(request.headers),
      },
    );
    return response;
  } catch (error) {
    console.debug('[api:error]', request.method, request.url, `${Date.now() - start}ms`, error);
    throw error;
  }
};
