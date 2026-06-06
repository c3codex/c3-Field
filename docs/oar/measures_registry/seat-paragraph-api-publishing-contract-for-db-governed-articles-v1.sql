do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'measures_publication_registry'
      and column_name = 'metadata'
  ) then
    raise exception 'missing metadata surface: public.measures_publication_registry.metadata';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'measures_publication_dispatch'
      and column_name = 'metadata'
  ) then
    raise exception 'missing metadata surface: public.measures_publication_dispatch.metadata';
  end if;

  if not exists (
    select 1
    from public.measures_publication_registry
    where publication_key = 'undrifted'
  ) then
    raise exception 'missing governed publication row: undrifted';
  end if;

  update public.measures_publication_registry
  set metadata =
    jsonb_set(
      coalesce(metadata, '{}'::jsonb),
      '{paragraph_api_publishing_contract}',
      $json$
      {
        "source_oar2": "docs/oar/measures_registry/oar2_seat_paragraph_api_publishing_contract_for_db_governed_articles_v1.meta.md",
        "contract_key": "paragraph_api_publishing_contract_for_db_governed_articles_v1",
        "contract_status": "seated_api_unavailable_export_only",
        "authority": {
          "codex_db_role": "article_authority",
          "field_role": "schema_and_metadata_structure",
          "measures_role": "registry_governance",
          "paragraph_role": "external_publication_surface_and_api_bridge",
          "src_role": "renderer_only",
          "paragraph_does_not_own_article_truth": true
        },
        "capability": {
          "platform": "paragraph",
          "handle": "@undrifted",
          "publication_key": "undrifted",
          "api_capability_state": "unavailable",
          "api_status": "alpha",
          "rate_limit_state": "acknowledged",
          "api_key_required": "true_for_protected_create_update_publish_endpoints",
          "token_storage": "environment_secret_only",
          "direct_publish_allowed": "false_by_default",
          "sdk_package": "@paragraph-com/sdk",
          "sdk_version_inspected": "1.6.0",
          "missing_capability": "no PARAGRAPH API key available in local environment or repo env files",
          "browser_automation_authorized": false,
          "raw_password_handling_authorized": false
        },
        "article_lifecycle": {
          "states": [
            "drafted_in_db",
            "operator_review_required",
            "approved_for_paragraph_draft",
            "paragraph_draft_created",
            "approved_for_paragraph_publish",
            "published_to_paragraph",
            "failed_paragraph_submission",
            "held_for_revision",
            "deprecated",
            "archived"
          ],
          "default_new_article_state": "drafted_in_db",
          "operator_required_before_draft": true,
          "operator_required_before_publish": true,
          "automatic_publish_from_draft": false,
          "recurring_publishing_automation": false
        },
        "article_authority_fields": [
          "dispatch_key",
          "publication_key",
          "series_key",
          "title",
          "subtitle",
          "slug",
          "excerpt",
          "body_markdown",
          "body_html_if_required",
          "author_display",
          "publish_state",
          "approval_state",
          "canonical_url",
          "paragraph_url",
          "paragraph_post_id",
          "paragraph_draft_id",
          "tags",
          "section",
          "cta_label",
          "cta_url",
          "claim_boundary",
          "social_preview_title",
          "social_preview_description",
          "social_preview_image",
          "created_at",
          "updated_at",
          "published_at"
        ],
        "publishing_workflow": {
          "step_1": "DB article record exists",
          "step_2": "article passes claim-boundary validation",
          "step_3": "operator approves for Paragraph draft",
          "step_4": "Cody creates Paragraph draft through API only if API capability exists",
          "step_5": "Paragraph draft ID is written back to governed DB metadata",
          "step_6": "operator reviews draft",
          "step_7": "operator approves publish",
          "step_8": "Cody publishes through API only if publish endpoint is confirmed",
          "step_9": "Paragraph post ID and URL are written back to governed DB metadata",
          "api_unavailable_path": "generate Paragraph-ready markdown package for operator manual publication"
        },
        "approval_boundary": {
          "approved_for_paragraph_draft": "operator_required",
          "approved_for_paragraph_publish": "operator_required",
          "agent_owned_publishing_decision": false,
          "automatic_publish_authorized": false
        },
        "credential_boundary": {
          "allowed_storage": [
            "local_environment_variable",
            "deployment_secret_manager",
            "future_seated_ci_secret"
          ],
          "prohibited_storage": [
            "GitHub_repo",
            "Supabase_DB",
            "OAR_files",
            "markdown_docs",
            "browser_runtime",
            "logs",
            "screenshots",
            "social_media_metadata"
          ],
          "log_rule": "redact_key_values",
          "raw_passwords": "prohibited"
        },
        "claim_boundary_validation": {
          "required_before_draft": true,
          "required_before_publish": true,
          "prohibited_claims": [
            "pricing claim",
            "payment claim",
            "wallet claim",
            "c3 Key issuance claim",
            "temp c3 Key claim",
            "SRC binding claim",
            "certification claim",
            "conversion claim",
            "DAO claim",
            "permission claim",
            "recognition claim",
            "distribution claim",
            "Marble readiness claim"
          ],
          "allowed_public_posture": [
            "education_only",
            "orientation",
            "dispatch",
            "field note",
            "assessment CTA",
            "governed environment framing"
          ]
        },
        "cta_behavior": {
          "allowed_ctas": [
            "Read the Dispatch",
            "Assess the Environment",
            "Continue to Structural Evaluation",
            "Understand the Environment",
            "View Field Notes"
          ],
          "primary_cta": {
            "label": "Assess the Environment",
            "url": "https://measuresregistry.com/ai-operations-assessment"
          },
          "publication_cta": {
            "label": "Read unDrifted",
            "url": "https://paragraph.com/@undrifted"
          },
          "public_support_line": "Begin where drift becomes visible.",
          "disallowed_internal_phrase": "assessment-first path"
        },
        "existing_articles": [
          {
            "dispatch_key": "undrifted_dispatch_v1",
            "publication_key": "undrifted",
            "title": "unDrifted",
            "paragraph_url": "https://paragraph.com/@undrifted/undrifted",
            "paragraph_publish_state": "published_external_operator_confirmed",
            "paragraph_api_managed": "false_until_matched",
            "db_body_state": "external_url_standing_or_body_pending",
            "db_record_standing": "external_url_standing_only"
          },
          {
            "dispatch_key": "measures_registry_dispatch_v1",
            "publication_key": "undrifted",
            "title": "Measures Registry",
            "paragraph_url": "https://paragraph.com/@undrifted/measures-registry",
            "paragraph_publish_state": "published_external_operator_confirmed",
            "paragraph_api_managed": "false_until_matched",
            "db_body_state": "external_url_standing_or_body_pending",
            "db_record_standing": "external_url_standing_only"
          },
          {
            "dispatch_key": "structural_drift_dispatch_v1",
            "publication_key": "undrifted",
            "series_key": "structural_drift",
            "title": "Structural Drift",
            "paragraph_url": "https://paragraph.com/@undrifted/structural-drift",
            "paragraph_publish_state": "published_external_operator_confirmed",
            "paragraph_api_managed": "false_until_matched",
            "db_body_state": "external_url_standing_or_body_pending",
            "db_record_standing": "dispatch_row_present_url_preserved"
          },
          {
            "dispatch_key": "agents_of_chaos_dispatch_v1",
            "publication_key": "undrifted",
            "series_key": "structural_drift",
            "title": "Agents of Chaos",
            "paragraph_url": "https://paragraph.com/@undrifted/agents-of-chaos",
            "paragraph_publish_state": "published_external_operator_confirmed",
            "paragraph_api_managed": "false_until_matched",
            "db_body_state": "external_url_standing_or_body_pending",
            "db_record_standing": "dispatch_row_present_url_preserved"
          }
        ],
        "sync_direction": {
          "default": "DB_to_Paragraph",
          "allowed_readback": [
            "Paragraph_URL",
            "Paragraph_post_ID",
            "Paragraph_draft_ID",
            "Paragraph_status",
            "published_timestamp",
            "redacted_API_response_summary"
          ],
          "not_allowed_by_default": [
            "Paragraph_body_overwrites_DB_body",
            "Paragraph_title_overwrites_DB_title",
            "Paragraph_tags_overwrite_DB_tags",
            "Paragraph_becomes_article_authority"
          ]
        },
        "api_execution_result": {
          "draft_attempted": false,
          "publish_attempted": false,
          "reason": "missing_api_key_and_missing_operator_approval",
          "paragraph_post_id": null,
          "paragraph_draft_id": null,
          "paragraph_ids_returned": []
        },
        "export_package": {
          "path": "docs/oar/measures_registry/paragraph_api_db_to_paragraph_export_package_v1.md",
          "standing": "generated_api_unavailable_manual_handoff",
          "api_submission_performed": false
        }
      }
      $json$::jsonb,
      true
    ),
      updated_at = now()
  where publication_key = 'undrifted';

  update public.measures_publication_dispatch
  set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
        'paragraph_publish_state', 'published_external_operator_confirmed',
        'paragraph_url', 'https://paragraph.com/@undrifted/agents-of-chaos',
        'article_url', 'https://paragraph.com/@undrifted/agents-of-chaos',
        'paragraph_api_managed', 'false_until_matched',
        'db_body_state', 'external_url_standing_or_body_pending',
        'publish_state', 'published_to_paragraph',
        'approval_state', 'external_operator_confirmed',
        'paragraph_post_id', null,
        'paragraph_draft_id', null,
        'sync_direction', 'DB_to_Paragraph'
      ),
      updated_at = now()
  where dispatch_key = 'agents_of_chaos_dispatch_v1'
    and external_url = 'https://paragraph.com/@undrifted/agents-of-chaos';

  update public.measures_publication_dispatch
  set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
        'paragraph_publish_state', 'published_external_operator_confirmed',
        'paragraph_url', 'https://paragraph.com/@undrifted/structural-drift',
        'article_url', 'https://paragraph.com/@undrifted/structural-drift',
        'paragraph_api_managed', 'false_until_matched',
        'db_body_state', 'external_url_standing_or_body_pending',
        'publish_state', 'published_to_paragraph',
        'approval_state', 'external_operator_confirmed',
        'paragraph_post_id', null,
        'paragraph_draft_id', null,
        'sync_direction', 'DB_to_Paragraph'
      ),
      updated_at = now()
  where dispatch_key = 'structural_drift_dispatch_v1'
    and external_url = 'https://paragraph.com/@undrifted/structural-drift';

  if not exists (
    select 1
    from public.measures_publication_registry
    where publication_key = 'undrifted'
      and metadata #>> '{paragraph_api_publishing_contract,contract_key}' = 'paragraph_api_publishing_contract_for_db_governed_articles_v1'
      and metadata #>> '{paragraph_api_publishing_contract,capability,api_capability_state}' = 'unavailable'
      and metadata #>> '{paragraph_api_publishing_contract,article_lifecycle,default_new_article_state}' = 'drafted_in_db'
      and metadata #>> '{paragraph_api_publishing_contract,approval_boundary,approved_for_paragraph_publish}' = 'operator_required'
      and metadata #>> '{paragraph_api_publishing_contract,sync_direction,default}' = 'DB_to_Paragraph'
      and metadata #>> '{paragraph_api_publishing_contract,authority,paragraph_does_not_own_article_truth}' = 'true'
  ) then
    raise exception 'Paragraph API publishing contract validation failed';
  end if;

  if (
    select jsonb_array_length(metadata #> '{paragraph_api_publishing_contract,existing_articles}')
    from public.measures_publication_registry
    where publication_key = 'undrifted'
  ) <> 4 then
    raise exception 'Paragraph existing article standing count validation failed';
  end if;

  if exists (
    select 1
    from public.measures_publication_dispatch
    where dispatch_key in ('agents_of_chaos_dispatch_v1', 'structural_drift_dispatch_v1')
      and (
        metadata #>> '{paragraph_publish_state}' <> 'published_external_operator_confirmed'
        or metadata #>> '{paragraph_api_managed}' <> 'false_until_matched'
        or metadata #>> '{db_body_state}' <> 'external_url_standing_or_body_pending'
        or coalesce(external_url, '') not like 'https://paragraph.com/@undrifted/%'
      )
  ) then
    raise exception 'Paragraph existing dispatch metadata validation failed';
  end if;
end $$;
