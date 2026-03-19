"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) throw resetError;
      setSent(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-[var(--space-4)] py-[var(--space-3)] rounded-lg bg-surface-secondary border border-border-subtle text-ink text-[length:var(--text-sm)] placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors";

  if (sent) {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[400px] mx-auto text-center">
          <div className="mb-[var(--space-6)]">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
              Check your email
            </h1>
            <p className="text-[length:var(--text-sm)] text-ink-secondary">
              We sent a password reset link to{" "}
              <strong className="text-ink">{email}</strong>. Click the link in
              the email to reset your password.
            </p>
          </div>
          <p className="text-[length:var(--text-xs)] text-ink-tertiary">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              onClick={() => setSent(false)}
              className="text-brand hover:text-brand-hover font-medium transition-colors duration-150"
            >
              try again
            </button>
            .
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
            Reset your password
          </h1>
          <p className="text-[length:var(--text-sm)] text-ink-secondary">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[var(--space-4)]">
          <div>
            <label
              htmlFor="email"
              className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-[length:var(--text-sm)] text-ink-secondary mt-[var(--space-6)]">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-brand hover:text-brand-hover font-medium transition-colors duration-150"
          >
            Sign in
          </a>
        </p>
      </div>
    </section>
  );
}
