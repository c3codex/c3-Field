update public.temp_exhibition_media
set
  storage_path = 'me01_memory.png',
  bucket_name = 'pre-codex-exhibition',
  media_type = 'image',
  is_active = true,
  notes = 'session_25 me_01 memory png seating',
  updated_at = now()
where surface_key = 'me_01'
  and media_type = 'image';

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
  'measures_of_inanna',
  'me',
  'me_01',
  'Memory Chamberplate',
  'image',
  'pre-codex-exhibition',
  'me01_memory.png',
  10,
  true,
  'session_25 me_01 memory png seating'
where not exists (
  select 1
  from public.temp_exhibition_media
  where surface_key = 'me_01'
    and media_type = 'image'
);
