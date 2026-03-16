-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  message text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add meta columns to blog_posts
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text;

-- RLS for contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public can insert contact submissions
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions
  FOR INSERT TO public WITH CHECK (true);

-- Authenticated users can read all contact submissions
CREATE POLICY "Authenticated can read contacts" ON public.contact_submissions
  FOR SELECT TO authenticated USING (true);

-- Authenticated users can update contact submissions
CREATE POLICY "Authenticated can update contacts" ON public.contact_submissions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Authenticated users can delete contact submissions
CREATE POLICY "Authenticated can delete contacts" ON public.contact_submissions
  FOR DELETE TO authenticated USING (true);

-- Blog posts: authenticated users can do full CRUD
CREATE POLICY "Authenticated can insert posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete posts" ON public.blog_posts
  FOR DELETE TO authenticated USING (true);

-- Authenticated can also read all posts (including unpublished)
CREATE POLICY "Authenticated can read all posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (true);