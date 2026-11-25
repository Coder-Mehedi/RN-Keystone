export interface ApiFieldError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiErrorOptions {
  status: number;
  code: string;
  message: string;
  fieldErrors?: ApiFieldError[];
  cause?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: ApiFieldError[];

  constructor({ status, code, message, fieldErrors = [], cause }: ApiErrorOptions) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed', cause?: unknown) {
    super(message, { cause });
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timed out', cause?: unknown) {
    super(message, { cause });
    this.name = 'TimeoutError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError || error instanceof NetworkError || error instanceof TimeoutError) {
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}
