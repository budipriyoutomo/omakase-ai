/** Centralised TanStack Query keys — keep aligned with `lib/services` routes. */

export const queryKeys = {
  root: ["omakase"] as const,

  dashboard: {
    root: ["omakase", "dashboard"] as const,
    overview: () => [...queryKeys.dashboard.root, "overview"] as const
  },

  auth: {
    root: ["omakase", "auth"] as const,
    me: () => [...queryKeys.auth.root, "me"] as const
  },

  templates: {
    root: ["omakase", "templates"] as const,
    list: () => [...queryKeys.templates.root, "list"] as const
  },

  campaigns: {
    root: ["omakase", "campaigns"] as const,
    list: (params?: { platform?: string; q?: string; page?: number }) =>
      [...queryKeys.campaigns.root, "list", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.campaigns.root, "detail", id] as const
  }
};
