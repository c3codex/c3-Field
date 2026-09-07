-- Expand measures_media_map RLS SELECT policy for anon role.
-- Prior policy restricted to 4 roles; Lapis publication roles were blocked.
-- New policy: allow all active rows regardless of role.
DROP POLICY IF EXISTS "public reads active registry landing media" ON measures_media_map;

CREATE POLICY "anon_read_active_media"
  ON measures_media_map
  FOR SELECT
  TO anon
  USING (is_active = true);
