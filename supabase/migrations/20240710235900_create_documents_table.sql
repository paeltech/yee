-- 1. Create storage bucket for general documents
INSERT INTO storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
) VALUES (
  'documents', 'documents', false, 52428800, ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'text/plain'
  ]
);

-- 2. Create table for general documents metadata
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 4. Create permissive RLS policy (adjust as needed)
CREATE POLICY "Allow all operations on documents"
  ON public.documents
  FOR ALL
  USING (true);

-- 5. Create storage policy for the new bucket
CREATE POLICY "Allow all operations on documents storage"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'documents');

-- 6. Create trigger for automatic timestamp updates (if you have this function)
-- If you already have a function like public.update_updated_at_column, use it:
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column(); 