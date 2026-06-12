"use client";

import { useState } from "react";

import { GeneratorForm } from "@/components/generator/generator-form";
import { PreviewTabs } from "@/components/generator/preview-tabs";
import type { GenerationRecord } from "@/lib/api/types";

export default function GeneratorPage() {
  const [generation, setGeneration] = useState<GenerationRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="min-w-0">
        <GeneratorForm
          onGenerationStart={() => {
            setError(null);
            setIsGenerating(true);
          }}
          onGenerationChange={(nextGeneration) => {
            setGeneration(nextGeneration);
            setIsGenerating(
              ["pending", "processing", "generated_image"].includes(nextGeneration.status)
            );
          }}
          onGenerationError={(message) => {
            setError(message);
            setIsGenerating(false);
          }}
        />
      </div>
      <PreviewTabs generation={generation} isGenerating={isGenerating} error={error} />
    </div>
  );
}
