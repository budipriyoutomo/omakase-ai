import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Subscription" subtitle="Manage your plan and billing status." />
      <div className="grid gap-4 md:grid-cols-3">
        {["Starter", "Pro", "Agency"].map((plan, idx) => (
          <GlassCard key={plan} className={idx === 1 ? "border-gold/60 shadow-glow" : ""}>
            <h3 className="text-xl font-semibold">{plan}</h3>
            <p className="mt-2 text-muted-foreground">{idx === 0 ? "$19/mo" : idx === 1 ? "$59/mo" : "$149/mo"}</p>
            <Button variant="goldOutline" size="sm" className="mt-5 w-fit" type="button">
              Select Plan
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
