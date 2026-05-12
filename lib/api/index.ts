export { api, apiRequest, type ApiRequestOptions } from "@/lib/api/client";
export { ApiError } from "@/lib/api/errors";
export { getApiBaseUrl, buildApiUrl } from "@/lib/api/config";
export { accessTokenStorage } from "@/lib/api/token-storage";
export { useAuthStore, readPersistedAccessTokenSync, AUTH_STORAGE_KEY, type AuthStore } from "@/lib/stores/auth-store";

export type {
  AnalyticsSummary,
  AuthCredentials,
  AuthTokens,
  BrandKitIdentity,
  CampaignTemplate,
  CreateGenerationPayload,
  DashboardStat,
  GenerationRecord,
  MonthlyUsagePoint,
  PaginatedMeta,
  PaginatedResponse,
  RegisterPayload,
  SubscriptionPlan,
  SubscriptionStatus,
  UserProfile,
  UserSettingsPayload
} from "@/lib/api/types";
