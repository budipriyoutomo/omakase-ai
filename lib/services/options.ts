import type { ApiRequestOptions } from "@/lib/api/client";

/** Common options routed into `apiRequest` from every service method. */
export type ServiceOptions = Pick<ApiRequestOptions, "auth" | "token" | "signal" | "credentials" | "cache" | "headers">;
