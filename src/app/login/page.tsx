"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
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
      router.push("/dashboard");
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
            <label
              htmlFor="password"
              className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
            >
              Password
            </label>
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
