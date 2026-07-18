"use client";

import { AuthGuard } from "./auth-guard";
import { AccountSettingsCard } from "./account-settings-card";
import { SecuritySettingsCard } from "./security-settings-card";

export default function SettingPage() {
  return (
    <AuthGuard>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Account Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account preferences and security settings
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-6">
          <AccountSettingsCard className="w-full max-w-2xl" />
          <SecuritySettingsCard className="w-full max-w-2xl" />
        </div>
      </div>
    </AuthGuard>
  );
}