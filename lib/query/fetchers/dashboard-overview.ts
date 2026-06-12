import type { CampaignTemplate, MonthlyUsagePoint } from "@/lib/api/types";
import { getStats, getTrendingTemplates, getSuggestions, getMonthlyUsage } from "@/lib/services/dashboard.service";
import { listHistory } from "@/lib/services/campaigns.service";

export type DashboardOverviewPanel = {
  stats: Array<{ label: string; value: string }>;
  trendingTemplates: CampaignTemplate[];
  recentPreviewUrls: string[];
  suggestion: string;
  monthlyUsage: MonthlyUsagePoint[];
};

export async function fetchDashboardOverview(): Promise<DashboardOverviewPanel> {
  const [stats, trendingTemplates, suggestionsResult, historyResult, monthlyUsage] = await Promise.all([
    getStats(),
    getTrendingTemplates(),
    getSuggestions(),
    listHistory({ limit: 4 }),
    getMonthlyUsage()
  ]);

  let suggestionText = "";
  if ("suggestions" in suggestionsResult && suggestionsResult.suggestions?.length > 0) {
    suggestionText = suggestionsResult.suggestions[0];
  } else if ("text" in suggestionsResult) {
    suggestionText = suggestionsResult.text;
  }

  const recentPreviewUrls = historyResult.items
    .map(g => g.previewUrls?.[0])
    .filter((url): url is string => !!url);

  return {
    stats,
    trendingTemplates: trendingTemplates.slice(0, 4),
    recentPreviewUrls,
    suggestion: suggestionText || 'Try a "Payday Promo + Tokyo Neon" campaign targeting Instagram Story to increase walk-in traffic this Friday.',
    monthlyUsage: Array.isArray(monthlyUsage) ? monthlyUsage : []
  };
}
