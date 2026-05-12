import { api } from "@/lib/api/client";
import type { CampaignTemplate, DashboardStat, MonthlyUsagePoint } from "@/lib/api/types";
import { API_V1 } from "@/lib/services/paths";
import type { ServiceOptions } from "@/lib/services/options";

export async function getStats(opts?: ServiceOptions): Promise<DashboardStat[]> {
  return api.get<DashboardStat[]>(`${API_V1}/dashboard/stats`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

export async function getMonthlyUsage(opts?: ServiceOptions): Promise<MonthlyUsagePoint[]> {
  return api.get<MonthlyUsagePoint[]>(`${API_V1}/dashboard/usage`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

export async function getSuggestions(opts?: ServiceOptions): Promise<{ text: string } | { suggestions: string[] }> {
  return api.get(`${API_V1}/dashboard/suggestions`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

/** Quick links / highlights for dashboard “trending” strip */
export async function getTrendingTemplates(opts?: ServiceOptions): Promise<CampaignTemplate[]> {
  return api.get<CampaignTemplate[]>(`${API_V1}/dashboard/templates/trending`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}
