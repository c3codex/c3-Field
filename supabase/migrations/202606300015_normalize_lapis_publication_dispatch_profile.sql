-- Normalize publication_dispatch surface metadata profile from deprecated lapis_publication_surface term.
-- Source OAR2: docs/oar/measures_registry/oar2_normalize_lapis_chamber_publication_integrations_v1.meta.md
--
-- lapis_publication_surface is deprecated from active Measures Registry vocabulary.
-- publication_dispatch surface retains standing=audit_trace. Profile updated to canonical term.
-- metadata.profile has zero runtime consumers (confirmed OAR1 normalize_measures_registry_terms).
-- This is a vocabulary alignment — no runtime behavior change.

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata
  || '{"profile": "lapis_chamber_publication_dispatch"}'::jsonb
WHERE surface_key = 'publication_dispatch';
