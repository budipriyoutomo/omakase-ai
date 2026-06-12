"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { listTemplates } from "@/lib/services/templates.service";
import type { CampaignTemplate } from "@/lib/api/types";

const categories = ["Sushi", "Ramen", "Coffee Shop", "Izakaya", "AYCE", "Dessert Cafe"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const data = await listTemplates();
        // Extract data if it comes in paginated form or direct array
        const items = Array.isArray(data) ? data : (data as any).items || [];
        setTemplates(items);
      } catch (err) {
        console.error("Failed to fetch templates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="space-y-6">
      <SectionTitle title="Template Marketplace" subtitle="Premium templates for every food campaign." />
      <div className="flex flex-wrap gap-2">
        {categories.map((category, idx) => (
          <Button key={category} variant={idx === 0 ? "secondary" : "outline"} size="sm" type="button" className="rounded-full">
            {category}
          </Button>
        ))}
      </div>
      
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">No templates available yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <GlassCard key={template.id || template.name}>
              <div className="mb-3 h-36 rounded-2xl border border-border bg-gradient-to-br from-gold/25 to-neon/10" />
              <p className="text-xs uppercase tracking-widest text-gold">{template.style || template.category}</p>
              <h3 className="mt-2 text-lg font-semibold">{template.name}</h3>
              <Button variant="goldOutline" size="sm" className="mt-3 w-full sm:w-auto" type="button">
                Use Template
              </Button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
