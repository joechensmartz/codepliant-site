CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  stripe_session_id text UNIQUE NOT NULL,
  email text NOT NULL,
  company_name text,
  repo_url text NOT NULL,
  package_type text NOT NULL,
  amount_cents integer NOT NULL,
  status text DEFAULT 'pending',
  download_url text,
  document_count integer,
  s3_key text,
  completed_at timestamptz
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_anon_insert ON public.orders
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY orders_anon_select ON public.orders
  FOR SELECT TO anon
  USING (true);
