"use client";

import Image from "next/image";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { previews } from "@/lib/data/mock";

export default function HistoryPage() {
  const gridSources = previews.concat(previews);

  return (
    <div className="space-y-6">
      <SectionTitle title="History" subtitle="Browse and reuse generated campaigns." />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="w-full flex-1 space-y-2 sm:max-w-sm">
          <Label htmlFor="history-search">Search</Label>
          <Input id="history-search" placeholder="Search history..." />
        </div>
        <div className="w-full space-y-2 sm:max-w-xs">
          <Label htmlFor="history-platform">Platform</Label>
          <Select defaultValue="all">
            <SelectTrigger id="history-platform" className="w-full">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="banner">Banner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
        {gridSources.map((src, idx) => (
          <GlassCard key={`${src}-${idx}`} className="break-inside-avoid p-0">
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <Image src={src} alt="Campaign preview" fill className="object-cover" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-3xl border-t border-border p-4 text-sm">
              <Button type="button" variant="ghost" size="sm">
                Download
              </Button>
              <Button type="button" variant="outline" size="sm">
                Duplicate
              </Button>
              <Button type="button" variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
