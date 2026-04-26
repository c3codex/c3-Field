-- Keep the antechamber image governed by the resolved DB renderer contract.
-- The new antechamber still should be seen as placed artwork, not cropped as a cover background.

update public.measures_encounter_def e
set
  metadata = jsonb_set(
    coalesce(e.metadata, '{}'::jsonb),
    '{renderer}',
    coalesce(e.metadata -> 'renderer', '{}'::jsonb)
      || jsonb_build_object(
        'media_fit', 'contain',
        'media_max_width', '92vw',
        'media_max_height', '78svh'
      ),
    true
  ),
  updated_at = now()
from public.measures_registry r
where e.registry_id = r.id
  and r.registry_key = 'temple_antechamber';
