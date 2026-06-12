import { api } from "@/lib/api/client";
import type { AuthCredentials, RegisterPayload, AuthTokens, UserProfile } from "@/lib/api/types";

export const authApi = {
  /**
   * POST /v1/auth/login
   * Returns access and refresh tokens on success
   */
  login: async (credentials: AuthCredentials): Promise<AuthTokens> => {
    return api.post<AuthTokens>("/v1/auth/login", credentials);
  },

  /**
   * POST /v1/auth/register
   * Register new user and return tokens
   */
  register: async (payload: RegisterPayload): Promise<AuthTokens> => {
    return api.post<AuthTokens>("/v1/auth/register", payload);
  },

  /**
   * POST /v1/auth/forgot-password
   * Request password reset link
   */
  forgotPassword: async (email: string): Promise<void> => {
    return api.post("/v1/auth/forgot-password", { email });
  },

  /**
   * GET /v1/auth/me
   * Get current authenticated user profile
   */
  me: async (): Promise<UserProfile> => {
    return api.get<UserProfile>("/v1/auth/me", { auth: true });
  },

  /**
   * POST /v1/auth/logout
   * Logout current user (clears server session)
   */
  logout: async (): Promise<void> => {
    return api.post("/v1/auth/logout", {}, { auth: true });
  },

  /**
   * POST /v1/auth/refresh
   * Refresh access token using current token
   */
  refresh: async (): Promise<AuthTokens> => {
    return api.post<AuthTokens>("/v1/auth/refresh", {}, { auth: true });
  }
};
