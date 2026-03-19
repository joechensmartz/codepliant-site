import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Custom fetch that strips invalid header values (undefined/null/empty Bearer)
// Fixes: "TypeError: Failed to execute 'fetch' on 'Window': Invalid value"
// See: https://github.com/supabase/supabase-js/issues/1590
const safeFetch: typeof fetch = (input, init) => {
  if (init?.headers) {
    const headers = new Headers(init.headers);
    const auth = headers.get('Authorization');
    if (auth === 'Bearer undefined' || auth === 'Bearer null' || auth === 'Bearer ') {
      headers.delete('Authorization');
    }
    return fetch(input, { ...init, headers });
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
