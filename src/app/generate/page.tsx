"use client";

import { useState, useEffect } from "react";
import { getUser } from "../../lib/auth";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$10",
    period: "/mo",
    description: "5 document generations per month",
    features: ["5 generations/mo", "120+ docs per generation", "All formats (MD, HTML, PDF, DOCX)", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$30",
    period: "/mo",
    description: "30 document generations per month",
    features: ["30 generations/mo", "Everything in Starter", "Priority support", "Custom branding"],
    popular: true,
  },
];

export default function GeneratePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getUser().then((user) => setIsLoggedIn(!!user));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, companyName, email, packageType: selectedPlan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-[var(--space-4)] py-[var(--space-3)] rounded-lg bg-surface-secondary border border-border-subtle text-ink text-[length:var(--text-sm)] placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors";

  return (
    <section className="py-[var(--space-24)] px-[var(--space-6)]">
      <div className="max-w-[720px] mx-auto">
        <div className="text-center mb-[var(--space-16)]">
          <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-[var(--space-4)]">
            Generate Compliance Documents
          </h1>
          <p className="text-[length:var(--text-lg)] text-ink-secondary max-w-[560px] mx-auto">
            Point us at your repo. We scan your code and generate
            publication-ready compliance documents.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[var(--space-8)]">
          {/* Repository URL */}
          <div>
            <label
              htmlFor="repoUrl"
              className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
            >
              GitHub Repository URL
            </label>
            <input
              id="repoUrl"
              type="url"
              required
              placeholder="https://github.com/your-org/your-repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className={inputClass}
            />
            <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-1)]">
              Must be a public repository. We clone it to scan your dependencies and source code.
            </p>
          </div>

          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
            >
              Company Name{" "}
              <span className="text-ink-tertiary font-normal">(optional)</span>
            </label>
            <input
              id="companyName"
              type="text"
              placeholder="Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
            >
              Contact Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="legal@yourcompany.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-1)]">
              Used as the contact email in your compliance documents.
            </p>
          </div>

          {/* Plan Selection */}
          <div>
            <p className="text-[length:var(--text-sm)] font-medium mb-[var(--space-4)]">
              Select a Plan
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-4)]">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative text-left rounded-lg p-[var(--space-4)] border-2 transition-colors duration-150 ${
                    selectedPlan === plan.id
                      ? "border-brand bg-brand-muted"
                      : "border-border-subtle bg-surface-primary hover:border-border-strong"
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-[var(--space-4)] bg-brand text-surface-primary text-[length:var(--text-xs)] font-medium px-[var(--space-2)] py-0.5 rounded">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-baseline gap-[var(--space-1)] mb-[var(--space-1)]">
                    <span className="font-display font-semibold text-[length:var(--text-lg)]">
                      {plan.price}
                    </span>
                    <span className="text-[length:var(--text-sm)] text-ink-secondary">{plan.period}</span>
                  </div>
                  <div className="font-medium text-[length:var(--text-sm)] mb-[var(--space-2)]">
                    {plan.name}
                  </div>
                  <p className="text-[length:var(--text-xs)] text-ink-secondary mb-[var(--space-3)]">
                    {plan.description}
                  </p>
                  <ul className="space-y-[var(--space-1)]">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="text-[length:var(--text-xs)] text-ink-secondary flex items-start gap-[var(--space-1)]"
                      >
                        <svg
                          className="w-3.5 h-3.5 mt-0.5 shrink-0 text-brand"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-urgency-muted border border-urgency/20 p-[var(--space-4)] text-[length:var(--text-sm)] text-urgency">
              {error}
            </div>
          )}

          {/* Auth note */}
          {!isLoggedIn && (
            <p className="text-[length:var(--text-xs)] text-ink-tertiary text-center">
              <a href="/login" className="text-brand hover:text-brand-hover transition-colors duration-150">
                Sign in
              </a>{" "}
              to track your orders and re-download documents from your dashboard.
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[var(--space-4)] rounded-lg text-[length:var(--text-base)] font-semibold transition-colors duration-150 bg-brand text-surface-primary hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            {loading ? "Redirecting to payment..." : "Start Generating"}
          </button>

          <p className="text-[length:var(--text-xs)] text-ink-tertiary text-center">
            Secure payment via Stripe. Documents delivered instantly after payment.
          </p>
        </form>

        {/* Free CLI note */}
        <div className="mt-[var(--space-8)] rounded-lg border border-border-subtle bg-surface-secondary p-[var(--space-4)] text-center">
          <p className="text-[length:var(--text-sm)] text-ink-secondary">
            The CLI is always free. Run{" "}
            <code className="font-mono text-brand">npx codepliant go</code>{" "}
            locally at no cost.
          </p>
        </div>
      </div>
    </section>
  );
}
