"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/services/auth.service";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      // Validate input
      if (!email) {
        throw new Error("Email is required");
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }

      // Call forgot password API
      await forgotPassword(email);

      // Show success message
      setSuccess(true);
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send reset link. Please try again.";
      setError(message);
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-500">
          If that email exists in our system, a password reset link has been sent. Please check your inbox.
        </div>
        <Button variant="outline" className="w-full" size="lg" asChild>
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          We will email you a link to reset your password if that email exists in our system.
        </p>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-gold hover:text-gold/90 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}
