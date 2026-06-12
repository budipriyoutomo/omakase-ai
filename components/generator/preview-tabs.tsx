"use client";

import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Sparkles } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GenerationRecord } from "@/lib/api/types";

const tabIds = ["preview", "brief", "metadata"] as const;
const tabLabels: Record<(typeof tabIds)[number], string> = {
  preview: "Preview",
  brief: "Brief",
  metadata: "Metadata"
};

const statusLabels: Record<string, string> = {
  pending: "Queued",
  processing: "Processing prompt",
  generated_image: "Rendering image",
  completed: "Completed",
  failed: "Failed",
};

const processingStatuses = new Set(["pending", "processing", "generated_image"]);

type PreviewTabsProps = {
  generation?: GenerationRecord | null;
  isGenerating?: boolean;
  error?: string | null;
};

export function PreviewTabs({ generation, isGenerating = false, error }: PreviewTabsProps) {
  const displayUrls = [
    ...(generation?.imageUrl ? [generation.imageUrl] : []),
    ...(generation?.previewUrls ?? []),
    ...(generation?.imageUrls ?? []),
  ].filter((url, index, urls) => url && urls.indexOf(url) === index);

  const hasOutput = displayUrls.length > 0;
  const isProcessing =
    isGenerating || (generation ? processingStatuses.has(generation.status) : false);
  const status = generation?.status ?? (isGenerating ? "processing" : "idle");

  return (
    <GlassCard className="sticky top-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="size-4 text-gold" />
            Backend preview
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Hasil dari endpoint generation akan muncul di sini setelah selesai diproses.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          {isProcessing ? (
            <Loader2 className="size-3 animate-spin" />
          ) : generation?.status === "completed" ? (
            <CheckCircle2 className="size-3 text-emerald-500" />
          ) : generation?.status === "failed" || error ? (
            <AlertCircle className="size-3 text-red-500" />
          ) : (
            <span className="size-2 rounded-full bg-muted-foreground/50" />
          )}
          {error ? "Error" : statusLabels[status] ?? "Ready"}
        </span>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-600">
          {error}
        </div>
      )}

      <Tabs defaultValue="preview">
        <TabsList className="h-auto min-h-[44px] w-full justify-start rounded-2xl p-2">
          {tabIds.map((id) => (
            <TabsTrigger key={id} value={id} className="flex-1 sm:flex-none">
              {tabLabels[id]}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabIds.map((id) => (
          <TabsContent key={id} value={id} className="mt-4 border-0 p-0">
            {id === "preview" && (
              <div className="space-y-4">
                {hasOutput ? (
                  <div className="grid gap-4">
                    {displayUrls.map((src) => (
                      <div key={src} className="overflow-hidden rounded-2xl border border-border bg-background">
                        <div className="aspect-square bg-muted">
                          <img src={src} alt="AI generated campaign preview" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex items-center justify-between gap-3 p-3">
                          <span className="text-xs text-muted-foreground">
                            {generation?.aspectRatio ?? "AI Generated"}
                          </span>
                          <Button type="button" variant="ghost" size="sm" className="h-auto gap-1.5 p-0 text-gold hover:bg-transparent hover:text-gold/90" asChild>
                            <a href={src} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="size-3.5" />
                              Open
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid min-h-[24rem] place-items-center rounded-3xl border border-dashed border-border bg-muted/30 p-6 text-center">
                    <div className="max-w-xs space-y-3">
                      {isProcessing ? (
                        <Loader2 className="mx-auto size-8 animate-spin text-gold" />
                      ) : (
                        <Sparkles className="mx-auto size-8 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {isProcessing ? "Generating backend result" : "Preview is waiting"}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {isProcessing
                            ? "Status akan diperbarui otomatis sampai gambar selesai."
                            : "Submit form untuk membuat generation baru dari backend."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {id === "brief" && (
              <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                <InfoRow label="Campaign" value={generation?.campaignType} />
                <InfoRow label="Cuisine" value={generation?.cuisine} />
                <InfoRow label="Platform" value={generation?.platform} />
                <InfoRow label="Audience" value={generation?.audience} />
                <InfoRow label="Goal" value={generation?.goal} />
                <InfoRow label="Mood" value={generation?.mood} />
                <InfoRow label="Style" value={generation?.style} />
                <InfoRow label="Hero Item" value={generation?.heroItem} />
                <InfoRow label="Visual Strategy" value={generation?.visualStrategy} />
                <InfoRow label="CTA Strategy" value={generation?.ctaStrategy} />
              </div>
            )}

            {id === "metadata" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <InfoRow label="Generation ID" value={generation?.id} />
                  <InfoRow label="Provider" value={generation?.provider} />
                  <InfoRow label="Model" value={generation?.model} />
                  <InfoRow label="Creative HTML" value={generation?.hasCreativeHtml ? "Available" : "Not ready"} />
                </div>
                <pre className="max-h-[22rem] overflow-auto rounded-2xl border border-border bg-muted/30 p-4 text-xs leading-5 text-muted-foreground">
                  {generation ? JSON.stringify({
                    status: generation.status,
                    imageUrl: generation.imageUrl,
                    imageUrls: generation.imageUrls,
                    previewUrls: generation.previewUrls,
                    metadata: generation.metadata,
                    aiMetadata: generation.aiMetadata,
                  }, null, 2) : "No backend response yet."}
                </pre>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </GlassCard>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="max-w-[12rem] text-right text-xs font-medium text-foreground">
        {value || "-"}
      </span>
    </div>
  );
}
