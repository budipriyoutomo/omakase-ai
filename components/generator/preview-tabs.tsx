"use client";

import Image from "next/image";
import { previews } from "@/lib/data/mock";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const tabIds = ["ig-post", "story", "tiktok", "banner"] as const;
const tabLabels: Record<(typeof tabIds)[number], string> = {
  "ig-post": "Instagram Post",
  story: "Story",
  tiktok: "TikTok",
  banner: "Banner"
};

export function PreviewTabs() {
  return (
    <GlassCard>
      <Tabs defaultValue="ig-post">
        <TabsList className="h-auto min-h-[44px] w-full justify-start rounded-2xl p-2 sm:flex-wrap">
          {tabIds.map((id) => (
            <TabsTrigger key={id} value={id} className="flex-1 sm:flex-none">
              {tabLabels[id]}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabIds.map((id) => (
          <TabsContent key={id} value={id} className="mt-4 border-0 p-0">
            <div className="grid gap-4 md:grid-cols-2">
              {previews.map((src) => (
                <div key={src} className="overflow-hidden rounded-2xl border border-border">
                  <div className="relative h-52">
                    <Image src={src} alt="AI preview" fill className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-muted-foreground">AI Generated</span>
                    <Button type="button" variant="ghost" size="sm" className="h-auto p-0 text-gold hover:bg-transparent hover:text-gold/90">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Select defaultValue="1:1">
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["1:1", "9:16", "16:9"].map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="default" size="xl" className="w-full sm:w-auto sm:min-h-0">
          Regenerate
        </Button>
      </div>
    </GlassCard>
  );
}
