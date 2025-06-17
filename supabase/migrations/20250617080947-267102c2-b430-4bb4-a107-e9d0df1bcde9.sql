
-- Enable Row Level Security on files table
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own files
CREATE POLICY "Users can view own files" ON files
  FOR SELECT USING (auth.uid()::text = user_id);

-- Policy to allow users to view public files
CREATE POLICY "Anyone can view public files" ON files
  FOR SELECT USING (is_public = true);

-- Policy to allow users to insert their own files
CREATE POLICY "Users can insert own files" ON files
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Policy to allow users to update their own files
CREATE POLICY "Users can update own files" ON files
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Policy to allow users to delete their own files
CREATE POLICY "Users can delete own files" ON files
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create storage bucket for user files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-files', 'user-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view public files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-files');

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
