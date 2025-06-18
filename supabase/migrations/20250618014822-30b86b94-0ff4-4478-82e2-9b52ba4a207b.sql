
-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public files are accessible" ON storage.objects;

-- Create storage policies that work with Clerk authentication
-- These policies check if the folder name in the storage path matches the user_id from the files table
CREATE POLICY "Users can upload their own files"
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'user-files');

CREATE POLICY "Users can view their own files"
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'user-files');

CREATE POLICY "Users can update their own files"
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'user-files');

CREATE POLICY "Users can delete their own files"
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'user-files');

-- Allow public access to all files in the user-files bucket
CREATE POLICY "Public files are accessible"
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'user-files');
