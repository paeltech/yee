-- Ensure photos bucket exists for activity photos and other photo uploads
INSERT INTO storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
) VALUES (
  'photos', 'photos', true, 10485760, ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ]
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

-- Ensure storage policies exist for photos bucket
-- Drop existing policies if they exist, then create new ones
-- Using ALL/TO public because the project uses a custom session management system
DROP POLICY IF EXISTS "Allow authenticated users to upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to upload photos" ON storage.objects;
CREATE POLICY "Allow public to upload photos"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'photos');

DROP POLICY IF EXISTS "Allow public to view photos" ON storage.objects;
CREATE POLICY "Allow public to view photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "Allow authenticated users to update photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to update photos" ON storage.objects;
CREATE POLICY "Allow public to update photos"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "Allow authenticated users to delete photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to delete photos" ON storage.objects;
CREATE POLICY "Allow public to delete photos"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'photos');

