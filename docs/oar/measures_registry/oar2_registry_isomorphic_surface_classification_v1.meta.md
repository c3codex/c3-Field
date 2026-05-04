---
document_type: oar2
title: OAR2 Registry Isomorphic Surface Classification
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: registry_isomorphic_surface_classification_v1

OBSERVED

measures_encounter_def.surface_type currently carries
Measures of Inanna vocabulary:

- threshold
- chamberplate
- passage
- phase_map
- aspect

Registry encounters are being forced into these categories,
creating semantic pressure and misalignment.

ALIGNED

- Codex remains authority.
- No schema-breaking changes.
- No removal of existing surface_type values.
- No slugs.
- Isomorphism must be preserved:
  same function → different state expression.
- Renderer contract resolves from metadata.renderer.
- surface_type becomes non-authoritative for Registry semantics.

ROUTED

1. Extend encounter metadata:

Add:

- function_layer (string)
- state_expression (string)

Stored in:
measures_encounter_def.metadata

2. Definitions

function_layer = invariant role across systems

Allowed values:

- entry
- choice
- encounter
- transition
- intake
- orientation
- resolution

state_expression = system-specific manifestation

3. Registry mapping

Apply to existing Registry encounters:

landing_intro_video:

function_layer: entry
state_expression: public_intro_video
renderer: measures_registry_intro

landing_path_choice:

function_layer: choice
state_expression: public_binary_path_choice
renderer: measures_registry_path_choice

understand_failure:

function_layer: encounter
state_expression: public_system_encounter
renderer: generic_media_encounter

build_coherence / reserve_seat:

function_layer: intake
state_expression: src_intake_entry
renderer: src_intake_surface

4. Renderer rule

Frontend must resolve renderer from:

metadata.renderer

NOT from:

surface_type

5. Compatibility rule

surface_type remains unchanged for:

- Measures of Inanna
- existing data integrity

Registry must NOT rely on surface_type
for semantic meaning moving forward.

6. Enforcement

If metadata.function_layer or state_expression is missing:

- report missing classification
- do not infer
- do not fallback to surface_type

CODY ROLE

Cody may:

- update metadata for Registry encounters
- ensure renderer uses metadata.renderer only
- add runtime checks for classification presence
- return validation query
- write OAR1 closeout

Cody may NOT:

- alter surface_type values
- introduce new schema columns
- invent classifications beyond this OAR2
- fallback to surface_type as authority

VALIDATION

Return:

select
  encounter_key,
  metadata->>'function_layer' as function_layer,
  metadata->>'state_expression' as state_expression,
  metadata->>'renderer' as renderer
from measures_encounter_def
where registry_key = 'measures_registry';

SUCCESS CONDITION

- All Registry encounters carry function_layer + state_expression
- Renderer selection resolves from metadata.renderer only
- No semantic dependency on surface_type for Registry
- Inanna surfaces remain unaffected
