"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ExternalLink,
    Loader2,
    Sparkles,
    Palette,
    Code,
    Image,
    Download,
    Edit3,
    Check,
    CalendarClock,
} from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyPreview } from "@/components/generator/typography-preview";
import { getGeneration, getCreativeHtml, renderCreative } from "@/lib/services/campaigns.service";
import type { TypographyOverrides } from "@/lib/services/campaigns.service";
import type { GenerationRecord } from "@/lib/api/types";

export default function GenerationPreviewPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;

    const [generation, setGeneration] = useState<GenerationRecord | null>(null);
    const [creativeHtml, setCreativeHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [htmlLoading, setHtmlLoading] = useState(true);
    const [htmlError, setHtmlError] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("typography");

    // Editable typography state
    const [editMode, setEditMode] = useState(false);
    const [typographyOverrides, setTypographyOverrides] = useState<TypographyOverrides | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const creativeIframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await getGeneration(id);
                setGeneration(data);
            } catch (err) {
                console.error("Failed to fetch generation", err);
                setError(err instanceof Error ? err.message : "Failed to load generation");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [id]);

    // Fetch creative HTML
    useEffect(() => {
        if (!generation || generation.status !== "completed") {
            setHtmlLoading(false);
            return;
        }

        const fetchHtml = async () => {
            setHtmlLoading(true);
            setHtmlError(false);
            try {
                const html = await getCreativeHtml(id);
                setCreativeHtml(html);
            } catch (err) {
                console.error("Failed to fetch creative HTML", err);
                setHtmlError(true);
            } finally {
                setHtmlLoading(false);
            }
        };

        fetchHtml();
    }, [generation, id]);

    // Handle typography changes from preview editor
    const handleTypographyChange = useCallback((overrides: TypographyOverrides) => {
        setTypographyOverrides(overrides);
    }, []);

    // Apply typography changes & re-render creative HTML via backend
    const handleApplyChanges = useCallback(async () => {
        if (!typographyOverrides) return;
        setIsRendering(true);
        try {
            const result = await renderCreative(id, typographyOverrides);
            setCreativeHtml(result.html);
            // Refetch generation so typographyBlueprint reflects saved edits
            const updated = await getGeneration(id);
            setGeneration(updated);
            setEditMode(false);
            setTypographyOverrides(null);
            // Switch to creative tab to show result
            setActiveTab("creative");
        } catch (err) {
            console.error("Failed to render creative", err);
            alert("Failed to apply typography changes.");
        } finally {
            setIsRendering(false);
        }
    }, [id, typographyOverrides]);

    // Export creative HTML as JPG using html2canvas
    const handleExportJpg = useCallback(async () => {
        if (!creativeIframeRef.current) return;
        setIsExporting(true);
        try {
            const html2canvas = (await import("html2canvas")).default;
            const iframe = creativeIframeRef.current;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) {
                alert("Cannot access iframe content");
                setIsExporting(false);
                return;
            }

            const canvas = iframeDoc.querySelector(".creative-canvas") as HTMLElement;
            if (!canvas) {
                alert("Creative canvas not found");
                setIsExporting(false);
                return;
            }

            const rendered = await html2canvas(canvas, {
                backgroundColor: "#0a0a0a",
                scale: 2,
                useCORS: true,
                allowTaint: true,
            });

            // Trigger download
            const link = document.createElement("a");
            link.download = `campaign-${id}-${Date.now()}.jpg`;
            link.href = rendered.toDataURL("image/jpeg", 0.95);
            link.click();
        } catch (err) {
            console.error("Failed to export JPG", err);
            alert("Failed to export JPG.");
        } finally {
            setIsExporting(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto size-8 animate-spin text-gold" />
                    <p className="mt-4 text-sm text-muted-foreground">Loading generation result...</p>
                </div>
            </div>
        );
    }

    if (error || !generation) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/generate">
                        <ArrowLeft className="size-4" />
                        Back to Generator
                    </Link>
                </Button>
                <GlassCard className="border-destructive/40 bg-destructive/5 p-6 text-center">
                    <p className="text-sm text-destructive-foreground">
                        {error ?? "Generation not found."}
                    </p>
                </GlassCard>
            </div>
        );
    }

    const previewUrl =
        generation.imageUrl ??
        generation.previewUrls?.[0] ??
        null;

    const typographyBlueprint = generation.typographyBlueprint;
    const hasTypography = typographyBlueprint && typographyBlueprint.headline?.text;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/generate">
                            <ArrowLeft className="size-4" />
                            Back to Generator
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">
                            {generation.campaignType ?? "Campaign Preview"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {generation.platform} • {generation.style} •{" "}
                            {new Date(generation.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017]/10"
                        asChild
                    >
                        <Link href={`/dashboard/scheduled-posts?campaign_id=${id}`}>
                            <CalendarClock className="size-3.5" />
                            Jadwalkan Post
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                        <Link href={`/dashboard/history/${generation.id}`}>
                            <ExternalLink className="size-3.5" />
                            Full Detail
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Tabs: Typography Blueprint Preview / Creative HTML / Campaign Images */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-auto w-full justify-start rounded-2xl p-1.5">
                    <TabsTrigger value="typography" className="gap-2" disabled={!hasTypography || !previewUrl}>
                        <Palette className="size-4" />
                        Typography Preview
                    </TabsTrigger>
                    <TabsTrigger value="creative" className="gap-2" disabled={generation.status !== "completed"}>
                        <Code className="size-4" />
                        Creative HTML
                    </TabsTrigger>
                    <TabsTrigger value="images" className="gap-2">
                        <Image className="size-4" />
                        Images
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Typography Blueprint Visual Preview (EDITABLE) */}
                <TabsContent value="typography" className="mt-4 border-0 p-0">
                    {hasTypography && previewUrl ? (
                        <GlassCard className="overflow-hidden p-0">
                            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <Palette className="size-4 text-gold" />
                                    <span className="text-sm font-semibold text-foreground">
                                        Typography Layout Preview
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {typographyBlueprint?.font_pairing && !editMode && (
                                        <span className="text-xs text-muted-foreground">
                                            {typographyBlueprint.font_pairing.headline} + {typographyBlueprint.font_pairing.body}
                                        </span>
                                    )}
                                    <Button
                                        variant={editMode ? "default" : "outline"}
                                        size="sm"
                                        className="gap-1.5"
                                        onClick={() => setEditMode(!editMode)}
                                    >
                                        {editMode ? (
                                            <>
                                                <Check className="size-3.5" />
                                                Done Editing
                                            </>
                                        ) : (
                                            <>
                                                <Edit3 className="size-3.5" />
                                                Edit Typography
                                            </>
                                        )}
                                    </Button>
                                    {editMode && typographyOverrides && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="gap-1.5 bg-gold text-black hover:bg-gold/90"
                                            onClick={handleApplyChanges}
                                            disabled={isRendering}
                                        >
                                            {isRendering ? (
                                                <Loader2 className="size-3.5 animate-spin" />
                                            ) : (
                                                <Sparkles className="size-3.5" />
                                            )}
                                            {isRendering ? "Rendering..." : "Apply & Render"}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Visual typography overlay on campaign image — EDITABLE when editMode=true */}
                            <TypographyPreview
                                blueprint={typographyBlueprint!}
                                imageUrl={previewUrl}
                                aspectRatio={generation.aspectRatio ?? "1:1"}
                                editable={editMode}
                                onTypographyChange={handleTypographyChange}
                            />

                            {/* Visual reasoning */}
                            {typographyBlueprint?.visual_reasoning && !editMode && (
                                <div className="border-t border-border px-5 py-4">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                        Layout Reasoning
                                    </p>
                                    <p className="text-sm leading-6 text-foreground">
                                        {typographyBlueprint.visual_reasoning}
                                    </p>
                                </div>
                            )}

                            {/* Edit mode hint */}
                            {editMode && (
                                <div className="border-t border-gold/20 bg-gold/5 px-5 py-3">
                                    <p className="text-xs text-gold/80">
                                        Double-click text to edit words | Drag to reposition | Use arrow buttons for fine-tuning | Change font & size in the bottom panel
                                    </p>
                                </div>
                            )}

                            {/* Layout strategy details */}
                            {!editMode && (
                                <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
                                    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                                        {typographyBlueprint?.layout_strategy}
                                    </span>
                                    <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                                        Headline: {typographyBlueprint?.headline?.style ?? "standard"}
                                    </span>
                                    <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                                        CTA: {typographyBlueprint?.cta?.style ?? "standard"}
                                    </span>
                                    {typographyBlueprint?.decorations?.map((d, i) => (
                                        <span key={i} className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                                            {d.type}{d.text ? `: ${d.text}` : ""}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </GlassCard>
                    ) : (
                        <GlassCard className="p-6 text-center">
                            {previewUrl ? (
                                <div>
                                    <Palette className="mx-auto size-8 text-muted-foreground" />
                                    <p className="mt-3 text-sm font-medium text-foreground">
                                        Typography blueprint belum tersedia
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Tunggu hingga proses typography analysis selesai.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <Loader2 className="mx-auto size-8 animate-spin text-gold" />
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Waiting for campaign image...
                                    </p>
                                </div>
                            )}
                        </GlassCard>
                    )}
                </TabsContent>

                {/* Tab: Creative HTML with Export JPG */}
                <TabsContent value="creative" className="mt-4 border-0 p-0">
                    <GlassCard className="overflow-hidden p-0">
                        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                            <div className="flex items-center gap-2">
                                <Code className="size-4 text-gold" />
                                <span className="text-sm font-semibold text-foreground">
                                    Creative HTML Output
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Export JPG */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5"
                                    onClick={handleExportJpg}
                                    disabled={isExporting || !creativeHtml}
                                >
                                    {isExporting ? (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    ) : (
                                        <Download className="size-3.5" />
                                    )}
                                    {isExporting ? "Exporting..." : "Export JPG"}
                                </Button>

                                {/* Download HTML */}
                                {creativeHtml && (
                                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                                        <a
                                            href={`data:text/html;charset=utf-8,${encodeURIComponent(creativeHtml)}`}
                                            download={`campaign-${generation.id}.html`}
                                        >
                                            <ExternalLink className="size-3.5" />
                                            Download HTML
                                        </a>
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => {
                                    setHtmlLoading(true);
                                    setHtmlError(false);
                                    getCreativeHtml(id)
                                        .then(setCreativeHtml)
                                        .catch(() => setHtmlError(true))
                                        .finally(() => setHtmlLoading(false));
                                }} disabled={htmlLoading}>
                                    <Loader2 className={`size-3.5 ${htmlLoading ? "animate-spin" : ""}`} />
                                    Retry
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white">
                            {htmlLoading ? (
                                <div className="flex h-[600px] items-center justify-center bg-muted/30">
                                    <div className="text-center">
                                        <Loader2 className="mx-auto size-8 animate-spin text-gold" />
                                        <p className="mt-4 text-sm text-muted-foreground">
                                            Rendering creative HTML...
                                        </p>
                                    </div>
                                </div>
                            ) : creativeHtml ? (
                                <iframe
                                    ref={creativeIframeRef}
                                    srcDoc={creativeHtml}
                                    className="h-[800px] w-full border-0"
                                    title="Creative HTML Preview"
                                    sandbox="allow-same-origin allow-scripts"
                                />
                            ) : (
                                <div className="flex h-[400px] items-center justify-center bg-muted/30">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">
                                            {htmlError
                                                ? "Creative HTML is being generated. Click Retry to check again."
                                                : "Creative HTML not available yet."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </TabsContent>

                {/* Tab: Campaign Images */}
                <TabsContent value="images" className="mt-4 border-0 p-0">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            ...(generation.imageUrl ? [generation.imageUrl] : []),
                            ...(generation.previewUrls ?? []),
                            ...(generation.imageUrls ?? []),
                        ]
                            .filter((url, index, urls) => url && urls.indexOf(url) === index)
                            .map((src) => (
                                <GlassCard key={src} className="overflow-hidden p-0">
                                    <div className="aspect-square bg-muted">
                                        <img
                                            src={src}
                                            alt="Campaign preview"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between border-t border-border p-3">
                                        <span className="text-xs text-muted-foreground">
                                            {generation.aspectRatio ?? "AI Generated"}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto gap-1.5 p-0 text-gold hover:bg-transparent hover:text-gold/90"
                                            asChild
                                        >
                                            <a href={src} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="size-3.5" />
                                                Open
                                            </a>
                                        </Button>
                                    </div>
                                </GlassCard>
                            ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}