do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'measures_registry'
      and column_name = 'metadata'
  ) then
    raise exception 'missing metadata surface: public.measures_registry.metadata';
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

  update public.measures_registry
  set release_state = 'released',
      access_state = 'visible',
      is_active = true,
      metadata = coalesce(metadata, '{}'::jsonb) || $json$
      {
        "route_role": "primary_publication_landing",
        "landing_contract_key": "undrifted_publication_landing_v1",
        "style_contract_key": "undrifted_publication_style_v1",
        "publication_key": "undrifted",
        "public_authority": true,
        "claims_boundary": "education_only",
        "route_authority": "registry",
        "frontend_role": "renderer",
        "runtime_surface": "structural_drift_dispatches",
        "cta_surface": "ai_operations_assessment_landing",
        "secondary_cta_surface": "ai_operations_assessment_landing",
        "landing_design_contract": {
          "source_oar2": "docs/oar/measures_registry/oar2_seat_public_landing_page_design_contracts_for_undrifted_and_ai_operations_assessment_v1.meta.md",
          "landing_contract_key": "undrifted_publication_landing_v1",
          "style_contract_key": "undrifted_publication_style_v1",
          "publication_key": "undrifted",
          "public_authority": true,
          "claims_boundary": "education_only",
          "hero": {
            "brand": "unDrifted",
            "canonical_line": [
              "Structural drift is detectable.",
              "Collapse is not the default."
            ],
            "parent_authority": "Measures Registry",
            "function": "dispatches on AI operations, governed environments, and structural correction",
            "description": "Dispatches from Measures Registry on structural drift, AI operations, and governed environments.",
            "primary_cta_label": "Read the Dispatches",
            "secondary_cta_label": "Assess the Environment",
            "secondary_cta_route": "/ai-operations-assessment"
          },
          "principles": [
            "Detect drift",
            "Measure condition",
            "Correct authority path",
            "Govern continuity"
          ],
          "sections": [
            "hero",
            "principles",
            "dispatches",
            "about",
            "cta_footer"
          ],
          "about": {
            "title": "Measures Registry relationship",
            "body": "unDrifted is a Measures Registry publication for observing structural drift and documenting governed correction paths."
          },
          "cta_footer": {
            "label": "Assess the Environment",
            "subline": "Begin where drift becomes visible.",
            "target_route": "/ai-operations-assessment"
          },
          "dispatch_card_contract": {
            "source": "measures_publication_dispatch",
            "required_fields": [
              "dispatch_key",
              "title",
              "subtitle_or_excerpt",
              "tags",
              "article_url_or_internal_route",
              "publish_state",
              "media_key",
              "claim_boundary",
              "cta_label"
            ],
            "allowed_cta_labels": [
              "Read the Dispatch",
              "Assess the Environment",
              "Continue to unDrifted"
            ],
            "disallowed_cta_labels": [
              "Buy",
              "Pay",
              "Mint",
              "Certify",
              "Convert",
              "Claim c3 Key",
              "Join DAO",
              "Get Recognized",
              "Enter Marble"
            ]
          },
          "media_contract": {
            "allowed_sources": [
              "governed_publication_brand_assets",
              "governed_r2_media",
              "governed_supabase_media_mappings"
            ],
            "invented_asset_paths_allowed": false,
            "missing_asset_behavior": "designed_missing_state"
          }
        },
        "seo": {
          "title": "unDrifted | Measures Registry",
          "description": "Structural drift is detectable. Collapse is not the default.",
          "canonical_url": "https://measuresregistry.com/undrifted",
          "og_type": "website",
          "og_title": "unDrifted | Measures Registry",
          "og_description": "Structural drift is detectable. Collapse is not the default.",
          "og_url": "https://measuresregistry.com/undrifted",
          "og_image": "https://measuresregistry.com/og.jpeg",
          "twitter_card": "summary_large_image",
          "twitter_title": "unDrifted | Measures Registry",
          "twitter_description": "Structural drift is detectable. Collapse is not the default.",
          "twitter_image": "https://measuresregistry.com/og.jpeg"
        }
      }
      $json$::jsonb,
      updated_at = now()
  where registry_key = 'undrifted_publication_landing';

  update public.measures_registry
  set display_title = 'AI Operations Assessment | Measures Registry',
      release_state = 'released',
      access_state = 'visible',
      is_active = true,
      metadata = coalesce(metadata, '{}'::jsonb) || $json$
      {
        "route_role": "public_assessment_landing",
        "landing_contract_key": "ai_operations_assessment_landing_v1",
        "style_contract_key": "assessment_public_landing_v1",
        "claims_boundary": "assessment_entry_only",
        "route_authority": "registry",
        "frontend_role": "renderer",
        "runtime_surface": "ai_operations_assessment_landing",
        "runtime_target": "eval_passage",
        "cta_surface": "eval_passage",
        "landing_design_contract": {
          "source_oar2": "docs/oar/measures_registry/oar2_seat_public_landing_page_design_contracts_for_undrifted_and_ai_operations_assessment_v1.meta.md",
          "landing_contract_key": "ai_operations_assessment_landing_v1",
          "style_contract_key": "assessment_public_landing_v1",
          "claims_boundary": "assessment_entry_only",
          "runtime_target": "eval_passage",
          "hero": {
            "title": "AI Operations Assessment",
            "supporting_line": "Identify structural drift before collapse becomes visible.",
            "public_explanation": "Measures Registry evaluates the environment around AI operations: authority, roles, automation, runtime surfaces, review pathways, and traceable action."
          },
          "what_it_evaluates": {
            "items": [
              "authority clarity",
              "role boundaries",
              "runtime behavior",
              "automation exposure",
              "review pathway standing",
              "traceability"
            ]
          },
          "what_it_is_not": {
            "items": [
              { "label": "not certification", "claim": "certification", "allowed": false },
              { "label": "not conversion", "claim": "conversion", "allowed": false },
              { "label": "not c3 MAP completion", "claim": "c3_map_completion", "allowed": false },
              { "label": "not payment", "claim": "payment", "allowed": false },
              { "label": "not c3 Key issuance", "claim": "c3_key_issuance", "allowed": false }
            ]
          },
          "cta": {
            "label": "Assess the Environment",
            "target_surface": "eval_passage",
            "subline": "Routes into the registered encounter flow without bypassing gates.",
            "direct_scoring_shortcut_allowed": false,
            "contact_gate_bypass_allowed": false,
            "result_gate_bypass_allowed": false
          }
        },
        "seo": {
          "title": "AI Operations Assessment | Measures Registry",
          "description": "Identify structural drift in AI operations and begin where drift becomes visible.",
          "canonical_url": "https://measuresregistry.com/ai-operations-assessment",
          "og_type": "website",
          "og_title": "AI Operations Assessment | Measures Registry",
          "og_description": "Identify structural drift in AI operations and begin where drift becomes visible.",
          "og_url": "https://measuresregistry.com/ai-operations-assessment",
          "og_image": "https://measuresregistry.com/og.jpeg",
          "twitter_card": "summary_large_image",
          "twitter_title": "AI Operations Assessment | Measures Registry",
          "twitter_description": "Identify structural drift in AI operations and begin where drift becomes visible.",
          "twitter_image": "https://measuresregistry.com/og.jpeg"
        }
      }
      $json$::jsonb,
      updated_at = now()
  where registry_key = 'ai_operations_assessment_landing';

  update public.measures_registry
  set metadata = coalesce(metadata, '{}'::jsonb) || $json$
      {
        "route_role": "legacy_inbound_route",
        "replacement_route": "/undrifted",
        "legacy_inbound_supported": true,
        "public_authority": false,
        "publication_key": "undrifted",
        "diagnostic_tag": "structural_drift",
        "route_authority": "registry",
        "frontend_role": "renderer",
        "runtime_surface": "structural_drift_dispatches",
        "cta_surface": null,
        "secondary_cta_surface": null,
        "legacy_behavior": "render_legacy_note_under_undrifted_branding",
        "seo": {
          "title": "Structural Drift | unDrifted",
          "description": "Structural Drift is now a diagnostic concept within unDrifted, the Measures Registry publication on structural drift and governed AI operations.",
          "canonical_url": "https://measuresregistry.com/undrifted",
          "og_type": "website",
          "og_title": "Structural Drift | unDrifted",
          "og_description": "Continue to unDrifted, the Measures Registry publication where Structural Drift is documented as a diagnostic concept.",
          "og_url": "https://measuresregistry.com/structural-drift",
          "og_image": "https://measuresregistry.com/og.jpeg",
          "twitter_card": "summary_large_image",
          "twitter_title": "Structural Drift | unDrifted",
          "twitter_description": "Continue to unDrifted, the Measures Registry publication where Structural Drift is documented as a diagnostic concept.",
          "twitter_image": "https://measuresregistry.com/og.jpeg"
        }
      }
      $json$::jsonb,
      updated_at = now()
  where registry_key = 'structural_drift_landing';

  update public.measures_publication_dispatch
  set metadata = coalesce(metadata, '{}'::jsonb) || $json$
      {
        "claim_boundary": "education_only",
        "landing_card_contract": {
          "source_oar2": "docs/oar/measures_registry/oar2_seat_public_landing_page_design_contracts_for_undrifted_and_ai_operations_assessment_v1.meta.md",
          "cta_label": "Read the Dispatch",
          "payment_claim_allowed": false,
          "certification_claim_allowed": false,
          "conversion_claim_allowed": false,
          "c3_key_claim_allowed": false,
          "dao_claim_allowed": false,
          "marble_readiness_claim_allowed": false
        }
      }
      $json$::jsonb,
      updated_at = now()
  where publication_key = 'undrifted'
    and status = 'published';

  if not exists (
    select 1
    from public.measures_registry
    where registry_key = 'undrifted_publication_landing'
      and metadata #>> '{landing_contract_key}' = 'undrifted_publication_landing_v1'
      and metadata #>> '{style_contract_key}' = 'undrifted_publication_style_v1'
      and metadata #>> '{landing_design_contract,hero,brand}' = 'unDrifted'
      and metadata #>> '{landing_design_contract,hero,parent_authority}' = 'Measures Registry'
      and metadata #>> '{landing_design_contract,cta_footer,label}' = 'Assess the Environment'
      and metadata #>> '{seo,canonical_url}' = 'https://measuresregistry.com/undrifted'
  ) then
    raise exception '/undrifted landing design contract validation failed';
  end if;

  if not exists (
    select 1
    from public.measures_registry
    where registry_key = 'ai_operations_assessment_landing'
      and metadata #>> '{landing_contract_key}' = 'ai_operations_assessment_landing_v1'
      and metadata #>> '{style_contract_key}' = 'assessment_public_landing_v1'
      and metadata #>> '{runtime_surface}' = 'ai_operations_assessment_landing'
      and metadata #>> '{cta_surface}' = 'eval_passage'
      and metadata #>> '{landing_design_contract,hero,title}' = 'AI Operations Assessment'
      and metadata #>> '{landing_design_contract,cta,direct_scoring_shortcut_allowed}' = 'false'
      and metadata #>> '{seo,description}' = 'Identify structural drift in AI operations and begin where drift becomes visible.'
  ) then
    raise exception '/ai-operations-assessment landing design contract validation failed';
  end if;

  if exists (
    select 1
    from public.measures_registry
    where registry_key = 'structural_drift_landing'
      and coalesce(metadata #>> '{public_authority}', 'true') <> 'false'
  ) then
    raise exception '/structural-drift legacy-only validation failed';
  end if;
end $$;
