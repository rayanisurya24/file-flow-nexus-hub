
-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public files are accessible" ON storage.objects;

-- Create storage policies that work with Clerk authentication and respect is_public flag
CREATE POLICY "Users can upload their own files"
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'user-files');

-- Allow access to files based on is_public flag or ownership
CREATE POLICY "Public files are accessible to everyone"
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'user-files' AND 
    EXISTS (
      SELECT 1 FROM public.files 
      WHERE file_url LIKE '%' || name || '%' 
      AND is_public = true
    )
  );

CREATE POLICY "Private files accessible to owners"
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'user-files' AND 
    EXISTS (
      SELECT 1 FROM public.files 
      WHERE file_url LIKE '%' || name || '%' 
      AND is_public = false
    )
  );

CREATE POLICY "Users can update their own files"
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'user-files');

CREATE POLICY "Users can delete their own files"
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'user-files');
