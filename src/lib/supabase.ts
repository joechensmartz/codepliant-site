import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Custom fetch that strips invalid header values (undefined/null/empty Bearer)
// Fixes: "TypeError: Failed to execute 'fetch' on 'Window': Invalid value"
// See: https://github.com/supabase/supabase-js/issues/1590
const safeFetch: typeof fetch = (input, init) => {
  if (init?.headers) {
    // Clean invalid header values before constructing Headers
    const raw = init.headers as Record<string, string>;
    const cleaned: Record<string, string> = {};
    const entries = typeof raw.entries === 'function'
      ? Array.from((raw as Headers).entries())
      : Object.entries(raw);
    for (const [key, val] of entries) {
      if (val !== undefined && val !== null && val !== 'undefined' && val !== 'null'
          && val !== 'Bearer undefined' && val !== 'Bearer null' && val !== 'Bearer ') {
        cleaned[key] = String(val);
      }
    }
    return fetch(input, { ...init, headers: cleaned });
  }
  return fetch(input, init);
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: safeFetch,
  },
});

export { supabaseUrl, supabaseKey };
