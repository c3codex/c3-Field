---
document_type: oar2
authority_level: proposed_execution
system_scope: measures_registry_root_lapis_landing_activation
title: OAR2 - Activate Lapis Landing as Production Root v1
status: ready_for_execution
version: v1
operator: op044
process_key: activate_lapis_landing_as_production_root
source_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_root_runtime_architecture_audit_before_live_launch_v1.meta.md
---

# OAR2 - Activate Lapis Landing as Production Root v1

## OBJECTIVE

Activate the approved Lapis landing as the production root experience and remove the legacy intro/threshold fallback from "/".

## SOURCE AUDIT STANDING

Previous OAR1 confirmed:

- stale query authority is repaired
- no stale runtime is leaking through ?surface=crystal_chamber
- "/" is not present in ROUTE_UNIT_KEYS
- root registry governance is bypassed
- initialSurface() hard-falls back to "intro"
- RegisteredIntro renders the old threshold/crystal split-path structure
- approved Lapis landing component exists as RegisteredPathChoice
- RegisteredPathChoice uses data-material-family="lapis"
- RegisteredPathChoice uses data-layout-contract="transition_choice"

## REQUIRED WORK

1. Confirm RegisteredPathChoice is the approved Lapis landing component.

2. Update root fallback behavior so "/" opens with the approved Lapis landing instead of RegisteredIntro.

3. Minimal approved correction:

Change in:

src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

from:

return "intro"

to:

return "path_choice"

4. Do not re-enable raw surface query authority.

5. Do not restore old crystal renderer.

6. Do not hard-seat public content in source files.

7. Preserve DB-first rendering boundary.

## REQUIRED VALIDATION

Validate:

https://measuresregistry.com/

Expected:

- root opens with approved Lapis landing
- old intro/continue surface does not render as root
- old threshold/crystal split-path structure does not render as root
- RegisteredPathChoice is active at root
- data-material-family="lapis"
- data-layout-contract="transition_choice"

Validate:

https://measuresregistry.com/?surface=crystal_chamber

Expected:

- raw surface query remains ignored
- old crystal renderer remains unreachable
- route resolves to approved root behavior

## BOUNDARY

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

- "/" opens with approved Lapis landing
- legacy intro is no longer root fallback
- threshold/crystal split-path structure is no longer root entry
- ?surface=crystal_chamber remains blocked/ignored
- old crystal renderer remains unreachable
- DB-first boundary preserved
- build passes
- deploy/push completed if authorized
- return formatted OAR1 closeout

## RETURN EVIDENCE

Return:

1. Files changed
2. Exact line changed
3. Build result
4. Production deployment status
5. Root URL QA evidence
6. Crystal query QA evidence
7. Confirmation no DB mutation or authority standing was created
