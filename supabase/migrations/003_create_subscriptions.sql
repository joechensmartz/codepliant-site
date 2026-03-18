-- Subscriptions table to track user credits
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_email text NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,
  plan text NOT NULL DEFAULT 'starter',
  credits_total integer NOT NULL DEFAULT 5,
  credits_used integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscriptions_anon_insert ON public.subscriptions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY subscriptions_anon_select ON public.subscriptions
  FOR SELECT TO anon USING (true);

CREATE POLICY subscriptions_anon_update ON public.subscriptions
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON public.subscriptions(user_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON public.subscriptions(stripe_subscription_id);
