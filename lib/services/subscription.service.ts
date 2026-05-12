import { api } from "@/lib/api/client";
import type { SubscriptionPlan, SubscriptionStatus } from "@/lib/api/types";
import { API_V1 } from "@/lib/services/paths";
import type { ServiceOptions } from "@/lib/services/options";

export async function listPlans(opts?: ServiceOptions): Promise<SubscriptionPlan[]> {
  return api.get<SubscriptionPlan[]>(`${API_V1}/subscription/plans`, {
    ...opts,
    auth: opts?.auth ?? false
  });
}

export async function getSubscription(opts?: ServiceOptions): Promise<SubscriptionStatus> {
  return api.get<SubscriptionStatus>(`${API_V1}/subscription`, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

export async function selectPlan(
  payload: { planId: string; successUrl?: string; cancelUrl?: string },
  opts?: ServiceOptions
): Promise<{ checkoutUrl?: string }> {
  return api.post<{ checkoutUrl?: string }>(`${API_V1}/subscription/checkout`, payload, {
    ...opts,
    auth: opts?.auth ?? true
  });
}

export async function openBillingPortal(opts?: ServiceOptions): Promise<{ url: string }> {
  return api.post<{ url: string }>(
    `${API_V1}/subscription/billing-portal`,
    {},
    {
      ...opts,
      auth: opts?.auth ?? true
    }
  );
}
