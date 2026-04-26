-- Seat tonal companion audio as DB media contract.
-- Concursus: marble chamber passage, codexstone, and ME chamberplates.
-- Etonal Phi: Harrumuk passage and gate chamberplates.

with tonal_rows(surface_key, surface_type, label, storage_path, render_order, notes) as (
  values
    ('kumurrah_passage', 'passage', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 40, 'session_25 marble tonal companion seating'),
    ('codexstone', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_01', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_02', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_03', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_04', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_05', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_06', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_07', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_08', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_09', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_10', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_11', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_12', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('me_13', 'me', 'Concursus Cubiculi Companion', 'Concursus_Cubiculi_binaural_216_220_len129s.wav', 30, 'session_25 marble tonal companion seating'),
    ('temple_harrumuk_passage', 'passage', 'Etonal Phi Companion', 'etonal_phi_companion.wav', 20, 'session_25 gate/harrumuk tonal companion verification'),
    ('gate_1_crown_removed', 'gate', 'Etonal Phi Companion', 'etonal_phi_companion.wav', 30, 'session_25 gate tonal companion seating'),
    ('gate_2_lapis_beads', 'gate', 'Etonal Phi Companion', 'etonal_phi_companion.wav', 30, 'session_25 gate tonal companion seating'),
    ('gate_3_lapis_necklace', 'gate', 'Etonal Phi Companion', 'etonal_phi_companion.wav', 30, 'session_25 gate tonal companion seating'),
    ('gate_4_breastplate', 'gate', 'Etonal Phi Companion', 'etonal_phi_companion.wav', 30, 'session_25 gate tonal companion seating'),
    ('gate_5_measuring_rod', 'gate', 'Etonal Phi Companion', 'etonal_phi_companion.wav', 30, 'session_25 gate tonal companion seating'),
    ('gate_6_golden_bracelet', 'gate', 'Etonal Phi Companion', 'etonal_phi_companion.wav', 30, 'session_25 gate tonal companion seating'),
    ('gate_7_robe', 'gate', 'Etonal Phi Companion', 'etonal_phi_companion.wav', 30, 'session_25 gate tonal companion seating')
),
updated as (
  update public.temp_exhibition_media m
  set
    display_context = 'measures_of_inanna',
    surface_type = t.surface_type,
    label = t.label,
    media_type = 'audio',
    bucket_name = 'pre-codex-exhibition',
    render_order = t.render_order,
    is_active = true,
    notes = t.notes
  from tonal_rows t
  where m.surface_key = t.surface_key
    and m.storage_path = t.storage_path
    and m.media_type = 'audio'
  returning m.surface_key, m.storage_path
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
  'measures_of_inanna',
  t.surface_type,
  t.surface_key,
  t.label,
  'audio',
  'pre-codex-exhibition',
  t.storage_path,
  t.render_order,
  true,
  t.notes
from tonal_rows t
where not exists (
  select 1
  from updated u
  where u.surface_key = t.surface_key
    and u.storage_path = t.storage_path
)
and not exists (
  select 1
  from public.temp_exhibition_media m
  where m.surface_key = t.surface_key
    and m.storage_path = t.storage_path
    and m.media_type = 'audio'
);
