-- Drop the old restrictive policy that relied on auth.uid()
DROP POLICY IF EXISTS "Allow admins full access to all posts" ON public.blog_posts;

-- Create a more permissive policy for management
-- Since the project uses a custom auth system and handles role-based access at the application layer,
-- we allow all operations. This matches the pattern used for the 'documents' table.
CREATE POLICY "Allow all management operations on blog_posts"
  ON public.blog_posts
  FOR ALL
  USING (true)
  WITH CHECK (true);
