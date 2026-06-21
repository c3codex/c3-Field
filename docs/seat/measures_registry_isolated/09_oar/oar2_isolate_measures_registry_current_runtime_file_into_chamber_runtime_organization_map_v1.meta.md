---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Isolate Measures Registry Current Runtime File Into Chamber Runtime Organization Map v1
status: proposed
version: v1
operator: op044
priority: runtime_structure_preflight
source_alignment:
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_confirmed_reduced_seat_upload_manifest_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_upload_content_review_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_review_confirmed_seat_upload_files_and_held_appendix_contents_before_bucket_upload_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
mutation_scope:
  runtime: false
  database: false
  policies: false
  rows: false
  rls: false
  routes: false
  renderer: false
  public_copy: false
  bucket_delete: false
  bucket_upload: false
  bucket_overwrite: false
  bucket_move: false
  local_docs_mutation: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR2 - Isolate Measures Registry Current Runtime File Into Chamber Runtime Organization Map v1

## OBSERVED

The confirmed SEAT upload package is clean for upload, but upload is still unauthorized.

The confirmed package currently includes:

- 56 confirmed upload files
- 0 appendix files included
- 34 appendix files held
- no missing files
- no unreadable files
- no active drift-risk files in confirmed upload set

The bucket placement plan is clean:

- proposed bucket: measures-registry
- proposed root: seat/current/
- target root collision count: 0

However, the current runtime organization still appears to depend on a large registered runtime file:

src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Current concern:

A single giant runtime file is not correct final form.

It increases risk that:

- chamber boundaries collapse
- route authority is hidden in frontend
- style/runtime/content/media logic becomes hard to verify
- Lapis, Obsidian, Marble, and Crystal Seat responsibilities are mixed
- held or future scope can be activated accidentally
- SEAT package appears coherent while runtime organization remains unresolved

Current need:

Audit and isolate the current runtime file into a chamber-based organization map before bucket upload or runtime refactor.

## ALIGNED

This OAR2 is audit and organization mapping only.

It may:

- inspect current runtime files
- inspect imports and related components
- identify runtime surfaces and functions
- classify each runtime section by chamber authority
- identify DB reads and renderer assumptions
- identify hardcoded route/style/content/media risks
- identify held/future/legacy runtime residue
- produce a chamber runtime organization map
- recommend a future refactor sequence
- write OAR1 evidence

It may not:

- move files
- split files
- edit runtime
- edit renderer
- change routes
- mutate DB rows
- mutate policies
- mutate public copy
- upload bucket docs
- submit SEAT folder
- activate launch
- activate payment
- claim SEAT completion
- claim SEAL standing
- claim Registry Standing
- activate Branch standing
- assign c3 Key
- activate DAO participation
- activate c3 backoffice

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Renderer rule:

Frontend must render seated DB state only. Runtime modules may organize rendering, but they may not become authority.

## ROUTED

## 1. Confirm prerequisite upload/content review state

Confirm these files exist:

docs/seat/measures_registry_isolated/09_oar/oar1_review_confirmed_seat_upload_files_and_held_appendix_contents_before_bucket_upload_v1.meta.md
docs/seat/measures_registry_isolated/10_validation/measures_registry_confirmed_reduced_seat_upload_manifest_v1.meta.md
docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_bucket_placement_plan_v1.meta.md

Confirm the OAR1 reports:

- clean_for_upload: true
- upload_authorized_now: false
- no bucket upload
- no runtime mutation
- no renderer mutation
- no public copy mutation

If prerequisite evidence is missing, stop and write blocker OAR1.

## 2. Inspect current Measures Registry runtime source

Inspect read-only:

src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Also inspect nearby files as needed:

src/measures_registry/
src/measures_registry/registered_runtime/
src/app/App.tsx
src/

Do not edit files.

## 3. Identify runtime sections

Break the current runtime file into functional sections.

For each section, report:

