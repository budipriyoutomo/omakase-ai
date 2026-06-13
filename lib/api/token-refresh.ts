/**
 * Token refresh interceptor.
 *
 * When an API call fails with 401 (Unauthorized), this module attempts to
 * call the refresh endpoint before giving up.
 */

import { accessTokenStorage } from "@/lib/api/token-storage";
import { buildApiUrl } from "@/lib/api/config";

let refreshPromise: Promise<string | null> | null = null;

/**
 * Call the backend refresh endpoint, store the new token, and return it.
 * If refresh fails, clear the session and return null.
 */
async function doRefresh(): Promise<string | null> {
    try {
        const currentToken = accessTokenStorage.get();
        if (!currentToken) return null;

        const url = buildApiUrl("/v1/auth/refresh");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${currentToken}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            // Refresh failed — clear session
            accessTokenStorage.clear();
            return null;
        }

        const body = (await response.json()) as { access_token?: string; data?: { access_token?: string } };

        // Handle both response shapes: { access_token } and { data: { access_token } }
        const newToken = body.access_token ?? body.data?.access_token ?? null;

        if (!newToken) {
            accessTokenStorage.clear();
            return null;
        }

        accessTokenStorage.set(newToken);
        return newToken;
    } catch {
        accessTokenStorage.clear();
        return null;
    }
}

/**
 * Attempt to refresh the token.
 *
 * Thread-safe: concurrent callers share the same in-flight promise.
 * Returns the new token or null if refresh failed.
 */
export function tryRefreshToken(): Promise<string | null> {
    if (!refreshPromise) {
        refreshPromise = doRefresh().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
}