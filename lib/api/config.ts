/**
 * Base URL for backend API requests.
 *
 * Browser: reads `NEXT_PUBLIC_API_BASE_URL` (inlined at build).
 * Server (RSC / Route Handler): prefers `API_BASE_URL`, then falls back to public URL.
 *
 * Leave empty to use same-origin paths (e.g. Next.js Route Handlers under `/api/...`).
 */
export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    const server = process.env.API_BASE_URL;
    if (server !== undefined && server !== "") return trimTrailingSlash(server);
  }

  const publicUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return trimTrailingSlash(publicUrl);
}

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBaseUrl();

  if (!base) {
    return normalizedPath;
  }

  return `${base}${normalizedPath}`;
}
