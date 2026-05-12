import { readPersistedAccessTokenSync, useAuthStore } from "@/lib/stores/auth-store";

/**
 * Client-only Bearer token bridge: keeps `apiRequest({ auth: true })` working
 * while session state lives in Zustand (with persist).
 */
export const accessTokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return useAuthStore.getState().accessToken ?? readPersistedAccessTokenSync();
  },

  set(token: string): void {
    if (typeof window === "undefined") return;
    useAuthStore.getState().setAccessToken(token);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    useAuthStore.getState().clearSession();
  }
};
