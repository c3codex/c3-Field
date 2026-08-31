insert into public.media_storage_registry (
  storage_key,
  provider,
  bucket,
  status,
  scope,
  metadata
)
values
  (
    'lapis_publication_chamber_source_asset_v1',
    'supabase_storage',
    'measures-registry',
    'active',
    'lapis_publication_chamber_source_custody',
    '{
      "source_oar2": "CanCom/codex/oar2_implement_lapis_publication_chamber_operator_environment_codex_005",
      "source_object_path": "lapis_antechamber_ops_surface.webp",
      "source_sha256": "64EC28A4BA640D1181D85780C40D4BB9D8373868D21B82CDB2D037505E683FC2",
      "source_size_bytes": 218326,
      "source_mime_type": "image/webp",
      "source_dimensions": {"width": 1536, "height": 1024},
      "custody_standing": "chamber_held_governed_source",
      "frontend_hardcode_allowed": false
    }'::jsonb
  ),
  (
    'lapis_publication_chamber_live_derivative_v1',
    'supabase_storage',
    'measures-registry',
    'active',
    'undrifted_publication_chamber_runtime_media',
    '{
      "source_oar2": "CanCom/codex/oar2_implement_lapis_publication_chamber_operator_environment_codex_005",
      "source_storage_key": "lapis_publication_chamber_source_asset_v1",
      "derivative_object_path": "undrifted/publication-chamber/lapis_antechamber_ops_surface_web_v1.webp",
      "derivative_sha256": "64EC28A4BA640D1181D85780C40D4BB9D8373868D21B82CDB2D037505E683FC2",
      "derivative_size_bytes": 218326,
      "derivative_mime_type": "image/webp",
      "derivative_dimensions": {"width": 1536, "height": 1024},
      "derivative_relation": "byte_identical_live_web_derivative_from_governed_source",
      "frontend_hardcode_allowed": false
    }'::jsonb
  )
on conflict (storage_key) do update
set
  provider = excluded.provider,
  bucket = excluded.bucket,
  status = excluded.status,
  scope = excluded.scope,
  metadata = excluded.metadata,
  updated_at = now();

do $$
begin
  update public.measures_media_map
  set
    registry_key = 'measures_registry_root',
    encounter_key = 'publish_undrifted_passage',
    storage_bucket = 'measures-registry',
    storage_path = 'undrifted/publication-chamber/lapis_antechamber_ops_surface_web_v1.webp',
    mime_type = 'image/webp',
    sort_order = 45,
    is_active = true,
    metadata = '{
      "source_oar2": "CanCom/codex/oar2_implement_lapis_publication_chamber_operator_environment_codex_005",
      "storage_provider": "supabase_storage",
      "surface_role": "publish_undrifted_operator_chamber",
      "runtime_use": "/publish-undrifted six-station operator chamber environment",
      "source_storage_key": "lapis_publication_chamber_source_asset_v1",
      "derivative_storage_key": "lapis_publication_chamber_live_derivative_v1",
      "source_sha256": "64EC28A4BA640D1181D85780C40D4BB9D8373868D21B82CDB2D037505E683FC2",
      "derivative_sha256": "64EC28A4BA640D1181D85780C40D4BB9D8373868D21B82CDB2D037505E683FC2",
      "frontend_hardcode_allowed": false
    }'::jsonb,
    updated_at = now()
  where campaign_key = 'measures_registry_root_authority_v1'
    and media_role = 'lapis_publication_chamber_operator_environment';

  if not found then
    insert into public.measures_media_map (
      registry_key,
      encounter_key,
      campaign_key,
      media_role,
      storage_bucket,
      storage_path,
      mime_type,
      sort_order,
      is_active,
      metadata
    )
    values (
      'measures_registry_root',
      'publish_undrifted_passage',
      'measures_registry_root_authority_v1',
      'lapis_publication_chamber_operator_environment',
      'measures-registry',
      'undrifted/publication-chamber/lapis_antechamber_ops_surface_web_v1.webp',
      'image/webp',
      45,
      true,
      '{
        "source_oar2": "CanCom/codex/oar2_implement_lapis_publication_chamber_operator_environment_codex_005",
        "storage_provider": "supabase_storage",
        "surface_role": "publish_undrifted_operator_chamber",
        "runtime_use": "/publish-undrifted six-station operator chamber environment",
        "source_storage_key": "lapis_publication_chamber_source_asset_v1",
        "derivative_storage_key": "lapis_publication_chamber_live_derivative_v1",
        "source_sha256": "64EC28A4BA640D1181D85780C40D4BB9D8373868D21B82CDB2D037505E683FC2",
        "derivative_sha256": "64EC28A4BA640D1181D85780C40D4BB9D8373868D21B82CDB2D037505E683FC2",
        "frontend_hardcode_allowed": false
      }'::jsonb
    );
  end if;
end $$;
