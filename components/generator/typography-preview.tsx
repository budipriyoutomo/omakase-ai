"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
    Type,
    Move,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import type { TypographyBlueprint } from "@/lib/api/types";
import type { TypographyOverrides } from "@/lib/services/campaigns.service";

type TypographyPreviewProps = {
    blueprint: TypographyBlueprint;
    imageUrl: string;
    aspectRatio?: string;
    editable?: boolean;
    onTypographyChange?: (overrides: TypographyOverrides) => void;
};

/**
 * Editable typography preview overlaid on campaign image.
 * Supports inline text editing, font size change, and repositioning.
 */
export function TypographyPreview({
    blueprint,
    imageUrl,
    aspectRatio = "1:1",
    editable = false,
    onTypographyChange,
}: TypographyPreviewProps) {
    const [w, h] = useMemo(() => {
        const parts = aspectRatio.split(":").map(Number);
        if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
            return parts;
        }
        return [1, 1];
    }, [aspectRatio]);

    // Editable state
    const [editingElement, setEditingElement] = useState<string | null>(null);
    const [headlineText, setHeadlineText] = useState(blueprint.headline?.text ?? "");
    const [headlineSize, setHeadlineSize] = useState(blueprint.headline?.font_size ?? "clamp(2rem, 6vw, 4.5rem)");
    const [headlineX, setHeadlineX] = useState(blueprint.headline?.safe_area?.x ?? 300);
    const [headlineY, setHeadlineY] = useState(blueprint.headline?.safe_area?.y ?? 300);

    const [subText, setSubText] = useState(blueprint.subheadline?.text ?? "");
    const [subSize, setSubSize] = useState(blueprint.subheadline?.font_size ?? "clamp(0.9rem, 2vw, 1.4rem)");
    const [subX, setSubX] = useState(blueprint.headline?.safe_area?.x ?? 310);
    const [subY, setSubY] = useState((blueprint.headline?.safe_area?.y ?? 300) + (blueprint.headline?.safe_area?.height ?? 100) + 10);

    const [ctaText, setCtaText] = useState(blueprint.cta?.text ?? "");
    const [ctaSize, setCtaSize] = useState("clamp(0.85rem, 1.5vw, 1.1rem)");
    const [ctaX, setCtaX] = useState(300);
    const [ctaY, setCtaY] = useState(800);

    const [fontHeadline, setFontHeadline] = useState(blueprint.font_pairing?.headline ?? "'Playfair Display', Georgia, serif");
    const [fontBody, setFontBody] = useState(blueprint.font_pairing?.body ?? "'Inter', sans-serif");

    const containerRef = useRef<HTMLDivElement>(null);

    // Emit changes on any edit
    const emitChange = useCallback(() => {
        if (!onTypographyChange) return;
        onTypographyChange({
            headline: {
                text: headlineText,
                font_size: headlineSize,
                font_family: fontHeadline,
                position: { x: headlineX, y: headlineY },
            },
            subheadline: blueprint.subheadline ? {
                text: subText,
                font_size: subSize,
                position: { x: subX, y: subY },
            } : undefined,
            cta: {
                text: ctaText,
                font_size: ctaSize,
                position: { x: ctaX, y: ctaY },
            },
            font_pairing: {
                headline: fontHeadline,
                body: fontBody,
            },
        });
    }, [headlineText, headlineSize, headlineX, headlineY, subText, subSize, subX, subY, ctaText, ctaSize, ctaX, ctaY, fontHeadline, fontBody, blueprint.subheadline, onTypographyChange]);

    // Drag handling for editable mode
    const [dragging, setDragging] = useState<string | null>(null);
    const dragStart = useRef({ x: 0, y: 0, elemX: 0, elemY: 0 });

    const handleMouseDown = (e: React.MouseEvent, element: string, currentX: number, currentY: number) => {
        if (!editable) return;
        // Jangan start drag jika user klik di input/textarea/select (biar bisa edit text)
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.tagName === 'BUTTON') {
            return;
        }
        e.preventDefault();
        setDragging(element);
        dragStart.current = { x: e.clientX, y: e.clientY, elemX: currentX, elemY: currentY };
    };

    useEffect(() => {
        if (!dragging) return;
        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const newX = dragStart.current.elemX + dx;
            const newY = dragStart.current.elemY + dy;
            if (dragging === "headline") { setHeadlineX(newX); setHeadlineY(newY); }
            if (dragging === "subheadline") { setSubX(newX); setSubY(newY); }
            if (dragging === "cta") { setCtaX(newX); setCtaY(newY); }
        };
        const handleMouseUp = () => {
            setDragging(null);
            emitChange();
        };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, emitChange]);

    const toPercent = (val: number) => `${(val / 10)}%`;

    const getHeadlineWeight = () => blueprint.headline?.font_weight ?? "700";
    const getLetterSpacing = () => blueprint.headline?.letter_spacing ?? "0.02em";

    // Get text background style from blueprint.text_backgrounds
    const getTextBgStyle = (element: string): React.CSSProperties | undefined => {
        const textBg = blueprint.text_backgrounds ?? [];
        const bg = textBg.find((t: { element?: string }) => t.element === element);
        if (!bg) {
            // Default text backgrounds per element type
            if (element === "headline") {
                return {
                    backgroundColor: "rgba(0,0,0,0.4)",
                    padding: "8px 24px",
                    borderRadius: "12px",
                };
            }
            return undefined;
        }
        return {
            backgroundColor: (bg as Record<string, string>).color ?? "rgba(0,0,0,0.5)",
            padding: (bg as Record<string, string>).padding ?? "6px 20px",
            borderRadius: (bg as Record<string, string>).border_radius ?? "8px",
            display: "inline-block",
        };
    };

    const getTextEffectStyle = (element: string): React.CSSProperties => {
        const effects = blueprint.text_effects?.filter((e: { element?: string }) => e.element === element) ?? [];
        const style: React.CSSProperties = {};
        for (const effect of effects) {
            switch (effect.effect) {
                case "luxury-glow":
                case "glow":
                    style.textShadow = `0 0 ${effect.value ?? "20px"} rgba(255,215,0,0.4), 0 0 40px rgba(255,215,0,0.2)`;
                    break;
                case "drop-shadow":
                    style.textShadow = `2px 4px ${effect.value ?? "8px"} rgba(0,0,0,0.5)`;
                    break;
                case "gradient-text":
                    style.background = "linear-gradient(135deg, #D4AF37 0%, #FFF8DC 50%, #D4AF37 100%)";
                    (style as Record<string, string>)["-webkit-background-clip"] = "text";
                    (style as Record<string, string>)["-webkit-text-fill-color"] = "transparent";
                    break;
                case "stroke":
                    style.textShadow = `-1px -1px 0 ${effect.value ?? "#000"}, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000`;
                    break;
            }
        }
        return style;
    };

    const decorations = blueprint.decorations ?? [];

    // Available font options
    const fontOptions = [
        "'Playfair Display', Georgia, serif",
        "'Cormorant Garamond', serif",
        "'EB Garamond', serif",
        "Montserrat, sans-serif",
        "'Inter', sans-serif",
        "Lato, sans-serif",
        "'Noto Serif JP', serif",
    ];

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl bg-cover bg-center"
            style={{
                aspectRatio: `${w}/${h}`,
                backgroundImage: `url(${imageUrl})`,
                maxHeight: "800px",
            }}
        >
            {/* Dark gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />

            {/* Decorative elements */}
            {decorations.map((dec, i) => (
                <div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                        [dec.placement.includes("top") ? "top" : "bottom"]: "8%",
                        [dec.placement.includes("left") ? "left" : "right"]: "5%",
                        fontFamily: fontBody,
                        fontSize: dec.font_size ?? "clamp(0.7rem, 1.5vw, 1rem)",
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.7)",
                        textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    }}
                >
                    {dec.type === "vertical_text" ? (
                        <span style={{ writingMode: "vertical-rl", textOrientation: "mixed", fontSize: dec.font_size ?? "clamp(0.8rem, 1.8vw, 1.2rem)" }}>
                            {dec.text}
                        </span>
                    ) : dec.type === "badge" ? (
                        <span style={{
                            display: "inline-block", padding: "4px 16px", borderRadius: "20px",
                            background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
                            color: "#fff", fontWeight: 700, fontSize: dec.font_size ?? "clamp(0.7rem, 1.2vw, 0.9rem)",
                            letterSpacing: "0.08em", textTransform: "uppercase", boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                        }}>
                            {dec.text}
                        </span>
                    ) : (
                        <span>{dec.text}</span>
                    )}
                </div>
            ))}

            {/* Headline */}
            <div
                className={`absolute ${editable ? "cursor-move" : "pointer-events-none"} ${dragging === "headline" ? "ring-2 ring-gold/40" : ""} ${editingElement === "headline" ? "ring-1 ring-gold/30 bg-black/10 backdrop-blur-sm" : ""}`}
                style={{
                    left: toPercent(headlineX),
                    top: toPercent(headlineY),
                    textAlign: (blueprint.headline?.alignment as "left" | "center" | "right") ?? "left",
                    padding: editable ? "4px" : 0,
                    borderRadius: editable ? "8px" : 0,
                    transition: "box-shadow 0.15s, background 0.15s",
                    ...(editingElement !== "headline" ? {
                        maxWidth: "90%",
                        ...getTextBgStyle("headline"),
                    } : { maxWidth: "90%" }),
                }}
                onMouseDown={(e) => handleMouseDown(e, "headline", headlineX, headlineY)}
                onDoubleClick={() => editable && setEditingElement(editingElement === "headline" ? null : "headline")}
            >
                {editable && (
                    <div className="flex items-center gap-1 mb-1">
                        <Type className="size-3 text-gold/80" />
                        <span className="text-[10px] text-gold/60 font-medium">Headline</span>
                    </div>
                )}
                {editable && editingElement === "headline" ? (
                    <textarea
                        value={headlineText}
                        onChange={(e) => { setHeadlineText(e.target.value); }}
                        onBlur={emitChange}
                        className="w-full bg-transparent text-white border border-gold/30 rounded-md px-2 py-1 text-sm resize-none focus:outline-none focus:border-gold"
                        style={{ fontFamily: fontHeadline, fontSize: "clamp(1rem, 3vw, 2rem)", fontWeight: getHeadlineWeight(), lineHeight: 1.1 }}
                        rows={2}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <h1
                        style={{
                            fontFamily: fontHeadline,
                            fontSize: headlineSize,
                            fontWeight: getHeadlineWeight(),
                            letterSpacing: getLetterSpacing(),
                            lineHeight: 1.1,
                            color: "#fff",
                            margin: 0,
                            ...getTextEffectStyle("headline"),
                        }}
                        className="drop-shadow-lg"
                    >
                        {headlineText.split("\n").map((line, i) => (
                            <span key={i}>{i > 0 && <br />}{line}</span>
                        ))}
                    </h1>
                )}
                {/* Position controls */}
                {editable && editingElement === "headline" && (
                    <PositionControls
                        x={headlineX} y={headlineY}
                        onMove={(dx, dy) => { setHeadlineX(headlineX + dx); setHeadlineY(headlineY + dy); }}
                        onMoveEnd={emitChange}
                    />
                )}
            </div>

            {/* Subheadline */}
            {blueprint.subheadline && (
                <div
                    className={`absolute ${editable ? "cursor-move" : "pointer-events-none"} ${dragging === "subheadline" ? "ring-2 ring-gold/40" : ""} ${editingElement === "subheadline" ? "ring-1 ring-gold/30 bg-black/10 backdrop-blur-sm" : ""}`}
                    style={{
                        left: toPercent(subX),
                        top: toPercent(subY),
                        maxWidth: "70%",
                        padding: editable ? "4px" : 0,
                        borderRadius: editable ? "8px" : 0,
                        transition: "box-shadow 0.15s, background 0.15s",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "subheadline", subX, subY)}
                    onDoubleClick={() => editable && setEditingElement(editingElement === "subheadline" ? null : "subheadline")}
                >
                    {editable && (
                        <div className="flex items-center gap-1 mb-1">
                            <Type className="size-3 text-gold/80" />
                            <span className="text-[10px] text-gold/60 font-medium">Subheadline</span>
                        </div>
                    )}
                    {editable && editingElement === "subheadline" ? (
                        <input
                            value={subText}
                            onChange={(e) => setSubText(e.target.value)}
                            onBlur={emitChange}
                            className="w-full bg-transparent text-white/90 border border-gold/30 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-gold"
                            style={{ fontFamily: fontBody }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <p style={{
                            fontFamily: fontBody,
                            fontSize: subSize,
                            fontWeight: 300,
                            fontStyle: "italic",
                            letterSpacing: "0.04em",
                            lineHeight: 1.4,
                            color: "rgba(255,255,255,0.9)",
                            margin: 0,
                            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                        }}>
                            {subText}
                        </p>
                    )}
                    {editable && editingElement === "subheadline" && (
                        <PositionControls
                            x={subX} y={subY}
                            onMove={(dx, dy) => { setSubX(subX + dx); setSubY(subY + dy); }}
                            onMoveEnd={emitChange}
                        />
                    )}
                </div>
            )}

            {/* CTA Button */}
            <div
                className={`absolute ${editable ? "cursor-move" : "pointer-events-none"} ${dragging === "cta" ? "ring-2 ring-gold/40" : ""} ${editingElement === "cta" ? "ring-1 ring-gold/30 bg-black/10 backdrop-blur-sm" : ""}`}
                style={{
                    left: toPercent(ctaX),
                    top: toPercent(ctaY),
                    padding: editable ? "4px" : 0,
                    borderRadius: editable ? "8px" : 0,
                    transition: "box-shadow 0.15s, background 0.15s",
                }}
                onMouseDown={(e) => handleMouseDown(e, "cta", ctaX, ctaY)}
                onDoubleClick={() => editable && setEditingElement(editingElement === "cta" ? null : "cta")}
            >
                {editable && (
                    <div className="flex items-center gap-1 mb-1">
                        <Type className="size-3 text-gold/80" />
                        <span className="text-[10px] text-gold/60 font-medium">CTA</span>
                    </div>
                )}
                {editable && editingElement === "cta" ? (
                    <input
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        onBlur={emitChange}
                        className="w-40 bg-transparent text-black border border-gold/30 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-gold"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span style={{
                        display: "inline-block",
                        padding: blueprint.cta?.border_radius === "pill" || blueprint.cta?.style?.includes("pill") ? "12px 32px" : "14px 36px",
                        borderRadius: blueprint.cta?.border_radius === "pill" || blueprint.cta?.style?.includes("pill") ? "50px" : blueprint.cta?.border_radius ?? "12px",
                        background: blueprint.cta?.style?.includes("outline") ? "transparent" : blueprint.cta?.background_style?.includes("gradient") ? "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)" : "rgba(255, 215, 0, 0.9)",
                        color: blueprint.cta?.style?.includes("outline") ? "#D4AF37" : "#1a1a1a",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: ctaSize,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                        border: blueprint.cta?.style?.includes("outline") ? "2px solid rgba(255,215,0,0.8)" : "none",
                    }}>
                        {ctaText}
                    </span>
                )}
                {editable && editingElement === "cta" && (
                    <PositionControls
                        x={ctaX} y={ctaY}
                        onMove={(dx, dy) => { setCtaX(ctaX + dx); setCtaY(ctaY + dy); }}
                        onMoveEnd={emitChange}
                    />
                )}
            </div>

            {/* Editable panel */}
            {editable && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-gold/20 p-3">
                    <div className="flex flex-wrap gap-2 items-center text-xs">
                        {/* Quick controls */}
                        <div className="flex items-center gap-1 text-gold/80">
                            <Type className="size-3" />
                            <select
                                value={fontHeadline}
                                onChange={(e) => { setFontHeadline(e.target.value); emitChange(); }}
                                className="bg-transparent border border-gold/30 rounded-md px-2 py-1 text-white text-xs max-w-[140px]"
                            >
                                {fontOptions.map(f => (
                                    <option key={f} value={f} className="bg-gray-800">{f.replace(/'/g, "")}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                            <span className="text-gold/60 text-[10px]">Headline:</span>
                            <button onClick={() => setEditingElement("headline")} className="px-2 py-0.5 rounded border border-gold/30 text-gold/80 hover:bg-gold/10 text-[10px]">
                                {editingElement === "headline" ? "Done" : "Edit"}
                            </button>
                            <input
                                value={headlineSize}
                                onChange={(e) => { setHeadlineSize(e.target.value); emitChange(); }}
                                className="bg-transparent border border-gold/20 rounded-md px-2 py-0.5 text-white text-[10px] w-32"
                                placeholder="Size"
                            />
                        </div>
                        {blueprint.subheadline && (
                            <div className="flex items-center gap-1 ml-2">
                                <span className="text-gold/60 text-[10px]">Sub:</span>
                                <button onClick={() => setEditingElement("subheadline")} className="px-2 py-0.5 rounded border border-gold/30 text-gold/80 hover:bg-gold/10 text-[10px]">
                                    {editingElement === "subheadline" ? "Done" : "Edit"}
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-1 ml-2">
                            <span className="text-gold/60 text-[10px]">CTA:</span>
                            <button onClick={() => setEditingElement("cta")} className="px-2 py-0.5 rounded border border-gold/30 text-gold/80 hover:bg-gold/10 text-[10px]">
                                {editingElement === "cta" ? "Done" : "Edit"}
                            </button>
                        </div>
                        <span className="text-gold/40 text-[10px] ml-auto">Drag or double-click to edit | Arrow keys to move</span>
                    </div>
                </div>
            )}

            {/* Font pairing info */}
            {blueprint.font_pairing && (
                <div className="absolute bottom-16 left-3 pointer-events-none" style={{
                    fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.6rem, 1vw, 0.75rem)",
                    color: "rgba(255,255,255,0.5)", textShadow: "0 1px 4px rgba(0,0,0,0.5)", letterSpacing: "0.03em",
                }}>
                    {fontHeadline.replace(/'/g, "")} + {fontBody.replace(/'/g, "")}
                </div>
            )}

            {/* Layout strategy badge */}
            <div className="absolute top-3 right-3 pointer-events-none" style={{
                fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.55rem, 0.8vw, 0.7rem)",
                color: "rgba(255,255,255,0.4)", textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                letterSpacing: "0.05em", textTransform: "uppercase", padding: "4px 12px",
                borderRadius: "20px", backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
            }}>
                {blueprint.layout_strategy}
            </div>
        </div>
    );
}

function PositionControls({
    x, y, onMove, onMoveEnd,
}: {
    x: number; y: number;
    onMove: (dx: number, dy: number) => void;
    onMoveEnd: () => void;
}) {
    const step = 10;
    return (
        <div className="flex gap-0.5 mt-1">
            <button onClick={() => { onMove(0, -step); onMoveEnd(); }} className="p-1 rounded bg-gold/20 hover:bg-gold/30 text-gold/80"><ChevronUp className="size-3" /></button>
            <button onClick={() => { onMove(0, step); onMoveEnd(); }} className="p-1 rounded bg-gold/20 hover:bg-gold/30 text-gold/80"><ChevronDown className="size-3" /></button>
            <button onClick={() => { onMove(-step, 0); onMoveEnd(); }} className="p-1 rounded bg-gold/20 hover:bg-gold/30 text-gold/80"><ChevronLeft className="size-3" /></button>
            <button onClick={() => { onMove(step, 0); onMoveEnd(); }} className="p-1 rounded bg-gold/20 hover:bg-gold/30 text-gold/80"><ChevronRight className="size-3" /></button>
            <span className="text-[10px] text-gold/40 ml-1 self-center">x:{Math.round(x)} y:{Math.round(y)}</span>
        </div>
    );
}