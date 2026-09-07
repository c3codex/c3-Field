---
oar_id: oar2_expand_dev_shell_transfer_package_into_measures_registry_full_site_working_folder_v1
oar_type: OAR2
title: Expand Dev Shell Transfer Package into Measures Registry Full Site Working Folder v1
system_scope: measures_registry
status: proposed
requires_oar1: true
source_manifest: docs/working/measures_registry_site_review_v1/dev_shell_transfer_manifest_v1.meta.md
mutation_scope:
  working_folder_created: true
  docs_copied_or_referenced: true
  runtime: false
  database: false
  routes: false
  renderer: false
  public_copy_rewrite: false
  public_metadata: false
  docs_deleted: false
  source_docs_moved: false
  payment_state: false
  map_delivery_state: false
  seat_state: false
  social_dispatch_state: false
  publication_state: false
  integration_state: false
  c3_backoffice_state: false
  launch_authority_created: false
---

# OAR2 — Expand Dev Shell Transfer Package into Measures Registry Full Site Working Folder v1

## EXECUTION RULE

Do not execute from chat text.

Save this OAR2 first.

Execute only from the saved OAR2.

Return OAR1 beside it.

This is ONE transfer surface.

## OBJECTIVE

Expand the existing Measures Registry dev shell transfer package into one full Measures Registry site working folder.

The working folder must gather review copies and manifests for:

- current dev shell
- boundary records
- full doc set
- chamber contents
- encounter surfaces
- content packets
- media mappings
- renderer contracts
- canopy campaigns
- circuit contracts
- integrations
- deprecated trace
- SEAT requirements hold
- operator review conflicts

This is a working review package only.

Placement in this package does not register, seat, publish, activate, transfer ownership, or create authority.

## PRIMARY SOURCE PACKAGE

Use:

docs/working/measures_registry_site_review_v1/dev_shell_transfer_manifest_v1.meta.md

If not found, locate by filename:

dev_shell_transfer_manifest_v1.meta.md

Use the actual located path as source_manifest in OAR1.

Preserve this rule:

This folder contains review copies only. Source paths remain authoritative in their existing locations. Placement in this package does not register, seat, publish, activate, or transfer ownership of any artifact.

## REQUIRED SOURCE RECORDS

Include these records where present:

- docs_measures_registry_dev_shell_carryout_recovery_matrix_v1.meta.md
- docs_measures_registry_dev_shell_isolation_boundary_v1.meta.md
- docs_measures_registry_launch_shell_recovery_audit_v1.meta.md
- oar1_isolate_measures_registry_dev_shell_from_recovered_carryout_matrix_with_upstream_downstream_trace_boundary_v1.meta.md
- carryout_recovery_oar1_v1.meta.md

If any are missing from the source package, locate by filename and reference/copy as review record.

## WORKING ROOT

Use or create:

docs/working/measures_registry_site_review_v1/

Do not create a competing root.

## REQUIRED FOLDER STRUCTURE

Ensure:

docs/working/measures_registry_site_review_v1/
  00_index/
  01_current_dev_shell/
  02_boundary_records/
  03_doc_set/
  04_chambers/
  05_encounter_surfaces/
  06_content_packets/
  07_media_maps/
  08_renderer_contracts/
  09_canopy_campaigns/
  10_circuit_contracts/
  11_integrations/
  12_deprecated_trace/
  13_structured_asset_requirements/
  14_operator_review/

Existing current_dev_shell/, operator_review_conflicts/, or boundary_records/ folders from the prior transfer may remain.

Do not duplicate content unnecessarily.

Add numbered manifests that point to existing review copies or copy files into the numbered folders while preserving source-path metadata.

## 00 INDEX

Create or update:

docs/working/measures_registry_site_review_v1/00_index/site_working_folder_index_v1.meta.md

Required frontmatter:

artifact_id: measures_registry_site_working_folder_index_v1
artifact_type: working_site_review_index
system_scope: measures_registry
status: populated_review_copies_only
source_manifest: dev_shell_transfer_manifest_v1.meta.md
authority_created: false
source_files_moved: false
source_files_deleted: false
source_files_rewritten: false
runtime_mutated: false
database_mutated: false
routes_mutated: false
renderer_mutated: false
public_copy_mutated: false
public_metadata_mutated: false
payment_activated: false
MAP_delivery_activated: false
SEAT_activated: false
social_dispatch_activated: false
publication_activated: false
integration_activated: false
c3_backoffice_created: false
confirmed_SEAT_system_environment_alignment_track: false

Include this table:

folder | purpose | source evidence | standing | authority boundary

## 01 CURRENT DEV SHELL

Create or update:

docs/working/measures_registry_site_review_v1/01_current_dev_shell/current_dev_shell_manifest_v1.meta.md

Include clean current dev shell files from source manifest:

- src/app/App.tsx
- src/measures_registry/registered_runtime/registeredRuntimeTypes.ts
- src/measures_registry/registered_runtime/registeredRuntimeUtils.ts
- src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredGovernedStatus.tsx
- src/measures_registry/registered_runtime/styles/registry.visual-system.css
- src/measures_registry/registered_runtime/styles/registry.tokens.css
- src/measures_registry/registered_runtime/styles/registry.runtime.css
- src/measures_registry/registered_runtime/styles/registry.materials.css
- src/measures_registry/registered_runtime/styles/registry.layout.css
- src/measures_registry/registered_runtime/styles/registry.footer.css
- src/measures_registry/registered_runtime/styles/registry.buttons.css
- src/measures_registry/registered_runtime/styles/encounters/public_understand.css
- src/measures_registry/registered_runtime/styles/encounters/passage.css
- src/measures_registry/registered_runtime/styles/encounters/assessment.css

Standing:

current_dev_shell:
  standing: isolated_current_review_copy
  whole_file_runtime_authority: false
  source_paths_remain_authoritative: true

## 02 BOUNDARY RECORDS

Create or update:

docs/working/measures_registry_site_review_v1/02_boundary_records/boundary_records_manifest_v1.meta.md

Include:

- docs_measures_registry_dev_shell_carryout_recovery_matrix_v1.meta.md
- docs_measures_registry_dev_shell_isolation_boundary_v1.meta.md
- docs_measures_registry_launch_shell_recovery_audit_v1.meta.md
- oar1_isolate_measures_registry_dev_shell_from_recovered_carryout_matrix_with_upstream_downstream_trace_boundary_v1.meta.md
- carryout_recovery_oar1_v1.meta.md

Standing:

boundary_records:
  standing: review_copy_evidence
  authority_created: false

## 03 DOC SET

Create:

docs/working/measures_registry_site_review_v1/03_doc_set/doc_set_manifest_v1.meta.md

Classify referenced docs into:

doc_classifications:
  current_shell_evidence: []
  current_content_candidate: []
  chamber_content: []
  media_mapping: []
  renderer_contract: []
  canopy_reference: []
  circuit_reference: []
  integration_trace: []
  deprecated_trace: []
  upstream_protected_trace: []
  downstream_held_authority: []
  operator_review_required: []

Use recovered carryout standings:

carryout_families:
  content: recovered_working_unregistered
  media_mapping: recovered_mixed
  contracts: recovered_mixed_working_and_protected
  integrations: recovered_protected_carryouts
  runtime: recovered_current_shell_carryouts
  canopy_campaigns: source_reference_only
  circuit_contracts: recovered_protected_working_contracts
  drift_cracks: recovered_audit_findings_not_normalized

## 04 CHAMBERS

Create:

docs/working/measures_registry_site_review_v1/04_chambers/chamber_contents_manifest_v1.meta.md

Include corrected Level 1 grammar:

level_1_native_system:
  Epigraph:
    function: first surface / intro / hero / hook
    position: before_threshold
    chamber: false
    passage_required: false
    creates_first_orthogonal_vector: true

  Crystal_Seat:
    function: c3 model seat / threshold position
    chamber: false
    passage_required: false
    allowed_passage_to:
      - Marble_Chamber
    represents: c3_model

  Obsidian_Chamber:
    function: threshold chamber / assessment / gate logic / secured crossing
    chamber: true
    position: threshold
    passage_required: true
    gate_allowed: true
    may_have_antechamber: true
    antechamber:
      materially_relational: true
      non_runtime: true
      may_be_secured: true
      directory_may_require_security_key: true

  Lapis_Chamber:
    function: relational chamber between Obsidian and Marble
    chamber: true
    passage_required: false
    runtime_role: relational
    may_hold:
      - landing_pages
      - MRM
      - integrations
      - relational_continuity
    antechamber:
      role_bound: true
      may_be_called_by:
        - Obsidian_Chamber
        - Marble_Chamber

  Marble_Chamber:
    function: governance / resolution chamber
    chamber: true
    passage_required: true
    may_have_multiple_antechambers: true
    antechamber_constraint:
      each_antechamber_supports_only_one_resolution: true

  Harrumuck:
    function: forward passage
    direction: forward

  Kumurrah:
    function: return passage
    direction: return

  Gate:
    function: Obsidian threshold mechanism
    allowed_only_in:
      - Obsidian_Chamber

  Codexstone:
    function: Integrity Governance / Registry Seal / c3 Field Registered System
    binds:
      - registry_key
    conversion_point:
      creates:
        - Branch
    monitored_by:
      - c3_Optics
    does_not_create:
      - SEAT
      - payment
      - MAP_delivery
      - c3_backoffice

  MAP:
    function: phase
    public_expression_controlled:
      - MAP the Environment
    delivery_activated: false

  SEAT:
    standing: held_requirements_container
    confirmed_System_Environment_Alignment_Track: false
    activated: false

  Epithet:
    function: role dispersion structure
    chamber_of_epithets_holds_all_materials: true
    constraint: role dispersion cannot exceed material chamber contract

## 05 ENCOUNTER SURFACES

Create:

docs/working/measures_registry_site_review_v1/05_encounter_surfaces/encounter_surface_manifest_v1.meta.md

Include:

encounter_surfaces:
  ai_operations_assessment:
    public_label: AI Operations Assessment
    public_use_allowed: true
    activates_scoring_authority: false
    activates_MAP_delivery: false

  undrifted:
    public_label: unDrifted
    public_use_allowed: true
    activates_publication_authority: false
    activates_social_dispatch: false

  map_the_environment:
    public_label: MAP the Environment
    public_use_allowed: controlled_only
    activates_payment: false
    activates_MAP_delivery: false
    activates_SEAT: false

  about_measures_registry:
    public_label: About Measures Registry
    public_use_allowed: only_if_content_standing_supports
    activates_service_authority: false

not_allowed_current_public_terms:
  - Structural Drift
  - Understand the Environment
  - Request a Review

## 06 CONTENT PACKETS

Create:

docs/working/measures_registry_site_review_v1/06_content_packets/content_packet_manifest_v1.meta.md

Gather as references/review copies where present:

- intro / epigraph
- AI Operations Assessment
- unDrifted
- About Measures Registry
- MAP the Environment controlled passage
- held-state copy
- email/SRC report candidates

Classify:

content_packet_status:
  current_allowed: []
  controlled_allowed: []
  working_unregistered: []
  seated_not_rendered: []
  held: []
  deprecated_trace: []
  operator_review_required: []

## 07 MEDIA MAPS

Create:

docs/working/measures_registry_site_review_v1/07_media_maps/media_map_manifest_v1.meta.md

Gather as references/review copies where present:

- intro media
- assessment passage media
- unDrifted media
- material media: crystal / obsidian / lapis / marble
- held MAP media
- social/canopy media candidates

Classify provider boundary:

