import { useRouter, usePathname } from "next/navigation";
import { useEffect, ComponentType, createElement } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { readPersistedAccessTokenSync } from "@/lib/stores/auth-store";

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/dashboard/analytics",
  "/dashboard/brand-kit",
  "/dashboard/generate",
  "/dashboard/history",
  "/dashboard/settings",
  "/dashboard/subscription",
  "/dashboard/templates"
] as const;

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/pricing"
] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname as typeof PUBLIC_ROUTES[number]);
}

/**
 * HOC to protect routes that require authentication.
 * Redirects to login if not authenticated.
 *
 * Usage:
 * export default withAuth(MyProtectedComponent);
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  const AuthWrapper = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
      // Check if route is protected
      if (!isProtectedRoute(pathname)) {
        return;
      }

      // Get token from store or persisted storage
      const token = accessToken || readPersistedAccessTokenSync();

      if (!token) {
        // No token, redirect to login
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }, [accessToken, pathname, router]);

    // If no token and route is protected, show nothing (will redirect)
    if (isProtectedRoute(pathname) && !accessToken) {
      return null;
    }

    return createElement(WrappedComponent, props);
  };

  AuthWrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthWrapper;
}
