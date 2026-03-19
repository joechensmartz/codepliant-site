"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, signOut } from "../../lib/auth";
import { supabase } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Order {
  id: string;
  created_at: string;
  package_type: string;
  status: string;
  download_url: string | null;
  document_count: number | null;
  repo_url: string;
}

interface Subscription {
  plan: string;
  status: string;
  credits_used: number;
  credits_total: number;
  current_period_end: string;
}

function isDownloadExpired(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return now - created > 24 * 60 * 60 * 1000;
}

function PlanBadge({ plan, status }: { plan: string; status: string }) {
  const label =
    status === "cancelled"
      ? `${plan.charAt(0).toUpperCase() + plan.slice(1)} (Cancelled)`
      : plan.charAt(0).toUpperCase() + plan.slice(1);

  const colorClass =
    status === "cancelled"
      ? "bg-urgency-muted text-urgency"
      : plan === "pro"
        ? "bg-brand-muted text-brand"
        : plan === "starter"
          ? "bg-brand-muted text-brand"
          : "bg-surface-secondary text-ink-secondary";

  return (
    <span
      className={`inline-flex items-center px-[var(--space-3)] py-1 rounded-full text-[length:var(--text-xs)] font-semibold ${colorClass}`}
    >
      {label}
    </span>
  );
}

