import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\s+/g, '');
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/\s+/g, '');

// Patch global fetch to strip invalid header values
// Supabase SDK sends "Authorization: Bearer undefined" when no session exists
// Ref: https://github.com/supabase/supabase-js/issues/1590
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (init?.headers) {
      try {
        const h = init.headers;
        if (h && typeof h === 'object' && !Array.isArray(h) && !(h instanceof Headers)) {
          const cleaned: Record<string, string> = {};
          for (const [k, v] of Object.entries(h)) {
            if (typeof v !== 'string') continue;
            // Only strip Authorization if it has an invalid Bearer value
            if (k.toLowerCase() === 'authorization' &&
                (v === 'Bearer undefined' || v === 'Bearer null' || v === 'Bearer ' || v === 'undefined')) {
              continue;
            }
            cleaned[k] = v;
          }
          return originalFetch(input, { ...init, headers: cleaned });
        }
      } catch {
        // fall through to original
      }
    }
    return originalFetch(input, init);
  };
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export { supabaseUrl, supabaseKey };
