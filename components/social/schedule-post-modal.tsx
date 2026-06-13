"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScheduledPost } from "@/lib/api/types";
import { updateScheduledPost } from "@/lib/api/social";

interface SchedulePostModalProps {
  post: ScheduledPost;
  onSave: (post: ScheduledPost) => void;
  onClose: () => void;
}

export function SchedulePostModal({ post, onSave, onClose }: SchedulePostModalProps) {
  const [caption, setCaption] = useState(post.caption);
  const [hashtags, setHashtags] = useState<string[]>(post.hashtags ?? []);
  const [hashtagInput, setHashtagInput] = useState("");
  const [scheduledDate, setScheduledDate] = useState(
    new Date(post.scheduled_at).toISOString().slice(0, 16)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddHashtag = () => {
    const tag = hashtagInput.trim();
    if (!tag) return;
    const normalized = tag.startsWith("#") ? tag : `#${tag}`;
    if (hashtags.includes(normalized)) return;
    if (hashtags.length >= 30) return;
    setHashtags([...hashtags, normalized]);
    setHashtagInput("");
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  const handleSave = async () => {
    if (caption.length > 2200) {
      setError("Caption cannot exceed 2,200 characters.");
      return;
    }

    // Validate scheduled time is at least 10 minutes from now
    const selected = new Date(scheduledDate);
    const minTime = new Date(Date.now() + 10 * 60 * 1000);
    if (selected < minTime) {
      setError("Scheduled time must be at least 10 minutes from now.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const updated = await updateScheduledPost(post.id, {
        caption,
        hashtags,
        scheduled_at: selected.toISOString(),
      });
      onSave(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit Scheduled Post</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-[#2A2A2A] hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Image Preview */}
        <div className="mb-5 overflow-hidden rounded-xl border border-[#2A2A2A]">
          <img
            src={post.image_url}
            alt="Post preview"
            className="aspect-square w-full object-cover"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Caption */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
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
            rows={4}
            maxLength={2250}
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#D4A017] focus:outline-none transition-colors resize-none"
            placeholder="Write your caption..."
          />
        </div>

        {/* Hashtags */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Hashtags{" "}
            <span className="text-gray-500">({hashtags.length}/30)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add hashtag and press Enter"
              className="flex-1 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#D4A017] focus:outline-none transition-colors"
              disabled={hashtags.length >= 30}
            />
            <Button
              type="button"
              onClick={handleAddHashtag}
              disabled={hashtags.length >= 30 || !hashtagInput.trim()}
              className="h-auto rounded-xl border border-[#D4A017] px-3 py-2.5 text-sm text-[#D4A017] hover:bg-[#D4A017]/10 transition-colors disabled:opacity-40"
            >
              Add
            </Button>
          </div>
          {hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-[#D4A017]/30 bg-[#D4A017]/10 px-2.5 py-1 text-xs text-[#D4A017]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveHashtag(tag)}
                    className="ml-0.5 hover:text-white transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Date/Time */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Scheduled Time{" "}
            <span className="text-gray-500">WIB (UTC+7)</span>
          </label>
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white focus:border-[#D4A017] focus:outline-none transition-colors [color-scheme:dark]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-[#2A2A2A] bg-transparent px-4 py-2.5 text-sm text-gray-400 hover:bg-[#2A2A2A] hover:text-white transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || caption.length > 2200}
            className="flex-1 gap-2 rounded-2xl bg-[#D4A017] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#c49015] disabled:opacity-60"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}