media_provider_boundary:
  Supabase:
    allowed: webp images
  R2:
    allowed: video/audio/large media
  forbidden:
    - temp media authority
    - frontend fallback media authority

## 08 RENDERER CONTRACTS

Create:

docs/working/measures_registry_site_review_v1/08_renderer_contracts/renderer_contract_manifest_v1.meta.md

Include:

clean_shell_renderers:
  - RegisteredIntro.tsx
  - RegisteredPathChoice.tsx
  - RegisteredPassage.tsx
  - RegisteredPublicUnderstand.tsx
  - RegisteredGovernedStatus.tsx

runtime_support:
  - registeredRuntimeTypes.ts
  - registeredRuntimeUtils.ts
  - styles/

mixed_orchestrator:
  file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  review_copy_location: operator_review_conflicts/src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  current_runtime_evidence: true
  clean_whole_file_shell_authority: false
  contains_downstream_logic:
    - assessment scoring/capture
    - publication/subscription
    - MAP commerce
    - checkout
    - payment return verification

## 09 CANOPY CAMPAIGNS

Create:

docs/working/measures_registry_site_review_v1/09_canopy_campaigns/canopy_campaign_manifest_v1.meta.md

Include:

canopy_campaigns:
  social_media:
    standing: requirement_or_candidate
    circuit: C1MRM
    activates_dispatch: false

  assessment:
    standing: requirement_or_candidate
    circuit: C1MRM
    activates_MAP: false

  undrifted:
    standing: requirement_or_candidate
    circuit: C1MRM
    activates_publication: false

## 10 CIRCUIT CONTRACTS

Create:

docs/working/measures_registry_site_review_v1/10_circuit_contracts/circuit_contract_manifest_v1.meta.md

Include:

circuits:
  C1MRM:
    circuit: Connect
    function: contact continuity
    resolves_by:
      - email confirmation
    opens:
      - response recall
      - SRC report candidate
      - MAP the Environment passage eligibility
    activates_MAP_delivery: false

  C2MAP:
    circuit: Contribute
    function: MAP the Environment value exchange
    requires:
      - C1MRM resolved
      - email confirmed
      - SRC report generated
      - payment/schedule/deliver contract seated
    activates_payment_now: false
    activates_MAP_delivery_now: false

  C3SEAT:
    circuit: Create
    function: SEAT requirements hold
    confirmed_SEAT_system_environment_alignment_track: false
    activates_SEAT_now: false

c3_backoffice:
  standing: unavailable
  creation_allowed: false
  condition:
    - system must be inside c3 Field

## 11 INTEGRATIONS

Create:

docs/working/measures_registry_site_review_v1/11_integrations/integration_manifest_v1.meta.md

Include as requirements/traces only:

- Resend
- Stripe
- Buffer
- Paragraph
- Supabase
- R2

Classify:

integration_status:
  configured_trace: []
  requirement: []
  held: []
  missing: []
  operator_review_required: []

No provider activation.

## 12 DEPRECATED TRACE

Create:

docs/working/measures_registry_site_review_v1/12_deprecated_trace/deprecated_trace_manifest_v1.meta.md

Include:

- Structural Drift
- Understand the Environment
- Request a Review
- Evaluate the Environment
- Structure the Environment
- educational diagnostic
- cohort conversion
- connect_src
- measures_eval_email_contract
- phase_payment
- reserve_seat
- Crystal Chamber as public term
- Marble Chamber as public term

Classify each:

deprecated_trace:
  public_use_allowed: false
  runtime_authority_allowed: false
  may_remain_as_trace: true

## 13 STRUCTURED ASSET REQUIREMENTS

Create:

docs/working/measures_registry_site_review_v1/13_structured_asset_requirements/seat_requirements_hold_manifest_v1.meta.md

This is a SEAT requirements hold, not SEAT activation.

Include:

