-- Create measures_registry_connect_capture — About page connect role call.
-- Source: docs/oar/measures_registry/oar2_fix_about_measures_registry_encounter_v1.meta.md
--
-- Receives: name, organization, email, message
-- Notification pipeline: queued (mirrors assessment capture pattern)
-- No commerce, certification, SEAT, or DAO standing.

CREATE TABLE IF NOT EXISTS public.measures_registry_connect_capture (
  id                 uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text         NOT NULL,
  organization       text         NOT NULL,
  email              text         NOT NULL,
  message            text,
  capture_context    text         NOT NULL DEFAULT 'about_measures_registry_connect',
  notification_state text         NOT NULL DEFAULT 'queued'
    CHECK (notification_state IN ('queued', 'sent', 'failed', 'held')),
  metadata           jsonb        NOT NULL DEFAULT '{}'::jsonb,
  created_at         timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS measures_registry_connect_capture_email_idx
  ON public.measures_registry_connect_capture (email);

CREATE INDEX IF NOT EXISTS measures_registry_connect_capture_created_idx
  ON public.measures_registry_connect_capture (created_at DESC);

-- Row-level security: insert-only public, read requires auth
ALTER TABLE public.measures_registry_connect_capture ENABLE ROW LEVEL SECURITY;

CREATE POLICY "connect_capture_insert_public"
  ON public.measures_registry_connect_capture
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "connect_capture_select_authenticated"
  ON public.measures_registry_connect_capture
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================================
-- VALIDATION
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'measures_registry_connect_capture'
  ) THEN
    RAISE EXCEPTION 'Validation failed: measures_registry_connect_capture table not created';
  END IF;
END $$;
