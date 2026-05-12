import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionTitle({ title, subtitle, className }: { title: string; subtitle?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 sm:mb-8", className)}>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">{title}</h2>
      {subtitle ? <div className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</div> : null}
    </div>
  );
}
