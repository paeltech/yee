-- 1. Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES public.users(id),
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing blog_posts policies to start fresh
DROP POLICY IF EXISTS "Allow public read-only access for published posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admins full access to all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow all management operations on blog_posts" ON public.blog_posts;

-- 4. Create correct blog_posts policies
-- Read access for published posts
CREATE POLICY "Allow public read-only access for published posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- Universal access for the application (matches project's custom auth pattern)
CREATE POLICY "Allow all management operations on blog_posts"
  ON public.blog_posts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Ensure the blog-assets bucket exists with robust parameters
INSERT INTO storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
) VALUES (
  'blog-assets', 'blog-assets', true, 10485760, ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

-- 6. Drop existing storage policies
DROP POLICY IF EXISTS "Allow public read access for blog assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to upload/manage blog assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow permissive operations on blog assets" ON storage.objects;

-- 7. Create correct storage policies for blog assets
CREATE POLICY "Allow permissive operations on blog assets"
  ON storage.objects
  FOR ALL
  TO public
  USING (bucket_id = 'blog-assets')
  WITH CHECK (bucket_id = 'blog-assets');

-- 8. Ensure updated_at trigger exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_blog_posts_updated_at') THEN
        CREATE TRIGGER update_blog_posts_updated_at
        BEFORE UPDATE ON public.blog_posts
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;
