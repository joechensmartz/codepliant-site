"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Supabase will set the session from the URL hash/params when
    // the user clicks the reset link. We need to wait for that.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
        setCheckingSession(false);
      }
    });

    // Also check if we already have a session (user may have landed directly)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-[var(--space-4)] py-[var(--space-3)] rounded-lg bg-surface-secondary border border-border-subtle text-ink text-[length:var(--text-sm)] placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors";

  if (checkingSession) {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[400px] mx-auto text-center text-ink-secondary">
          Verifying reset link...
        </div>
      </section>
    );
  }

  if (!sessionReady) {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[400px] mx-auto text-center">
          <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
            Invalid or Expired Link
          </h1>
          <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-6)]">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <a
            href="/forgot-password"
            className="inline-flex items-center px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold bg-brand text-surface-primary hover:bg-brand-hover transition-colors duration-150"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            Request New Link
          </a>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[400px] mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-brand-muted flex items-center justify-center mx-auto mb-[var(--space-4)]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-brand"
              aria-hidden="true"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
            Password Reset
          </h1>
          <p className="text-[length:var(--text-sm)] text-ink-secondary">
            Your password has been updated. Redirecting to dashboard...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[var(--space-24)] px-[var(--space-6)]">
      <div className="max-w-[400px] mx-auto">
        <div className="text-center mb-[var(--space-12)]">
          <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
            Set new password
          </h1>
          <p className="text-[length:var(--text-sm)] text-ink-secondary">
            Choose a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[var(--space-4)]">
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
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-urgency-muted border border-urgency/20 p-[var(--space-3)] text-[length:var(--text-sm)] text-urgency">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold transition-colors duration-150 bg-brand text-surface-primary hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
}
