
-- Add organization_id and is_public columns to the files table
ALTER TABLE public.files 
ADD COLUMN organization_id TEXT,
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- Update RLS policies to handle organization-based access
DROP POLICY IF EXISTS "Users can view their own files" ON public.files;
DROP POLICY IF EXISTS "Users can create their own files" ON public.files;
DROP POLICY IF EXISTS "Users can update their own files" ON public.files;
DROP POLICY IF EXISTS "Users can delete their own files" ON public.files;

-- Create new policies for organization-aware file access
CREATE POLICY "Users can view files in their organization or personal files" 
  ON public.files 
  FOR SELECT 
  USING (
    (organization_id IS NULL AND user_id = auth.jwt() ->> 'sub') OR
    (organization_id = auth.jwt() ->> 'org_id') OR
    is_public = true
  );

CREATE POLICY "Users can create files in their organization or personal space" 
  ON public.files 
  FOR INSERT 
  WITH CHECK (
    (organization_id IS NULL AND user_id = auth.jwt() ->> 'sub') OR
    (organization_id = auth.jwt() ->> 'org_id' AND user_id = auth.jwt() ->> 'sub')
  );

CREATE POLICY "Users can update files in their organization or personal files" 
  ON public.files 
  FOR UPDATE 
  USING (
    (organization_id IS NULL AND user_id = auth.jwt() ->> 'sub') OR
    (organization_id = auth.jwt() ->> 'org_id')
  );

CREATE POLICY "Users can delete files in their organization or personal files" 
  ON public.files 
  FOR DELETE 
  USING (
    (organization_id IS NULL AND user_id = auth.jwt() ->> 'sub') OR
    (organization_id = auth.jwt() ->> 'org_id')
  );

-- Update storage policies to handle organization folders
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

CREATE POLICY "Users can upload to their organization or personal folder" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'user-files' AND (
      (storage.foldername(name))[1] = auth.jwt() ->> 'sub' OR
      (storage.foldername(name))[1] = auth.jwt() ->> 'org_id'
    )
  );

CREATE POLICY "Users can view files in their organization or personal folder" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'user-files' AND (
      (storage.foldername(name))[1] = auth.jwt() ->> 'sub' OR
      (storage.foldername(name))[1] = auth.jwt() ->> 'org_id'
    )
  );

CREATE POLICY "Users can delete files in their organization or personal folder" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'user-files' AND (
      (storage.foldername(name))[1] = auth.jwt() ->> 'sub' OR
      (storage.foldername(name))[1] = auth.jwt() ->> 'org_id'
    )
  );
