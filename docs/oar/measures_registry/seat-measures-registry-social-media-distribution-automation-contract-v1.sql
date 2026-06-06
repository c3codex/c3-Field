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
  set metadata = metadata || $json$
  {
    "social_media_distribution_contract": {
      "source_oar2": "docs/oar/measures_registry/oar2_seat_measures_registry_social_and_media_distribution_automation_contract_v1.meta.md",
      "contract_key": "measures_registry_social_media_distribution_automation_contract_v1",
      "contract_status": "draft_preparation_only",
      "authority": {
        "governing_system": "measures_registry",
        "publication_key": "undrifted",
        "primary_series": "structural_drift",
        "paragraph_role": "source_publication_distribution_surface",
        "social_platform_role": "signal_distribution_surface",
        "r2_role": "media_asset_support_surface"
      },
      "external_accounts": [
        {
          "platform": "x",
          "handle": "@measures_c3",
          "account_role": "measures_registry_social_distribution",
          "status": "active_operator_confirmed",
          "verification_state": "external_verification_pending"
        },
        {
          "platform": "instagram",
          "handle": "measures_registry",
          "account_role": "measures_registry_media_distribution",
          "status": "active_operator_confirmed",
          "verification_state": "external_verification_pending"
        },
        {
          "platform": "linkedin",
          "url": "www.linkedin.com/in/measures-registry",
          "account_role": "measures_registry_executive_distribution",
          "status": "active_operator_confirmed",
          "verification_state": "external_verification_pending"
        },
        {
          "platform": "paragraph",
          "handle": "@undrifted",
          "account_role": "undrifted_publication_distribution",
          "status": "active_operator_confirmed",
          "verification_state": "external_verification_pending"
        }
      ],
      "paragraph_standing": {
        "handle": "@undrifted",
        "publisher": "Measures Registry",
        "api_posting_dependency": false,
        "direct_posting_authorized": false,
        "articles": [
          {
            "dispatch_key": "undrifted_dispatch_v1",
            "title": "unDrifted",
            "paragraph_url": "https://paragraph.com/@undrifted/undrifted",
            "publication_key": "undrifted",
            "section": "Dispatches from Measures Registry",
            "claim_boundary": "education_only",
            "cta_boundary": "no_payment_no_conversion_no_certification",
            "db_article_body_status": "external_url_standing_only"
          },
          {
            "dispatch_key": "measures_registry_dispatch_v1",
            "title": "Measures Registry",
            "paragraph_url": "https://paragraph.com/@undrifted/measures-registry",
            "publication_key": "undrifted",
            "section": "Dispatches from Measures Registry",
            "claim_boundary": "education_only",
            "cta_boundary": "no_payment_no_conversion_no_certification",
            "db_article_body_status": "external_url_standing_only"
          },
          {
            "dispatch_key": "structural_drift_dispatch_v1",
            "title": "Structural Drift",
            "paragraph_url": "https://paragraph.com/@undrifted/structural-drift",
            "publication_key": "undrifted",
            "series_key": "structural_drift",
            "claim_boundary": "education_only",
            "cta_boundary": "no_payment_no_conversion_no_certification",
            "db_article_body_status": "existing_dispatch_url_corrected"
          },
          {
            "dispatch_key": "agents_of_chaos_dispatch_v1",
            "title": "Agents of Chaos",
            "paragraph_url": "https://paragraph.com/@undrifted/agents-of-chaos",
            "publication_key": "undrifted",
            "series_key": "structural_drift",
            "claim_boundary": "education_only",
            "cta_boundary": "no_payment_no_conversion_no_certification",
            "db_article_body_status": "existing_dispatch_url_corrected"
          }
        ]
      },
      "r2_media_assets": [
        {
          "media_key": "measures_structured_environments_video",
          "url": "https://media.c3field.online/measures_structured_enviroments.mp4",
          "media_type": "video",
          "source_surface": "r2",
          "use": ["Measures Registry executive summary", "structured environments", "LinkedIn overview", "Instagram overview"],
          "related_dispatch": "measures_registry_dispatch_v1"
        },
        {
          "media_key": "governance_framework_video",
          "url": "https://media.c3field.online/governance_framework.mp4",
          "media_type": "video",
          "source_surface": "r2",
          "use": ["governed environments", "AI governance framing", "systems conversion explanation"],
          "related_dispatch": "measures_registry_dispatch_v1"
        },
        {
          "media_key": "left_hero_fracture_motion_video",
          "url": "https://media.c3field.online/left_hero_fracture_motion.mp4",
          "media_type": "video",
          "source_surface": "r2",
          "use": ["unDrifted launch", "Structural Drift diagnosis", "collapse is not the default posts"],
          "related_dispatches": ["undrifted_dispatch_v1", "structural_drift_dispatch_v1"]
        },
        {
          "media_key": "integrity_governance_intro_video",
          "url": "https://media.c3field.online/integrity_governance_intro.mp4",
          "media_type": "video",
          "source_surface": "r2",
          "use": ["Measures Registry authority intro", "LinkedIn executive post", "X launch post"],
          "related_dispatch": "measures_registry_dispatch_v1"
        },
        {
          "media_key": "questions_ungoverned_systems_cannot_answer_video",
          "url": "https://media.c3field.online/questions_ungoverned_systems_cannot_answer.mp4",
          "media_type": "video",
          "source_surface": "r2",
          "use": ["Agents of Chaos", "Structural Drift", "ungoverned systems questions"],
          "related_dispatches": ["agents_of_chaos_dispatch_v1", "structural_drift_dispatch_v1"]
        },
        {
          "media_key": "right_measured_hero_motion_graphic_video",
          "url": "https://media.c3field.online/right_measured_hero_motion_graphic.mp4",
          "media_type": "video",
          "source_surface": "r2",
          "use": ["Assess the Environment CTA", "Detect Measure Correct Govern", "campaign loop"],
          "related_route": "https://measuresregistry.com/ai-operations-assessment"
        }
      ],
      "duplicate_media_handling": {
        "duplicate_operator_url": "https://media.c3field.online/measures_structured_enviroments.mp4",
        "canonical_media_key": "measures_structured_environments_video",
        "standing": "single_canonical_entry_unless_distinct_second_file_confirmed"
      },
      "social_cta_boundary": {
        "primary_public_cta": {
          "label": "Assess the Environment",
          "url": "https://measuresregistry.com/ai-operations-assessment"
        },
        "secondary_publication_cta": {
          "label": "Read unDrifted",
          "url": "https://paragraph.com/@undrifted"
        },
        "dispatch_cta": "Read the Dispatch",
        "public_support_line": "Begin where drift becomes visible.",
        "avoid_internal_phrase": "assessment-first path",
        "allowed_cta_labels": ["Assess the Environment", "Read the Dispatch", "Read unDrifted", "Continue to Structural Evaluation", "Understand the Environment", "View Field Notes"],
        "disallowed_cta_labels": ["Buy", "Pay", "Mint", "Certify", "Convert", "Claim c3 Key", "Join DAO", "Get Recognized", "Enter Marble", "Reserve certification"]
      },
      "platform_formatting_rules": {
        "x": {
          "role": "fast thesis distribution",
          "preferred_length": "short_or_thread",
          "tone": ["sharp", "clear", "field-defining"],
          "links": ["Paragraph", "Measures Registry"],
          "hashtags_max": 4,
          "preferred_hashtags": ["#unDrifted", "#StructuralDrift", "#AIOperations", "#AIGovernance"]
        },
        "instagram": {
          "role": "media signal surface",
          "preferred_format": ["reels", "quote cards", "carousel summaries", "article cover cards"],
          "captions": ["short", "brand-forward", "no internal system jargon"],
          "link_behavior": ["bio link or manual CTA", "direct URL where platform allows"]
        },
        "linkedin": {
          "role": "executive distribution",
          "preferred_format": ["short executive posts", "article thesis summaries", "native video where appropriate"],
          "tone": ["institutional", "clear", "non-alarmist", "not compliance cosplay"],
          "cta": ["Read the dispatch", "Assess the Environment"]
        },
        "paragraph": {
          "role": "source publication distribution surface",
          "publication": "unDrifted",
          "publisher": "Measures Registry",
          "function": ["article source", "subscriber archive", "canonical external article surface unless Measures Registry canonical route supersedes"]
        }
      },
      "automation_boundary": {
        "approval_required": true,
        "approval_before_post": true,
        "direct_posting_authorized": false,
        "api_posting_dependency": false,
        "recurring_automation_activated": false,
        "allowed_automation": ["generate post copy", "generate captions", "map articles to media", "prepare posting queue", "create platform-specific drafts", "prepare weekly calendar", "validate no-claims boundary", "validate media-to-dispatch mapping"],
        "not_authorized": ["auto-publish to Paragraph", "auto-publish to X", "auto-publish to Instagram", "auto-publish to LinkedIn", "credential handling", "account control", "auto-replies", "DMs", "engagement automation", "scraping followers", "platform growth automation"]
      },
      "social_copy_packages": [
        {
          "dispatch_key": "undrifted_dispatch_v1",
          "title": "unDrifted",
          "url": "https://paragraph.com/@undrifted/undrifted",
          "section": "Dispatches from Measures Registry",
          "thesis": "Structural drift is detectable. Collapse is not the default.",
          "media_keys": ["left_hero_fracture_motion_video"],
          "x_copy_lines": ["unDrifted is live.", "Structural drift is detectable.", "Collapse is not the default.", "A Measures Registry publication on AI operations, governed environments, and the correction of structural drift.", "Read the dispatch:", "https://paragraph.com/@undrifted/undrifted"],
          "linkedin_copy_lines": ["Introducing unDrifted.", "Structural drift is detectable. Collapse is not the default.", "unDrifted is a Measures Registry publication on AI operations, governed environments, and the correction of structural drift. It documents the seams where systems begin to lose alignment — and why collapse is not inevitable when drift can be detected, measured, corrected, and governed.", "Read the launch dispatch:", "https://paragraph.com/@undrifted/undrifted"],
          "instagram_caption_lines": ["unDrifted is live.", "Structural drift is detectable.", "Collapse is not the default.", "A Measures Registry publication on AI operations, governed environments, and the correction of structural drift."]
        },
        {
          "dispatch_key": "measures_registry_dispatch_v1",
          "title": "Measures Registry",
          "url": "https://paragraph.com/@undrifted/measures-registry",
          "section": "Dispatches from Measures Registry",
          "thesis": "Measures Registry is a systems conversion platform for organizations deploying AI into environments that need clear authority, bounded roles, traceable actions, and governed correction.",
          "media_keys": ["measures_structured_environments_video", "governance_framework_video", "integrity_governance_intro_video"],
          "x_copy_lines": ["The problem is not AI alone.", "The problem is the environment AI is deployed into:", "unclear authority", "role collapse", "hardcoded runtime behavior", "untraceable automation", "review paths that cannot keep pace", "Measures Registry begins there.", "Read:", "https://paragraph.com/@undrifted/measures-registry"],
          "linkedin_copy_lines": ["Measures Registry is a systems conversion platform for organizations deploying AI.", "Rather than only monitoring AI behavior after risk appears, Measures Registry evaluates the environment around AI: authority, roles, runtime logic, review pathways, automation, and traceable action.", "The goal is not more acceleration without structure.", "The goal is a coherent operating environment where AI can act through bounded roles, traceable actions, and accountable chains of responsibility.", "Read the executive summary:", "https://paragraph.com/@undrifted/measures-registry"],
          "instagram_caption_lines": ["AI is not failing in isolation.", "The environment around AI determines whether acceleration becomes coherent — or drifted.", "Measures Registry identifies structural drift in AI operations and routes governed correction."]
        },
        {
          "dispatch_key": "structural_drift_dispatch_v1",
          "title": "Structural Drift",
          "url": "https://paragraph.com/@undrifted/structural-drift",
          "series_key": "structural_drift",
          "thesis": "Structural drift begins when AI operations scale faster than authority, review, role boundaries, and traceability can hold.",
          "media_keys": ["left_hero_fracture_motion_video", "questions_ungoverned_systems_cannot_answer_video"],
          "x_copy_lines": ["Structural drift begins before failure becomes visible.", "The tools work.", "The outputs arrive.", "The automations run.", "Then no one can prove what happened, who approved it, or what system acted.", "Structural drift is detectable.", "Collapse is not the default.", "https://paragraph.com/@undrifted/structural-drift"],
          "linkedin_copy_lines": ["Structural drift begins before failure becomes visible.", "Organizations are accelerating AI adoption into environments that were not designed to govern it: unclear authority, fragmented roles, hardcoded runtime behavior, unmanaged automation, and review pathways that cannot keep pace.", "The issue is not AI alone. It is the system AI operates in.", "Structural drift is detectable. Collapse is not the default.", "Read the Structural Drift dispatch:", "https://paragraph.com/@undrifted/structural-drift"],
          "instagram_caption_lines": ["Structural drift is detectable.", "Collapse is not the default.", "AI operations lose alignment when authority, automation, runtime, and review begin to separate."]
        },
        {
          "dispatch_key": "agents_of_chaos_dispatch_v1",
          "title": "Agents of Chaos",
          "url": "https://paragraph.com/@undrifted/agents-of-chaos",
          "series_key": "structural_drift",
          "thesis": "Unbounded AI agents become operational risk when they act without clear authority, review, traceability, or governed correction paths.",
          "media_keys": ["questions_ungoverned_systems_cannot_answer_video", "governance_framework_video"],
          "x_copy_lines": ["Agents do not create governance by acting.", "When AI agents enter drifted environments, they can accelerate ambiguity:", "unclear authority", "unbounded automation", "missing review", "untraceable action", "The issue is not autonomy alone.", "It is the environment autonomy enters.", "https://paragraph.com/@undrifted/agents-of-chaos"],
          "linkedin_copy_lines": ["AI agents are being introduced into organizations faster than many institutions can define authority, review, and accountability around them.", "Without bounded roles and traceable actions, agents can become accelerants of structural drift.", "The question is not only whether an agent can act.", "The question is whether the environment can govern what the agent does, why it acted, who authorized it, and how the action can be reviewed or corrected.", "Read Agents of Chaos:", "https://paragraph.com/@undrifted/agents-of-chaos"],
          "instagram_caption_lines": ["Agents do not create governance by acting.", "In drifted environments, AI agents can accelerate ambiguity instead of coherence.", "Bounded roles.", "Traceable actions.", "Governed correction."]
        }
      ],
      "media_backed_post_queue": [
        {
          "post_key": "post_001",
          "platforms": ["instagram", "x", "linkedin"],
          "media_key": "left_hero_fracture_motion_video",
          "copy_theme": "unDrifted launch",
          "link": "https://paragraph.com/@undrifted/undrifted",
          "approval_required": true
        },
        {
          "post_key": "post_002",
          "platforms": ["linkedin", "x"],
          "media_key": "integrity_governance_intro_video",
          "copy_theme": "Measures Registry executive summary",
          "link": "https://paragraph.com/@undrifted/measures-registry",
          "approval_required": true
        },
        {
          "post_key": "post_003",
          "platforms": ["instagram", "x"],
          "media_key": "questions_ungoverned_systems_cannot_answer_video",
          "copy_theme": "ungoverned systems cannot answer",
          "link": "https://paragraph.com/@undrifted/agents-of-chaos",
          "approval_required": true
        },
        {
          "post_key": "post_004",
          "platforms": ["instagram", "linkedin"],
          "media_key": "right_measured_hero_motion_graphic_video",
          "copy_theme": "Detect Measure Correct Govern",
          "cta": "Assess the Environment",
          "link": "https://measuresregistry.com/ai-operations-assessment",
          "approval_required": true
        }
      ],
      "cadence_recommendation": {
        "x": "1 to 2 posts per day during launch; threads for major dispatches",
        "linkedin": "2 to 3 posts per week; executive-summary style",
        "instagram": "2 to 3 posts per week; reels, quote cards, carousels",
        "paragraph": "source publication only; publish new dispatches when article standing is ready",
        "cadence_is_recommendation_only": true
      },
      "no_claims_boundary": ["assessment completion", "c3 MAP completion", "payment standing", "wallet standing", "c3 Key issuance", "temp c3 Key issuance", "SRC binding", "Measures Conversion", "Registry Certification", "DAO standing", "permission standing", "recognition standing", "distribution standing", "Marble Chamber readiness"],
      "instagram_signal_note": {
        "reported_signal": "approximately 500 views with no followers",
        "standing": "early_distribution_signal_only",
        "not_proof_of": ["conversion", "recognition", "campaign authority", "performance standing"]
      }
    }
  }
  $json$::jsonb,
      updated_at = now()
  where publication_key = 'undrifted';

  update public.measures_publication_dispatch
  set external_platform = 'paragraph',
      external_slug = 'agents-of-chaos',
      external_url = 'https://paragraph.com/@undrifted/agents-of-chaos',
      article_url = 'https://paragraph.com/@undrifted/agents-of-chaos',
      metadata = metadata || jsonb_build_object(
        'paragraph_url', 'https://paragraph.com/@undrifted/agents-of-chaos',
        'paragraph_handle', '@undrifted',
        'umbrella_publication_key', 'undrifted',
        'publication_key_standing', 'undrifted',
        'series_key', 'structural_drift',
        'claim_boundary', 'education_only',
        'cta_boundary', 'no_payment_no_conversion_no_certification'
      ),
      updated_at = now()
  where dispatch_key = 'agents_of_chaos_dispatch_v1';

  update public.measures_publication_dispatch
  set external_platform = 'paragraph',
      external_slug = 'structural-drift',
      external_url = 'https://paragraph.com/@undrifted/structural-drift',
      article_url = 'https://paragraph.com/@undrifted/structural-drift',
      metadata = metadata || jsonb_build_object(
        'paragraph_url', 'https://paragraph.com/@undrifted/structural-drift',
        'paragraph_handle', '@undrifted',
        'umbrella_publication_key', 'undrifted',
        'publication_key_standing', 'undrifted',
        'series_key', 'structural_drift',
        'claim_boundary', 'education_only',
        'cta_boundary', 'no_payment_no_conversion_no_certification'
      ),
      updated_at = now()
  where dispatch_key = 'structural_drift_dispatch_v1';

  if not exists (
    select 1
    from public.measures_publication_registry
    where publication_key = 'undrifted'
      and metadata #>> '{social_media_distribution_contract,contract_status}' = 'draft_preparation_only'
      and metadata #>> '{social_media_distribution_contract,automation_boundary,approval_required}' = 'true'
      and metadata #>> '{social_media_distribution_contract,automation_boundary,direct_posting_authorized}' = 'false'
  ) then
    raise exception 'social/media distribution contract validation failed';
  end if;

  if exists (
    select 1
    from public.measures_publication_dispatch
    where dispatch_key in ('agents_of_chaos_dispatch_v1', 'structural_drift_dispatch_v1')
      and coalesce(external_url, '') not like 'https://paragraph.com/@undrifted/%'
  ) then
    raise exception 'Paragraph @undrifted URL correction validation failed';
  end if;
end $$;
