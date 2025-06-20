
-- Create the user-files storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-files', 'user-files', true);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop the problematic policies and recreate them correctly
DROP POLICY IF EXISTS "Public files are accessible to everyone" ON storage.objects;
DROP POLICY IF EXISTS "Private files accessible to owners" ON storage.objects;

-- Create a better policy for public file access
CREATE POLICY "Public files are accessible to everyone"
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'user-files' AND 
    EXISTS (
      SELECT 1 FROM public.files 
      WHERE file_url = 'https://lfnivyevvibutwtcupwh.supabase.co/storage/v1/object/public/user-files/' || name
      AND is_public = true
    )
  );

-- Create policy for private files (only accessible to file owners through application logic)
CREATE POLICY "Private files not directly accessible"
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'user-files' AND 
    EXISTS (
      SELECT 1 FROM public.files 
      WHERE file_url = 'https://lfnivyevvibutwtcupwh.supabase.co/storage/v1/object/public/user-files/' || name
      AND is_public = false
    ) AND false -- This ensures private files are never directly accessible
  );
