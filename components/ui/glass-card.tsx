import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function GlassCard({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-4 rounded-3xl border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:shadow-glow sm:p-6",
        className
      )}
      {...props}
    />
  );
}
