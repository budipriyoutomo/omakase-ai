import { api } from "@/lib/api/client";
import type { AnalyticsSummary, MonthlyUsagePoint } from "@/lib/api/types";
import { API_V1 } from "@/lib/services/paths";
import type { ServiceOptions } from "@/lib/services/options";

export type AnalyticsRange = "7d" | "30d" | "90d" | "12m";

export async function getSummary(range: AnalyticsRange = "30d", opts?: ServiceOptions): Promise<AnalyticsSummary> {
  return api.get<AnalyticsSummary>(`${API_V1}/analytics/summary?range=${encodeURIComponent(range)}`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

export async function getUsageSeries(range: AnalyticsRange = "12m", opts?: ServiceOptions): Promise<MonthlyUsagePoint[]> {
  return api.get<MonthlyUsagePoint[]>(`${API_V1}/analytics/usage?range=${encodeURIComponent(range)}`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}
