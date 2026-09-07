---
document_type: oar2
authority_level: working
document_scope: lapis_integration_process
title: OAR2 - Seat Paragraph Lapis Integration Process
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Seat Paragraph Lapis Integration Process

## GOVERNANCE STANDING

Governance belongs to the body.
Agency belongs to the individual.
Integrity belongs to both.

This OAR governs the Lapis publication integration body.
It does not govern the operator.

Purpose is to formally seat Paragraph as a Lapis publication integration process.

Paragraph publishes.

Paragraph does not determine publication standing.

Measures Registry remains authoritative.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

Verified from prior OAR1:

- PARAGRAPH_PUBLISH_KEY exists in .env.local.
- Paragraph publication target is undrifted.
- Six published unDrifted dispatches are registered.
- No Paragraph automation route exists.
- No Paragraph process record exists.
- No integration schema exists beyond system_process_registry.
- Paragraph integration status is missing_required and hold_for_operator_review.

## ALIGNED

Native order:

Codex holds.
Systems align.
Measures determine.
c3 Field arranges.
Optics prove.

Lapis Chamber arranges publication, relationship, and integration standing.

Paragraph is an external publication integration.

Paragraph may publish or sync external article state only after explicit operator-governed activation.

Paragraph may not determine registry standing.

Social registry function remains planned, not active.

## ROUTED

Create a held process record for Paragraph in system_process_registry if schema supports it.

Do not implement automation.

Do not publish content.

Do not change dispatch records.

Do not expose secrets.

Do not activate the process.

## REQUIRED ACTIONS

### 1. Create process record

Create process record:

process_key:
- paragraph_publication_integration

Required standing:

- process_family: publication_integration
- process_scope: lapis
- authority_level: system
- required_oar_type: oar2
- chamber_assignment: lapis
- material_identity: lapis
- system: measures_registry
- process_status: draft
- automation_status: held
- requires_operator_confirm: true
- requires_preflight: true
- requires_oar1_closeout: true

### 2. Metadata

Add metadata:

integration_provider:
- paragraph

publication_target:
- undrifted

env_binding:
- PARAGRAPH_PUBLISH_KEY

function:
- external_article_publication

supported_actions:
- publish_article
- sync_dispatch_status
- verify_publication_state

prohibited_actions:
- determine_publication_standing
- mutate_registry_authority
- activate_social_registry

### 3. Automation architecture discovery

Return recommendation only.

Do not implement.

Return evidence for:

- recommended route location
- recommended process location
- recommended evidence capture
- recommended dispatch sync strategy
- required env bindings by name only

## PRESERVE

Do not mutate:

- measures_publication_registry
- measures_publication_dispatch
- structural_drift_dispatch_v1
- fables_and_myths_dispatch_v1
- agents_with_keys_dispatch_v1
- agents_of_chaos_dispatch_v1
- measures_registry_dispatch_v1
- undrifted_dispatch_v1

Do not expose secret values.

Do not publish anything.

## VALIDATION

Return OAR1 evidence showing:

1. paragraph_publication_integration exists in system_process_registry.
2. process_scope is lapis.
3. process_status is draft.
4. automation_status is held.
5. PARAGRAPH_PUBLISH_KEY is referenced by name only.
6. No secret values exposed.
7. No publication occurred.
8. No dispatch records changed.
9. No renderer code changed.
10. No frontend inference added.
11. Paragraph is seated as Lapis integration only.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- Paragraph publishes content
- dispatch records are mutated
- secret values are exposed
- Paragraph is treated as authority
- social registry is activated
- new schema is invented without OAR
- automation is implemented
- process is activated
- operator is governed instead of the work body

## CLOSE

Seat Paragraph integration standing.

Do not activate.

Do not publish.

Nothing is invented.
