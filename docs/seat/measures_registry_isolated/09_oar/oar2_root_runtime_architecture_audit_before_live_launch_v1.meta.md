---
document_type: oar2
authority_level: proposed_execution
system_scope: measures_registry_root_runtime_architecture
title: OAR2 - Root Runtime Architecture Audit Before Live Launch v1
status: ready_for_execution
version: v1
operator: op044
process_key: root_runtime_architecture_audit_before_live_launch
source_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_production_verification_after_runtime_boundary_repair_v1.meta.md
---

# OAR2 - Root Runtime Architecture Audit Before Live Launch v1

## OBJECTIVE

Audit why production root still renders the legacy threshold/crystal split-path architecture instead of the approved Lapis landing.

## LIVE QA FINDING

Production no longer grants authority to:

https://measuresregistry.com/?surface=crystal_chamber

However, production root continues to render the same runtime structure:

1. Intro / Continue surface
2. Split-path threshold surface
3. Crystal-style content surfaces

The stale query authority appears repaired.

The approved launch architecture does not appear active.

## EXPECTED

https://measuresregistry.com/

opens directly into the approved Lapis landing experience.

## ACTUAL

https://measuresregistry.com/

renders the legacy threshold/crystal split-path runtime structure.

## REQUIRED AUDIT

Determine:

1. Root component mounted at "/"
2. Root registry key being resolved
3. Runtime source of landing_root
4. Active layout contract
5. Active intro/continue contract
6. Active threshold/split-path contract
7. Why threshold hero remains active
8. Whether root behavior is controlled by:
   - source files
   - registry records
   - fallback defaults
   - routing configuration
9. Exact files involved
10. Exact registry records involved
11. Minimal correction required to activate approved Lapis landing

## VALIDATION

Compare:

EXPECTED:
- Lapis landing

ACTUAL:
- threshold intro
- split-path hero
- crystal-style runtime sequence

Identify where divergence occurs.

## BOUNDARY

Audit only.

Do not:

- mutate DB
- create assessments
- create checkout sessions
- create payments
- trigger webhooks
- create SRC bindings
- create c3 keys
- create permissions
- create certifications
- create DAO standing
- create Codexstone conversion
- create Registry Certification standing

## ACCEPTANCE

Return:

1. Root runtime architecture source
2. Active root component
3. Active root registry record
4. Cause of threshold/crystal architecture remaining active
5. Whether defect exists in:
   - routing
   - registry
   - source
   - fallback logic
   - layout contract
6. Exact files requiring change
7. Exact records requiring change
8. Minimal correction path required to activate approved Lapis landing

## RETURN EVIDENCE

Return:

- URLs tested
- DOM/runtime evidence
- root component evidence
- registry evidence
- file evidence
- correction recommendation
- confirmation no authority standing was created
