"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
    Eye,
    Copy,
    Trash2,
    Sparkles,
    AlertTriangle,
    Search,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Wand2,
} from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { GenerationRecord, PaginatedMeta } from "@/lib/api/types";

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

const PAGE_SIZE = 12;

export default function HistoryPage() {
    const [generations, setGenerations] = useState<GenerationRecord[]>([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState<string | null>(null);
    const [search, setSearch]           = useState("");
    const [platform, setPlatform]       = useState("all");
    const [page, setPage]               = useState(1);
    const [meta, setMeta]               = useState<PaginatedMeta | null>(null);
    const [deleting, setDeleting]       = useState<Set<string>>(new Set());

    const fetchHistory = useCallback(async (p: number, q: string, pf: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await listHistory({
                page:     p,
                limit:    PAGE_SIZE,
                query:    q || undefined,
                platform: pf !== "all" ? pf : undefined,
            });
            setGenerations(result.items ?? []);
            setMeta(result.meta ?? null);
        } catch (err) {
            console.error("Failed to fetch history", err);
            setError(err instanceof Error ? err.message : "Failed to load history");
            setGenerations([]);
            setMeta(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchHistory(page, search, platform);
        }, 400);
        return () => clearTimeout(timer);
    }, [page, search, platform, fetchHistory]);

    const totalPages = meta ? Math.max(1, Math.ceil(meta.total / PAGE_SIZE)) : 1;

    const handleDelete = async (id: string) => {
        setDeleting((prev) => new Set(prev).add(id));
        try {
            await deleteGeneration(id);
            setGenerations((prev) => prev.filter((g) => g.id !== id));
            if (meta) setMeta({ ...meta, total: meta.total - 1 });
        } catch (err) {
            console.error("Failed to delete generation", err);
        } finally {
            setDeleting((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    const handleDuplicate = async (id: string) => {
        try {
            const newRecord = await duplicateGeneration(id);
            setGenerations((prev) => [newRecord, ...prev]);
            if (meta) setMeta({ ...meta, total: meta.total + 1 });
        } catch (err) {
            console.error("Failed to duplicate generation", err);
        }
    };

    return (
        <div className="space-y-6">
            <SectionTitle
                title="History"
                subtitle="Browse and reuse your campaign generations."
            />

            {/* Filters & Pagination Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                    <div className="w-full space-y-1 sm:max-w-xs">
                        <label htmlFor="history-search" className="text-xs font-medium text-muted-foreground">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="history-search"
                                placeholder="Search campaigns..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <div className="w-full space-y-1 sm:max-w-[180px]">
                        <label htmlFor="history-platform" className="text-xs font-medium text-muted-foreground">
                            Platform
                        </label>
                        <Select value={platform} onValueChange={(v) => { setPlatform(v); setPage(1); }}>
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

                {/* Pagination top */}
                {meta && meta.total > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{meta.total} results</span>
                        <span className="text-border">|</span>
                        <span>Page {meta.page} of {totalPages}</span>
                        <div className="ml-2 flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                <ChevronLeft className="size-3" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                <ChevronRight className="size-3" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-12 text-center">
                    <RefreshCw className="size-8 animate-spin text-gold" />
                    <p className="text-sm text-muted-foreground">Loading history...</p>
                </div>
            ) : error ? (
                <GlassCard className="flex flex-col items-center gap-3 border-red-500/20 bg-red-500/5 p-12 text-center">
                    <AlertTriangle className="size-8 text-red-400" />
                    <div>
                        <p className="text-sm font-medium text-foreground">Failed to load history</p>
                        <p className="mt-1 text-xs text-muted-foreground">{error}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => fetchHistory(page, search, platform)}>
                        <RefreshCw className="size-3.5" />
                        Retry
                    </Button>
                </GlassCard>
            ) : generations.length === 0 ? (
                <GlassCard className="flex flex-col items-center gap-4 p-12 text-center">
                    <Sparkles className="size-8 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium text-foreground">No generations found</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {search || platform !== "all"
                                ? "Try adjusting your search or filter."
                                : "Start by creating your first AI campaign!"}
                        </p>
                    </div>
                    {!search && platform === "all" && (
                        <Button variant="goldOutline" size="sm" asChild>
                            <Link href="/dashboard/generate">
                                <Wand2 className="size-3.5" />
                                Generate Campaign
                            </Link>
                        </Button>
                    )}
                </GlassCard>
            ) : (
                <>
                    <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
                        {generations.map((gen) => {
                            const previewUrl =
                                gen.imageUrl ??
                                gen.previewUrls?.[0] ??
                                null;

                            const statusStyle =
                                STATUS_STYLES[gen.status] ?? STATUS_STYLES.pending;

                            const isDeleting = deleting.has(gen.id);

                            return (
                                <GlassCard
                                    key={gen.id}
                                    className="mb-4 break-inside-avoid p-0"
                                >
                                    {/* Preview Image */}
                                    <div className="relative h-64 overflow-hidden rounded-t-3xl bg-muted">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt={gen.campaignType ?? "Campaign preview"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Sparkles className="size-8 text-muted-foreground/40" />
                                            </div>
                                        )}

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
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? (
                                                <RefreshCw className="size-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="size-3.5" />
                                            )}
                                            Delete
                                        </Button>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>

                    {/* Pagination bottom */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                <ChevronLeft className="size-4" />
                                Previous
                            </Button>
                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                const start = Math.max(1, Math.min(page - 3, totalPages - 6));
                                const p = start + i;
                                if (p > totalPages) return null;
                                return (
                                    <Button
                                        key={p}
                                        variant={p === page ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </Button>
                                );
                            })}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}