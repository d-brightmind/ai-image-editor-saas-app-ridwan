"use client";

import { useState } from "react";
import {
  useChangePassword,
  useListSessions,
  useRevokeSession,
  useDeleteUser,
} from "@better-auth-ui/react";
import { authClient } from "~/lib/auth-client";
import { Loader2 } from "lucide-react";

interface SecuritySettingsCardProps {
  className?: string;
}

export function SecuritySettingsCard({ className }: SecuritySettingsCardProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = useChangePassword(authClient, {
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
    },
  });

  const sessions = useListSessions(authClient, {
    // listSessions is gated server-side on userId for cache partitioning
  });

  const revokeSession = useRevokeSession(authClient);
  const deleteUser = useDeleteUser(authClient);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    changePassword.mutate({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("This will permanently delete your account. Continue?")) {
      return;
    }
    deleteUser.mutate({});
  };

  return (
    <div className={`bg-card border-border space-y-8 rounded-xl border p-6 ${className ?? ""}`}>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Security</h2>
        <p className="text-muted-foreground text-sm">
          Manage your password, active sessions, and account deletion.
        </p>
      </div>

      {/* Change password */}
      <form onSubmit={handlePasswordSubmit} className="space-y-3">
        <h3 className="text-sm font-medium">Change password</h3>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={changePassword.isPending || !currentPassword || !newPassword}
          className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {changePassword.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Update password
        </button>
        {changePassword.isError && (
          <p className="text-destructive text-sm">{changePassword.error.message}</p>
        )}
        {changePassword.isSuccess && (
          <p className="text-sm text-green-600">Password updated.</p>
        )}
      </form>

      {/* Active sessions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Active sessions</h3>
        {sessions.isLoading && (
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        )}
        {sessions.data && sessions.data.length > 0 && (
          <ul className="space-y-2">
            {sessions.data.map((s) => (
              <li
                key={s.id}
                className="border-border flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{s.userAgent ?? "Unknown device"}</p>
                  <p className="text-muted-foreground text-xs">
                    Created {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => revokeSession.mutate({ token: s.token })}
                  disabled={revokeSession.isPending}
                  className="text-destructive text-xs font-medium hover:underline disabled:opacity-50"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
        {sessions.data && sessions.data.length === 0 && (
          <p className="text-muted-foreground text-sm">No other active sessions.</p>
        )}
      </div>

      {/* Danger zone */}
      <div className="border-destructive/30 space-y-3 rounded-md border border-dashed p-4">
        <h3 className="text-destructive text-sm font-medium">Danger zone</h3>
        <p className="text-muted-foreground text-sm">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleteUser.isPending}
          className="bg-destructive text-destructive-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {deleteUser.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Delete account
        </button>
        {deleteUser.isError && (
          <p className="text-destructive text-sm">{deleteUser.error.message}</p>
        )}
      </div>
    </div>
  );
}