"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ScheduledPostsContent } from "./scheduled-posts-content";

export default function ScheduledPostsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-[#D4A017]" />
        </div>
      }
    >
      <ScheduledPostsContent />
    </Suspense>
  );
}