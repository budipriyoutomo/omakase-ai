"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  Palette,
  History,
  CreditCard,
  BarChart3,
  Settings,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const dashboardNavItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/generate", label: "Generate Campaign", icon: Sparkles },
  { href: "/dashboard/templates", label: "Templates", icon: Layers },
  { href: "/dashboard/brand-kit", label: "Brand Kit", icon: Palette },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function DashboardNavList({
  className,
  onNavigate,
  branded = false
}: {
  className?: string;
  onNavigate?: () => void;
  branded?: boolean;
}) {
  const path = usePathname();

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {branded ? (
        <Button variant="ghost" className="-ml-2 h-auto justify-start px-2 text-2xl font-semibold tracking-tight text-gold hover:bg-transparent hover:text-gold/90" asChild>
          <Link href="/" onClick={onNavigate}>
            Omakase AI
          </Link>
        </Button>
      ) : null}
      <nav className="flex flex-col gap-2">
        {dashboardNavItems.map((item) => {
          const active = path === item.href;
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              variant={active ? "secondary" : "ghost"}
              className={cn(
                "h-auto justify-start rounded-2xl border px-4 py-3 text-left text-sm sm:text-[15px]",
                active
                  ? "border-gold/60 bg-gold/10 text-gold hover:bg-gold/15 hover:text-gold"
                  : "border-transparent text-foreground hover:border-border hover:bg-muted/80"
              )}
              asChild
            >
              <Link href={item.href} onClick={onNavigate}>
                <Icon size={17} aria-hidden />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
