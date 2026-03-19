"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthNav() {
  const [displayLabel, setDisplayLabel] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Account";
        setDisplayLabel(name);
      }
      setLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          "Account";
        setDisplayLabel(name);
      } else {
        setDisplayLabel(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!loaded) return null;

  const linkStyle = { transitionTimingFunction: "var(--ease-out-quart)" } as const;

  if (displayLabel) {
    return (
      <a
        href="/dashboard"
        className="hover:text-ink transition-colors duration-150 truncate max-w-[140px]"
        style={linkStyle}
        title={displayLabel}
      >
        {displayLabel}
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
