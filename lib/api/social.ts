import { api } from "@/lib/api/client";
import type {
  SocialAccount,
  ScheduledPost,
  CreateScheduledPostPayload,
  PaginatedScheduledPosts,
} from "@/lib/api/types";

// ─── Instagram OAuth ────────────────────────────────────────────────────────

export async function getAuthUrl(): Promise<{ url: string }> {
  return api.get<{ url: string }>("/v1/instagram/auth-url", { auth: true });
}

// ─── Social Accounts ────────────────────────────────────────────────────────

export async function getSocialAccounts(): Promise<SocialAccount[]> {
  return api.get<SocialAccount[]>("/v1/social-accounts", { auth: true });
}

export async function disconnectAccount(id: string): Promise<void> {
  return api.delete<void>(`/v1/social-accounts/${id}`, { auth: true });
}

// ─── Scheduled Posts ────────────────────────────────────────────────────────

export async function getScheduledPosts(
  status?: string,
): Promise<PaginatedScheduledPosts> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return api.get<PaginatedScheduledPosts>(`/v1/scheduled-posts${query}`, {
    auth: true,
  });
}

export async function createScheduledPost(
  data: CreateScheduledPostPayload,
): Promise<ScheduledPost> {
  return api.post<ScheduledPost>("/v1/scheduled-posts", data, { auth: true });
}

export async function updateScheduledPost(
  id: string,
  data: Partial<CreateScheduledPostPayload>,
): Promise<ScheduledPost> {
  return api.patch<ScheduledPost>(`/v1/scheduled-posts/${id}`, data, {
    auth: true,
  });
}

export async function cancelScheduledPost(id: string): Promise<ScheduledPost> {
  return api.delete<ScheduledPost>(`/v1/scheduled-posts/${id}`, { auth: true });
}