section_name:
line_range_or_identifier:
function_or_component_name:
current_behavior:
DB_tables_read:
state_variables_used:
route_or_surface_control:
content_source:
media_source:
style_source:
chamber_authority_candidate:
risk_level:
notes:

## 4. Classify each section by chamber authority

Use this chamber authority map:

Lapis:
  current scope:
    - unDrifted landing
    - relational/social/publication surfaces
    - Paragraph integration display
    - landing page support
    - social/public link routing
  must_not:
    - activate MAP
    - activate payment
    - activate SEAT
    - claim Registry Standing

Obsidian:
  current scope:
    - AI Operations Assessment
    - contact capture
    - assessment questions
    - findings preparation
    - risk factor carrythrough
    - review determination
  must_not:
    - diagnose AI behavior
    - activate payment
    - create SEAT
    - create SEAL

Marble:
  current scope:
    - Measures Assessment Protocol
    - c3 7s presentation
    - involved parties / scope / delivery / payment-of-scope framing
    - MAP review entry
    - payment-of-scope boundary
  must_not:
    - claim payment active unless provider evidence exists
    - claim SEAT completion
    - claim SEAL
    - claim Registry Standing

Crystal_Seat:
  current scope:
    - final confirmation surface
    - registered standing surface only when future authority exists
  must_not:
    - act as encounter
    - act as public launch landing
    - activate current launch by default

Shared_runtime_shell:
  current scope:
    - DB state loading
    - chamber_key resolution
    - renderer state handoff
    - missing state display
  must_not:
    - own content truth
    - own route truth
    - own release truth
    - hardcode chamber-specific copy

Held_or_legacy:
  current scope:
    - old routes
    - deprecated surfaces
    - payment held paths
    - SEAT/SEAL/Registry Standing claims
    - old connect_src
    - old five-question assessment
    - structure_passage
    - reserve_seat
    - cohort_conversion
    - phase_payment
    - measures_phases_reveal

## 5. Identify hardcoded risks

Search for and report hardcoded or frontend-owned truth risks:

- inline public copy that should come from DB/content_records
- inline media URL or media mapping that should come from DB/media_mappings
- inline style values that should come from style_profile/design token
- hardcoded route sequence
- hardcoded release state
- hardcoded button labels
- hardcoded CTA targets
- hardcoded chamber standing
- hardcoded payment/payment-of-scope activation
- direct assumptions about SEAT/SEAL/Registry Standing
- old deprecated route names
- catch-all fallback truth
- frontend-generated content when DB row missing

For each risk, report:

risk_type:
file:
line_or_identifier:
current_value:
should_resolve_from:
chamber:
severity:
recommended_future_action:

Do not fix in this OAR2.

## 6. Identify current DB read dependencies

Report all known DB tables read by current runtime:

- public.measures_registry
- public.measures_encounter_def
- public.measures_media_map
- public.measures_design_token
- public.measures_publication_registry
- public.measures_publication_dispatch
- public.map_commerce_contracts
- any additional tables found

For each:

table:
read_location:
used_for:
chamber_or_shell:
public_policy_dependency:
notes:

## 7. Create chamber runtime organization map

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_chamber_runtime_organization_map_v1.meta.md

Must include:

standing:
  status: runtime_organization_mapped
  mutation_authorized: false
  runtime_mutation_authorized: false
  renderer_mutation_authorized: false

current_runtime_file:
  path:
  standing: monolithic_recovery_container_or_current_runtime
  recommended_final_form: chamber_runtime_modules

runtime_shell:
  proposed_files:
    - src/measures_registry/runtime/MeasuresRegistryRuntimeShell.tsx
    - src/measures_registry/runtime/runtimeRegistry.ts
    - src/measures_registry/runtime/runtimeTypes.ts
  responsibilities:
    - load DB state
    - resolve chamber_key
    - pass state into chamber runtime
    - render missing state honestly

