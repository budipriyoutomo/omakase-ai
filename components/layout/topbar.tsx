"use client";

import { useState } from "react";
import { Bell, Menu, Search, UserCircle2 } from "lucide-react";
import { DashboardNavList } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/lib/stores/auth-store";

export function Topbar() {
  const [navOpen, setNavOpen] = useState(false);
  const credits = useAuthStore((s) => s.credits);

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/80 px-3 py-3 backdrop-blur-xl sm:flex-nowrap sm:gap-4 sm:px-4 sm:py-4 supports-[backdrop-filter]:bg-background/70">
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="-ml-1 shrink-0 border-border lg:hidden"
            aria-label={navOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <Menu className="size-[22px]" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="border-border lg:hidden">
          <DashboardNavList branded onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="order-last flex min-w-0 flex-1 basis-full sm:order-none sm:basis-auto">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input className="h-11 rounded-2xl border-border bg-muted/40 pl-9 sm:h-10" placeholder="Search campaigns..." aria-label="Search campaigns" />
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <Badge variant="default" className="hidden px-3 sm:inline-flex">
          {credits} Credits
        </Badge>
        <Badge variant="default" className="inline-flex px-2 sm:hidden">
          {credits}
        </Badge>
        <Button type="button" variant="ghost" size="icon" className="rounded-full border border-border" aria-label="Notifications">
          <Bell className="size-[18px] text-muted-foreground" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="rounded-full border border-border" aria-label="Account">
          <UserCircle2 className="size-[18px] text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
