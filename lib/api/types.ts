/**
 * Align these with your backend DTOs as you implement endpoints.
 */

export type DashboardStat = {
    label: string;
    value: string;
};

export type MonthlyUsagePoint = {
    month: string;
    usage: number;
};

export type CampaignTemplate = {
    id?:      string;
    name:     string;
    category: string;
    style:    string;
    payload?: CreateGenerationPayload;
};

export type PaginatedMeta = {
    total:    number;
    page:     number;
    pageSize: number;
};

export type PaginatedResponse<T> = {
    items: T[];
    meta:  PaginatedMeta;
};

export type AuthCredentials = {
    email:    string;
    password: string;
};

export type RegisterPayload = AuthCredentials & {
    name?: string;
};

export type AuthTokens = {
    accessToken:   string;
    refreshToken?: string;
};

export type UserProfile = {
    id:    string;
    email: string;
    name?: string;
};

// ─── Generation ────────────────────────────────────────────────────────────

export type CreateGenerationPayload = {
    // Required
    campaignType: string;
    platform:     string;
    style:        string;
    prompt:       string;

    // Optional
    cuisine?:        string;
    audience?:       string;
    goal?:           string;
    mood?:           string;
    heroItem?:       string;
    visualStrategy?: string;
    ctaStrategy?:    string;
    aspectRatio?:    string;
    negativePrompt?: string;
};

export type TypographyBlueprint = {
    headline: {
        text:           string;
        placement:      string;
        alignment:      string;
        style:          string;
        font_size?:     string;
        font_weight?:   string;
        letter_spacing?: string;
        safe_area: {
            x:      number;
            y:      number;
            width:  number;
            height: number;
        };
    };
    subheadline?: {
        text?:      string;
        placement:  string;
        style:      string;
        font_size?: string;
    };
    cta: {
        text:            string;
        placement:       string;
        style:           string;
        background_style?: string;
        border_radius?:    string;
    };
    decorations?: Array<{
        type:       string;
        text?:      string;
        placement:  string;
        style?:     string;
        font_size?: string;
    }>;
    font_pairing?: {
        headline?:  string;
        body?:      string;
        accent?:    string;
        reasoning?: string;
    };
    text_effects?: Array<{
        element: string;
        effect:  string;
        value?:  string;
    }>;
    text_backgrounds?: Array<{
        element:       string;
        type:          string;
        color?:        string;
        opacity?:      string;
        padding?:      string;
        border_radius?: string;
    }>;
    layout_strategy:  string;
    visual_reasoning: string;
    responsive_rules?: Array<{
        breakpoint?:    string;
        headline_size?: string;
        cta_size?:      string;
    }>;
};

export type ComponentBlueprint = {
    type:     string;
    content:  string | null;
    position: { x: number; y: number };
    styles:   Record<string, string>;
};

export type CreativeBlueprint = {
    theme:       string;
    layout_mode: string;
    canvas: {
        width:        number;
        height:       number;
        aspect_ratio: string;
    };
    tokens: {
        colors:     Record<string, string>;
        typography: Record<string, string>;
        spacing:    Record<string, string>;
        shadows:    Record<string, string>;
        gradients:  Record<string, string>;
        button:     Record<string, string>;
    };
    components:       ComponentBlueprint[];
    overlay_strategy: {
        negative_space:         string;
        typography_safe_layout: string;
        layout_strategy:        string;
        visual_reasoning:       string;
        overlay_gradient:       string;
    };
};

export type MarketingIntelligence = {
    campaign_goal: string;
    conversion_priority: string;
    brand_positioning: string;
    audience_energy: string;
    cta_strength: string;
    platform_behavior: string;
    marketing_energy: string;
    campaign_tone: string;
    psychology_signals: string[];
    metadata: Record<string, unknown>;
};

export type AiMetadata = {
    typography_blueprint?: TypographyBlueprint;
    creative_blueprint?:   CreativeBlueprint;
    marketing_intelligence?: MarketingIntelligence;
    blueprint_error?: {
        message:   string;
        failed_at: string;
    };
};

export type GenerationRecord = {
    id:     string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'generated_image';

    // Campaign
    campaignType:    string | null;
    cuisine:         string | null;
    platform:        string | null;
    audience:        string | null;
    goal:            string | null;
    mood:            string | null;
    style:           string | null;
    heroItem:        string | null;
    visualStrategy:  string | null;
    ctaStrategy:     string | null;
    aspectRatio:     string | null;

    // Prompts
    prompt:          string | null;
    enhancedPrompt:  string | null;
    negativePrompt:  string | null;

    // AI Engine
    agent:    string | null;
    provider: string | null;
    model:    string | null;

    // Results
    imageUrl:    string | null;
    imageUrls:   string[];
    previewUrls: string[];

    // Metadata
    metadata:   Record<string, unknown>;
    aiMetadata: AiMetadata;

    // Phase 3 & 4
    typographyBlueprint: TypographyBlueprint | null;
    creativeBlueprint:   CreativeBlueprint   | null;
    hasCreativeHtml:     boolean;

    // Marketing Intelligence (diproses terpisah dari image generation)
    marketingIntelligence: MarketingIntelligence | null;

    createdAt: string;
    updatedAt: string;
};

// ─── Brand Kit ─────────────────────────────────────────────────────────────

export type BrandKitIdentity = {
    logoUrl?:      string;
    primaryColor?: string;
    accentColor?:  string;
    fontFamily?:   string;
};

// ─── Subscription ──────────────────────────────────────────────────────────

export type SubscriptionPlan = {
    id:               string;
    name:             string;
    priceUsdMonthly:  number;
    creditsMonthly?:  number;
    description?:     string;
};

export type SubscriptionStatus = {
    planId?:              string;
    status:               string;
    currentPeriodEndsAt?: string;
};

// ─── Analytics ─────────────────────────────────────────────────────────────

export type AnalyticsSummary = {
    impressions?: number;
    clicks?:      number;
    conversions?: number;
    period?:      string;
};

// ─── User ──────────────────────────────────────────────────────────────────

export type UserSettingsPayload = Partial<{
    name:               string;
    emailNotifications: boolean;
    marketingEmails:    boolean;
}>;

// ─── Social / Instagram ────────────────────────────────────────────────────

export interface SocialAccount {
  id: string;
  platform: 'instagram';
  platform_username: string;
  is_active: boolean;
  connected_at: string;
  token_expires_at: string | null;
}

export interface ScheduledPost {
  id: string;
  campaign_generation_id: string | null;
  image_url: string;
  caption: string;
  hashtags: string[];
  scheduled_at: string;
  status: 'pending' | 'processing' | 'published' | 'failed' | 'cancelled';
  published_at: string | null;
  instagram_media_id: string | null;
  error_message: string | null;
  retry_count: number;
  social_account: SocialAccount;
  created_at: string;
  updated_at: string;
}

export type CreateScheduledPostPayload = {
  campaign_generation_id?: string | null;
  social_account_id: string;
  image_url: string;
  caption: string;
  hashtags?: string[];
  scheduled_at: string;
};

export type PaginatedScheduledPosts = {
  items: ScheduledPost[];
  meta: PaginatedMeta;
};

