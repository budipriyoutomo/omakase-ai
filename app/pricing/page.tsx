import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <main className="container-wide py-10 sm:py-14 md:py-16">
      <SectionTitle title="Pricing" subtitle="Choose a plan tailored to your marketing volume." />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { name: "Starter", price: "$19/mo", desc: "For single restaurant operations." },
          { name: "Pro", price: "$59/mo", desc: "For teams and growing brands." },
          { name: "Agency", price: "$149/mo", desc: "For agencies managing multi clients." }
        ].map((plan, idx) => (
          <GlassCard key={plan.name} className={idx === 1 ? "border-gold/70 shadow-glow" : ""}>
            <h3 className="text-2xl font-semibold">{plan.name}</h3>
            <p className="mt-3 text-3xl text-gold">{plan.price}</p>
            <p className="mt-2 text-muted-foreground">{plan.desc}</p>
            <Button variant="goldOutline" className="mt-4 self-start rounded-xl px-6" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