chamber_runtime_modules:
  lapis:
    proposed_files:
    sections:
    DB_dependencies:
    risks:
  obsidian:
    proposed_files:
    sections:
    DB_dependencies:
    risks:
  marble:
    proposed_files:
    sections:
    DB_dependencies:
    risks:
  crystal_seat:
    proposed_files:
    sections:
    DB_dependencies:
    risks:
  held_or_legacy:
    sections:
    risks:

hardcoded_risks:
  rows:

DB_read_dependencies:
  rows:

future_refactor_sequence:
  - step:
    purpose:
    mutation_required:
    blocker:

## 8. Create refactor recommendation file

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_chamber_runtime_refactor_recommendation_v1.meta.md

Must include:

recommended_refactor:
  status: proposed_not_authorized
  do_not_refactor_now_if:
    - SEAT upload must happen first
    - runtime dependency too risky before launch
  refactor_sequence:
    1_runtime_shell_extraction
    2_lapis_module_extraction
    3_obsidian_module_extraction
    4_marble_module_extraction
    5_crystal_seat_hold_module
    6_legacy_route_quarantine
    7_runtime_validation

required_future_oar2:
  title: OAR2 - Refactor Measures Registry Runtime Into Chamber Modules v1

must_preserve:
  - DB-first render
  - no frontend truth
  - no hardcoded route authority
  - no held scope activation
  - current launch behavior unless explicitly changed

## 9. Upload readiness impact

Create a final standing section:

upload_readiness_impact:
  current_SEAT_doc_package_clean_for_upload: true_or_false_from_source_OAR1
  runtime_organization_blocks_doc_upload: true_or_false
  reason:
  recommended_next_oar2_if_upload_can_proceed:
  recommended_next_oar2_if_runtime_blocks_upload:

Default rule:

Runtime organization concern should block upload only if the audit finds active runtime drift that invalidates the confirmed SEAT package.

If it is structural refactor work but not a current package blocker, mark:

runtime_organization_blocks_doc_upload: false
refactor_required_after_upload_or_before_launch_runtime_mutation: true

## 10. No mutation boundary

Do not:

- edit runtime files
- move runtime files
- split components
- change imports
- change routes
- change DB
- change policies
- change public copy
- upload bucket docs
- submit SEAT folder

## VALIDATION RETURN

Return:

- OAR2 path
- chamber runtime organization map path
- refactor recommendation path
- source upload/content OAR1 verified
- current runtime file inspected
- sections identified count
- chamber classifications count
- hardcoded risk count
- DB dependency count
- held/legacy runtime residue count
- upload readiness impact
- runtime_organization_blocks_doc_upload true_or_false
- recommended next OAR2 title
- no runtime mutation confirmation
- no renderer mutation confirmation
- no route mutation confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no public copy mutation confirmation
- no bucket upload confirmation
- OAR1 path

## OAR1 CLOSEOUT

Create OAR1:

docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_file_into_chamber_runtime_organization_map_v1.meta.md

OAR1 must report:

- OAR2 path
- chamber runtime organization map path
- refactor recommendation path
- source upload/content OAR1 verified
- current runtime file inspected
- sections identified count
- chamber classifications count
- hardcoded risk count
- DB dependency count
- held/legacy runtime residue count
- upload readiness impact
- runtime_organization_blocks_doc_upload
- recommended next OAR2 title
- no runtime mutation confirmation
- no renderer mutation confirmation
- no route mutation confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no public copy mutation confirmation
- no bucket upload confirmation

Recommended next OAR2 if runtime organization does not block doc upload:

OAR2 - Upload Confirmed Measures Registry SEAT Folder Package to Supabase Bucket v1

Recommended next OAR2 if runtime organization blocks doc upload:

OAR2 - Resolve Measures Registry Runtime Organization Blockers Before SEAT Upload v1

Recommended later refactor OAR2 if upload can proceed:

OAR2 - Refactor Measures Registry Runtime Into Chamber Modules v1

## CLOSE

This OAR2 isolates the current Measures Registry runtime file into a chamber runtime organization map.

It does not refactor runtime.

It does not upload docs.

It does not mutate source.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody inspects and writes evidence.
