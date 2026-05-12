"use client";

import { useMemo, useState } from "react";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileDropzone } from "@/components/ui/file-dropzone";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  "Seafood",
  "Coffee & Bakery",
  "Padang Food",
  "Modern Indonesian Food",
  "Dessert Cafe",
];

const visualStyles = [
  "Dark Japanese Luxury",
  "Tokyo Neon",
  "Modern Nusantara",
  "Luxury Fine Dining",
  "Minimal Zen",
  "Industrial Cafe",
  "Warm Tropical Bali",
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
  "Tourists",
  "High Income Customers",
];

const moods = [
  "Luxury",
  "Elegant",
  "Cozy",
  "Energetic",
  "Playful",
  "Minimal",
];

const goals = [
  "Increase Sales",
  "Boost Awareness",
  "Launch New Menu",
  "Increase Foot Traffic",
  "Create Viral Campaign",
];

const aspectRatios = [
  "1:1",
  "4:5",
  "9:16",
  "16:9",
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
    name: "Matcha Green",
    value: "#15803D",
    ai: "natural matcha green organic aesthetic",
    className: "bg-green-700",
  },
  {
    name: "Ocean Blue",
    value: "#2563EB",
    ai: "fresh seafood ocean blue mood",
    className: "bg-blue-600",
  },
  {
    name: "Coffee Brown",
    value: "#78350F",
    ai: "warm coffee shop earthy tones",
    className: "bg-amber-900",
  },
];

/* =========================================================
   ORCHESTRATION MAPS
========================================================= */

const platformCompositionMap: Record<string, string> = {
  "Instagram Feed": `
premium instagram marketing composition,
high engagement social media layout,
clean typography hierarchy,
center focus food presentation,
high-converting visual storytelling
  `,

  "Instagram Story": `
vertical mobile-first composition,
immersive storytelling layout,
strong call-to-action spacing,
bold modern typography,
instagram story optimized composition
  `,

  TikTok: `
dynamic viral composition,
trendy social media aesthetic,
fast-paced visual storytelling,
bold mobile layout,
attention-grabbing composition
  `,

  "GoFood Banner": `
food-first delivery composition,
strong pricing hierarchy,
high contrast food presentation,
conversion-focused layout,
delivery app optimized visual
  `,

  "GrabFood Banner": `
high-converting food banner layout,
clean CTA hierarchy,
delivery platform optimized composition,
strong menu visibility,
food-focused commercial composition
  `,
};

const moodCompositionMap: Record<string, string> = {
  Luxury: `
gold cinematic lighting,
premium elegant shadows,
high-end restaurant atmosphere,
luxury branding composition
  `,

  Elegant: `
clean sophisticated layout,
soft premium lighting,
refined visual spacing,
modern luxury aesthetic
  `,

  Cozy: `
warm natural lighting,
comfortable cafe atmosphere,
welcoming visual composition,
soft earthy tones
  `,

  Energetic: `
bold vibrant lighting,
high energy visual direction,
dynamic composition flow,
social-media-friendly contrast
  `,

  Playful: `
fun colorful composition,
creative visual arrangement,
youth-focused marketing aesthetic,
trendy playful atmosphere
  `,

  Minimal: `
minimal negative spacing,
clean japanese composition,
simple elegant layout,
premium minimal branding
  `,
};

const cuisineCompositionMap: Record<string, string> = {
  "Japanese Sushi": `
luxury omakase presentation,
minimal japanese plating,
precise sushi arrangement,
premium sushi bar atmosphere
  `,

  Ramen: `
warm ramen bowl close-up,
rich japanese street food atmosphere,
steamy cinematic food presentation,
comfort food photography
  `,

  Seafood: `
fresh ocean-inspired composition,
premium seafood texture details,
fresh cold lighting atmosphere,
high-end seafood presentation
  `,

  "Coffee & Bakery": `
warm coffee shop atmosphere,
artisan bakery presentation,
soft cafe lighting,
premium coffee table composition
  `,

  "Padang Food": `
rich indonesian food presentation,
bold warm food styling,
traditional indonesian dining atmosphere,
abundant food composition
  `,

  "Modern Indonesian Food": `
modern nusantara food styling,
premium indonesian fine dining presentation,
elegant local cuisine composition,
high-end indonesian restaurant atmosphere
  `,

  "Dessert Cafe": `
sweet luxury dessert presentation,
soft pastel cafe atmosphere,
premium dessert photography,
instagrammable dessert composition
  `,
};

