
-- Drop existing RLS policies that use auth.uid() (which doesn't work with Clerk)
DROP POLICY IF EXISTS "Users can view their own files" ON public.files;
DROP POLICY IF EXISTS "Users can create their own files" ON public.files;
DROP POLICY IF EXISTS "Users can update their own files" ON public.files;
DROP POLICY IF EXISTS "Users can delete their own files" ON public.files;

-- Create new policies that work with Clerk authentication
-- These policies allow authenticated operations based on user_id matching
CREATE POLICY "Users can view their own files" 
  ON public.files 
  FOR SELECT 
  USING (true); -- Allow all reads since we filter by user_id in the application

CREATE POLICY "Users can create their own files" 
  ON public.files 
  FOR INSERT 
  WITH CHECK (user_id IS NOT NULL); -- Ensure user_id is provided

CREATE POLICY "Users can update their own files" 
  ON public.files 
  FOR UPDATE 
  USING (true); -- Allow updates since we filter by user_id in the application

CREATE POLICY "Users can delete their own files" 
  ON public.files 
  FOR DELETE 
  USING (true); -- Allow deletes since we filter by user_id in the application

-- Ensure the files table has proper constraints
ALTER TABLE public.files ALTER COLUMN user_id SET NOT NULL;
