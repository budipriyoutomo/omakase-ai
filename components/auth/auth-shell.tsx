import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <main className="grid min-h-[100dvh] md:grid-cols-2">
      <section className="hidden flex-col justify-center border-r border-border bg-[radial-gradient(circle_at_top,_rgba(255,59,59,0.15),_transparent_45%)] p-10 md:flex">
        <h1 className="font-heading text-4xl font-semibold text-gold">Omakase AI</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Premium AI content studio for Japanese restaurants and food businesses.
        </p>
      </section>
      <section className="flex flex-col items-center justify-center px-4 py-10 sm:p-6">
        <div className="mb-8 w-full max-w-md md:hidden">
          <h1 className="text-xl font-semibold tracking-tight text-gold">Omakase AI</h1>
          <p className="mt-1 text-sm text-muted-foreground">AI marketing content for Japanese restaurants.</p>
        </div>
        <Card className="w-full max-w-md border-border bg-card/80 shadow-glass backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </section>
    </main>
  );
}
