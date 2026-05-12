import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="min-w-0 flex-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Topbar />
          <div className="p-4 sm:p-5 md:p-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
