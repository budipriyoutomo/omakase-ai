import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <AuthShell title="Create account">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="register-name">Name</Label>
          <Input id="register-name" autoComplete="name" placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input id="register-email" type="email" autoComplete="email" placeholder="you@company.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input id="register-password" type="password" autoComplete="new-password" placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Register
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-gold hover:text-gold/90 hover:underline">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
