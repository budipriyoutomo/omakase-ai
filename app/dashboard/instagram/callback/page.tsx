"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { InstagramCallbackContent } from "./callback-content";

export default function InstagramCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <GlassCard className="w-full max-w-md space-y-6 p-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#D4A017]/10">
              <Loader2 className="size-8 animate-spin text-[#D4A017]" />
            </div>
            <p className="text-sm text-gray-400">Loading...</p>
          </GlassCard>
        </div>
      }
    >
      <InstagramCallbackContent />
    </Suspense>
  );
}