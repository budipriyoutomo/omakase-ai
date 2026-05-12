import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset password" description="We will email you a link to reset your password.">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input id="reset-email" type="email" autoComplete="email" placeholder="you@company.com" />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
