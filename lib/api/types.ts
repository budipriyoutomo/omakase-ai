/**
 * Align these with your backend DTOs as you implement endpoints.
 */

export type DashboardStat = {
  label: string;
  value: string;
};

export type MonthlyUsagePoint = {
  month: string;
  usage: number;
};

export type CampaignTemplate = {
  id?: string;
  name: string;
  category: string;
  style: string;
};

export type PaginatedMeta = {
  total: number;
  page: number;
  pageSize: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: PaginatedMeta;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthCredentials & {
  name?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
};

export type CreateGenerationPayload = {
  campaignType: string;
  platform: string;
  style: string;
  prompt: string;
};

export type GenerationRecord = {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  campaignType?: string;
  platform?: string;
  style?: string;
  previewUrls?: string[];
  createdAt: string;
  updatedAt?: string;
};

export type BrandKitIdentity = {
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  priceUsdMonthly: number;
  creditsMonthly?: number;
  description?: string;
};

export type SubscriptionStatus = {
  planId?: string;
  status: string;
  currentPeriodEndsAt?: string;
};

export type AnalyticsSummary = {
  impressions?: number;
  clicks?: number;
  conversions?: number;
  period?: string;
};

export type UserSettingsPayload = Partial<{
  name: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
}>;
