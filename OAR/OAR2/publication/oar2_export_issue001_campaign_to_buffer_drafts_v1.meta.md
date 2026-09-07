---
document_type: oar2
authority_level: release_gate
document_scope: buffer_draft_export
title: OAR2 - Export Issue 001 Campaign to Buffer Drafts
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Export Issue 001 Campaign to Buffer Drafts

## OBJECTIVE

Export the release-ready Issue 001 Launch Campaign into Buffer as drafts only.

This OAR does not authorize scheduling.

This OAR does not authorize publishing.

This OAR does not activate automated distribution.

It authorizes draft creation/export only.

## OBSERVED

Publication Authority is approved.

Launch-critical derivatives are resolved.

Campaign Release is authorized for Buffer draft export.

Distribution Assets are draft-complete.

Cloudflare / Stripe variables have been updated by the operator.

Stripe checkout is ready for payment and webhook testing will follow separately.

No code push is required for the Stripe env updates.

## ALIGNED

Issue 001 remains canonical.

Campaign remains the governed source for distribution.

Buffer is a downstream projection.

Buffer is not authority.

Facebook Groups remain human-mediated and should not be exported to Buffer.

Stripe testing remains separate.

## ROUTED

### 1. Inspect campaign export readiness

Read live state for:

- measures_publication_campaign
- measures_publication_campaign_asset
- measures_publication_distribution_asset
- measures_publication_derivative_asset
- system_process_registry row for buffer_social_distribution_integration

Confirm:

- campaign status = ready_for_export
- campaign release_state = release_ready
- distribution assets status = draft
- metadata.export_status = ready_for_buffer_draft_export
- launch-critical derivatives approved
- Buffer automation_status remains held

Return mismatches before writing or exporting.

### 2. Identify Buffer-exportable distribution assets

Export only Distribution Assets that are:

- status = draft
- metadata.export_status = ready_for_buffer_draft_export
- buffer_export_ready = true or equivalent metadata
- platform supported by Buffer
- not facebook_groups
- not human-mediated distribution

Do not export:

- Facebook Groups
- unsupported platforms
- Paragraph already-published assets
- website-only features
- anything lacking approved derivative/payload

### 3. Prepare Buffer draft payloads

For each exportable asset, prepare:

- platform/profile target
- post text
- media reference
- alt text
- link destination
- hashtags
- CTA
- source publication_asset_id
- source derivative_asset_id
- campaign_asset_id
- distribution_asset_id

Do not mutate canonical copy to fit Buffer unless recorded as platform formatting.

### 4. Create Buffer drafts

If Buffer integration is configured and authorized for draft creation:

- create Buffer drafts only
- do not schedule
- do not publish
- do not add posting times
- do not activate queues

If Buffer API credentials or profile IDs are missing:

- do not fabricate
- return exact missing configuration
- prepare export file or payload manifest instead

### 5. Record export standing

For each successfully exported Distribution Asset, update metadata only:

- buffer_export_state: draft_created
- buffer_draft_id if returned
- exported_at
- exported_by_actor_class: AI
- approved_by_actor_class: Human
- source_oar2: this OAR2

Do not change status from draft unless explicitly required by existing schema convention.

### 6. Preserve gates

Do not change:

- Buffer automation_status
- campaign release_state
- publication_state
- Stripe state
- renderer code
- website routes
- Paragraph posts
- distribution scheduling state

### 7. Return launch status

Return:

- number exported
- number skipped
- skipped reasons
- Buffer draft links/ids if available
- manual review instructions
- next gate recommendation

## VALIDATION

Return OAR1 with:

- export readiness inspection
- exportable asset list
- skipped asset list
- Buffer draft creation results or blocker
- metadata updates
- gates untouched
- manual QA instructions
- recommended next OAR

## EXPECTED OAR1

OAR/OAR1/publication/oar1_export_issue001_campaign_to_buffer_drafts_v1.meta.md

## STOP CONDITION

Issue 001 campaign exists in Buffer as drafts or as a Buffer-ready export manifest.

Nothing is scheduled.

Nothing is published.

Buffer automation remains held.

Operator reviews drafts before release.
