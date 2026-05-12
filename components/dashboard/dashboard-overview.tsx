"use client";

import Image from "next/image";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { useDashboardOverviewQuery } from "@/lib/query/hooks/use-dashboard-overview";
import { Button } from "@/components/ui/button";

export function DashboardOverview() {
  const { data, isPending, isError, error, refetch } = useDashboardOverviewQuery();

  if (isPending) {
    return <DashboardOverviewSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Dashboard Overview" subtitle="Track your AI marketing operations in real time." />
        <GlassCard className="border-destructive/40 bg-destructive/5">
          <p className="text-sm text-destructive-foreground">{error?.message ?? "Could not load dashboard."}</p>
          <Button type="button" variant="outline" className="mt-4 w-fit" onClick={() => void refetch()}>
            Retry
          </Button>
        </GlassCard>
      </div>
    );
  }

  const { stats, trendingTemplates, recentPreviewUrls, suggestion } = data;

  return (
    <div className="space-y-6">
      <SectionTitle title="Dashboard Overview" subtitle="Track your AI marketing operations in real time." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <GlassCard key={item.label}>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard>
        <h3 className="text-lg font-semibold">Monthly Usage</h3>
        <UsageChart />
      </GlassCard>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-lg font-semibold">Recent Generations</h3>
          <div className="grid grid-cols-2 gap-3">
            {recentPreviewUrls.map((src) => (
              <div key={src} className="relative h-28 overflow-hidden rounded-xl border border-border">
                <Image src={src} alt="recent" fill className="object-cover" />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold">Trending Campaign Templates</h3>
          <div className="flex flex-col gap-2 pt-2">
            {trendingTemplates.map((template) => (
              <div key={template.name} className="rounded-xl border border-border bg-muted/40 px-3 py-3">
                <p className="text-sm text-gold">{template.category}</p>
                <p className="text-foreground">{template.name}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      <GlassCard>
        <h3 className="text-lg font-semibold">AI Suggestions</h3>
        <p className="mt-2 text-muted-foreground">{suggestion}</p>
      </GlassCard>
    </div>
  );
}

function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Dashboard Overview" subtitle="Track your AI marketing operations in real time." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GlassCard key={String(i)} className="animate-pulse">
            <div className="h-4 w-24 rounded-md bg-muted" />
            <div className="mt-3 h-8 w-20 rounded-md bg-muted" />
          </GlassCard>
        ))}
      </div>
      <GlassCard className="animate-pulse">
        <div className="mb-4 h-5 w-40 rounded-md bg-muted" />
        <div className="h-72 rounded-lg bg-muted/60" />
      </GlassCard>
    </div>
  );
}
