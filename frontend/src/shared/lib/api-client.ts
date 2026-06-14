import { logger } from "./logger";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface RequestOptions extends RequestInit {
  correlationId?: string;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { correlationId, ...fetchOptions } = options;
  const url = `${API_BASE}${path}`;
  const id = correlationId ?? crypto.randomUUID();

  logger.info("API request", { correlationId: id, method: options.method ?? "GET", url });

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      "X-Correlation-Id": id,
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = { message: response.statusText };
    }
    logger.error("API error", { correlationId: id, status: response.status, body: errorBody });
    const error = new Error(
      (errorBody as { message?: string })?.message ?? "Request failed"
    );
    (error as Error & { status: number }).status = response.status;
    throw error;
  }

  const data = (await response.json()) as T;
  logger.info("API response", { correlationId: id, status: response.status });
  return data;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body != null ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body != null ? JSON.stringify(body) : undefined,
    }),
};
