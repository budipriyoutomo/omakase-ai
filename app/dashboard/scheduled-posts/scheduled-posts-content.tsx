"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  X,
  Pencil,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Calendar,
  Clock,
  ChevronLeft,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { SchedulePostModal } from "@/components/social/schedule-post-modal";
import {
  getScheduledPosts,
  createScheduledPost,
  cancelScheduledPost,
} from "@/lib/api/social";
import { getSocialAccounts } from "@/lib/api/social";
import type { ScheduledPost, SocialAccount } from "@/lib/api/types";

type FilterTab = "all" | "pending" | "published" | "failed" | "cancelled";

function formatWIB(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

function formatWIBTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "published", label: "Published" },
  { key: "failed", label: "Failed" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Terjadwal",
    className: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  },
  processing: {
    label: "Sedang Posting",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  published: {
    label: "Terposting",
    className: "bg-green-500/10 text-green-400 border-green-500/30",
  },
  failed: {
    label: "Gagal",
    className: "bg-red-500/10 text-red-400 border-red-500/30",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-gray-700/20 text-gray-500 border-gray-700/30",
  },
};

export function ScheduledPostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaign_id");

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pageSize: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Schedule form state
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Edit modal
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  // Cancelling
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const status = activeTab === "all" ? undefined : activeTab;
      const data = await getScheduledPosts(status);
      setPosts(data.items);
      setMeta(data.meta);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await getSocialAccounts();
      setAccounts(data);
    } catch {
      // Non-critical
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchAccounts();
  }, [fetchPosts, fetchAccounts]);

  // If campaign_id, fetch campaign image
  useEffect(() => {
    if (!campaignId) return;
    async function loadCampaign() {
      try {
        const { api } = await import("@/lib/api/client");
        const gen = await api.get<{ imageUrl?: string }>(
          `/v1/generations/${campaignId}`,
          { auth: true }
        );
        if (gen?.imageUrl) {
          setImageUrl(gen.imageUrl);
        }
      } catch {
        // ignore
      }
    }
    loadCampaign();
  }, [campaignId]);

  const handleAddHashtag = () => {
    const tag = hashtagInput.trim();
    if (!tag) return;
    const normalized = tag.startsWith("#") ? tag : `#${tag}`;
    if (hashtags.includes(normalized)) return;
    if (hashtags.length >= 30) return;
    setHashtags([...hashtags, normalized]);
    setHashtagInput("");
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  const handleSubmit = async () => {
    setFormError(null);
    setFormSuccess(false);

    if (!selectedAccount) {
      setFormError("Pilih akun Instagram terlebih dahulu.");
      return;
    }
    if (!imageUrl) {
      setFormError("Image URL is required.");
      return;
    }
    if (!caption.trim()) {
      setFormError("Caption is required.");
      return;
    }
    if (caption.length > 2200) {
      setFormError("Caption cannot exceed 2,200 characters.");
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      setFormError("Date and time are required.");
      return;
    }

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00+07:00`);
    const minTime = new Date(Date.now() + 10 * 60 * 1000);
    if (scheduledAt < minTime) {
      setFormError("Scheduled time must be at least 10 minutes from now.");
      return;
    }

    try {
      setSubmitting(true);
      const post = await createScheduledPost({
        campaign_generation_id: campaignId ?? null,
        social_account_id: selectedAccount,
        image_url: imageUrl,
        caption: caption.trim(),
        hashtags: hashtags.length > 0 ? hashtags : undefined,
        scheduled_at: scheduledAt.toISOString(),
      });

      setPosts((prev) => [post, ...prev]);
      setFormSuccess(true);

      // Reset form
      setCaption("");
      setHashtags([]);
      setSelectedAccount("");
      setScheduledDate("");
      setScheduledTime("");

      // Refresh list
      setTimeout(fetchPosts, 1000);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Failed to schedule post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      setCancellingId(id);
      const cancelled = await cancelScheduledPost(id);
      setPosts((prev) => prev.map((p) => (p.id === id ? cancelled : p)));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to cancel post");
    } finally {
      setCancellingId(null);
    }
  };

  const handleEditSave = (updated: ScheduledPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPost(null);
  };

  const filteredPosts = posts.filter(
    (p) => activeTab === "all" || p.status === activeTab
  );

  const isOutsideOptimal = (): boolean => {
    if (!scheduledTime) return false;
    const hour = parseInt(scheduledTime.split(":")[0], 10);
    return hour < 9 || hour >= 21;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {campaignId && (
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-[#2A2A2A] hover:text-white transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Scheduled Posts
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Jadwalkan posting Instagram otomatis
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px]">
        {/* LEFT — Posts List */}
        <div className="order-2 lg:order-1 space-y-6">
          {/* Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-[#D4A017]/60 bg-[#D4A017]/10 text-[#D4A017]"
                    : "border-[#2A2A2A] text-gray-400 hover:border-gray-600 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Posts List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-7 animate-spin text-[#D4A017]" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <GlassCard className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <Calendar className="size-10 text-gray-600" />
              <p className="text-sm text-gray-400">
                {activeTab === "all"
                  ? "Belum ada posting terjadwal"
                  : `Tidak ada posting dengan status "${activeTab}"`}
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => {
                const config = STATUS_CONFIG[post.status];
                return (
                  <GlassCard key={post.id} className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="size-[50px] shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={post.image_url}
                        alt=""
                        className="size-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm text-white">
                        {post.caption}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatWIB(post.scheduled_at)} •{" "}
                        {formatWIBTime(post.scheduled_at)} WIB
                      </p>

                      {/* Status + Error */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${config.className}`}
                        >
                          {post.status === "processing" && (
                            <Loader2 className="size-3 animate-spin" />
                          )}
                          {config.label}
                        </span>
                        {post.status === "failed" && post.error_message && (
                          <span className="text-[11px] text-red-400 truncate max-w-[200px]">
                            {post.error_message}
                          </span>
                        )}
                        {post.status === "published" && post.instagram_media_id && (
                          <a
                            href={`https://instagram.com/p/${post.instagram_media_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#D4A017] hover:underline"
                          >
                            <ExternalLink className="size-3" /> View
                          </a>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-2 flex gap-2">
                        {post.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditingPost(post)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-[#2A2A2A] hover:text-white transition-colors"
                              title="Edit"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancel(post.id)}
                              disabled={cancellingId === post.id}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              title="Cancel"
                            >
                              {cancellingId === post.id ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <X className="size-3.5" />
                              )}
                            </button>
                          </>
                        )}
                        {post.status === "failed" && post.retry_count < 3 && (
                          <button
                            type="button"
                            onClick={() => {
                              fetchPosts();
                            }}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-[#D4A017] hover:bg-[#D4A017]/10 transition-colors"
                          >
                            <RefreshCw className="size-3" /> Retry
                          </button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT — Schedule Form */}
        <div className="order-1 lg:order-2">
          <GlassCard className="sticky top-6 p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Jadwalkan Post
            </h2>

            {formSuccess && (
              <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs text-green-400">
                Post terjadwal! Daftar akan diperbarui.
              </div>
            )}

            {formError && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {formError}
              </div>
            )}

            {/* Image Preview */}
            {imageUrl && (
              <div className="mb-4 overflow-hidden rounded-xl border border-[#2A2A2A]">
                <img
                  src={imageUrl}
                  alt="Campaign preview"
                  className="aspect-square w-full object-cover"
                />
              </div>
            )}
            {!imageUrl && (
              <div className="mb-4 flex items-center justify-center rounded-xl border border-dashed border-[#2A2A2A] aspect-square">
                <span className="text-xs text-gray-500">
                  {campaignId
                    ? "Loading image..."
                    : "Image dari campaign akan muncul di sini"}
                </span>
              </div>
            )}

            {/* Caption */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-300">
                Caption{" "}
                <span
                  className={
                    caption.length > 2200
                      ? "text-red-400"
                      : caption.length > 2000
                        ? "text-[#D4A017]"
                        : "text-gray-500"
                  }
                >
                  ({caption.length}/2200)
                </span>
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                maxLength={2250}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#D4A017] focus:outline-none transition-colors resize-none"
                placeholder="Tulis caption..."
              />
            </div>

            {/* Hashtags */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-300">
                Hashtags{" "}
                <span className="text-gray-500">({hashtags.length}/30)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleHashtagKeyDown}
                  placeholder="Tambah hashtag (Enter)"
                  className="flex-1 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#D4A017] focus:outline-none transition-colors"
                  disabled={hashtags.length >= 30}
                />
              </div>
              {hashtags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-[#D4A017]/30 bg-[#D4A017]/10 px-2 py-0.5 text-[11px] text-[#D4A017]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setHashtags(hashtags.filter((t) => t !== tag))
                        }
                        className="hover:text-white transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Account Selector */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-300">
                Akun Instagram
              </label>
              {accounts.length === 0 ? (
                <p className="text-xs text-gray-500">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/social-accounts")}
                    className="text-[#D4A017] hover:underline"
                  >
                    Hubungkan akun Instagram dulu
                  </button>
                </p>
              ) : (
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white focus:border-[#D4A017] focus:outline-none transition-colors [color-scheme:dark]"
                >
                  <option value="">Pilih akun...</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      @{a.platform_username}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Date & Time */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-300">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white focus:border-[#D4A017] focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-300">
                  Jam (WIB)
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white focus:border-[#D4A017] focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Timezone + Warning */}
            <div className="mb-5 space-y-1.5">
              <span className="text-[11px] text-gray-500">
                <Clock className="inline size-3 mr-1" />
                WIB (UTC+7)
              </span>
              {isOutsideOptimal() && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
                  <AlertTriangle className="size-3" />
                  Di luar jam posting optimal (9AM–9PM)
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full gap-2 rounded-2xl bg-[#D4A017] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#c49015] disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Calendar className="size-4" />
              )}
              Jadwalkan Post
            </Button>
          </GlassCard>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <SchedulePostModal
          post={editingPost}
          onSave={handleEditSave}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
}