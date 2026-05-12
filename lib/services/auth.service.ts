import { api, apiRequest } from "@/lib/api/client";
import type { AuthCredentials, AuthTokens, RegisterPayload, UserProfile } from "@/lib/api/types";
import { accessTokenStorage } from "@/lib/api/token-storage";
import { API_V1 } from "@/lib/services/paths";
import type { ServiceOptions } from "@/lib/services/options";

export async function login(credentials: AuthCredentials, opts?: ServiceOptions): Promise<AuthTokens> {
  const tokens = await api.post<AuthTokens>(`${API_V1}/auth/login`, credentials, opts);

  if (typeof window !== "undefined" && tokens.accessToken) {
    accessTokenStorage.set(tokens.accessToken);
  }

  return tokens;
}

export async function register(payload: RegisterPayload, opts?: ServiceOptions): Promise<AuthTokens> {
  const tokens = await api.post<AuthTokens>(`${API_V1}/auth/register`, payload, opts);

  if (typeof window !== "undefined" && tokens.accessToken) {
    accessTokenStorage.set(tokens.accessToken);
  }

  return tokens;
}

export async function logoutRemote(opts?: ServiceOptions): Promise<void> {
  try {
    await api.post<{ ok?: boolean }>(`${API_V1}/auth/logout`, undefined, {
      ...opts,
      auth: opts?.auth ?? true
    });
  } catch {
    /* network / 401 — still clear local session */
  } finally {
    if (typeof window !== "undefined") {
      accessTokenStorage.clear();
    }
  }
}

/** Clear local session only (no network). */
export function logoutLocal(): void {
  accessTokenStorage.clear();
}

export async function fetchCurrentUser(opts?: ServiceOptions): Promise<UserProfile> {
  return api.get<UserProfile>(`${API_V1}/auth/me`, { ...opts, auth: opts?.auth ?? true });
}

export async function forgotPassword(email: string, opts?: ServiceOptions): Promise<void> {
  await api.post<{ ok?: boolean }>(`${API_V1}/auth/forgot-password`, { email }, opts);
}

/** When backend rotates tokens (optional). */
export async function refreshTokens(refreshToken: string, opts?: ServiceOptions): Promise<AuthTokens> {
  const tokens = await api.post<AuthTokens>(
    `${API_V1}/auth/refresh`,
    { refreshToken },
    opts
  );

  if (typeof window !== "undefined" && tokens.accessToken) {
    accessTokenStorage.set(tokens.accessToken);
  }

  return tokens;
}

/** Password update while logged in. */
export async function changePassword(
  payload: { currentPassword: string; newPassword: string },
  opts?: ServiceOptions
): Promise<void> {
  await api.post<{ ok?: boolean }>(`${API_V1}/auth/change-password`, payload, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

/** multipart upload if backend expects file */
export async function uploadAvatar(file: File, opts?: ServiceOptions): Promise<{ url?: string }> {
  const form = new FormData();
  form.append("avatar", file);
  return apiRequest<{ url?: string }>(`${API_V1}/auth/me/avatar`, {
    ...opts,
    method: "POST",
    body: form,
    auth: opts?.auth ?? true
  });
}
