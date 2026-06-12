"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Copy, Trash2, Sparkles } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    listHistory,
    deleteGeneration,
    duplicateGeneration,
} from "@/lib/services/campaigns.service";
import type { GenerationRecord } from "@/lib/api/types";

const STATUS_STYLES: Record<string, string> = {
    pending:         "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    processing:      "bg-blue-500/10  text-blue-500  border-blue-500/20",
    generated_image: "bg-blue-500/10  text-blue-500  border-blue-500/20",
    completed:       "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    failed:          "bg-red-500/10   text-red-500   border-red-500/20",
};

const STATUS_LABEL: Record<string, string> = {
    pending:         "Pending",
    processing:      "Processing",
    generated_image: "Generating",
    completed:       "Completed",
    failed:          "Failed",
};

export default function HistoryPage() {
    const [generations, setGenerations] = useState<GenerationRecord[]>([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState("");
    const [platform, setPlatform]       = useState("all");

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const result = await listHistory({
                    query:    search,
                    platform: platform !== "all" ? platform : undefined,
                });
                setGenerations(result.items ?? []);
            } catch (err) {
                console.error("Failed to fetch generations", err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search, platform]);

    const handleDelete = async (id: string) => {
        try {
            await deleteGeneration(id);
            setGenerations((prev) => prev.filter((g) => g.id !== id));
        } catch (err) {
            console.error("Failed to delete generation", err);
        }
    };

    const handleDuplicate = async (id: string) => {
        try {
            const newRecord = await duplicateGeneration(id);
            setGenerations((prev) => [newRecord, ...prev]);
        } catch (err) {
            console.error("Failed to duplicate generation", err);
        }
    };

    return (
        <div className="space-y-6">
            <SectionTitle
                title="History"
                subtitle="Browse and reuse generated campaigns."
            />

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                <div className="w-full flex-1 space-y-2 sm:max-w-sm">
                    <Label htmlFor="history-search">Search</Label>
                    <Input
                        id="history-search"
                        placeholder="Search history..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full space-y-2 sm:max-w-xs">
                    <Label htmlFor="history-platform">Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger id="history-platform" className="w-full">
                            <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="Instagram Feed">Instagram Feed</SelectItem>
                            <SelectItem value="Instagram Story">Instagram Story</SelectItem>
                            <SelectItem value="TikTok">TikTok</SelectItem>
                            <SelectItem value="GoFood Banner">GoFood Banner</SelectItem>
                            <SelectItem value="GrabFood Banner">GrabFood Banner</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="py-12 text-center text-muted-foreground">
                    Loading history...
                </div>
            ) : generations.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                    No generations found.
                </div>
            ) : (
                <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
                    {generations.map((gen) => {
                        const previewUrl =
                            gen.imageUrl ??
                            gen.previewUrls?.[0] ??
                            "https://placehold.co/600x600/1a1a1a/ffffff?text=Generating...";

                        const statusStyle =
                            STATUS_STYLES[gen.status] ?? STATUS_STYLES.pending;

                        return (
                            <GlassCard
                                key={gen.id}
                                className="mb-4 break-inside-avoid p-0"
                            >
                                {/* Preview Image */}
                                <div className="relative h-64 overflow-hidden rounded-t-3xl bg-muted">
                                    <Image
                                        src={previewUrl}
                                        alt={gen.campaignType ?? "Campaign preview"}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Status badge */}
                                    <div className="absolute left-3 top-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle}`}
                                        >
                                            <span className="size-1.5 rounded-full bg-current" />
                                            {STATUS_LABEL[gen.status] ?? gen.status}
                                        </span>
                                    </div>

                                    {/* Creative HTML badge */}
                                    {gen.hasCreativeHtml && (
                                        <div className="absolute right-3 top-3">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold">
                                                <Sparkles className="size-3" />
                                                Creative Ready
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col gap-1.5 p-4">
                                    <h3 className="font-semibold text-foreground">
                                        {gen.campaignType ?? "Unknown Campaign"}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        {gen.platform && (
                                            <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1">
                                                {gen.platform}
                                            </span>
                                        )}
                                        {gen.cuisine && (
                                            <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1">
                                                {gen.cuisine}
                                            </span>
                                        )}
                                        {gen.mood && (
                                            <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1">
                                                {gen.mood}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {new Date(gen.createdAt).toLocaleDateString("id-ID", {
                                            day:   "numeric",
                                            month: "long",
                                            year:  "numeric",
                                        })}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-3xl border-t border-border bg-background/50 p-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1.5"
                                        asChild
                                    >
                                        <Link href={`/dashboard/history/${gen.id}`}>
                                            <Eye className="size-3.5" />
                                            View
                                        </Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5"
                                        onClick={() => handleDuplicate(gen.id)}
                                    >
                                        <Copy className="size-3.5" />
                                        Duplicate
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="gap-1.5"
                                        onClick={() => handleDelete(gen.id)}
                                    >
                                        <Trash2 className="size-3.5" />
                                        Delete
                                    </Button>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}