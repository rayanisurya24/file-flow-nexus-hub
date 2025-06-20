
-- Create the user-files storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-files', 'user-files', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure the bucket is public for easier access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'user-files';
