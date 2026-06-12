import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { accessTokenStorage } from "@/lib/api/token-storage";

export function useAuth() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  const isAuthenticated = !!accessToken;

  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await authApi.me();
      setUser(profile);
      return profile;
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // Clear session on auth error
      clearSession();
      accessTokenStorage.clear();
      throw err;
    }
  }, [setUser, clearSession]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
      // Clear session regardless of API error
    } finally {
      clearSession();
      accessTokenStorage.clear();
      router.push("/login");
    }
  }, [clearSession, router]);

  const refreshToken = useCallback(async () => {
    try {
      const tokens = await authApi.refresh();
      setAccessToken(tokens.accessToken);
      accessTokenStorage.set(tokens.accessToken);
      return tokens;
    } catch (err) {
      console.error("Token refresh failed:", err);
      clearSession();
      accessTokenStorage.clear();
      router.push("/login");
      throw err;
    }
  }, [setAccessToken, clearSession, router]);

  return {
    isAuthenticated,
    user,
    accessToken,
    setAccessToken,
    setUser,
    fetchUserProfile,
    logout,
    refreshToken,
    clearSession
  };
}