const campaignCompositionMap: Record<string, string> = {
  "Payday Promo": `
luxury promotional composition,
high-converting marketing layout,
premium commercial advertising,
strong promotional hierarchy
  `,

  "Happy Hour": `
social dining atmosphere,
fun restaurant energy,
group dining composition,
after-work social vibe
  `,

  "Buy 1 Get 1": `
high-conversion promotional layout,
clear product comparison composition,
strong offer-focused hierarchy,
sales-driven advertisement
  `,

  "Weekend Promo": `
family-friendly dining atmosphere,
weekend social energy,
warm lifestyle composition,
casual premium restaurant aesthetic
  `,

  "Lunch Special": `
fast casual food presentation,
office-worker-focused composition,
clean quick-service marketing layout,
bright appetizing food styling
  `,

  "Grand Opening": `
celebration restaurant atmosphere,
premium grand opening branding,
luxury launch event composition,
high-attention commercial visual
  `,

  "Ramadan Promo": `
warm islamic elegant atmosphere,
golden ramadan lighting,
family dining composition,
premium festive restaurant styling
  `,
};

/* =========================================================
   COMPONENT
========================================================= */

export function GeneratorForm() {
  const [referenceImages, setReferenceImages] = useState<File[]>([]);

  const [campaignType, setCampaignType] = useState(
    campaignTypes[0]
  );

  const [cuisine, setCuisine] = useState(
    cuisineTypes[0]
  );

  const [style, setStyle] = useState(
    visualStyles[0]
  );

  const [platform, setPlatform] = useState(
    platforms[0]
  );

  const [audience, setAudience] = useState(
    audiences[0]
  );

  const [mood, setMood] = useState(
    moods[0]
  );

  const [goal, setGoal] = useState(
    goals[0]
  );

  const [aspectRatio, setAspectRatio] = useState(
    aspectRatios[0]
  );

  const [prompt, setPrompt] = useState("");

  const [negativePrompt, setNegativePrompt] =
    useState("");

  const [selectedAccent, setSelectedAccent] =
    useState(brandAccents[0]);

  /* =========================================================
     COMPOSITION ENGINE
  ========================================================= */

  const composition = useMemo(() => {
    return [
      platformCompositionMap[platform],
      moodCompositionMap[mood],
      cuisineCompositionMap[cuisine],
      campaignCompositionMap[campaignType],
      selectedAccent.ai,
    ]
      .filter(Boolean)
      .join(",\n");
  }, [
    platform,
    mood,
    cuisine,
    campaignType,
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

Marketing mood:
${mood}

Goal:
${goal}

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
    mood,
    goal,
    platform,
    composition,
    aspectRatio,
    prompt,
  ]);

  /* =========================================================
     GENERATE
  ========================================================= */

  const handleGenerate = async () => {
    const payload = {
      campaign: {
        type: campaignType,
        cuisine,
        style,
        platform,
        audience,
        mood,
        goal,
      },

      branding: {
        accent_name: selectedAccent.name,
        accent_color: selectedAccent.value,
      },

      generation: {
        aspect_ratio: aspectRatio,
      },

      prompts: {
        original_prompt: prompt,

        enhanced_prompt: enhancedPrompt,

        negative_prompt: negativePrompt,
      },

      references: {
        total_files: referenceImages.length,

        files: referenceImages.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      },

      orchestration: {
        composition,
        cuisine_injection: cuisine,
        marketing_injection: campaignType,
        style_injection: style,
        audience_injection: audience,
        mood_injection: mood,
        branding_injection: selectedAccent.ai,
        platform_injection: platform,
      },

      metadata: {
        generated_at: new Date().toISOString(),
        source: "omakase-ai",
        version: "v1",
      },
    };

    console.log("ORCHESTRATION PAYLOAD");
    console.log(payload);

    alert("Payload generated. Check console.");
  };

  return (
    <GlassCard>
      <form
        className="contents"
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerate();
        }}
      >
        <h3 className="text-lg font-semibold">
          AI Campaign Builder
        </h3>

        <div className="flex flex-col gap-4 pt-2">
          {/* CAMPAIGN */}
          <div className="space-y-2">
            <Label>Campaign Type</Label>

            <Select
              value={campaignType}
              onValueChange={setCampaignType}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {campaignTypes.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CUISINE */}
          <div className="space-y-2">
            <Label>Cuisine Type</Label>

            <Select
              value={cuisine}
              onValueChange={setCuisine}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {cuisineTypes.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* STYLE */}
          <div className="space-y-2">
            <Label>Visual Style</Label>

            <Select
              value={style}
              onValueChange={setStyle}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {visualStyles.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PLATFORM */}
          <div className="space-y-2">
            <Label>Platform</Label>

            <Select
              value={platform}
              onValueChange={setPlatform}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {platforms.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* AUDIENCE */}
          <div className="space-y-2">
            <Label>Target Audience</Label>

            <Select
              value={audience}
              onValueChange={setAudience}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {audiences.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* MOOD */}
          <div className="space-y-2">
            <Label>Mood</Label>

            <Select
              value={mood}
              onValueChange={setMood}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {moods.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* GOAL */}
          <div className="space-y-2">
            <Label>Campaign Goal</Label>

            <Select
              value={goal}
              onValueChange={setGoal}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {goals.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ASPECT RATIO */}
          <div className="space-y-2">
            <Label>Aspect Ratio</Label>

            <Select
              value={aspectRatio}
              onValueChange={setAspectRatio}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {aspectRatios.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PROMPT */}
          <div className="space-y-2">
            <Label>Prompt</Label>

            <Textarea
              rows={5}
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              placeholder="Create a luxury sushi payday campaign..."
            />
          </div>

          {/* NEGATIVE PROMPT */}
          <div className="space-y-2">
            <Label>Negative Prompt</Label>

            <Textarea
              rows={3}
              value={negativePrompt}
              onChange={(e) =>
                setNegativePrompt(e.target.value)
              }
              placeholder="low quality, blurry, messy layout..."
            />
          </div>

          {/* BRAND ACCENT */}
          <div className="space-y-3">
            <Label>Brand Accent</Label>

            <div className="grid grid-cols-5 gap-3">
              {brandAccents.map((accent) => {
                const active =
                  selectedAccent.name === accent.name;

                return (
                  <button
                    key={accent.name}
                    type="button"
                    onClick={() =>
                      setSelectedAccent(accent)
                    }
                    className="group flex flex-col items-center gap-2"
                  >
                    <span
                      className={`
                        ${accent.className}
                        size-10 rounded-full border
                        transition-all duration-300
                        shadow-lg
                        ${
                          active
                            ? "ring-2 ring-white scale-110"
                            : "border-white/10"
                        }
                      `}
                    />

                    <span className="text-[10px] text-center text-muted-foreground">
                      {accent.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FILES */}
          <div className="space-y-2">
            <FileDropzone
              label="Brand References"
              hint="Upload food photos, logo, restaurant interior, menu, or branding references."
              files={referenceImages}
              onFilesChange={setReferenceImages}
              maxFiles={8}
              maxSizeBytes={12 * 1024 * 1024}
            />
          </div>

          {/* AI PROMPT PREVIEW */}
          <div className="space-y-2">
            <Label>AI Orchestrated Prompt</Label>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {enhancedPrompt}
              </p>
            </div>
          </div>

          {/* GENERATE */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
          >
            Generate AI Campaign
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}