"use client";

import { DashboardNavList } from "@/components/layout/dashboard-nav";

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-card/80 p-5 backdrop-blur-xl lg:block">
      <DashboardNavList branded />
    </aside>
  );
}
