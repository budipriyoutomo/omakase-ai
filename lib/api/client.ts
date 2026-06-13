import { buildApiUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import { accessTokenStorage } from "@/lib/api/token-storage";
import { tryRefreshToken } from "@/lib/api/token-refresh";

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  /** Use for FormData / streams. Ignored when `json` is set. */
  body?: BodyInit;
  /** JSON body; sets Content-Type and serializes */
  json?: unknown;
  /**
   * When true, sends `Authorization: Bearer <token>` using `accessTokenStorage` (client only).
   * Ignored on the server unless you pass `token` explicitly.
   */
  auth?: boolean;
  /** Explicit Bearer token (overrides `auth` storage when set) */
  token?: string | null;
};

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  return text;
}

/**
 * Typed fetch to your backend. Throws `ApiError` on non-OK responses.
 *
 * Automatically attempts token refresh on 401 (Unauthorized).
 */
export async function apiRequest<T = unknown>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { json, auth, token, body: rawBody, headers: initHeaders, ...rest } = options;

  const headers = new Headers(initHeaders);

  let body: BodyInit | undefined = rawBody;
  if (json !== undefined) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    body = JSON.stringify(json);
  }

  const bearer = token ?? (auth ? accessTokenStorage.get() : null);
  if (bearer && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${bearer}`);
  }

  const url = buildApiUrl(path);

  const response = await fetch(url, {
    ...rest,
    headers,
    body,
    cache: rest.cache ?? "no-store"
  });

  // ── 401 interceptor: auto-refresh token and retry once ──────────────
  if (response.status === 401 && auth && !token && typeof window !== "undefined") {
    const newToken = await tryRefreshToken();
    if (newToken) {
      // Retry the original request with the fresh token
      const retryHeaders = new Headers(initHeaders);
      retryHeaders.set("Authorization", `Bearer ${newToken}`);
      if (json !== undefined && !retryHeaders.has("Content-Type")) {
        retryHeaders.set("Content-Type", "application/json");
      }

      const retryResponse = await fetch(url, {
        ...rest,
        headers: retryHeaders,
        body,
        cache: "no-store",
      });

      const retryParsed = await parseBody(retryResponse);

      if (!retryResponse.ok) {
        const message =
          typeof retryParsed === "object" && retryParsed !== null && "message" in retryParsed && typeof (retryParsed as { message: unknown }).message === "string"
            ? (retryParsed as { message: string }).message
            : retryResponse.statusText || "Request failed";
        throw new ApiError(message, retryResponse.status, retryParsed);
      }

      if (retryParsed && typeof retryParsed === "object" && "data" in retryParsed) {
        return (retryParsed as { data: T }).data;
      }

      return retryParsed as T;
    }

    // Refresh failed — throw the original error
    const parsed = await parseBody(response);
    const message =
      typeof parsed === "object" && parsed !== null && "message" in parsed && typeof (parsed as { message: unknown }).message === "string"
        ? (parsed as { message: string }).message
        : response.statusText || "Unauthorized";
    throw new ApiError(message, 401, parsed);
  }

  const parsed = await parseBody(response);

  if (!response.ok) {
    const message =
      typeof parsed === "object" && parsed !== null && "message" in parsed && typeof (parsed as { message: unknown }).message === "string"
        ? (parsed as { message: string }).message
        : response.statusText || "Request failed";
    throw new ApiError(message, response.status, parsed);
  }

  if (parsed && typeof parsed === "object" && "data" in parsed) {
    return (parsed as { data: T }).data;
  }

  return parsed as T;
}

export const api = {
  get: <T = unknown>(path: string, options?: Omit<ApiRequestOptions, "body" | "method" | "json">) =>
    apiRequest<T>(path, { ...options, method: "GET" }),

  post: <T = unknown>(path: string, json?: unknown, options?: Omit<ApiRequestOptions, "method" | "json">) =>
    apiRequest<T>(path, { ...options, method: "POST", json }),

  put: <T = unknown>(path: string, json?: unknown, options?: Omit<ApiRequestOptions, "method" | "json">) =>
    apiRequest<T>(path, { ...options, method: "PUT", json }),

  patch: <T = unknown>(path: string, json?: unknown, options?: Omit<ApiRequestOptions, "method" | "json">) =>
    apiRequest<T>(path, { ...options, method: "PATCH", json }),

  delete: <T = unknown>(path: string, options?: Omit<ApiRequestOptions, "body" | "method" | "json">) =>
    apiRequest<T>(path, { ...options, method: "DELETE" })
};
