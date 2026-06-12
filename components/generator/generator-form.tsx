"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Brain,
  ImageIcon,
  Megaphone,
  Sparkles,
  Target,
  TrendingUp,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FileDropzone } from "@/components/ui/file-dropzone";
import { GlassCard } from "../ui/glass-card";
import { createGenerationWithAssets, getGeneration } from "@/lib/services/campaigns.service";
import type { GenerationRecord } from "@/lib/api/types";

/* =========================================================
   DATA
========================================================= */

const campaignTypes = [
  "Payday Promo",
  "Happy Hour",
  "Buy 1 Get 1",
  "Weekend Promo",
  "Lunch Special",
  "Grand Opening",
  "Ramadan Promo",
];

const cuisineTypes = [
  "Japanese Sushi",
  "Ramen",
  "Coffee & Bakery",
  "Seafood",
  "Modern Indonesian Food",
  "Padang Food",
  "Dessert Cafe",
];

const visualStyles = [
  "Dark Japanese Luxury",
  "Tokyo Neon",
  "Modern Nusantara",
  "Luxury Fine Dining",
  "Industrial Cafe",
  "Warm Tropical Bali",
  "Minimal Zen",
];

const platforms = [
  "Instagram Feed",
  "Instagram Story",
  "TikTok",
  "GoFood Banner",
  "GrabFood Banner",
];

const audiences = [
  "Gen Z",
  "Office Workers",
  "Family",
  "Students",
  "High Income Customers",
  "Tourists",
];

const moods = [
  "Luxury",
  "Elegant",
  "Energetic",
  "Cozy",
  "Minimal",
  "Playful",
];

const goals = [
  "Increase Sales",
  "Boost Awareness",
  "Launch New Menu",
  "Increase Foot Traffic",
  "Create Viral Campaign",
];

const aspectRatios = ["1:1", "4:5", "9:16", "16:9"];

const visualStrategies = [
  "Food Focused",
  "Lifestyle Focused",
  "Typography Focused",
  "Close-Up Product",
  "Human Interaction",
];

const ctaStrategies = [
  "Strong Sales CTA",
  "Luxury Soft CTA",
  "Brand Awareness CTA",
  "Urgency CTA",
];

const brandAccents = [
  {
    name: "Gold Luxury",
    value: "#D4AF37",
    ai: "premium gold cinematic lighting",
    className: "bg-[#D4AF37]",
  },
  {
    name: "Tokyo Red",
    value: "#DC2626",
    ai: "bold japanese red neon atmosphere",
    className: "bg-red-600",
  },
  {
    name: "Ocean Blue",
    value: "#2563EB",
    ai: "fresh seafood ocean atmosphere",
    className: "bg-blue-600",
  },
  {
    name: "Matcha Green",
    value: "#15803D",
    ai: "organic matcha cafe aesthetic",
    className: "bg-green-700",
  },
  {
    name: "Coffee Brown",
    value: "#78350F",
    ai: "warm earthy coffee tone",
    className: "bg-amber-900",
  },
];

/* =========================================================
   COMPOSITION MAPS
========================================================= */

const platformCompositionMap: Record<string, string> = {
  "Instagram Feed": `
instagram optimized composition,
high-engagement social media layout,
premium typography hierarchy,
food-first commercial visual
  `,

  "Instagram Story": `
vertical immersive storytelling,
mobile-first composition,
strong call-to-action hierarchy,
instagram story optimized visual
  `,

  TikTok: `
viral content composition,
trendy social media energy,
dynamic mobile storytelling,
attention-grabbing layout
  `,

  "GoFood Banner": `
high-converting delivery composition,
strong menu hierarchy,
food-focused commercial banner,
pricing optimized visual layout
  `,

  "GrabFood Banner": `
delivery app optimized layout,
high contrast food composition,
strong CTA visibility,
commercial restaurant advertising
  `,
};

const cuisineCompositionMap: Record<string, string> = {
  "Japanese Sushi": `
luxury omakase presentation,
minimal japanese plating,
premium sushi arrangement,
dark japanese atmosphere
  `,

  Ramen: `
steamy cinematic ramen bowl,
warm japanese comfort food atmosphere,
rich texture food photography
  `,

  "Coffee & Bakery": `
artisan coffee shop composition,
soft warm cafe lighting,
premium bakery presentation
  `,

  Seafood: `
fresh seafood presentation,
ocean-inspired commercial styling,
fresh premium texture details
  `,

  "Modern Indonesian Food": `
modern nusantara food styling,
premium indonesian fine dining atmosphere,
elegant local cuisine presentation
  `,

  "Padang Food": `
rich indonesian food composition,
bold warm culinary styling,
traditional premium dining atmosphere
  `,

  "Dessert Cafe": `
instagrammable dessert presentation,
soft pastel luxury aesthetic,
premium dessert photography
  `,
};

/* =========================================================
   COMPONENT
========================================================= */

