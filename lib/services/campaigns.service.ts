import { api, apiRequest } from "@/lib/api/client";
import { buildApiUrl } from "@/lib/api/config";
import type {
    CreateGenerationPayload,
    GenerationRecord,
    PaginatedResponse,
} from "@/lib/api/types";
import { API_V1 } from "@/lib/services/paths";
import type { ServiceOptions } from "@/lib/services/options";

export async function createGeneration(
    payload: CreateGenerationPayload,
    opts?: ServiceOptions
): Promise<GenerationRecord> {
    return api.post<GenerationRecord>(`${API_V1}/generations`, payload, {
        ...opts,
        auth: opts?.auth ?? true,
    });
}

export async function createGenerationWithAssets(
    payload: CreateGenerationPayload & { images?: File[] },
    opts?: ServiceOptions
): Promise<GenerationRecord> {
    const { images, ...rest } = payload;

    if (!images?.length) {
        return createGeneration(rest, opts);
    }

    const form = new FormData();
    for (const [key, value] of Object.entries(rest)) {
        if (value != null && value !== "") {
            form.append(key, String(value));
        }
    }

    for (const file of images) {
        form.append("images[]", file);
    }

    return apiRequest<GenerationRecord>(`${API_V1}/generations`, {
        ...opts,
        method: "POST",
        body: form,
        auth: opts?.auth ?? true,
    });
}

export async function getGeneration(
    id: string,
    opts?: ServiceOptions
): Promise<GenerationRecord> {
    return api.get<GenerationRecord>(
        `${API_V1}/generations/${encodeURIComponent(id)}`,
        { ...opts, auth: opts?.auth ?? true }
    );
}

export async function getCreativeHtml(
    id: string,
    opts?: ServiceOptions
): Promise<string> {
    // Get token from localStorage directly for client-side calls
    let token = opts?.token ?? "";
    if (!token && typeof window !== "undefined") {
        try {
            const raw = window.localStorage.getItem("omakase-auth-storage");
            if (raw) {
                const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
                token = parsed?.state?.accessToken ?? "";
            }
            // Fallback to legacy key
            if (!token) {
                token = window.localStorage.getItem("omakase_access_token") ?? "";
            }
        } catch { /* ignore */ }
    }

    const url = buildApiUrl(`${API_V1}/generations/${encodeURIComponent(id)}/creative`);

    // This is a POST endpoint per backend routes
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/html",
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Creative HTML not ready (${response.status})`);
    }

    return response.text();
}

export type ListHistoryParams = {
    page?:     number;
    limit?:    number;
    platform?: string;
    query?:    string;
};

export async function listHistory(
    params: ListHistoryParams = {},
    opts?: ServiceOptions
): Promise<PaginatedResponse<GenerationRecord>> {
    const search = new URLSearchParams();
    if (params.page     != null) search.set("page",     String(params.page));
    if (params.limit    != null) search.set("limit",    String(params.limit));
    if (params.platform)         search.set("platform", params.platform);
    if (params.query)            search.set("q",        params.query);

    const qs = search.toString();

    return api.get<PaginatedResponse<GenerationRecord>>(
        `${API_V1}/generations${qs ? `?${qs}` : ""}`,
        { ...opts, auth: opts?.auth ?? true }
    );
}

export async function deleteGeneration(
    id: string,
    opts?: ServiceOptions
): Promise<void> {
    await api.delete(`${API_V1}/generations/${encodeURIComponent(id)}`, {
        ...opts,
        auth: opts?.auth ?? true,
    });
}

export async function duplicateGeneration(
    id: string,
    opts?: ServiceOptions
): Promise<GenerationRecord> {
    return api.post<GenerationRecord>(
        `${API_V1}/generations/${encodeURIComponent(id)}/duplicate`,
        {},
        { ...opts, auth: opts?.auth ?? true }
    );
}

export async function regenerate(
    id: string,
    opts?: ServiceOptions
): Promise<GenerationRecord> {
    return api.post<GenerationRecord>(
        `${API_V1}/generations/${encodeURIComponent(id)}/regenerate`,
        {},
        { ...opts, auth: opts?.auth ?? true }
    );
}

export type TypographyOverrides = {
    headline?: {
        text?: string;
        font_size?: string;
        font_family?: string;
        position?: { x: number; y: number };
    };
    subheadline?: {
        text?: string;
        font_size?: string;
        position?: { x: number; y: number };
    };
    cta?: {
        text?: string;
        font_size?: string;
        position?: { x: number; y: number };
    };
    font_pairing?: {
        headline?: string;
        body?: string;
    };
};

export type RenderCreativeResponse = {
    html: string;
    creative_blueprint: Record<string, unknown>;
};

export async function renderCreative(
    id: string,
    typography: TypographyOverrides,
    opts?: ServiceOptions
): Promise<RenderCreativeResponse> {
    let token = opts?.token ?? "";
    if (!token && typeof window !== "undefined") {
        try {
            const raw = window.localStorage.getItem("omakase-auth-storage");
            if (raw) {
                const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
                token = parsed?.state?.accessToken ?? "";
            }
            if (!token) {
                token = window.localStorage.getItem("omakase_access_token") ?? "";
            }
        } catch { /* ignore */ }
    }

    const url = buildApiUrl(`${API_V1}/generations/${encodeURIComponent(id)}/creative/render`);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ typography }),
    });

    if (!response.ok) {
        throw new Error(`Failed to render creative (${response.status})`);
    }

    return response.json() as Promise<RenderCreativeResponse>;
}
