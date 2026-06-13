"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { listTemplates } from "@/lib/services/templates.service";
import type { CampaignTemplate } from "@/lib/api/types";
import { Eye, X } from "lucide-react";

const categories = ["Sushi", "Ramen", "Coffee Shop", "Izakaya", "AYCE", "Dessert Cafe"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const data = await listTemplates();
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

  const payloadFields: { label: string; key: keyof NonNullable<CampaignTemplate["payload"]> }[] = [
    { label: "Campaign Type", key: "campaignType" },
    { label: "Cuisine", key: "cuisine" },
    { label: "Platform", key: "platform" },
    { label: "Audience", key: "audience" },
    { label: "Goal", key: "goal" },
    { label: "Mood", key: "mood" },
    { label: "Style", key: "style" },
    { label: "Hero Item", key: "heroItem" },
    { label: "Visual Strategy", key: "visualStrategy" },
    { label: "CTA Strategy", key: "ctaStrategy" },
    { label: "Aspect Ratio", key: "aspectRatio" },
    { label: "Prompt", key: "prompt" },
  ];

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
              <Button
                variant="goldOutline"
                size="sm"
                className="mt-3 w-full sm:w-auto gap-1.5"
                type="button"
                onClick={() => setSelectedTemplate(template)}
              >
                <Eye className="size-3.5" />
                Preview
              </Button>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTemplate(null)}>
          <div
            className="relative max-h-[85vh] w-full max-w-2xl overflow-auto rounded-3xl border border-gold/20 bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-gold">{selectedTemplate.category}</p>
              <h2 className="mt-1 text-2xl font-bold text-foreground">{selectedTemplate.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{selectedTemplate.style}</p>
            </div>

            {/* Payload fields */}
            {selectedTemplate.payload ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Template Data</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {payloadFields.map(({ label, key }) => {
                    const value = selectedTemplate.payload?.[key];
                    if (value === undefined || value === null || value === "") return null;
                    return (
                      <div key={key} className="rounded-xl border border-border bg-background/50 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
                        <p className="mt-1 text-sm font-medium text-foreground whitespace-pre-wrap break-words">
                          {String(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {selectedTemplate.payload.negativePrompt && (
                  <div className="rounded-xl border border-border bg-background/50 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Negative Prompt</p>
                    <p className="mt-1 text-sm font-medium text-foreground whitespace-pre-wrap break-words">
                      {selectedTemplate.payload.negativePrompt}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <p className="text-sm text-muted-foreground">This template has no predefined data yet.</p>
                <p className="mt-1 text-xs text-muted-foreground">Add a payload with campaign settings to preview here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}