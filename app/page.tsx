"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";

const MARKETING_PREVIEWS = [
  "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1000&q=80"
];

const MARKETING_TEMPLATES = [
  { name: "Sushi Night Promo", category: "Sushi", style: "Tokyo Neon" },
  { name: "Ramen Lunch Combo", category: "Ramen", style: "Dark Japanese Luxury" },
  { name: "Izakaya Happy Hour", category: "Izakaya", style: "Modern Izakaya" },
  { name: "Cafe Matcha Set", category: "Dessert Cafe", style: "Minimal Zen" },
  { name: "AYCE Weekend Feast", category: "AYCE", style: "Anime Pop" },
  { name: "Coffee Morning Deal", category: "Coffee Shop", style: "Minimal Zen" }
];

export default function LandingPage() {
  return (
    <main className="container-wide py-8 sm:py-10 md:py-16">
      <section className="grid items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-12">
        <div className="min-w-0">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold sm:text-sm">AI Marketing for Restaurants</p>
          <h1 className="text-balance text-[1.65rem] font-semibold leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl">
            Generate Stunning Restaurant Marketing Content with AI
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:mt-5 sm:text-base">
            Create Japanese-style promo posters, social media ads, captions, and campaigns in seconds.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button variant="default" size="xl" className="w-full sm:w-auto" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="default" size="xl" className="w-full sm:w-auto" asChild>
              <Link href="/register">Register</Link>
            </Button>
            <Button variant="outline" size="xl" className="w-full border-border sm:w-auto" asChild>
              <Link href="/dashboard/templates">View Templates</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:min-w-0">
          {MARKETING_PREVIEWS.slice(0, 4).map((src, i) => (
            <motion.div
              key={src}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity }}
              className="relative aspect-[4/5] min-h-[8.5rem] overflow-hidden rounded-2xl border border-border sm:h-52 sm:min-h-[12rem] sm:rounded-3xl md:h-52 md:aspect-auto md:min-h-[13rem]"
            >
              <Image src={src} alt="poster" fill sizes="(max-width: 768px) 45vw, 25vw" className="object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <SectionTitle title="Features" subtitle="Built for digital marketing teams in food business." />
        <div className="grid gap-4 md:grid-cols-3">
          {["AI Poster Generation", "Cross-platform Resize", "Template Marketplace"].map((item) => (
            <GlassCard key={item}>{item}</GlassCard>
          ))}
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <SectionTitle title="AI Workflow" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {["Prompt", "Generate", "Refine", "Publish"].map((step, idx) => (
            <GlassCard key={step}>
              <p className="text-gold">0{idx + 1}</p>
              <p className="mt-2 text-lg">{step}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <SectionTitle title="Marketing Templates" />
        <div className="grid gap-4 md:grid-cols-3">
          {MARKETING_TEMPLATES.map((template) => (
            <GlassCard key={template.name}>
              <p className="text-sm text-gold">{template.category}</p>
              <h3 className="mt-2 text-lg">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.style}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mt-14 pb-8 sm:mt-20 sm:pb-10">
        <SectionTitle title="Pricing" />
        <div className="grid gap-4 md:grid-cols-3">
          {["Starter", "Pro", "Agency"].map((plan, idx) => (
            <GlassCard key={plan} className={idx === 1 ? "border-gold/60 shadow-glow" : ""}>
              <h3 className="text-2xl">{plan}</h3>
              <p className="mt-2 text-muted-foreground">{idx === 0 ? "$19/mo" : idx === 1 ? "$59/mo" : "$149/mo"}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </main>
  );
}