function CreditBar({
  used,
  total,
}: {
  used: number;
  total: number;
}) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-[var(--space-1)]">
        <span className="text-[length:var(--text-sm)] text-ink-secondary">
          Credits
        </span>
        <span className="text-[length:var(--text-sm)] font-medium">
          {used} of {total} used
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  completed: "bg-brand-muted text-brand",
  processing: "bg-urgency-muted text-urgency",
  downloading: "bg-urgency-muted text-urgency",
  scanning: "bg-urgency-muted text-urgency",
  generating: "bg-urgency-muted text-urgency",
  packaging: "bg-urgency-muted text-urgency",
  pending: "bg-surface-secondary text-ink-tertiary",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const packageLabels: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await getUser();
        if (!currentUser) {
          router.push("/login");
          return;
        }
        setUser(currentUser);

        // Fetch orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select(
            "id, created_at, package_type, status, download_url, document_count, repo_url"
          )
          .eq("email", currentUser.email)
          .order("created_at", { ascending: false });

        setOrders(ordersData || []);

        // Fetch active subscription
        const { data: subData, error: subError } = await supabase
          .from("subscriptions")
          .select(
            "plan, status, credits_used, credits_total, current_period_end"
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
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[800px] mx-auto">
          <div className="animate-pulse space-y-[var(--space-6)]">
            <div className="h-8 w-48 bg-surface-secondary rounded-lg" />
            <div className="h-4 w-32 bg-surface-secondary rounded" />
            <div className="h-32 bg-surface-secondary rounded-xl" />
            <div className="h-48 bg-surface-secondary rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const currentPlan = subscription?.plan || "free";
  const planStatus = subscription?.status || "none";

  return (
    <section className="py-[var(--space-16)] px-[var(--space-6)]">
      <div className="max-w-[800px] mx-auto">
        {error && (
          <div className="rounded-lg bg-urgency-muted border border-urgency/20 p-[var(--space-3)] text-[length:var(--text-sm)] text-urgency mb-[var(--space-6)]">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-[var(--space-8)]">
          <div>
            <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-1)]">
              Welcome back, {displayName}
            </h1>
            <p className="text-[length:var(--text-sm)] text-ink-secondary">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-[var(--space-4)] py-[var(--space-2)] rounded-lg text-[length:var(--text-sm)] font-medium border border-border-subtle text-ink-secondary hover:text-ink hover:border-border-strong transition-colors duration-150"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            Sign Out
          </button>
        </div>

        {/* Account Overview Card */}
        <div className="rounded-xl border border-border-subtle bg-surface-primary p-[var(--space-6)] mb-[var(--space-6)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--space-4)] mb-[var(--space-6)]">
            <div className="flex items-center gap-[var(--space-3)]">
              <h2 className="text-[length:var(--text-base)] font-semibold">
                Current Plan
              </h2>
              <PlanBadge plan={currentPlan} status={planStatus} />
            </div>
            {subscription?.current_period_end && planStatus === "active" && (
              <p className="text-[length:var(--text-xs)] text-ink-tertiary">
                Renews{" "}
                {new Date(subscription.current_period_end).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                )}
              </p>
            )}
            {subscription?.current_period_end && planStatus === "cancelled" && (
              <p className="text-[length:var(--text-xs)] text-urgency">
                Access until{" "}
                {new Date(subscription.current_period_end).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                )}
              </p>
            )}
          </div>

          {subscription && subscription.credits_total > 0 ? (
            <div className="mb-[var(--space-6)]">
              <CreditBar
                used={subscription.credits_used}
                total={subscription.credits_total}
              />
            </div>
          ) : (
            <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-6)]">
              You&apos;re on the free plan. Upgrade to generate compliance
              documents.
            </p>
          )}

          <div className="flex flex-wrap gap-[var(--space-3)]">
            <a
              href="/generate"
              className="inline-flex items-center px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold bg-brand text-surface-primary hover:bg-brand-hover transition-colors duration-150"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              Generate Documents
            </a>
            <a
              href="/dashboard/billing"
              className="inline-flex items-center px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium border border-border-subtle text-ink-secondary hover:text-ink hover:border-border-strong transition-colors duration-150"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              Manage Billing
            </a>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mb-[var(--space-6)]">
          <h2 className="text-[length:var(--text-lg)] font-semibold mb-[var(--space-4)]">
            Recent Orders
          </h2>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-border-subtle p-[var(--space-8)] text-center">
              <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-4)]">
                No documents generated yet.
              </p>
              <a
                href="/generate"
                className="inline-flex items-center text-[length:var(--text-sm)] font-medium text-brand hover:text-brand-hover transition-colors duration-150"
              >
                Start your first generation &rarr;
              </a>
            </div>
          ) : (
            <div className="space-y-[var(--space-3)]">
              {orders.map((order) => {
                const expired =
                  order.status === "completed" &&
                  isDownloadExpired(order.created_at);
                const canDownload =
                  order.download_url &&
                  order.status === "completed" &&
                  !expired;

                return (
                  <div
                    key={order.id}
                    className="rounded-xl border border-border-subtle p-[var(--space-4)] bg-surface-primary"
                  >
                    <div className="flex items-start justify-between gap-[var(--space-4)]">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-[var(--space-2)] mb-[var(--space-1)]">
                          <span className="font-medium text-[length:var(--text-sm)]">
                            {packageLabels[order.package_type] ||
                              order.package_type}
                          </span>
                          <span
                            className={`inline-flex items-center px-[var(--space-2)] py-0.5 rounded-full text-[length:var(--text-xs)] font-medium capitalize ${
                              statusColors[order.status] ||
                              "bg-surface-secondary text-ink-tertiary"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[length:var(--text-xs)] text-ink-tertiary truncate max-w-[400px]">
                          {order.repo_url}
                        </p>
                        <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-1)]">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                          {order.document_count
                            ? ` \u2014 ${order.document_count} document${order.document_count !== 1 ? "s" : ""}`
                            : ""}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {canDownload && (
                          <a
                            href={order.download_url!}
                            className="inline-flex items-center px-[var(--space-3)] py-[var(--space-2)] rounded-lg text-[length:var(--text-xs)] font-medium bg-brand text-surface-primary hover:bg-brand-hover transition-colors duration-150"
                            style={{
                              transitionTimingFunction:
                                "var(--ease-out-quart)",
                            }}
                          >
                            Download
                          </a>
                        )}
                        {expired && order.status === "completed" && (
                          <span className="inline-flex items-center px-[var(--space-3)] py-[var(--space-2)] rounded-lg text-[length:var(--text-xs)] font-medium text-ink-tertiary bg-surface-secondary">
                            Link expired
                          </span>
                        )}
                        {order.status === "failed" && (
                          <a
                            href="/contact"
                            className="inline-flex items-center px-[var(--space-3)] py-[var(--space-2)] rounded-lg text-[length:var(--text-xs)] font-medium text-urgency bg-urgency-muted hover:opacity-80 transition-opacity duration-150"
                          >
                            Contact Support
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-3)]">
          <a
            href="/dashboard/billing"
            className="rounded-xl border border-border-subtle p-[var(--space-4)] bg-surface-primary hover:border-border-strong transition-colors duration-150 group"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            <h3 className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-1)] group-hover:text-brand transition-colors duration-150">
              Billing &amp; Subscription
            </h3>
            <p className="text-[length:var(--text-xs)] text-ink-tertiary">
              Manage your plan, payment methods, and invoices
            </p>
          </a>
          <a
            href="/dashboard/settings"
            className="rounded-xl border border-border-subtle p-[var(--space-4)] bg-surface-primary hover:border-border-strong transition-colors duration-150 group"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            <h3 className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-1)] group-hover:text-brand transition-colors duration-150">
              Account Settings
            </h3>
            <p className="text-[length:var(--text-xs)] text-ink-tertiary">
              Update your profile and security preferences
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
