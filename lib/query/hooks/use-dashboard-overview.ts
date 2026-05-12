"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/query-keys";
import { fetchDashboardOverview, type DashboardOverviewPanel } from "@/lib/query/fetchers/dashboard-overview";

export function useDashboardOverviewQuery(
  options?: Omit<UseQueryOptions<DashboardOverviewPanel, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: fetchDashboardOverview,
    staleTime: 60_000,
    ...options
  });
}
