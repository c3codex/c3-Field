-- Seat Paragraph as a Lapis publication integration process record.
-- OAR2: oar2_seat_paragraph_lapis_integration_process_v1
-- Paragraph publishes. Paragraph does not determine publication standing.
-- process_status=draft, automation_status=held -- not activated.

INSERT INTO system_process_registry (
  process_key,
  process_family,
  title,
  status,
  source_path,
  authority_state,
  process_title,
  process_scope,
  process_status,
  authority_level,
  required_oar_type,
  requires_operator_confirm,
  requires_preflight,
  requires_oar1_closeout,
  metadata
) VALUES (
  'paragraph_publication_integration',
  'publication_integration',
  'Paragraph Publication Integration',
  'seeded',
  'docs/oar/measures_registry/oar2_seat_paragraph_lapis_integration_process_v1.meta.md',
  'file_seeded_db_referenced',
  'Paragraph Publication Integration',
  'lapis',
  'draft',
  'system',
  'oar2',
  true,
  true,
  true,
  '{
    "integration_provider": "paragraph",
    "publication_target": "undrifted",
    "env_binding": "PARAGRAPH_PUBLISH_KEY",
    "function": "external_article_publication",
    "chamber_assignment": "lapis",
    "material_identity": "lapis",
    "system": "measures_registry",
    "is_active": false,
    "automation_status": "held",
    "supported_actions": [
      "publish_article",
      "sync_dispatch_status",
      "verify_publication_state"
    ],
    "prohibited_actions": [
      "determine_publication_standing",
      "mutate_registry_authority",
      "activate_social_registry"
    ],
    "operator": "op044",
    "source_oar2": "docs/oar/measures_registry/oar2_seat_paragraph_lapis_integration_process_v1.meta.md"
  }'::jsonb
);