SEAT_requirements_hold:
  standing: requirements_container_only
  confirmed_SEAT: false
  confirmed_System_Environment_Alignment_Track: false
  activates_backoffice: false

  structured_asset_requirements:
    content:
      required: true
    media:
      required: true
    contracts:
      required: true
    integrations:
      required: true
    runtime:
      required: true
    assessment_report:
      required: true
    commerce:
      required: true
    verification:
      required: true

## 14 OPERATOR REVIEW

Create:

docs/working/measures_registry_site_review_v1/14_operator_review/operator_review_manifest_v1.meta.md

Include unresolved or held conflicts:

- mixed registered orchestrator
- assessment renderer boundary
- publication renderer boundary
- MAP/payment renderer boundary
- provider ownership
- circuit contract wording
- Codexstone Branch conversion boundary
- SEAT requirements hold
- c3 backoffice unavailable until c3 Field

## COPY / REFERENCE RULE

Where source file paths exist, copy review copies into the working folder or reference existing review copies.

Where source file paths cannot be found, record expected source path and classify as:

missing_or_not_found_for_review

Never create substitute content to fill a missing source.

## HARD GUARDRAILS

guardrails:
  source_files_moved: false
  source_files_deleted: false
  source_files_rewritten: false
  runtime_mutated: false
  database_mutated: false
  routes_mutated: false
  renderer_mutated: false
  public_copy_mutated: false
  public_metadata_mutated: false
  payment_activated: false
  MAP_delivery_activated: false
  SEAT_activated: false
  social_dispatch_activated: false
  publication_activated: false
  integration_activated: false
  c3_backoffice_created: false
  launch_authority_created: false

## VALIDATION

Pass only if:

validation:
  working_root_exists: true
  index_created: true
  current_dev_shell_manifest_created: true
  boundary_records_manifest_created: true
  doc_set_manifest_created: true
  chamber_contents_manifest_created: true
  encounter_surface_manifest_created: true
  content_packet_manifest_created: true
  media_map_manifest_created: true
  renderer_contract_manifest_created: true
  canopy_campaign_manifest_created: true
  circuit_contract_manifest_created: true
  integration_manifest_created: true
  deprecated_trace_manifest_created: true
  seat_requirements_hold_manifest_created: true
  operator_review_manifest_created: true
  source_files_moved: false
  source_files_deleted: false
  source_files_rewritten: false
  runtime_mutated: false
  database_mutated: false
  routes_mutated: false
  renderer_mutated: false
  public_copy_mutated: false
  public_metadata_mutated: false
  payment_activated: false
  MAP_delivery_activated: false
  SEAT_activated: false
  social_dispatch_activated: false
  publication_activated: false
  integration_activated: false
  c3_backoffice_created: false
  launch_authority_created: false

## REQUIRED OAR1

Return OAR1 beside this OAR2 with:

- source OAR2 path
- source transfer manifest path
- working folder root
- directories created
- files created
- manifest paths
- doc set count
- chamber manifest count
- encounter surface count
- content packet count
- media map count
- renderer contract count
- canopy campaign count
- circuit contract count
- integration count
- deprecated trace count
- structured asset requirement count
- operator review count
- missing_or_not_found_for_review list
- confirmation no source files moved
- confirmation no source files deleted
- confirmation no source files rewritten
- confirmation no runtime mutation
- confirmation no DB mutation
- confirmation no route mutation
- confirmation no renderer mutation
- confirmation no public copy mutation
- confirmation no public metadata mutation
- confirmation no payment/MAP/SEAT/social/publication/integration activation
- confirmation no c3 backoffice creation
- confirmation no launch authority created
- recommended next OAR2

## EXPECTED NEXT OAR2

After this closes:

OAR2 — Review Measures Registry Site Working Folder and Prepare Codexstone Branch Registration Requirements v1

That next OAR2 must treat Codexstone Registration as the conversion point that creates the Branch.

It must not treat Measures Registry as confirmed SEAT.

It must not create c3 backoffice.

It must not activate MAP delivery, payment, SEAT, social dispatch, publication, or integrations.
