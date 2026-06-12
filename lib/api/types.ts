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
        text:      string;
        placement: string;
        alignment: string;
        style:     string;
        safe_area: {
            x:      number;
            y:      number;
            width:  number;
            height: number;
        };
    };
    subheadline: {
        placement: string;
        style:     string;
    };
    cta: {
        text:      string;
        placement: string;
        style:     string;
    };
    layout_strategy:  string;
    visual_reasoning: string;
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

export type AiMetadata = {
    typography_blueprint?: TypographyBlueprint;
    creative_blueprint?:   CreativeBlueprint;
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