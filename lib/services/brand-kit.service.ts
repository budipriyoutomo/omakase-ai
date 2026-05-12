import { api, apiRequest } from "@/lib/api/client";
import type { BrandKitIdentity } from "@/lib/api/types";
import { API_V1 } from "@/lib/services/paths";
import type { ServiceOptions } from "@/lib/services/options";

export async function getBrandKit(opts?: ServiceOptions): Promise<BrandKitIdentity> {
  return api.get<BrandKitIdentity>(`${API_V1}/brand-kit`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

export async function upsertBrandKit(
  patch: Partial<BrandKitIdentity>,
  opts?: ServiceOptions
): Promise<BrandKitIdentity> {
  return api.patch<BrandKitIdentity>(`${API_V1}/brand-kit`, patch, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

export async function uploadLogo(file: File, opts?: ServiceOptions): Promise<BrandKitIdentity> {
  const form = new FormData();
  form.append("logo", file);

  return apiRequest<BrandKitIdentity>(`${API_V1}/brand-kit/logo`, {
    ...opts,
    method: "POST",
    body: form,
    auth: opts?.auth ?? true
  });
}
