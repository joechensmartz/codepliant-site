"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthNav() {
  const [email, setEmail] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!loaded) return null;

  const linkStyle = { transitionTimingFunction: "var(--ease-out-quart)" } as const;

  if (email) {
    return (
      <a
        href="/dashboard"
        className="hover:text-ink transition-colors duration-150 truncate max-w-[140px]"
        style={linkStyle}
        title={email}
      >
        Dashboard
      </a>
    );
  }

  return (
    <a
      href="/login"
      className="hover:text-ink transition-colors duration-150"
      style={linkStyle}
    >
      Sign In
    </a>
  );
}
