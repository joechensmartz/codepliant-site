"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

function SubscribeContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "starter";
  const [status, setStatus] = useState<"loading" | "redirecting" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "INITIAL_SESSION") {
          if (!session?.user?.email) {
            window.location.href = `/login?redirect=/pricing/subscribe?plan=${plan}`;
            return;
          }

          // Call checkout API
          try {
            setStatus("redirecting");
            const res = await fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: session.user.email, plan }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Checkout failed");
            if (data.url) {
              window.location.href = data.url;
            }
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to start checkout");
            setStatus("error");
          }
        }
      }
    );
    return () => { subscription.unsubscribe(); };
  }, [plan]);

  return (
    <section className="py-[var(--space-24)] px-[var(--space-6)]">
      <div className="max-w-[400px] mx-auto text-center">
        {status === "loading" && <p className="text-ink-secondary">Checking account...</p>}
        {status === "redirecting" && (
          <>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-muted mb-[var(--space-4)]">
              <svg className="w-6 h-6 text-brand animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-ink-secondary text-[length:var(--text-sm)]">Redirecting to checkout...</p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-urgency text-[length:var(--text-sm)] mb-[var(--space-4)]">{error}</p>
            <a href="/pricing" className="text-brand hover:text-brand-hover text-[length:var(--text-sm)] font-medium">
              Back to Pricing
            </a>
          </>
        )}
      </div>
    </section>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<section className="py-[var(--space-24)] px-[var(--space-6)]"><div className="max-w-[400px] mx-auto text-center text-ink-secondary">Loading...</div></section>}>
      <SubscribeContent />
    </Suspense>
  );
}
