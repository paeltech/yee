-- 1. Ensure the blog-assets bucket exists with robust parameters
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

-- 2. Drop the old restrictive policies if they exist
DROP POLICY IF EXISTS "Allow admins to upload/manage blog assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow permissive operations on blog assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access for blog assets" ON storage.objects;

-- 3. Create a more permissive policy that aligns with the project's existing storage patterns
-- Since the project uses a custom auth system, we allow operations on this specific bucket
CREATE POLICY "Allow permissive operations on blog assets"
  ON storage.objects
  FOR ALL
  TO public
  USING (bucket_id = 'blog-assets')
  WITH CHECK (bucket_id = 'blog-assets');
