"use client";

import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    // Handle OAuth callback: extract tokens from URL hash and set session
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        supabase.auth
          .setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(() => {
            window.location.href = "/dashboard";
          })
          .catch(() => {
            window.location.href = "/login";
          });
        return;
      }
    }

    // Also handle code exchange (PKCE flow)
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(() => {
          window.location.href = "/dashboard";
        })
        .catch(() => {
          window.location.href = "/login";
        });
      return;
    }

    // No tokens or code found
    window.location.href = "/login";
  }, []);

  return (
    <section className="py-[var(--space-24)] px-[var(--space-6)]">
      <div className="max-w-[400px] mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-muted mb-[var(--space-4)]">
          <svg className="w-6 h-6 text-brand animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-ink-secondary text-[length:var(--text-sm)]">Signing you in...</p>
      </div>
    </section>
  );
}
