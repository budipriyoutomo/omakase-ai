import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { UserProfile } from "@/lib/api/types";

/** localStorage key used by zustand persist */
export const AUTH_STORAGE_KEY = "omakase-auth-storage";

/** Legacy bare token key (read fallback + removed on clear) */
const LEGACY_TOKEN_KEY = "omakase_access_token";

export type AuthStore = {
  accessToken: string | null;
  user: UserProfile | null;
  credits: number;
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  setCredits: (credits: number) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      credits: 92,
      setAccessToken: (accessToken) => {
        set({ accessToken });
        if (typeof window !== "undefined" && accessToken) {
          try {
            window.localStorage.removeItem(LEGACY_TOKEN_KEY);
          } catch {
            /* ignore */
          }
        }
      },
      setUser: (user) => set({ user }),
      setCredits: (credits) => set({ credits }),
      clearSession: () => {
        set({ accessToken: null, user: null });
        if (typeof window !== "undefined") {
          try {
            window.localStorage.removeItem(LEGACY_TOKEN_KEY);
          } catch {
            /* ignore */
          }
        }
      }
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        accessToken: s.accessToken,
        user: s.user,
        credits: s.credits
      })
    }
  )
);

/** Synchronous read for API client before zustand has rehydrated in the browser */
export function readPersistedAccessTokenSync(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { accessToken?: string | null } };
      const t = parsed?.state?.accessToken;
      if (typeof t === "string" && t.length > 0) return t;
    }
    const legacy = window.localStorage.getItem(LEGACY_TOKEN_KEY);
    return legacy && legacy.length > 0 ? legacy : null;
  } catch {
    return null;
  }
}
