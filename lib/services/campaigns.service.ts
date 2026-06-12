import { api, apiRequest } from "@/lib/api/client";
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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    const token   = opts?.token ?? "";

    const response = await fetch(
        `${baseUrl}${API_V1}/generations/${encodeURIComponent(id)}/creative`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "text/html",
            },
        }
    );

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
