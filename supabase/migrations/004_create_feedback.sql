CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  category text NOT NULL,
  message text NOT NULL,
  page_url text,
  user_agent text
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY feedback_anon_insert ON public.feedback
  FOR INSERT TO anon WITH CHECK (true);
