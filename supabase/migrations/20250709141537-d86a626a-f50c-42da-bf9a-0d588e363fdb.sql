-- Create storage bucket for group documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('group-documents', 'group-documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'text/plain']);

-- Create table for group documents metadata
CREATE TABLE public.group_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.group_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for group documents
CREATE POLICY "Allow all operations on group_documents" 
ON public.group_documents 
FOR ALL 
USING (true);

-- Create storage policies for group documents
CREATE POLICY "Allow all operations on group documents storage" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'group-documents');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_group_documents_updated_at
BEFORE UPDATE ON public.group_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();