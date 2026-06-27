-- Grant anon INSERT on measures_iis_eval_gate1_capture.
--
-- This table predates the migration chain and has no anon INSERT policy.
-- The frontend uses the anon key to insert assessment contact captures.
-- Without this policy, all public assessment submissions are blocked by RLS.
--
-- connect_capture already has TO public INSERT via 202606240006.
-- This migration brings assessment capture to the same standing.

ALTER TABLE public.measures_iis_eval_gate1_capture ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "assessment_capture_insert_public"
  ON public.measures_iis_eval_gate1_capture;

CREATE POLICY "assessment_capture_insert_public"
  ON public.measures_iis_eval_gate1_capture
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Validation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'measures_iis_eval_gate1_capture'
      AND policyname = 'assessment_capture_insert_public'
      AND cmd        = 'INSERT'
  ) THEN
    RAISE EXCEPTION 'Validation failed: assessment_capture_insert_public policy not created';
  END IF;
END $$;
