"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDropzone } from "@/components/ui/file-dropzone";

export default function BrandKitPage() {
  const [logoFiles, setLogoFiles] = useState<File[]>([]);

  return (
    <div className="space-y-6">
      <SectionTitle title="Brand Kit" subtitle="Save logo, color palette, and typography identity." />
      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard>
          <FileDropzone
            label="Logo upload"
            hint="Vector or high-res raster; square assets work best for lockups."
            files={logoFiles}
            onFilesChange={setLogoFiles}
            maxFiles={1}
            maxSizeBytes={8 * 1024 * 1024}
            emptyLabel="Drop logo or browse"
          />
          <div className="flex gap-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="brand-primary">Primary</Label>
              <Input id="brand-primary" type="color" defaultValue="#D4AF37" className="size-14 cursor-pointer rounded-xl border-border p-1" aria-label="Primary brand color" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-accent">Accent</Label>
              <Input id="brand-accent" type="color" defaultValue="#FF3B3B" className="size-14 cursor-pointer rounded-xl border-border p-1" aria-label="Accent brand color" />
            </div>
          </div>
          <div className="space-y-2 pt-4">
            <Label htmlFor="brand-font">Typeface</Label>
            <Select defaultValue="Inter">
              <SelectTrigger id="brand-font">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Inter", "Noto Sans JP", "Manrope"].map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" variant="default" size="lg" className="mt-4 w-fit">
            Save Visual Identity
          </Button>
        </GlassCard>
        <GlassCard>
          <p className="text-sm font-medium text-muted-foreground">Live preview</p>
          <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-5">
            <p className="text-gold">TOKYO SUSHI NIGHTS</p>
            <h3 className="mt-2 text-2xl font-semibold">20% OFF Weekend Omakase</h3>
            <p className="mt-2 text-sm text-muted-foreground">Use code: OMAKASE20</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
