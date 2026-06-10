-- OAR2: docs/oar/c3_field/oar2_extend_field_origin_origin_type_check_to_include_c3_field_v1.meta.md

-- ── EXTEND field_origin_origin_type_check ────────────────────────────────────
-- Preserve existing values: named_individual, institution_in_service, operator, system
-- Add: c3_field
ALTER TABLE public.field_origin
  DROP CONSTRAINT field_origin_origin_type_check;

ALTER TABLE public.field_origin
  ADD CONSTRAINT field_origin_origin_type_check
    CHECK (origin_type IN (
      'named_individual',
      'institution_in_service',
      'operator',
      'system',
      'c3_field'
    ));

-- ── UPDATE c3 Field anchor row ────────────────────────────────────────────────
UPDATE public.field_origin
SET
  origin_type = 'c3_field',
  metadata    = metadata || jsonb_build_object(
    'origin_type_corrected',        true,
    'origin_type_correction_oar2',  'docs/oar/c3_field/oar2_extend_field_origin_origin_type_check_to_include_c3_field_v1.meta.md',
    'standing_note',                'c3 Field is now formalized as first-class origin type.'
  ),
  updated_at  = now()
WHERE origin_ref = 'c3_field_v1';
