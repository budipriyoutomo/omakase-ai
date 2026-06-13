"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { api } from "@/lib/api/client";

export function InstagramCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      setStatus("error");
      setErrorMessage("Missing authorization code or state parameter.");
      return;
    }

    const finalCode = code;
    const finalState = state;

    async function completeOAuth() {
      try {
        await api.get(
          `/v1/instagram/callback?code=${encodeURIComponent(finalCode)}&state=${encodeURIComponent(finalState)}`,
          { auth: true }
        );
        setStatus("success");
        setTimeout(() => {
          router.push("/dashboard/social-accounts");
        }, 2000);
      } catch (e: unknown) {
        setStatus("error");
        setErrorMessage(
          (e as { message?: string })?.message ?? "Failed to connect Instagram account"
        );
      }
    }

    completeOAuth();
  }, [searchParams, router]);

  const handleRetry = () => {
    setStatus("loading");
    setErrorMessage("");
    router.push("/dashboard/social-accounts");
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <GlassCard className="w-full max-w-md space-y-6 p-8 text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#D4A017]/10">
              <Loader2 className="size-8 animate-spin text-[#D4A017]" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connecting Instagram</h2>
            <p className="text-sm text-gray-400">
              Please wait while we complete the connection...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="size-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connected!</h2>
            <p className="text-sm text-gray-400">
              Your Instagram account has been connected. Redirecting...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/10">
              <XCircle className="size-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connection Failed</h2>
            <p className="text-sm text-red-400">{errorMessage}</p>
            <Button
              type="button"
              onClick={handleRetry}
              className="gap-2 rounded-2xl bg-[#D4A017] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#c49015]"
            >
              Try Again
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}