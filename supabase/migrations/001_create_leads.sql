-- Create leads table for contact form submissions
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  company_size text,
  message text NOT NULL,
  service_type text,
  status text DEFAULT 'new',
  source_page text
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts only (no select/update/delete for anon)
CREATE POLICY leads_anon_insert ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);
