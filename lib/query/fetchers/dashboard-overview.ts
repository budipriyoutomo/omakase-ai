import type { CampaignTemplate } from "@/lib/api/types";

export type DashboardOverviewPanel = {
  stats: Array<{ label: string; value: string }>;
  trendingTemplates: CampaignTemplate[];
  recentPreviewUrls: string[];
  suggestion: string;
};

/**
 * Swap this body for `dashboardService.getStats()` (+ parallel fetches) when the API is live.
 */
export async function fetchDashboardOverview(): Promise<DashboardOverviewPanel> {
  const { stats, templates, previews } = await import("@/lib/data/mock");

  return {
    stats,
    trendingTemplates: templates.slice(0, 4),
    recentPreviewUrls: previews.slice(0, 4),
    suggestion:
      'Try a "Payday Promo + Tokyo Neon" campaign targeting Instagram Story to increase walk-in traffic this Friday.'
  };
}
