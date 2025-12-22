-- Add photo_url column to members table
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add photo_url column to groups table
ALTER TABLE public.groups 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create storage bucket for photos
INSERT INTO storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
) VALUES (
  'photos', 'photos', true, 10485760, ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy for photos bucket
CREATE POLICY IF NOT EXISTS "Allow authenticated users to upload photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY IF NOT EXISTS "Allow public to view photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'photos');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to update photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'photos');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'photos');

