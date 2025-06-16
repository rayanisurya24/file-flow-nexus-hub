
-- Create a table for storing file metadata
CREATE TABLE public.files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own files
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Create policies for file access
CREATE POLICY "Users can view their own files" 
  ON public.files 
  FOR SELECT 
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can create their own files" 
  ON public.files 
  FOR INSERT 
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own files" 
  ON public.files 
  FOR UPDATE 
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own files" 
  ON public.files 
  FOR DELETE 
  USING (user_id = auth.jwt() ->> 'sub');

-- Create storage bucket for user files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-files', 'user-files', true);

-- Create storage policies for the bucket
CREATE POLICY "Users can upload their own files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.jwt() ->> 'sub');

CREATE POLICY "Users can view their own files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own files" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.jwt() ->> 'sub');
