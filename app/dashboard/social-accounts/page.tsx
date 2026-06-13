"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Instagram, Loader2, ExternalLink, AlertTriangle, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { getAuthUrl, getSocialAccounts, disconnectAccount } from "@/lib/api/social";
import type { SocialAccount } from "@/lib/api/types";

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function SocialAccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setError(null);
      const data = await getSocialAccounts();
      setAccounts(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setError(null);
      const { url } = await getAuthUrl();
      window.location.href = url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to start OAuth flow");
      setConnecting(false);
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      setDisconnectingId(id);
      await disconnectAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      setConfirmDelete(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to disconnect account");
    } finally {
      setDisconnectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#D4A017]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Social Media</h1>
        <p className="mt-1.5 text-sm text-gray-400">
          Connect your accounts to enable auto-posting
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-2 underline hover:text-red-300 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Connected Accounts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Connected Accounts</h2>
          <Button
            type="button"
            onClick={handleConnect}
            disabled={connecting}
            className="gap-2 rounded-2xl bg-[#D4A017] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#c49015] disabled:opacity-60"
          >
            {connecting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Instagram className="size-4" />
            )}
            {connecting ? "Connecting..." : "Hubungkan Instagram"}
          </Button>
        </div>

        {accounts.length === 0 ? (
          <GlassCard className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="rounded-full bg-[#D4A017]/10 p-4">
              <Instagram className="size-8 text-[#D4A017]" />
            </div>
            <p className="text-sm text-gray-400">Belum ada akun terhubung</p>
            <Button
              type="button"
              onClick={handleConnect}
              disabled={connecting}
              className="gap-2 rounded-2xl bg-[#D4A017] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#c49015]"
            >
              <Instagram className="size-4" />
              Hubungkan Instagram
            </Button>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => {
              const daysLeft = daysUntil(account.token_expires_at);
              const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft < 7;
              const isExpired = daysLeft !== null && daysLeft < 0;

              return (
                <GlassCard key={account.id} className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A017]/20 to-[#D4A017]/5">
                      <Instagram className="size-5 text-[#D4A017]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">@{account.platform_username}</p>
                      <p className="text-xs text-gray-400">
                        Terhubung sejak {formatDate(account.connected_at)}
                      </p>
                      {isExpiringSoon && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
                          <AlertTriangle className="size-3" />
                          Token hampir expired
                        </span>
                      )}
                      {isExpired && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-400">
                          <AlertTriangle className="size-3" />
                          Token expired — reconnect needed
                        </span>
                      )}
                    </div>
                  </div>

                  {confirmDelete === account.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400">Yakin lepas?</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={disconnectingId === account.id}
                        onClick={() => handleDisconnect(account.id)}
                        className="h-auto rounded-xl border border-red-500/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        {disconnectingId === account.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          "Lepas"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete(null)}
                        className="h-auto rounded-xl border border-[#2A2A2A] px-3 py-1.5 text-xs text-gray-400 hover:bg-[#2A2A2A] transition-colors"
                      >
                        Batal
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDelete(account.id)}
                      className="h-auto gap-1.5 rounded-xl border border-red-500/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                      Lepas
                    </Button>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}