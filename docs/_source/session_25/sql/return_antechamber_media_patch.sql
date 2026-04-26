-- Seat the return antechamber image now present in storage.

with media_row as (
  select
    'measures_of_inanna'::text as display_context,
    'antechamber'::text as surface_type,
    'return_antechamber'::text as surface_key,
    'Return Antechamber'::text as label,
    'image'::text as media_type,
    'pre-codex-exhibition'::text as bucket_name,
    'return_antechamber.png'::text as storage_path,
    10::integer as render_order,
    true::boolean as is_active,
    'session_25 return antechamber image seating'::text as notes
),
updated as (
  update public.temp_exhibition_media m
  set
    display_context = media_row.display_context,
    surface_type = media_row.surface_type,
    label = media_row.label,
    media_type = media_row.media_type,
    bucket_name = media_row.bucket_name,
    storage_path = media_row.storage_path,
    render_order = media_row.render_order,
    is_active = media_row.is_active,
    notes = media_row.notes
  from media_row
  where m.surface_key = media_row.surface_key
    and m.media_type = media_row.media_type
  returning m.id
)
insert into public.temp_exhibition_media (
  display_context,
  surface_type,
  surface_key,
  label,
  media_type,
  bucket_name,
  storage_path,
  render_order,
  is_active,
  notes
)
select
  display_context,
  surface_type,
  surface_key,
  label,
  media_type,
  bucket_name,
  storage_path,
  render_order,
  is_active,
  notes
from media_row
where not exists (select 1 from updated);

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
  and r.registry_key = 'return_antechamber';
