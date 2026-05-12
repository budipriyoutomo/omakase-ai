import { api } from "@/lib/api/client";
import type { CampaignTemplate } from "@/lib/api/types";
import { API_V1 } from "@/lib/services/paths";
import type { ServiceOptions } from "@/lib/services/options";

export async function listTemplates(opts?: ServiceOptions): Promise<CampaignTemplate[]> {
  return api.get<CampaignTemplate[]>(`${API_V1}/templates`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

export async function getTemplate(id: string, opts?: ServiceOptions): Promise<CampaignTemplate> {
  return api.get<CampaignTemplate>(`${API_V1}/templates/${encodeURIComponent(id)}`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}
