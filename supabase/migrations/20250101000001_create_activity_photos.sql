-- Create junction table for activity photos
CREATE TABLE IF NOT EXISTS public.activity_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id INTEGER NOT NULL REFERENCES public.group_activities(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  uploaded_by TEXT REFERENCES public.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.activity_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY IF NOT EXISTS "Allow authenticated users to view activity photos"
  ON public.activity_photos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert activity photos"
  ON public.activity_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete activity photos"
  ON public.activity_photos
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_photos_activity_id ON public.activity_photos(activity_id);

