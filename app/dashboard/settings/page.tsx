import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tabs = ["Account", "Billing", "API", "Notifications", "Preferences"];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Settings" subtitle="Configure account, billing, API, and preferences." />
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, idx) => (
          <Button key={tab} variant={idx === 0 ? "secondary" : "outline"} size="sm" type="button" className="rounded-xl">
            {tab}
          </Button>
        ))}
      </div>
      <GlassCard>
        <h3 className="text-lg font-semibold">Account Information</h3>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="settings-name">Full name</Label>
            <Input id="settings-name" placeholder="Ada Lovelace" />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="settings-email">Email</Label>
            <Input id="settings-email" type="email" placeholder="you@company.com" />
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
