"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser, signOut } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile
  const [displayName, setDisplayName] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [passwordCooldown, setPasswordCooldown] = useState(false);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteText, setDeleteText] = useState("");

  const isGoogleUser = user?.app_metadata?.provider === "google" ||
    user?.app_metadata?.providers?.includes("google");

  const loadUser = useCallback(async () => {
    const currentUser = await getUser();
    if (!currentUser) {
      router.push("/login?redirect=/dashboard/settings");
      return;
    }
    setUser(currentUser);
    setDisplayName(
      currentUser.user_metadata?.full_name ||
        currentUser.user_metadata?.name ||
        ""
    );
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    setNameLoading(true);
    setNameError("");
    setNameSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName },
      });
      if (error) throw error;
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err: unknown) {
      setNameError(
        err instanceof Error ? err.message : "Failed to update name"
      );
    } finally {
      setNameLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();

    if (passwordCooldown) {
      setPasswordError(
        "Too many attempts. Please wait a moment before trying again."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess(false);

    try {
      // Re-authenticate with current password first
      const { error: reAuthError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });
      if (reAuthError) {
        setPasswordError("Current password is incorrect");
        setPasswordLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);

      // Rate limiting
      const attempts = passwordAttempts + 1;
      setPasswordAttempts(attempts);
      if (attempts >= 3) {
        setPasswordCooldown(true);
        setTimeout(() => {
          setPasswordCooldown(false);
          setPasswordAttempts(0);
        }, 60000);
      }
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete account");
        setDeleteLoading(false);
        return;
      }

      await signOut();
      router.push("/");
    } catch {
      setDeleteError("Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[640px] mx-auto">
          <div className="animate-pulse space-y-[var(--space-6)]">
            <div className="h-8 w-48 bg-surface-secondary rounded-lg" />
            <div className="h-40 bg-surface-secondary rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  const inputClass =
    "w-full px-[var(--space-4)] py-[var(--space-3)] rounded-lg bg-surface-secondary border border-border-subtle text-ink text-[length:var(--text-sm)] placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors";

  return (
    <section className="py-[var(--space-16)] px-[var(--space-6)]">
      <div className="max-w-[640px] mx-auto">
        {/* Back link */}
        <a
          href="/dashboard"
          className="inline-flex items-center text-[length:var(--text-sm)] text-ink-secondary hover:text-ink transition-colors duration-150 mb-[var(--space-6)]"
        >
          &larr; Back to Dashboard
        </a>

        <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-8)]">
          Account Settings
        </h1>

        {/* Profile Section */}
        <div className="rounded-xl border border-border-subtle bg-surface-primary p-[var(--space-6)] mb-[var(--space-6)]">
          <h2 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-4)]">
            Profile
          </h2>

          <form onSubmit={handleNameSave} className="space-y-[var(--space-4)]">
            <div>
              <label
                htmlFor="displayName"
                className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]">
                Email
              </label>
              <div className="px-[var(--space-4)] py-[var(--space-3)] rounded-lg bg-surface-tertiary border border-border-subtle text-[length:var(--text-sm)] text-ink-secondary">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]">
                Auth Provider
              </label>
              <div className="px-[var(--space-4)] py-[var(--space-3)] rounded-lg bg-surface-tertiary border border-border-subtle text-[length:var(--text-sm)] text-ink-secondary">
                {isGoogleUser ? "Google" : "Email / Password"}
              </div>
            </div>

            {nameError && (
              <div className="rounded-lg bg-urgency-muted border border-urgency/20 p-[var(--space-3)] text-[length:var(--text-sm)] text-urgency">
                {nameError}
              </div>
            )}

            {nameSuccess && (
              <div className="rounded-lg bg-brand-muted border border-brand/20 p-[var(--space-3)] text-[length:var(--text-sm)] text-brand">
                Name updated successfully.
              </div>
            )}

            <button
              type="submit"
              disabled={nameLoading}
              className="px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold bg-brand text-surface-primary hover:bg-brand-hover transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                transitionTimingFunction: "var(--ease-out-quart)",
              }}
            >
              {nameLoading ? "Saving..." : "Save Name"}
            </button>
          </form>
        </div>

        {/* Security Section — only for email/password users */}
        {!isGoogleUser && (
          <div className="rounded-xl border border-border-subtle bg-surface-primary p-[var(--space-6)] mb-[var(--space-6)]">
            <h2 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-4)]">
              Security
            </h2>

            <form
              onSubmit={handlePasswordChange}
              className="space-y-[var(--space-4)]"
            >
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Your current password"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your new password"
                  minLength={6}
                  required
                  className={inputClass}
                />
              </div>

              {passwordError && (
                <div className="rounded-lg bg-urgency-muted border border-urgency/20 p-[var(--space-3)] text-[length:var(--text-sm)] text-urgency">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="rounded-lg bg-brand-muted border border-brand/20 p-[var(--space-3)] text-[length:var(--text-sm)] text-brand">
                  Password changed successfully.
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading || passwordCooldown}
                className="px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold bg-brand text-surface-primary hover:bg-brand-hover transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  transitionTimingFunction: "var(--ease-out-quart)",
                }}
              >
                {passwordLoading
                  ? "Changing..."
                  : passwordCooldown
                    ? "Please wait..."
                    : "Change Password"}
              </button>
            </form>
          </div>
        )}

        {/* Danger Zone */}
        <div className="rounded-xl border border-urgency/30 bg-surface-primary p-[var(--space-6)]">
          <h2 className="text-[length:var(--text-base)] font-semibold text-urgency mb-[var(--space-2)]">
            Danger Zone
          </h2>
          <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-4)]">
            Permanently delete your account, all data, and cancel any active
            subscriptions. This action cannot be undone.
          </p>

          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold border border-urgency/30 text-urgency hover:bg-urgency-muted transition-colors duration-150"
              style={{
                transitionTimingFunction: "var(--ease-out-quart)",
              }}
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-[var(--space-3)]">
              <p className="text-[length:var(--text-sm)] font-medium text-urgency">
                Type &quot;delete my account&quot; to confirm:
              </p>
              <input
                type="text"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder='Type "delete my account"'
                className={inputClass}
              />

              {deleteError && (
                <div className="rounded-lg bg-urgency-muted border border-urgency/20 p-[var(--space-3)] text-[length:var(--text-sm)] text-urgency">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-[var(--space-3)]">
                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    deleteText !== "delete my account" || deleteLoading
                  }
                  className="px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    transitionTimingFunction: "var(--ease-out-quart)",
                  }}
                >
                  {deleteLoading
                    ? "Deleting..."
                    : "Permanently Delete Account"}
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirm(false);
                    setDeleteText("");
                    setDeleteError("");
                  }}
                  className="px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium border border-border-subtle text-ink-secondary hover:text-ink transition-colors duration-150"
                  style={{
                    transitionTimingFunction: "var(--ease-out-quart)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
