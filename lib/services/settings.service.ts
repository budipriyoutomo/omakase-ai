import { api } from "@/lib/api/client";
import type { UserProfile, UserSettingsPayload } from "@/lib/api/types";
import { API_V1 } from "@/lib/services/paths";
import type { ServiceOptions } from "@/lib/services/options";

export async function getProfile(opts?: ServiceOptions): Promise<UserProfile> {
  return api.get<UserProfile>(`${API_V1}/users/me`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

export async function updateProfile(
  patch: UserSettingsPayload,
  opts?: ServiceOptions
): Promise<UserProfile> {
  return api.patch<UserProfile>(`${API_V1}/users/me`, patch, {
    ...opts,
    auth: opts?.auth ?? true
  });
}
