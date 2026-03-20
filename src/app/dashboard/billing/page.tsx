"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Subscription {
  plan: string;
  status: string;
  credits_used: number;
  credits_total: number;
  current_period_start: string;
  current_period_end: string;
  stripe_customer_id: string;
}

const planDetails: Record<string, { name: string; price: string }> = {
  starter: { name: "Starter", price: "$10/mo" },
  pro: { name: "Pro", price: "$30/mo" },
  free: { name: "Free", price: "$0" },
};

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "INITIAL_SESSION") {
          if (!session) {
            router.push("/login?redirect=/dashboard/billing");
            return;
          }
          loadData(session.user);
        }
      }
    );
    return () => { authSub.unsubscribe(); };

    async function loadData(currentUser: User) {
      try {
        setUser(currentUser);

        const { data: subData, error: subError } = await supabase
          .from("subscriptions")
          .select(
            "plan, status, credits_used, credits_total, current_period_start, current_period_end, stripe_customer_id"
          )
          .eq("user_email", currentUser.email)
          .in("status", ["active", "cancelled", "past_due"])
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        // PGRST116 means no rows found — expected for users without a subscription
        if (subError && subError.code !== "PGRST116") {
          console.error("Failed to fetch subscription:", subError);
        }

        setSubscription(subData || null);
      } catch (err: unknown) {
        console.error("Billing page load error:", err);
        setError("Failed to load billing data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    }
  }, [router]);

  async function handleCheckout(plan: string) {
    if (!user?.email) return;
    setPortalLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setPortalLoading(false);
    }
  }

  async function openPortal() {
    if (!user?.email) return;
    setPortalLoading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to open billing portal");
        setPortalLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Failed to open billing portal. Please try again.");
      setPortalLoading(false);
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

  const plan = subscription?.plan || "free";
  const details = planDetails[plan] || planDetails.free;

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
          Billing &amp; Subscription
        </h1>

        {error && (
          <div className="rounded-lg bg-urgency-muted border border-urgency/20 p-[var(--space-3)] text-[length:var(--text-sm)] text-urgency mb-[var(--space-6)]">
            {error}
          </div>
        )}

        {subscription && subscription.plan !== "free" ? (
          <>
            {/* Active/Cancelled Subscription */}
            <div className="rounded-xl border border-border-subtle bg-surface-primary p-[var(--space-6)] mb-[var(--space-6)]">
              <div className="flex items-start justify-between mb-[var(--space-6)]">
                <div>
                  <h2 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-1)]">
                    {details.name} Plan
                  </h2>
                  <p className="text-[length:var(--text-lg)] font-bold text-brand">
                    {details.price}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-[var(--space-3)] py-1 rounded-full text-[length:var(--text-xs)] font-semibold capitalize ${
                    subscription.status === "active"
                      ? "bg-brand-muted text-brand"
                      : subscription.status === "past_due"
                        ? "bg-urgency-muted text-urgency"
                        : "bg-surface-secondary text-ink-tertiary"
                  }`}
                >
                  {subscription.status === "past_due"
                    ? "Past Due"
                    : subscription.status}
                </span>
              </div>

              {/* Credits */}
              <div className="mb-[var(--space-6)]">
                <div className="flex items-center justify-between mb-[var(--space-1)]">
                  <span className="text-[length:var(--text-sm)] text-ink-secondary">
                    Credits this period
                  </span>
                  <span className="text-[length:var(--text-sm)] font-medium">
                    {subscription.credits_used} of{" "}
                    {subscription.credits_total} used
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-300"
                    style={{
                      width: `${subscription.credits_total > 0 ? Math.min((subscription.credits_used / subscription.credits_total) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-[var(--space-4)] mb-[var(--space-6)] text-[length:var(--text-sm)]">
                <div>
                  <p className="text-ink-tertiary mb-[var(--space-1)]">
                    Current period started
                  </p>
                  <p className="font-medium">
                    {new Date(
                      subscription.current_period_start
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-ink-tertiary mb-[var(--space-1)]">
                    {subscription.status === "cancelled"
                      ? "Access ends"
                      : "Next billing date"}
                  </p>
                  <p className="font-medium">
                    {new Date(
                      subscription.current_period_end
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Manage Button */}
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="w-full py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold transition-colors duration-150 border border-border-subtle text-ink hover:bg-surface-secondary disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  transitionTimingFunction: "var(--ease-out-quart)",
                }}
              >
                {portalLoading
                  ? "Opening portal..."
                  : subscription.status === "cancelled"
                    ? "Resubscribe"
                    : "Manage Subscription"}
              </button>
              <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-2)] text-center">
                Manage payment methods, view invoices, or cancel your
                subscription through Stripe&apos;s secure portal.
              </p>
            </div>
          </>
        ) : (
          /* No Subscription — Free Plan */
          <div className="rounded-xl border border-border-subtle bg-surface-primary p-[var(--space-6)] mb-[var(--space-6)]">
            <div className="text-center">
              <h2 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-2)]">
                You&apos;re on the Free Plan
              </h2>
              <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-6)]">
                Upgrade to start generating compliance documents from your
                codebase.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-3)]">
                <button
                  onClick={() => handleCheckout("starter")}
                  disabled={portalLoading}
                  className="flex flex-col items-center p-[var(--space-4)] rounded-xl border border-border-subtle hover:border-brand transition-colors duration-150 disabled:opacity-50"
                >
                  <span className="text-[length:var(--text-lg)] font-bold mb-[var(--space-1)]">
                    $10<span className="text-[length:var(--text-sm)] font-normal text-ink-secondary">/mo</span>
                  </span>
                  <span className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-1)]">Starter</span>
                  <span className="text-[length:var(--text-xs)] text-ink-tertiary">5 generations/mo</span>
                </button>
                <button
                  onClick={() => handleCheckout("pro")}
                  disabled={portalLoading}
                  className="flex flex-col items-center p-[var(--space-4)] rounded-xl border border-brand bg-brand-muted hover:bg-brand-muted/80 transition-colors duration-150 disabled:opacity-50"
                >
                  <span className="text-[length:var(--text-lg)] font-bold mb-[var(--space-1)]">
                    $30<span className="text-[length:var(--text-sm)] font-normal text-ink-secondary">/mo</span>
                  </span>
                  <span className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-1)]">Pro</span>
                  <span className="text-[length:var(--text-xs)] text-ink-tertiary">30 generations/mo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
