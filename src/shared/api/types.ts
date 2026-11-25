type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  signal?: AbortSignal;
  auth?: boolean;
  retry?: boolean;
  idempotent?: boolean;
}

export interface ApiRequest extends RequestOptions {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  correlationId: string;
  attempt: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
  request: ApiRequest;
}

type Next = <T>(request: ApiRequest) => Promise<ApiResponse<T>>;

export interface Middleware {
  (request: ApiRequest, next: Next): Promise<ApiResponse<unknown>>;
}

export interface Transport {
  (request: ApiRequest): Promise<ApiResponse<unknown>>;
}
