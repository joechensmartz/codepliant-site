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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const currentUser = await getUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      const { data } = await supabase
        .from("orders")
        .select("id, created_at, package_type, status, download_url, document_count, repo_url")
        .eq("email", currentUser.email)
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setLoading(false);
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
        <div className="max-w-[720px] mx-auto text-center text-ink-secondary">
          Loading...
        </div>
      </section>
    );
  }

  const packageLabels: Record<string, string> = {
    single: "Single Document",
    bundle: "Full Bundle",
    branded: "Branded Bundle",
  };

  const statusColors: Record<string, string> = {
    completed: "text-brand",
    processing: "text-urgency",
    pending: "text-ink-tertiary",
  };

  return (
    <section className="py-[var(--space-24)] px-[var(--space-6)]">
      <div className="max-w-[720px] mx-auto">
        <div className="flex items-center justify-between mb-[var(--space-12)]">
          <div>
            <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-1)]">
              Dashboard
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

        {/* CTA */}
        <div className="mb-[var(--space-12)] p-[var(--space-6)] rounded-xl bg-surface-secondary border border-border-subtle text-center">
          <p className="font-display font-semibold text-[length:var(--text-base)] mb-[var(--space-3)]">
            Need compliance documents for another project?
          </p>
          <a
            href="/generate"
            className="inline-flex items-center px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold bg-brand text-surface-primary hover:bg-brand-hover transition-colors duration-150"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            Generate New Documents
          </a>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-[length:var(--text-lg)] font-semibold mb-[var(--space-6)]">
            Order History
          </h2>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-border-subtle p-[var(--space-8)] text-center">
              <p className="text-ink-secondary text-[length:var(--text-sm)]">
                No orders yet. Generate your first compliance documents to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-[var(--space-4)]">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-border-subtle p-[var(--space-4)] bg-surface-primary"
                >
                  <div className="flex items-start justify-between gap-[var(--space-4)]">
                    <div className="min-w-0">
                      <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-1)]">
                        <span className="font-medium text-[length:var(--text-sm)]">
                          {packageLabels[order.package_type] || order.package_type}
                        </span>
                        <span
                          className={`text-[length:var(--text-xs)] font-medium capitalize ${
                            statusColors[order.status] || "text-ink-tertiary"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[length:var(--text-xs)] text-ink-tertiary truncate">
                        {order.repo_url}
                      </p>
                      <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-1)]">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {order.document_count
                          ? ` — ${order.document_count} document${order.document_count !== 1 ? "s" : ""}`
                          : ""}
                      </p>
                    </div>
                    {order.download_url && order.status === "completed" && (
                      <a
                        href={order.download_url}
                        className="shrink-0 px-[var(--space-3)] py-[var(--space-2)] rounded-lg text-[length:var(--text-xs)] font-medium bg-brand text-surface-primary hover:bg-brand-hover transition-colors duration-150"
                        style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
                      >
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
