"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { GeneratorForm } from "@/components/generator/generator-form";
import type { GenerationRecord } from "@/lib/api/types";

export default function GeneratorPage() {
  const router = useRouter();
  const [generation, setGeneration] = useState<GenerationRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
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

          // Auto-redirect to preview page when generation completes
          if (nextGeneration.status === "completed") {
            router.push(`/dashboard/generate/preview/${nextGeneration.id}`);
          }
        }}
        onGenerationError={(message) => {
          setError(message);
          setIsGenerating(false);
        }}
      />
    </div>
  );
}