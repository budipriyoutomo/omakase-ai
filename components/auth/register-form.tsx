"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/services/auth.service";
import { useAuthStore } from "@/lib/stores/auth-store";

export function RegisterForm() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate inputs
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("All fields are required");
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Call register API
      const tokens = await register({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password
      });

      // Store token in auth store
      setAccessToken(tokens.accessToken);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="register-name">Name</Label>
          <Input
            id="register-name"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-confirm-password">Confirm Password</Label>
          <Input
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-gold hover:text-gold/90 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}
