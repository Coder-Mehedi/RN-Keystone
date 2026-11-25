import { ApiError, NetworkError, TimeoutError } from '@/shared/api/errors';
import type {
  ApiRequest,
  ApiResponse,
  Middleware,
  RequestOptions,
  Transport,
} from '@/shared/api/types';
import { env } from '@/shared/config/env';

function createCorrelationId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildUrl(path: string, query: RequestOptions['query']): string {
  const base = env.EXPO_PUBLIC_API_URL;
  if (!path.startsWith('http') && !base) {
    throw new ApiError({
      status: 0,
      code: 'MISSING_API_URL',
      message: 'EXPO_PUBLIC_API_URL is not configured.',
    });
  }
  const url = new URL(path, base);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null) continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  const text = await response.text();
  return text.length ? text : null;
}

const fetchTransport: Transport = async <T>(request: ApiRequest): Promise<ApiResponse<T>> => {
  const timeoutMs = request.timeoutMs ?? 15_000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new TimeoutError()), timeoutMs);
  const onAbort = () => controller.abort(request.signal?.reason);
  request.signal?.addEventListener('abort', onAbort, { once: true });

  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body == null ? undefined : JSON.stringify(request.body),
      signal: controller.signal,
    });

    const data = (await parseBody(response)) as T;
    if (!response.ok) {
      const payload = data as { message?: string; code?: string; fieldErrors?: unknown } | null;
      throw new ApiError({
        status: response.status,
        code: payload?.code ?? `HTTP_${response.status}`,
        message: payload?.message ?? `Request failed with status ${response.status}`,
        fieldErrors: Array.isArray(payload?.fieldErrors) ? (payload.fieldErrors as []) : [],
        cause: data,
      });
    }

    return { data, status: response.status, headers: response.headers, request };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof TimeoutError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      if (error instanceof TimeoutError) throw error;
      throw new TimeoutError('Request timed out', error);
    }
    throw new NetworkError('Network request failed', error);
  } finally {
    clearTimeout(timeout);
    request.signal?.removeEventListener('abort', onAbort);
  }
};

function compose(middlewares: Middleware[], transport: Transport): Transport {
  return middlewares.reduceRight<Transport>(
    (next, middleware) => (request) =>
      middleware(request, next as never) as Promise<ApiResponse<unknown>>,
    transport,
  );
}

export interface ApiClient {
  request<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  put<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  patch<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}

export function createApiClient(
  middlewares: Middleware[],
  transport: Transport = fetchTransport,
): ApiClient {
  const run = compose(middlewares, transport);

  async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const method = options.method ?? 'GET';
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.body == null ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers ?? {}),
    };

    const apiRequest: ApiRequest = {
      ...options,
      url: buildUrl(path, options.query),
      method,
      headers,
      correlationId: createCorrelationId(),
      attempt: 0,
    };

    return run(apiRequest) as Promise<ApiResponse<T>>;
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, options) => request(path, { ...options, method: 'POST' }),
    put: (path, options) => request(path, { ...options, method: 'PUT' }),
    patch: (path, options) => request(path, { ...options, method: 'PATCH' }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  };
}
