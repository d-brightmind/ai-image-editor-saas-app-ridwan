"use client";

import { useAuthenticate } from "@better-auth-ui/react";
import { authClient } from "~/lib/auth-client";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Replacement for the old <RedirectToSignIn /> + <SignedIn> pair from
 * @daveyplate/better-auth-ui. @better-auth-ui/react is headless and only
 * exposes useAuthenticate, which redirects unauthenticated users to the
 * sign-in page (preserving the current URL as `redirectTo`) and otherwise
 * behaves like useSession.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, isPending } = useAuthenticate(authClient);

  if (isPending || !session) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}