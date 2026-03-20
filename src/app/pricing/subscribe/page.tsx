"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$10",
    period: "/mo",
    credits: "5 generations per month",
    features: ["All 4 formats (MD, HTML, DOCX, PDF)", "Per-document folders", "Company name injection"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$30",
    period: "/mo",
    credits: "30 generations per month",
    features: ["Everything in Starter", "Company branding", "Priority support"],
  },
];

function SubscribeContent() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("plan");
  const [selectedPlan, setSelectedPlan] = useState(preselected || "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "INITIAL_SESSION") {
          if (!session?.user?.email) {
            const redirect = preselected
              ? `/pricing/subscribe?plan=${preselected}`
              : "/pricing/subscribe";
            window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
            return;
          }
          setEmail(session.user.email);
          setLoading(false);
        }
      }
    );
    return () => { subscription.unsubscribe(); };
  }, [preselected]);

  async function handleSubscribe() {
    if (!selectedPlan || !email) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan: selectedPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[520px] mx-auto text-center text-ink-secondary">Checking account...</div>
      </section>
    );
  }

  return (
    <section className="py-[var(--space-24)] px-[var(--space-6)]">
      <div className="max-w-[520px] mx-auto">
        <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-2)]">
          Choose Your Plan
        </h1>
        <p className="text-ink-secondary text-[length:var(--text-sm)] mb-[var(--space-8)]">
          Subscribe to generate compliance documents in MD, HTML, DOCX, and PDF from any GitHub repo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-4)] mb-[var(--space-8)]">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`text-left p-[var(--space-5)] rounded-xl border-2 transition-colors duration-150 ${
                selectedPlan === plan.id
                  ? "border-brand bg-brand-muted"
                  : "border-border-subtle hover:border-ink-tertiary"
              }`}
            >
              <div className="flex items-baseline gap-[var(--space-1)] mb-[var(--space-1)]">
                <span className="text-[length:var(--text-xl)] font-bold">{plan.price}</span>
                <span className="text-[length:var(--text-sm)] text-ink-secondary">{plan.period}</span>
              </div>
              <p className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-2)]">{plan.name}</p>
              <p className="text-[length:var(--text-xs)] text-ink-secondary mb-[var(--space-3)]">{plan.credits}</p>
              <ul className="space-y-[var(--space-1)]">
                {plan.features.map((f) => (
                  <li key={f} className="text-[length:var(--text-xs)] text-ink-secondary flex items-start gap-[var(--space-1)]">
                    <span className="text-brand mt-0.5">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg bg-urgency-muted border border-urgency/20 p-[var(--space-3)] text-[length:var(--text-sm)] text-urgency mb-[var(--space-4)]">
            {error}
          </div>
        )}

        <button
          onClick={handleSubscribe}
          disabled={!selectedPlan || submitting}
          className="w-full py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold bg-brand text-surface-primary hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Redirecting to checkout..."
            : selectedPlan
            ? `Subscribe to ${selectedPlan === "pro" ? "Pro" : "Starter"} — ${selectedPlan === "pro" ? "$30" : "$10"}/mo`
            : "Select a plan"}
        </button>

        <p className="text-[length:var(--text-xs)] text-ink-tertiary text-center mt-[var(--space-3)]">
          Cancel anytime. You&apos;ll be redirected to Stripe for secure payment.
        </p>
      </div>
    </section>
  );
}

export default function SubscribePage() {
  return (
    <Suspense
      fallback={
        <section className="py-[var(--space-24)] px-[var(--space-6)]">
          <div className="max-w-[520px] mx-auto text-center text-ink-secondary">Loading...</div>
        </section>
      }
    >
      <SubscribeContent />
    </Suspense>
  );
}
