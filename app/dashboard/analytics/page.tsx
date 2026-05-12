import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { UsageChart } from "@/components/dashboard/usage-chart";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Analytics" subtitle="Campaign performance and content usage." />
      <GlassCard>
        <h3 className="text-lg font-semibold">Monthly Generation Volume</h3>
        <UsageChart />
      </GlassCard>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Instagram", "48%"],
          ["TikTok", "31%"],
          ["Banner Ads", "21%"]
        ].map(([channel, value]) => (
          <GlassCard key={channel}>
            <p className="text-muted-foreground">{channel}</p>
            <p className="mt-2 text-2xl font-semibold text-gold">{value}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
