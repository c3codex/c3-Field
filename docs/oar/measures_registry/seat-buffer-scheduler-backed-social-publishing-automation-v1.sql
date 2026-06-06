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
    from public.measures_publication_registry
    where publication_key = 'undrifted'
      and metadata ? 'social_media_distribution_contract'
  ) then
    raise exception 'missing prerequisite social_media_distribution_contract on undrifted';
  end if;

  update public.measures_publication_registry
  set metadata =
    jsonb_set(
      metadata || jsonb_build_object(
        'social_media_distribution_contract',
        (metadata->'social_media_distribution_contract')
          || jsonb_build_object(
            'contract_status', 'approved_buffer_scheduler_preparation',
            'buffer_scheduler_contract_key', 'buffer_scheduler_backed_social_publishing_automation_v1'
          )
      ),
      '{buffer_scheduler_contract}',
      $json$
      {
        "source_oar2": "docs/oar/measures_registry/oar2_seat_buffer_scheduler_backed_social_publishing_automation_v1.meta.md",
        "contract_key": "buffer_scheduler_backed_social_publishing_automation_v1",
        "contract_status": "approved_buffer_scheduler_preparation",
        "buffer_capability_standing": {
          "buffer_api_available": false,
          "buffer_api_token_present": false,
          "missing_capability": "BUFFER_API token unavailable in environment",
          "standing": "buffer_ready_draft_package_only",
          "browser_automation_authorized": false,
          "raw_password_handling_authorized": false
        },
        "scheduler_standing": {
          "scheduler_platform": "buffer",
          "scheduler_role": "approved_social_publishing_layer",
          "scheduler_status": "active_operator_confirmed",
          "connected_channels": [
            "x:@measures_c3",
            "instagram:measures_registry",
            "linkedin_profile:measures-registry"
          ],
          "channel_count": 3,
          "plan_boundary": "free_three_channel_standing_operator_confirmed",
          "authority": "scheduler_only",
          "direct_platform_credentials": "prohibited",
          "linkedin_surface": "profile_not_company_page"
        },
        "automation_standing": {
          "allowed_states": [
            "prepared",
            "operator_review_required",
            "approved_for_buffer",
            "sent_to_buffer_draft",
            "scheduled_in_buffer",
            "posted_by_buffer",
            "failed_buffer_submission",
            "held_for_revision"
          ],
          "default_state": "operator_review_required",
          "approval_required": true,
          "approval_before_schedule": true,
          "recurring_autoposting_authorized": false
        },
        "approval_rule": {
          "required_before_buffer_submission": true,
          "approval_record_forms": [
            "approve_post_key",
            "approve_batch_key",
            "approve_platform_subset",
            "approve_schedule_window"
          ],
          "default_approval_status": "operator_review_required"
        },
        "buffer_action_boundary": {
          "allowed": [
            "create Buffer draft",
            "create Buffer scheduled post after approval",
            "attach approved media where supported",
            "assign connected channel",
            "assign scheduled date/time",
            "update queue item status",
            "record Buffer post identifier if returned",
            "record failure response if submission fails"
          ],
          "not_authorized": [
            "publish immediately without approval",
            "auto-reply",
            "DM",
            "scrape followers",
            "growth automation",
            "engagement automation",
            "delete posts without operator approval",
            "modify account settings",
            "connect or disconnect channels",
            "change Buffer billing or plan",
            "store Buffer API key in repo or DB metadata"
          ]
        },
        "credential_boundary": {
          "token_storage": "environment_secret_only",
          "repo_storage": "prohibited",
          "db_storage": "prohibited",
          "oar_storage": "prohibited",
          "log_storage": "redacted_only",
          "raw_platform_passwords": "prohibited"
        },
        "platform_copy_rules": {
          "x": {
            "role": "fast thesis distribution",
            "tone": ["sharp", "clear", "field-defining"],
            "hashtags_max": 4,
            "links": ["Paragraph", "Measures Registry"],
            "thread_allowed": true
          },
          "instagram": {
            "role": "media signal surface",
            "preferred_formats": ["reels", "quote cards", "carousel summaries", "article cover cards"],
            "captions": ["short", "brand-forward", "no internal system jargon"],
            "note": "Instagram bio/link behavior may limit clickable URLs"
          },
          "linkedin_profile": {
            "role": "executive / founder-facing distribution",
            "surface_type": "personal_profile",
            "tone": ["executive", "clear", "non-alarmist", "not company-page boilerplate"],
            "avoid": ["we at our company page", "corporate press-release language", "over-formal compliance framing"]
          }
        },
        "batch_001": {
          "batch_key": "buffer_batch_001_undrifted_launch",
          "batch_status": "operator_review_required",
          "buffer_submission_status": "not_submitted_missing_api_capability_and_operator_approval",
          "approval_status": "operator_review_required",
          "schedule_recommendation": {
            "day_1": ["post_001 Instagram", "post_001 X", "post_002 LinkedIn"],
            "day_2": ["post_003 Instagram", "post_003 X"],
            "day_3": ["post_004 Instagram", "post_004 LinkedIn"],
            "day_4": ["post_002 X variant or repost variant"],
            "standing": "recommendation_only_until_operator_approval"
          },
          "queue_items": [
            {
              "post_key": "post_001",
              "batch_key": "buffer_batch_001_undrifted_launch",
              "platforms": ["instagram", "x", "linkedin"],
              "media_key": "left_hero_fracture_motion_video",
              "dispatch_key": "undrifted_dispatch_v1",
              "copy_variant": "unDrifted launch",
              "approval_status": "operator_review_required",
              "buffer_status": "prepared",
              "scheduled_at": null,
              "posted_at": null,
              "buffer_post_id": null,
              "failure_reason": null,
              "claim_boundary_validation": "passed_no_prohibited_claims",
              "operator_notes": null
            },
            {
              "post_key": "post_002",
              "batch_key": "buffer_batch_001_undrifted_launch",
              "platforms": ["linkedin", "x"],
              "media_key": "integrity_governance_intro_video",
              "dispatch_key": "measures_registry_dispatch_v1",
              "copy_variant": "Measures Registry executive summary",
              "approval_status": "operator_review_required",
              "buffer_status": "prepared",
              "scheduled_at": null,
              "posted_at": null,
              "buffer_post_id": null,
              "failure_reason": null,
              "claim_boundary_validation": "passed_no_prohibited_claims",
              "operator_notes": null
            },
            {
              "post_key": "post_003",
              "batch_key": "buffer_batch_001_undrifted_launch",
              "platforms": ["instagram", "x"],
              "media_key": "questions_ungoverned_systems_cannot_answer_video",
              "dispatch_key": "agents_of_chaos_dispatch_v1",
              "copy_variant": "ungoverned systems cannot answer",
              "approval_status": "operator_review_required",
              "buffer_status": "prepared",
              "scheduled_at": null,
              "posted_at": null,
              "buffer_post_id": null,
              "failure_reason": null,
              "claim_boundary_validation": "passed_no_prohibited_claims",
              "operator_notes": null
            },
            {
              "post_key": "post_004",
              "batch_key": "buffer_batch_001_undrifted_launch",
              "platforms": ["instagram", "linkedin"],
              "media_key": "right_measured_hero_motion_graphic_video",
              "route_key": "ai_operations_assessment",
              "copy_variant": "Detect Measure Correct Govern",
              "approval_status": "operator_review_required",
              "buffer_status": "prepared",
              "scheduled_at": null,
              "posted_at": null,
              "buffer_post_id": null,
              "failure_reason": null,
              "claim_boundary_validation": "passed_no_prohibited_claims",
              "operator_notes": null
            }
          ]
        },
        "buffer_status_tracking_shape": [
          "post_key",
          "batch_key",
          "platform",
          "media_key",
          "dispatch_key or route_key",
          "copy_variant",
          "approval_status",
          "buffer_status",
          "scheduled_at",
          "posted_at",
          "buffer_post_id",
          "failure_reason",
          "claim_boundary_validation",
          "operator_notes"
        ],
        "no_claims_validation": {
          "blocked_terms": [
            "Buy",
            "Pay",
            "Mint",
            "Certify",
            "Convert",
            "Claim c3 Key",
            "Join DAO",
            "Get Recognized",
            "Enter Marble",
            "Reserve certification"
          ],
          "blocked_claims": [
            "certification claim",
            "conversion claim",
            "payment claim",
            "wallet claim",
            "c3 Key claim",
            "DAO claim",
            "recognition claim",
            "distribution claim",
            "Marble readiness claim"
          ],
          "batch_001_validation": "passed"
        }
      }
      $json$::jsonb,
      true
    ),
    updated_at = now()
  where publication_key = 'undrifted';

  if not exists (
    select 1
    from public.measures_publication_registry
    where publication_key = 'undrifted'
      and metadata #>> '{social_media_distribution_contract,contract_status}' = 'approved_buffer_scheduler_preparation'
      and metadata #>> '{buffer_scheduler_contract,scheduler_standing,scheduler_platform}' = 'buffer'
      and metadata #>> '{buffer_scheduler_contract,scheduler_standing,linkedin_surface}' = 'profile_not_company_page'
      and metadata #>> '{buffer_scheduler_contract,automation_standing,default_state}' = 'operator_review_required'
      and metadata #>> '{buffer_scheduler_contract,batch_001,batch_key}' = 'buffer_batch_001_undrifted_launch'
      and metadata #>> '{buffer_scheduler_contract,batch_001,buffer_submission_status}' = 'not_submitted_missing_api_capability_and_operator_approval'
  ) then
    raise exception 'Buffer scheduler contract validation failed';
  end if;
end $$;
