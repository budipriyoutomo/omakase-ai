"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";
import {
    ArrowLeft,
    ExternalLink,
    Copy,
    Sparkles,
    ImageIcon,
    RefreshCw,
} from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { getGeneration, getCreativeHtml, regenerate } from "@/lib/services/campaigns.service";
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
    generated_image: "Generating Image",
    completed:       "Completed",
    failed:          "Failed",
};

export default function GenerationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const [generation, setGeneration] = useState<GenerationRecord | null>(null);
    const [creativeHtml, setCreativeHtml] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"preview" | "creative" | "blueprint">("preview");
    const [loading, setLoading]         = useState(true);
    const [htmlLoading, setHtmlLoading] = useState(false);
    const [regenerating, setRegenerating] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await getGeneration(id);
                setGeneration(data);
            } catch (err) {
                console.error("Failed to fetch generation", err);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [id]);

    useEffect(() => {
        if (!generation?.hasCreativeHtml || activeTab !== "creative") return;
        if (creativeHtml) return;

        const fetchHtml = async () => {
            setHtmlLoading(true);
            try {
                const html = await getCreativeHtml(id);
                setCreativeHtml(html);
            } catch (err) {
                console.error("Failed to fetch creative HTML", err);
            } finally {
                setHtmlLoading(false);
            }
        };

        fetchHtml();
    }, [activeTab, generation, id, creativeHtml]);

    const handleRegenerate = async () => {
        if (!generation) return;
        setRegenerating(true);
        try {
            const updated = await regenerate(generation.id);
            setGeneration(updated);
        } catch (err) {
            console.error("Failed to regenerate", err);
        } finally {
            setRegenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="py-24 text-center text-muted-foreground">
                Loading...
            </div>
        );
    }

    if (!generation) {
        return (
            <div className="py-24 text-center text-muted-foreground">
                Generation not found.
            </div>
        );
    }

    const previewUrl =
        generation.imageUrl ??
        generation.previewUrls?.[0] ??
        "https://placehold.co/600x600/1a1a1a/ffffff?text=No+Image";

    const statusStyle = STATUS_STYLES[generation.status] ?? STATUS_STYLES.pending;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/history">
                            <ArrowLeft className="size-4" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">
                            {generation.campaignType ?? "Campaign Detail"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {generation.platform} •{" "}
                            {new Date(generation.createdAt).toLocaleDateString("id-ID", {
                                day:   "numeric",
                                month: "long",
                                year:  "numeric",
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusStyle}`}
                    >
                        <span className="size-1.5 rounded-full bg-current" />
                        {STATUS_LABEL[generation.status] ?? generation.status}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={handleRegenerate}
                        disabled={regenerating}
                    >
                        <RefreshCw className={`size-3.5 ${regenerating ? "animate-spin" : ""}`} />
                        Regenerate
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-2xl border border-border bg-muted/30 p-1">
                {[
                    { key: "preview",   label: "Preview",         icon: <ImageIcon className="size-3.5" /> },
                    { key: "creative",  label: "Creative HTML",   icon: <Sparkles  className="size-3.5" />, disabled: !generation.hasCreativeHtml },
                    { key: "blueprint", label: "Blueprint",       icon: <Copy      className="size-3.5" />, disabled: !generation.creativeBlueprint },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        disabled={tab.disabled}
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                            activeTab === tab.key
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "preview" && (
                <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">

                    {/* Image */}
                    <GlassCard className="p-0 overflow-hidden">
                        <div className="relative aspect-square w-full bg-muted">
                            <Image
                                src={previewUrl}
                                alt={generation.campaignType ?? "Campaign"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-border p-4">
                            <p className="text-xs text-muted-foreground">
                                {generation.aspectRatio} • {generation.style}
                            </p>
                            <Button variant="outline" size="sm" className="gap-1.5" asChild>
                                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="size-3.5" />
                                    Open Original
                                </a>
                            </Button>
                        </div>
                    </GlassCard>

                    {/* Campaign Info */}
                    <div className="space-y-4">
                        <GlassCard className="space-y-4">
                            <h2 className="text-sm font-semibold text-foreground">
                                Campaign Info
                            </h2>
                            <InfoRow label="Cuisine"          value={generation.cuisine} />
                            <InfoRow label="Audience"         value={generation.audience} />
                            <InfoRow label="Goal"             value={generation.goal} />
                            <InfoRow label="Mood"             value={generation.mood} />
                            <InfoRow label="Hero Item"        value={generation.heroItem} />
                            <InfoRow label="Visual Strategy"  value={generation.visualStrategy} />
                            <InfoRow label="CTA Strategy"     value={generation.ctaStrategy} />
                        </GlassCard>

                        {generation.typographyBlueprint && (
                            <GlassCard className="space-y-3">
                                <h2 className="text-sm font-semibold text-foreground">
                                    Typography Blueprint
                                </h2>
                                <InfoRow
                                    label="Headline"
                                    value={generation.typographyBlueprint.headline?.text}
                                />
                                <InfoRow
                                    label="Placement"
                                    value={generation.typographyBlueprint.headline?.placement}
                                />
                                <InfoRow
                                    label="CTA"
                                    value={generation.typographyBlueprint.cta?.text}
                                />
                                <InfoRow
                                    label="Layout"
                                    value={generation.typographyBlueprint.layout_strategy}
                                />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Visual Reasoning
                                    </p>
                                    <p className="text-xs leading-5 text-foreground">
                                        {generation.typographyBlueprint.visual_reasoning}
                                    </p>
                                </div>
                            </GlassCard>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "creative" && (
                <GlassCard className="p-0 overflow-hidden">
                    {htmlLoading ? (
                        <div className="flex h-[600px] items-center justify-center text-muted-foreground">
                            Loading creative HTML...
                        </div>
                    ) : creativeHtml ? (
                        <iframe
                            srcDoc={creativeHtml}
                            className="h-[800px] w-full rounded-3xl border-0"
                            title="Creative Preview"
                            sandbox="allow-same-origin"
                        />
                    ) : (
                        <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                            Creative HTML not available.
                        </div>
                    )}
                </GlassCard>
            )}

            {activeTab === "blueprint" && generation.creativeBlueprint && (
                <GlassCard className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-foreground">
                            Creative Blueprint
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                                {generation.creativeBlueprint.theme}
                            </span>
                            <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                                {generation.creativeBlueprint.layout_mode}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                            Components ({generation.creativeBlueprint.components?.length ?? 0})
                        </p>
                        <div className="space-y-2">
                            {generation.creativeBlueprint.components?.map((c, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3"
                                >
                                    <span className="rounded-lg bg-gold/10 px-2 py-1 text-xs font-medium text-gold">
                                        {c.type}
                                    </span>
                                    <span className="text-sm text-foreground">
                                        {c.content ?? "—"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                            Raw JSON
                        </p>
                        <pre className="max-h-[400px] overflow-auto rounded-2xl border border-border bg-muted/30 p-4 text-xs leading-5 text-muted-foreground">
                            {JSON.stringify(generation.creativeBlueprint, null, 2)}
                        </pre>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    if (!value) return null;

    return (
        <div className="flex items-start justify-between gap-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-right text-xs font-medium text-foreground">{value}</p>
        </div>
    );
}