type GeneratorFormProps = {
  onGenerationStart?: () => void;
  onGenerationChange?: (generation: GenerationRecord) => void;
  onGenerationError?: (message: string) => void;
};

const POLLABLE_STATUSES = new Set(["pending", "processing", "generated_image"]);

export function GeneratorForm({
  onGenerationStart,
  onGenerationChange,
  onGenerationError,
}: GeneratorFormProps = {}) {
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const isMountedRef = useRef(true);

  const [campaignType, setCampaignType] = useState(campaignTypes[0]);
  const [cuisine, setCuisine] = useState(cuisineTypes[0]);
  const [style, setStyle] = useState(visualStyles[0]);
  const [platform, setPlatform] = useState(platforms[0]);
  const [audience, setAudience] = useState(audiences[0]);
  const [mood, setMood] = useState(moods[0]);
  const [goal, setGoal] = useState(goals[0]);
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0]);
  const [visualStrategy, setVisualStrategy] = useState(
    visualStrategies[0]
  );
  const [ctaStrategy, setCtaStrategy] = useState(
    ctaStrategies[0]
  );
  const [heroItem, setHeroItem] = useState("");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

  const [selectedAccent, setSelectedAccent] = useState(
    brandAccents[0]
  );

  /* =========================================================
     COMPOSITION ENGINE
  ========================================================= */

  const composition = useMemo(() => {
    return [
      platformCompositionMap[platform],
      cuisineCompositionMap[cuisine],
      selectedAccent.ai,
      `${mood} marketing atmosphere`,
      `${visualStrategy} composition`,
      `${ctaStrategy}`,
      `high-converting restaurant marketing advertisement`,
      `commercial food photography`,
      `premium cinematic lighting`,
    ]
      .filter(Boolean)
      .join(",\n");
  }, [
    platform,
    cuisine,
    mood,
    visualStrategy,
    ctaStrategy,
    selectedAccent,
  ]);

  /* =========================================================
     ENHANCED PROMPT
  ========================================================= */

  const enhancedPrompt = useMemo(() => {
    return `
${campaignType} campaign for ${cuisine} restaurant.

Visual style:
${style}

Target audience:
${audience}

Campaign goal:
${goal}

Hero menu item:
${heroItem}

Platform optimized for:
${platform}

Composition:
${composition}

Aspect ratio:
${aspectRatio}

User request:
${prompt}
    `.trim();
  }, [
    campaignType,
    cuisine,
    style,
    audience,
    goal,
    heroItem,
    platform,
    composition,
    aspectRatio,
    prompt,
  ]);

  /* =========================================================
     AI RECOMMENDATIONS
  ========================================================= */

  const recommendations = useMemo(() => {
    return [
      `${platform} performs best with ${aspectRatio} composition`,
      `${audience} audiences respond well to ${mood.toLowerCase()} visuals`,
      `${style} works best with cinematic food close-up shots`,
      `Use stronger CTA hierarchy for ${goal.toLowerCase()}`,
    ];
  }, [platform, aspectRatio, audience, mood, style, goal]);

  /* =========================================================
     SCORE ENGINE
  ========================================================= */

  const campaignScore = useMemo(() => {
    let score = 60;

    if (prompt.length > 20) score += 10;
    if (heroItem) score += 5;
    if (referenceImages.length > 0) score += 10;
    if (negativePrompt.length > 10) score += 5;
    if (visualStrategy) score += 5;
    if (ctaStrategy) score += 5;

    return Math.min(score, 100);
  }, [
    prompt,
    heroItem,
    referenceImages,
    negativePrompt,
    visualStrategy,
    ctaStrategy,
  ]);

  /* =========================================================
     GENERATE
  ========================================================= */

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const wait = (ms: number) =>
    new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });

  const pollGeneration = async (generationId: string) => {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      await wait(5000);

      if (!isMountedRef.current) return;

      const latest = await getGeneration(generationId);
      onGenerationChange?.(latest);

      if (!POLLABLE_STATUSES.has(latest.status)) {
        return;
      }
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    onGenerationStart?.();
    try {
      const payload = {
        campaignType,
        platform,
        style,
        prompt: enhancedPrompt,
        cuisine,
        audience,
        goal,
        mood,
        heroItem,
        visualStrategy,
        ctaStrategy,
        aspectRatio,
        negativePrompt,
      };

      const generation = await createGenerationWithAssets({
        ...payload,
        images: referenceImages.length > 0 ? referenceImages : undefined
      });

      onGenerationChange?.(generation);
      if (POLLABLE_STATUSES.has(generation.status)) {
        await pollGeneration(generation.id);
      }
    } catch (err) {
      console.error("Failed to generate campaign", err);
      const message = err instanceof Error ? err.message : "Failed to generate campaign. Please try again.";
      onGenerationError?.(message);
      alert(message);
    } finally {
      if (isMountedRef.current) {
        setIsGenerating(false);
      }
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        handleGenerate();
      }}
    >
      <section className="overflow-hidden rounded-3xl border border-border bg-card/70">
      <GlassCard>
        <div className="grid gap-6 border-b border-border px-5 py-5 lg:grid-cols-[1fr_18rem] lg:px-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              <Sparkles className="size-3.5" />
              Prompt orchestration studio
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Restaurant Marketing AI Studio
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                AI-powered campaign orchestration engine designed for restaurant and cafe marketing.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[campaignType, platform, aspectRatio, mood].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Prompt readiness
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
                  {campaignScore}%
                </p>
              </div>
              <div className="grid size-14 place-items-center rounded-2xl bg-gold/10 text-gold">
                <Target className="size-6" />
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gold transition-all duration-300"
                style={{ width: `${campaignScore}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Lengkapi hero item, prompt detail, negative prompt, dan referensi untuk arahan visual yang lebih presisi.
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.02fr)_minmax(22rem,0.98fr)] lg:p-6">
          <div className="space-y-5">
            <PanelHeader
              icon={<Megaphone className="size-5" />}
              title="Campaign setup"
              description="Atur konteks pemasaran inti sebelum masuk ke detail visual."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Campaign Type">
                <Select value={campaignType} onValueChange={setCampaignType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignTypes.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Campaign Goal">
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Target Audience">
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Platform">
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Divider />

            <PanelHeader
              icon={<ImageIcon className="size-5" />}
              title="Visual direction"
              description="Tentukan rasa visual, frame output, dan aksen brand."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Cuisine Type">
                <Select value={cuisine} onValueChange={setCuisine}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisineTypes.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Visual Style">
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {visualStyles.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Mood">
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {moods.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Aspect Ratio">
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Brand Accent">
              <div className="grid gap-3 sm:grid-cols-5">
                {brandAccents.map((accent) => {
                  const active = selectedAccent.name === accent.name;

                  return (
                    <button
                      key={accent.name}
                      type="button"
                      onClick={() => setSelectedAccent(accent)}
                      className={`flex min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-center transition ${
                        active
                          ? "border-gold/60 bg-gold/10 text-foreground shadow-sm"
                          : "border-border bg-background/70 text-muted-foreground hover:border-gold/30 hover:text-foreground"
                      }`}
                    >
                      <span className={`${accent.className} size-8 rounded-full border border-white/15`} />
                      <span className="text-[11px] font-medium leading-4">{accent.name}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Divider />

            <PanelHeader
              icon={<Brain className="size-5" />}
              title="Prompt craft"
              description="Isi objek utama, arahan konten, dan file referensi."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hero Menu Item">
                <Input
                  value={heroItem}
                  onChange={(e) => setHeroItem(e.target.value)}
                  placeholder="Salmon Sushi Deluxe"
                />
              </Field>

              <Field label="Visual Strategy">
                <Select value={visualStrategy} onValueChange={setVisualStrategy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {visualStrategies.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="CTA Strategy">
                <Select value={ctaStrategy} onValueChange={setCtaStrategy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ctaStrategies.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Prompt">
              <Textarea
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Create a luxury sushi payday campaign for Gen Z audiences with a strong product close-up and dramatic lighting."
              />
            </Field>

            <Field label="Negative Prompt">
              <Textarea
                rows={3}
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="blurry, low quality, warped hands, unreadable logo, cluttered layout"
              />
            </Field>

            <FileDropzone
              label="Brand References"
              hint="Upload logo, menu, restaurant interior, or food photos."
              files={referenceImages}
              onFilesChange={setReferenceImages}
              maxFiles={8}
              maxSizeBytes={12 * 1024 * 1024}
            />

            <Button type="submit" size="lg" className="h-14 w-full rounded-2xl" disabled={isGenerating}>
              <Wand2 className="size-4" />
              {isGenerating ? "Generating..." : "Generate AI Campaign"}
            </Button>
          </div>

          <aside className="space-y-5">
            <section className="overflow-hidden rounded-3xl border border-border bg-background/80">
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Live direction preview</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ringkasan brief yang akan dibawa ke generator.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Active
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="rounded-3xl border border-border bg-card p-5">
                  <div className="flex flex-wrap gap-2">
                    {[campaignType, cuisine, platform].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                    {heroItem || cuisine}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {style} campaign for {audience.toLowerCase()} with {mood.toLowerCase()} visual tone and {visualStrategy.toLowerCase()} framing.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[goal, ctaStrategy, aspectRatio].map((item) => (
                      <span
                        key={item}
                        className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Sparkles className="size-4 text-gold" />
                    AI orchestrated prompt
                  </div>
                  <div className="max-h-[24rem] overflow-auto rounded-2xl border border-border bg-muted/30 p-4">
                    <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                      {enhancedPrompt}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-background/80 p-5">
              <PanelHeader
                icon={<TrendingUp className="size-5" />}
                title="AI recommendations"
                description="Saran kecil untuk menjaga prompt tetap tajam."
              />
              <div className="mt-4 space-y-3">
                {recommendations.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-6 text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
        </GlassCard>
      </section>
    </form>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function PanelHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-2xl bg-gold/10 text-gold">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}
