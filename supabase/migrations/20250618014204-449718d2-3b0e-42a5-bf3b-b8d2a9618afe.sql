
-- Enable RLS on files table if not already enabled
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own files" ON public.files;
DROP POLICY IF EXISTS "Users can create their own files" ON public.files;
DROP POLICY IF EXISTS "Users can update their own files" ON public.files;
DROP POLICY IF EXISTS "Users can delete their own files" ON public.files;
DROP POLICY IF EXISTS "Public files are viewable by everyone" ON public.files;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view their own files" 
  ON public.files 
  FOR SELECT 
  USING (auth.uid()::text = user_id OR is_public = true);

CREATE POLICY "Users can create their own files" 
  ON public.files 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own files" 
  ON public.files 
  FOR UPDATE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own files" 
  ON public.files 
  FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create storage bucket for user files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-files', 'user-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public files are accessible" ON storage.objects;

-- Create storage policies for the user-files bucket
CREATE POLICY "Users can upload their own files"
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files"
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files"
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to files marked as public
CREATE POLICY "Public files are accessible"
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'user-files');
