"use client";

import { useState } from "react";
import { useUser, useUpdateUser, useChangeEmail } from "@better-auth-ui/react";
import { authClient } from "~/lib/auth-client";
import { Loader2 } from "lucide-react";

interface AccountSettingsCardProps {
  className?: string;
}

export function AccountSettingsCard({ className }: AccountSettingsCardProps) {
  const { data: user } = useUser(authClient);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const updateUser = useUpdateUser(authClient, {
    onSuccess: () => {
      // session query is auto-invalidated by the package's MutationInvalidator
    },
  });

  const changeEmail = useChangeEmail(authClient);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === user?.name) return;
    updateUser.mutate({ name });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || email === user?.email) return;
    changeEmail.mutate({ newEmail: email });
  };

  return (
    <div className={`bg-card border-border space-y-6 rounded-xl border p-6 ${className ?? ""}`}>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Account</h2>
        <p className="text-muted-foreground text-sm">
          Update your name and email address.
        </p>
      </div>

      <form onSubmit={handleNameSubmit} className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <div className="flex gap-2">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="Your name"
          />
          <button
            type="submit"
            disabled={updateUser.isPending || name === user?.name || !name.trim()}
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {updateUser.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </button>
        </div>
        {updateUser.isError && (
          <p className="text-destructive text-sm">{updateUser.error.message}</p>
        )}
      </form>

      <form onSubmit={handleEmailSubmit} className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <div className="flex gap-2">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={changeEmail.isPending || email === user?.email || !email.trim()}
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {changeEmail.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </button>
        </div>
        {changeEmail.isError && (
          <p className="text-destructive text-sm">{changeEmail.error.message}</p>
        )}
        {changeEmail.isSuccess && (
          <p className="text-sm text-green-600">
            Check your inbox to confirm the new email address.
          </p>
        )}
      </form>
    </div>
  );
}