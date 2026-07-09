---
document_type: oar2
authority_level: release_gate
document_scope: campaign_release_authorization
title: OAR2 - Authorize Issue 001 Campaign Release for Buffer Draft Export
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Authorize Issue 001 Campaign Release for Buffer Draft Export

## OBJECTIVE

Authorize the Issue 001 Launch Campaign to move from governed draft state to release-ready state for Buffer draft export.

This OAR does not schedule posts.

This OAR does not publish posts.

This OAR does not activate Buffer automation.

This OAR authorizes campaign release readiness only.

## OBSERVED

Publication Authority is resolved.

Launch-critical derivatives are resolved.

Distribution payloads are draft-complete.

Remaining pending derivatives are classified as Deferred Production or Documentation and do not block launch.

Campaign remains draft / held.

Buffer integration remains held.

Stripe remains a separate production gate.

## ALIGNED

Issue 001 remains canonical.

Campaign Assets reference approved Derivative Assets.

Distribution Assets remain projections.

Buffer is a distribution tool, not authority.

Human approval remains required before scheduling or publishing.

Facebook Groups remain Human-mediated distribution and should not be forced through Buffer.

## ROUTED

### 1. Inspect current campaign state

Read live state for:

- measures_publication_campaign
- measures_publication_campaign_asset
- measures_publication_distribution_asset
- measures_publication_derivative_asset
- system_process_registry row for buffer_social_distribution_integration

Return mismatches before writing.

### 2. Confirm release readiness

Confirm:

- publication authority approved
- 0 launch-critical derivatives pending
- campaign assets linked to approved or launch-valid derivatives
- distribution assets have draft payloads
- no scheduled or published statuses exist
- Buffer integration remains held

### 3. Authorize campaign release readiness

Update the Issue 001 Launch Campaign:

campaign_key:

undrifted_issue001_launch_campaign_v1

Set:

status: ready_for_export

release_state: release_ready

Metadata should record:

- approved_by_actor_class: Human
- approved_by_actor_key: op044
- source_oar2: this OAR2
- decision_scope: campaign release readiness only
- buffer_scheduling_authorized: false
- publication_authority_dependency: resolved
- stripe_dependency: separate_runtime_gate
- facebook_groups_distribution_mode: human_mediated

### 4. Prepare Buffer export standing

Do not call Buffer.

Do not schedule.

Do not publish.

Mark Distribution Assets as:

export_status: ready_for_buffer_draft_export

only if schema supports this safely.

If schema does not support export_status, record readiness in metadata only.

Keep row status as draft.

### 5. Preserve gates

Do not change:

- Buffer automation_status
- actual Buffer schedules
- publication_state
- Stripe state
- renderer code
- website routes
- Paragraph posts

### 6. Return next gate recommendation

Recommend next OAR:

- Buffer Draft Export
- Stripe Production Verification Path

Do not execute either.

## VALIDATION

Return OAR1 with:

- campaign row before / after
- distribution readiness update
- Buffer automation confirmed held
- publication authority confirmed approved
- derivative standing
- Facebook Groups human-mediated standing
- gates untouched
- blockers, if any

## EXPECTED OAR1

OAR/OAR1/publication/oar1_authorize_issue001_campaign_release_for_buffer_draft_export_v1.meta.md

## STOP CONDITION

Issue 001 Campaign is release-ready.

Buffer remains held.

Distribution remains draft.

Scheduling remains unauthorized.

Publishing remains unauthorized.

Stripe remains separate.

Launch proceeds one governed gate at a time.
