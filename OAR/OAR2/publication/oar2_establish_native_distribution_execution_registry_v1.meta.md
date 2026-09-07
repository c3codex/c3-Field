---
document_type: oar2
authority_level: architecture
document_scope: native_distribution_execution
title: OAR2 - Establish Native Distribution Execution Registry
status: proposed
version: v1
operator: op044
system: measures_registry
executor: Claude
---

# OAR2 - Establish Native Distribution Execution Registry

## OBJECTIVE

Establish a native Distribution Execution Registry so Buffer becomes one executor among many, not campaign authority.

This OAR is registry/schema architecture only.

Do not publish posts.

Do not schedule posts.

Do not call platform APIs.

Do not change existing Buffer drafts.

## OBSERVED

Issue001 campaign distribution has proven the current chain:

Publication Asset

↓

Derivative Asset

↓

Campaign Asset

↓

Distribution Asset

↓

Buffer Draft

↓

Evidence

The current Buffer path works, but credentials are executor-context-bound.

Cody has Buffer MCP credentials.

Claude/repo context does not.

Therefore Buffer is not native authority.

It is a downstream executor.

unDrifted now requires a native distribution model capable of supporting:

- Buffer
- Human/manual distribution
- LinkedIn API
- X API
- Instagram Graph API
- YouTube API
- Paragraph
- Email
- future platform executors

## ALIGNED

Distribution Assets remain canonical.

Executors act on Distribution Assets.

Platforms receive projections.

Evidence returns to registry.

No external platform becomes authority.

Human and AI actor attribution remains explicit.

Optics observes distribution events, not individuals.

## ROUTED

### 1. Inspect existing distribution structures

Inspect current tables:

- measures_publication_distribution_asset
- measures_publication_campaign
- measures_publication_campaign_asset
- measures_publication_derivative_asset
- system_process_registry records for Buffer / Paragraph / email if present

Return existing fields before adding new ones.

### 2. Create Distribution Executor Registry

Create preferred table:

measures_distribution_executor

Minimum fields:

- executor_key
- executor_name
- executor_type
- platform
- role_class
- execution_mode
- credential_reference
- status
- supports_media
- supports_video
- supports_threads
- supports_carousel
- supports_scheduling
- supports_draft
- supports_publish
- metadata
- optics
- created_at
- updated_at

Allowed executor_type values:

- human
- ai
- buffer
- platform_api
- email_service
- manual
- system

Allowed role_class values:

- Human
- AI
- System

Do not store secrets.

credential_reference must be a reference only.

### 3. Create Distribution Channel Registry

Create preferred table:

measures_distribution_channel

Minimum fields:

- channel_key
- executor_key
- platform
- account_name
- channel_identifier
- channel_url
- status
- role_owner
- credential_reference
- metadata
- optics
- created_at
- updated_at

Seed known channels if evidence exists:

- Instagram: measures_registry
- LinkedIn: measures-registry / Stephanie Gaffney
- X: measures_c3

Do not invent YouTube.

If YouTube channel is not confirmed, return held / missing.

### 4. Create Distribution Execution Registry

Create preferred table:

measures_distribution_execution

Minimum fields:

- execution_id
- distribution_asset_id
- executor_key
- channel_key
- execution_status
- execution_mode
- attempt_number
- scheduled_for
- executed_at
- published_at
- platform_post_id
- platform_url
- evidence
- error
- source_oar2
- created_by_actor_class
- created_by_actor_key
- approved_by_actor_class
- approved_by_actor_key
- metadata
- optics
- created_at
- updated_at

Execution statuses should support:

- draft
- prepared
- queued
- scheduled
- published
- failed
- held
- canceled

Do not backfill fake executions.

Only seed execution rows where real Buffer draft evidence already exists.

### 5. Register Buffer as executor

Register Buffer as:

executor_type: buffer

execution_mode: buffer

status: active_or_held based on current process_registry standing

supports:

- draft
- scheduling
- publish
- media
- video
- threads
- carousel where platform permits

Bind to existing Buffer process standing.

### 6. Register Human Manual Executor

Register Human Manual Distribution as valid executor.

Purpose:

- Facebook Groups
- live community discussions
- conferences
- manually posted content
- relationship-based outreach

status:

available

execution_mode:

manual

This executor must not be treated as automation.

### 7. Register future Platform API executors as held

Register held executor records for:

- LinkedIn API
- X API
- Instagram Graph API
- YouTube API
- Paragraph API
- Email / newsletter service

Status:

held

Reason:

API keys / scopes / platform review not yet seated.

Do not implement API calls.

### 8. Link existing Buffer drafts to execution records

For the 5 Buffer drafts already created from Issue001:

Create execution records referencing:

- distribution_asset_id
- Buffer executor
- matching channel
- buffer draft id
- execution_status: draft
- execution_mode: buffer
- evidence: existing Buffer draft id and metadata

Do not mark published.

Do not schedule.

### 9. Optics preparation

Optics observes:

Distribution Asset

↓

Executor

↓

Channel

↓

Execution

↓

Evidence

It must not model individuals as primary objects.

Seed optics metadata accordingly.

### 10. Preserve gates

Do not change:

- existing distribution asset payloads
- campaign release_state
- Buffer draft status
- Buffer automation_status
- publication_state
- Stripe state
- renderer code
- website routes

## VALIDATION

Return OAR1 with:

- existing structure inspection
- new tables created
- executor registry seeded
- channel registry seeded
- execution registry seeded for real Buffer drafts only
- held future API executors
- Facebook Groups manual standing
- YouTube status
- optics standing
- gates untouched
- blockers

## EXPECTED OAR1

OAR/OAR1/publication/oar1_establish_native_distribution_execution_registry_v1.meta.md

## STOP CONDITION

Native Distribution Execution Registry exists.

Buffer is one executor, not authority.

Manual distribution is valid.

Future platform APIs are held.

Real Buffer draft evidence is linked.

No posts are scheduled.

No posts are published.

Distribution is now native.
