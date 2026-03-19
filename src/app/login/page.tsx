"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { signIn, signInWithGoogle } from "../../lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/dashboard";
  const redirectTo = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(email, password);
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in"
      );
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-[var(--space-4)] py-[var(--space-3)] rounded-lg bg-surface-secondary border border-border-subtle text-ink text-[length:var(--text-sm)] placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors";

  return (
    <section className="py-[var(--space-24)] px-[var(--space-6)]">
      <div className="max-w-[400px] mx-auto">
        <div className="text-center mb-[var(--space-12)]">
          <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
            Sign in to Codepliant
          </h1>
          <p className="text-[length:var(--text-sm)] text-ink-secondary">
            Track your orders and download documents
          </p>
        </div>

        <button
          onClick={() => signInWithGoogle(redirectTo)}
          className="w-full py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold transition-colors duration-150 bg-surface-secondary border border-border-subtle text-ink hover:bg-surface-primary flex items-center justify-center gap-[var(--space-3)]"
          style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative my-[var(--space-4)]">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-subtle"></div>
          </div>
          <div className="relative flex justify-center text-[length:var(--text-xs)]">
            <span className="bg-surface-primary px-[var(--space-3)] text-ink-tertiary">or sign in with email</span>
          </div>
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

          <div>
            <div className="flex items-center justify-between mb-[var(--space-2)]">
              <label
                htmlFor="password"
                className="block text-[length:var(--text-sm)] font-medium"
              >
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-[length:var(--text-xs)] text-brand hover:text-brand-hover font-medium transition-colors duration-150"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[length:var(--text-sm)] text-ink-secondary mt-[var(--space-6)]">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-brand hover:text-brand-hover font-medium transition-colors duration-150"
          >
            Sign up
          </a>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <section className="py-[var(--space-24)] px-[var(--space-6)]">
          <div className="max-w-[400px] mx-auto text-center text-ink-secondary">
            Loading...
          </div>
        </section>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
