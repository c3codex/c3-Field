---
document_type: validation_report
authority_level: chamber_runtime_organization_map
system_scope: measures_codex
title: Measures Registry Chamber Runtime Organization Map v1
status: runtime_organization_mapped
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_current_runtime_file_into_chamber_runtime_organization_map_v1.meta.md
current_runtime_file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
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

# Measures Registry Chamber Runtime Organization Map v1

## Standing

```yaml
standing:
  status: runtime_organization_mapped
  mutation_authorized: false
  runtime_mutation_authorized: false
  renderer_mutation_authorized: false
  source_upload_content_oar1_verified: true
  source_upload_content_oar1_path: docs/seat/measures_registry_isolated/09_oar/oar1_review_confirmed_seat_upload_files_and_held_appendix_contents_before_bucket_upload_v1.meta.md
  source_upload_clean_for_upload: true
  source_upload_authorized_now: false
```

## Current Runtime File

```yaml
current_runtime_file:
  path: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  inspected: true
  approximate_line_count: 1250
  standing: monolithic_recovery_container_or_current_runtime
  recommended_final_form: chamber_runtime_modules
  imported_by:
    - src/app/App.tsx
  nearby_runtime_files_inspected:
    - src/measures_registry/registered_runtime/registeredRuntimeTypes.ts
    - src/measures_registry/registered_runtime/registeredRuntimeUtils.ts
    - src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
    - src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx
    - src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx
    - src/measures_registry/registered_runtime/renderers/RegisteredPublicAssessment.tsx
    - src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx
    - src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx
    - src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
    - src/measures_registry/registered_runtime/renderers/RegisteredAssessmentLanding.tsx
    - src/measures_registry/registered_runtime/renderers/MarbleCommerceDirectory.tsx
```

## Runtime Shell

```yaml
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
  current_sections:
    - constants and registered runtime maps, lines 45-141
    - browser URL and query resolution, lines 143-174
    - DB data loading, lines 236-297
    - navigation history synchronization, lines 390-424
    - media and design token derivation, lines 374-545
    - surface dispatcher, lines 976-1250
  must_not:
    - own content truth
    - own route truth
    - own release truth
    - hardcode chamber-specific copy
```

## Runtime Sections

```yaml
runtime_sections:
  - section_name: registered_constants_and_surface_maps
    line_range_or_identifier: lines 45-141
    function_or_component_name: REGISTERED_ENCOUNTER_KEYS, REGISTERED_MEDIA_ROLES, SURFACE_QUERY, SURFACE_QUERY_ALIASES, ROUTE_SURFACE_ALIASES, ROUTE_UNIT_KEYS
    current_behavior: enumerates allowed encounter keys, media roles, query aliases, route aliases, and route registry units
    DB_tables_read:
      - measures_encounter_def
      - measures_media_map
      - measures_registry
    state_variables_used: []
    route_or_surface_control: hardcoded route/query maps steer initial surface and fetch allowlists
    content_source: constants plus DB row metadata
    media_source: REGISTERED_MEDIA_ROLES filtered from measures_media_map
    style_source: measures_design_token
    chamber_authority_candidate: Shared_runtime_shell
    risk_level: medium
    notes: needed shell registry, but should become runtimeRegistry.ts so route truth stays visibly seated and reviewable
  - section_name: initial_surface_and_history
    line_range_or_identifier: lines 143-174 and 390-424
    function_or_component_name: historyUrl, writeHistory, initialSurface, navigate, URL sync effects
    current_behavior: resolves active surface from path/query and synchronizes URL history
    DB_tables_read:
      - measures_registry
    state_variables_used:
      - activeSurface
      - activeRouteUnit
      - activeRouteDefaultSurface
    route_or_surface_control: frontend path/query fallback to intro plus legacy aliases
    content_source: none
    media_source: none
    style_source: none
    chamber_authority_candidate: Shared_runtime_shell
    risk_level: high
    notes: route fallback is operationally useful but can become fallback authority if not tied to seated route units
  - section_name: db_state_loader
    line_range_or_identifier: lines 236-297
    function_or_component_name: loadData effect
    current_behavior: reads runtime content, registry units, media, design tokens, publications, dispatches, and MAP contracts
    DB_tables_read:
      - measures_encounter_def
      - measures_registry
      - measures_media_map
      - measures_design_token
      - measures_publication_registry
      - measures_publication_dispatch
      - map_commerce_contracts
    state_variables_used:
      - sections
      - landingUnits
      - mediaRows
      - designTokens
      - publicationRows
      - publicationDispatchRows
      - mapCommerceContracts
    route_or_surface_control: fetch filters determine available runtime surfaces
    content_source: DB metadata
    media_source: DB media rows
    style_source: DB design tokens
    chamber_authority_candidate: Shared_runtime_shell
    risk_level: medium
    notes: good DB-first boundary; future shell should own this and pass typed runtime state downward
  - section_name: map_payment_return
    line_range_or_identifier: lines 189-202 and 301-329
    function_or_component_name: mapPaymentReturn state and payment-status effect
    current_behavior: reads map_order_id/session_id from URL, calls payment-status API, navigates to MAP surface when scheduling is released
    DB_tables_read: []
    state_variables_used:
      - mapPaymentReturn
      - activeSurface
    route_or_surface_control: payment return can navigate to map_integrity_governance
    content_source: API response
    media_source: none
    style_source: none
    chamber_authority_candidate: Marble
    risk_level: high
    notes: payment verification belongs in a Marble/payment boundary module and must remain provider-evidence driven
  - section_name: epigraph_and_lapis_entry_motion
    line_range_or_identifier: lines 204-209, 230, 333-339, 1000-1042
    function_or_component_name: epigraph state, RegisteredIntro, RegisteredPathChoice
    current_behavior: controls landing video/motion and left/right entry choice
    DB_tables_read:
      - measures_encounter_def
      - measures_media_map
      - measures_design_token
    state_variables_used:
      - epigraphEntered
      - epigraphMuted
      - epigraphFailed
      - landingHeroReady
      - thresholdMotionSettled
      - passageMuted
    route_or_surface_control: left to eval_passage, right to structure_passage
    content_source: sectionCopy from measures_encounter_def
    media_source: measures_media_map
    style_source: measures_design_token
    chamber_authority_candidate: Lapis
    risk_level: medium
    notes: landing support crosses Lapis and Obsidian/Crystal path choice; final module should keep route choices DB-seated
  - section_name: governed_route_units
    line_range_or_identifier: lines 343-372 and 981-999
    function_or_component_name: landingUnitMap, governedSurface, landing_unit_missing renderer
    current_behavior: uses measures_registry metadata runtime_surface/cta_surface and renders missing state if route unit is absent
    DB_tables_read:
      - measures_registry
    state_variables_used:
      - landingUnits
      - landingUnitsLoaded
      - activeRouteUnit
    route_or_surface_control: DB metadata can override initial route surface
    content_source: measures_registry metadata
    media_source: none
    style_source: design token style
    chamber_authority_candidate: Shared_runtime_shell
    risk_level: low
    notes: strong DB-first pattern; preserve in shell extraction
  - section_name: media_and_design_resolution
    line_range_or_identifier: lines 374-388 and 502-545
    function_or_component_name: mediaMap, registryTokenStyle, media URL constants, launchMediaStyle
    current_behavior: converts DB media rows and design tokens into renderer props and CSS custom properties
    DB_tables_read:
      - measures_media_map
      - measures_design_token
    state_variables_used:
      - mediaRows
      - designTokens
    route_or_surface_control: none
    content_source: none
    media_source: measures_media_map
    style_source: measures_design_token
    chamber_authority_candidate: Shared_runtime_shell
    risk_level: medium
    notes: media role fallbacks are hardcoded in shell and should be isolated into media binding map
  - section_name: obsidian_assessment
    line_range_or_identifier: lines 211-222, 549-783, 920-974, 1097-1115
    function_or_component_name: assessment state, submitIisEvaluation, RegisteredPublicAssessment
    current_behavior: renders AI Operations Assessment, validates seated question contract, computes deterministic report, and inserts contact-gated capture
    DB_tables_read:
      - measures_encounter_def
      - measures_iis_eval_gate1_capture
    state_variables_used:
      - evalFields
      - evalAnswers
      - evalStep
      - evalReport
      - evalScore
      - evalCaptureId
      - evalEmailArtifact
      - conditionTraces
    route_or_surface_control: navigates from assessment to obsidian_to_marble_passage_video
    content_source: measures_encounter_def metadata and registeredRuntimeUtils scoring contracts
    media_source: obsidian visual media rows
    style_source: design tokens
    chamber_authority_candidate: Obsidian
    risk_level: high
    notes: assessment logic is sizable and should be extracted without changing DB-first content contract
  - section_name: obsidian_to_marble_passage
    line_range_or_identifier: lines 1116-1165
    function_or_component_name: inline passage renderer
    current_behavior: renders Before the Pathway passage and routes to map_integrity_governance
    DB_tables_read:
      - measures_encounter_def
      - measures_media_map
    state_variables_used:
      - passageMuted
      - obsidianToMarblePassageCopy
    route_or_surface_control: on video end and CTA navigate to map_integrity_governance
    content_source: measures_encounter_def
    media_source: measures_media_map
    style_source: design tokens
    chamber_authority_candidate: Obsidian
    risk_level: medium
    notes: inline renderer should become Obsidian passage module or renderer file
  - section_name: public_understand_structure_passage
    line_range_or_identifier: lines 1068-1080 plus RegisteredPublicUnderstand.tsx
    function_or_component_name: RegisteredPublicUnderstand
    current_behavior: renders structure_passage and routes to crystal_chamber
    DB_tables_read:
      - measures_encounter_def
      - measures_media_map
    state_variables_used:
      - structurePassageCopy
      - passageMuted
    route_or_surface_control: continue/skip routes to crystal_chamber
    content_source: measures_encounter_def
    media_source: measures_media_map
    style_source: design tokens
    chamber_authority_candidate: Crystal_Seat
    risk_level: medium
    notes: passage is not Crystal Seat itself; keep as transition carrier into Crystal Seat
  - section_name: crystal_chamber_surface
    line_range_or_identifier: lines 1081-1096 plus RegisteredCrystalChamber.tsx
    function_or_component_name: RegisteredCrystalChamber
    current_behavior: renders sparse crystal chamber, Structural Drift publication link, Foundational Leadership held conversation, and assessment CTA
    DB_tables_read:
      - measures_encounter_def
      - measures_media_map
      - measures_publication_registry
      - measures_publication_dispatch
    state_variables_used:
      - crystalChamberCopy
      - structurePassageCopy
      - publicationRows
      - publicationDispatchRows
    route_or_surface_control: can navigate to eval_passage or structural_drift_dispatches
    content_source: measures_encounter_def metadata with publicSafeString guard
    media_source: measures_media_map
    style_source: design tokens
    chamber_authority_candidate: Crystal_Seat
    risk_level: medium
    notes: current renderer contains public safety filter; still needs final standing boundary so Crystal Seat does not become encounter authority
  - section_name: marble_map_directory_and_payment
    line_range_or_identifier: lines 301-329, 824-858, 1166-1184 plus MarbleCommerceDirectory.tsx
    function_or_component_name: handleProceedToMapPayment, MarbleCommerceDirectory
    current_behavior: renders MAP directory, recommended contract, payment CTA, payment return, scheduling release, and SEAT hold copy
    DB_tables_read:
      - map_commerce_contracts
      - measures_iis_eval_gate1_capture
    state_variables_used:
      - evalReport
      - evalFields
      - mapCommerceContracts
      - mapCheckoutLoading
      - mapCheckoutError
      - mapPaymentReturn
    route_or_surface_control: calls create-checkout-session and redirects to provider checkout
    content_source: map_commerce_contracts plus inline held/payment copy
    media_source: marble_accent_reference
    style_source: design tokens
    chamber_authority_candidate: Marble
    risk_level: high
    notes: strongest current runtime risk surface because payment copy/API flow lives near shell; must remain held/provider-evidence driven
  - section_name: lapis_publication_dispatch
    line_range_or_identifier: lines 224-228, 491-500, 787-820, 1185-1211 plus RegisteredStructuralDrift.tsx
    function_or_component_name: submitPublicationSubscription, RegisteredStructuralDrift
    current_behavior: renders unDrifted/Structural Drift publication dispatches and inserts subscription capture
    DB_tables_read:
      - measures_publication_registry
      - measures_publication_dispatch
      - measures_publication_subscription_capture
    state_variables_used:
      - publicationRows
      - publicationDispatchRows
      - publicationEmail
      - publicationOrganization
      - publicationStatus
      - publicationError
    route_or_surface_control: /undrifted and /publication/structural_drift dispatch paths
    content_source: publication registry/dispatch DB rows
    media_source: dispatch media_manifest and media rows
    style_source: design tokens
    chamber_authority_candidate: Lapis
    risk_level: medium
    notes: relational/publication capture; keep distinct from launch authority and MAP/payment
  - section_name: shared_header_footer_audio
    line_range_or_identifier: lines 862-918
    function_or_component_name: renderHeader, renderSystemFooter, renderMarbleToneContinuity
    current_behavior: renders brand header, footer from active section copy, and marble tone continuity audio
    DB_tables_read:
      - measures_encounter_def
      - measures_media_map
    state_variables_used:
      - activeSurface
      - sectionMap
      - passageMuted
    route_or_surface_control: none
    content_source: measures_encounter_def footer contract
    media_source: measures_media_map
    style_source: CSS classes/design tokens
    chamber_authority_candidate: Shared_runtime_shell
    risk_level: medium
    notes: shared UI should remain shell-owned but not own copy truth
  - section_name: fallback_intro_dispatch
    line_range_or_identifier: lines 1212-1248
    function_or_component_name: fallback RegisteredIntro branch
    current_behavior: renders intro when no known activeSurface branch matches
    DB_tables_read:
      - measures_encounter_def
      - measures_media_map
    state_variables_used:
      - activeSurface
    route_or_surface_control: catch-all fallback to intro/path_choice
    content_source: introCopy
    media_source: measures_media_map
    style_source: design tokens
    chamber_authority_candidate: Held_or_legacy
    risk_level: high
    notes: catch-all fallback truth should be quarantined or changed to missing-state display in future refactor
```

## Chamber Runtime Modules

```yaml
chamber_runtime_modules:
  lapis:
    proposed_files:
      - src/measures_registry/runtime/chambers/LapisRuntime.tsx
      - src/measures_registry/runtime/chambers/LapisPublicationRuntime.tsx
    sections:
      - epigraph_and_lapis_entry_motion
      - lapis_publication_dispatch
    DB_dependencies:
      - measures_encounter_def
      - measures_media_map
      - measures_design_token
      - measures_publication_registry
      - measures_publication_dispatch
      - measures_publication_subscription_capture
    risks:
      - social/publication routes must not become launch or Registry Standing authority
      - subscription insert must stay capture-only and guarded by DB policy
  obsidian:
    proposed_files:
      - src/measures_registry/runtime/chambers/ObsidianAssessmentRuntime.tsx
      - src/measures_registry/runtime/chambers/ObsidianPassageRuntime.tsx
    sections:
      - obsidian_assessment
      - obsidian_to_marble_passage
    DB_dependencies:
      - measures_encounter_def
      - measures_media_map
      - measures_iis_eval_gate1_capture
    risks:
      - deterministic assessment logic and contact capture are too large for the shell
      - contact capture must not create SEAT or SEAL
  marble:
    proposed_files:
      - src/measures_registry/runtime/chambers/MarbleMapRuntime.tsx
      - src/measures_registry/runtime/chambers/MarblePaymentBoundary.tsx
    sections:
      - marble_map_directory_and_payment
    DB_dependencies:
      - map_commerce_contracts
      - measures_iis_eval_gate1_capture
      - measures_media_map
    risks:
      - active payment and scheduling language must remain provider-evidence driven
      - SEAT standing copy must remain held until MAP completion authority exists
  crystal_seat:
    proposed_files:
      - src/measures_registry/runtime/chambers/CrystalSeatRuntime.tsx
      - src/measures_registry/runtime/chambers/CrystalSeatHoldBoundary.tsx
    sections:
      - public_understand_structure_passage
      - crystal_chamber_surface
    DB_dependencies:
      - measures_encounter_def
      - measures_media_map
      - measures_publication_registry
      - measures_publication_dispatch
    risks:
      - crystal_chamber must not act as current encounter authority or launch landing by default
      - structural drift publication link must stay publication/education, not governing route authority
  shared_runtime_shell:
    proposed_files:
      - src/measures_registry/runtime/MeasuresRegistryRuntimeShell.tsx
      - src/measures_registry/runtime/runtimeRegistry.ts
      - src/measures_registry/runtime/runtimeTypes.ts
      - src/measures_registry/runtime/runtimeDataLoader.ts
      - src/measures_registry/runtime/runtimeMediaBindings.ts
    sections:
      - registered_constants_and_surface_maps
      - initial_surface_and_history
      - db_state_loader
      - governed_route_units
      - media_and_design_resolution
      - shared_header_footer_audio
    DB_dependencies:
      - measures_encounter_def
      - measures_registry
      - measures_media_map
      - measures_design_token
    risks:
      - route aliases, fallback intro, and media role lists can become frontend-owned truth if not visibly DB-bound
  held_or_legacy:
    sections:
      - fallback_intro_dispatch
      - SURFACE_QUERY_ALIASES educational_diagnostic_passage
      - SURFACE_QUERY_ALIASES marble_pathway_reveal
      - /structural-drift redirect
      - destination_legacy_alias marble_pathway_reveal in assessment capture metadata
      - payment return and scheduling release UI
    risks:
      - compatibility aliases could revive old route authority
      - catch-all intro fallback can mask missing DB state
      - payment/scheduling UI can look active without enough provider-state separation
```

## Hardcoded Risks

```yaml
hardcoded_risks:
  count: 12
  rows:
    - risk_type: hardcoded_route_sequence
      file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      line_or_identifier: lines 96-139
      current_value: SURFACE_QUERY, SURFACE_QUERY_ALIASES, ROUTE_SURFACE_ALIASES, ROUTE_UNIT_KEYS
      should_resolve_from: measures_registry route/unit metadata plus measures_encounter_def
      chamber: Shared_runtime_shell
      severity: high
      recommended_future_action: extract runtimeRegistry.ts and mark compatibility aliases as held/deprecated
    - risk_type: catch_all_fallback_truth
      file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      line_or_identifier: lines 1212-1248
      current_value: unknown surface renders RegisteredIntro
      should_resolve_from: missing-state renderer when DB route/surface is absent
      chamber: Held_or_legacy
      severity: high
      recommended_future_action: replace fallback intro with explicit missing-governed-state in future refactor
    - risk_type: hardcoded_media_role_allowlist
      file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      line_or_identifier: lines 63-94
      current_value: REGISTERED_MEDIA_ROLES
      should_resolve_from: measures_media_map role requirements or seated media binding contract
      chamber: Shared_runtime_shell
      severity: medium
      recommended_future_action: extract runtimeMediaBindings.ts and document required roles by chamber
    - risk_type: hardcoded_release_filter
      file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      line_or_identifier: lines 277-280
      current_value: map_commerce_contracts release_state active
      should_resolve_from: DB policy plus Marble payment boundary
      chamber: Marble
      severity: high
      recommended_future_action: isolate active commerce reads into MarblePaymentBoundary and require provider evidence for action copy
    - risk_type: payment_api_route_inline
      file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      line_or_identifier: lines 305 and 833
      current_value: /api/map/payment-status and /api/map/create-checkout-session
      should_resolve_from: Marble payment boundary contract and provider-status API
      chamber: Marble
      severity: high
      recommended_future_action: extract payment service adapter and keep payment activation out of shell
    - risk_type: hardcoded_public_assessment_question_count
      file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      line_or_identifier: lines 124 and 927-941
      current_value: PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT = 7
      should_resolve_from: measures_encounter_def assessment mechanics contract
      chamber: Obsidian
      severity: medium
      recommended_future_action: move expected question count into seated assessment contract
    - risk_type: inline_missing_state_copy
      file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      line_or_identifier: lines 991-996 and 935-941
      current_value: missing registry unit and assessment contract copy inline in frontend
      should_resolve_from: seated missing-state copy or system error contract
      chamber: Shared_runtime_shell
      severity: medium
      recommended_future_action: seat missing-state copy in DB or shared content contract
    - risk_type: hardcoded_cta_targets
      file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      line_or_identifier: lines 1026-1027, 1039-1040, 1077, 1093-1094, 1157, 1203-1205
      current_value: navigate calls directly target eval_passage, structure_passage, crystal_chamber, map_integrity_governance, structural_drift_dispatches
      should_resolve_from: measures_registry cta_surface metadata and transition contracts
      chamber: Shared_runtime_shell
      severity: high
      recommended_future_action: centralize transitions in runtimeRegistry.ts using DB-backed route contract
    - risk_type: frontend_generated_capture_metadata
      file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      line_or_identifier: lines 649-727 and 799-809
      current_value: capture metadata, carry_forward, oar1_trace, subscription metadata constructed in frontend
      should_resolve_from: DB function or seated capture contract
      chamber: Obsidian/Lapis
      severity: high
      recommended_future_action: move capture payload schema to DB-backed contract or RPC wrapper
    - risk_type: deprecated_public_route_alias
      file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      line_or_identifier: lines 123, 126-130, 419-423
      current_value: /structural-drift redirect and /publication/structural_drift
      should_resolve_from: publication routing registry
      chamber: Lapis/Held_or_legacy
      severity: medium
      recommended_future_action: quarantine legacy publication aliases in held route adapter
    - risk_type: inline_style_contract_classes
      file: src/measures_registry/registered_runtime/renderers/MarbleCommerceDirectory.tsx and RegisteredCrystalChamber.tsx
      line_or_identifier: renderer data-layout/data-release/className values
      current_value: material/layout/release semantics in renderer props/classes
      should_resolve_from: seated design token and style_profile contracts
      chamber: Marble/Crystal_Seat
      severity: medium
      recommended_future_action: extract chamber style contracts and ensure renderer only consumes seated style bindings
    - risk_type: public_copy_fallbacks_in_renderers
      file: src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx and MarbleCommerceDirectory.tsx
      line_or_identifier: fallback headings/buttons/payment and SEAT hold copy
      current_value: fallback public copy and held-status copy embedded in renderer
      should_resolve_from: measures_encounter_def content contract and map_commerce_contracts
      chamber: Crystal_Seat/Marble
      severity: medium
      recommended_future_action: remove fallback public copy or mark as missing state once content contracts are seated
```

## DB Read Dependencies

```yaml
DB_read_dependencies:
  count: 8
  rows:
    - table: public.measures_encounter_def
      read_location: MeasuresRegistryRuntimeRegistered.tsx lines 244-248
      used_for: section/content metadata for registered surfaces
      chamber_or_shell: Shared_runtime_shell; all chambers
      public_policy_dependency: public read for active/current encounter definitions
      notes: primary content contract source
    - table: public.measures_registry
      read_location: MeasuresRegistryRuntimeRegistered.tsx lines 249-253 and App.tsx lines 184-188
      used_for: route landing unit metadata and app page metadata
      chamber_or_shell: Shared_runtime_shell
      public_policy_dependency: public read for active/released route units
      notes: source of governed route metadata
    - table: public.measures_media_map
      read_location: MeasuresRegistryRuntimeRegistered.tsx lines 254-259
      used_for: runtime media URLs by role
      chamber_or_shell: Shared_runtime_shell; Lapis; Obsidian; Marble; Crystal_Seat
      public_policy_dependency: public read for active media mappings
      notes: campaign_key filter includes measures_registry_crystal_chamber
    - table: public.measures_design_token
      read_location: MeasuresRegistryRuntimeRegistered.tsx lines 260-264
      used_for: CSS custom properties/design tokens
      chamber_or_shell: Shared_runtime_shell
      public_policy_dependency: public read for active design tokens
      notes: style truth should remain DB-seated
    - table: public.measures_publication_registry
      read_location: MeasuresRegistryRuntimeRegistered.tsx lines 265-269
      used_for: structural_drift and undrifted publication standing
      chamber_or_shell: Lapis; Crystal_Seat
      public_policy_dependency: public read for published publication rows
      notes: publication truth, not governing route authority
    - table: public.measures_publication_dispatch
      read_location: MeasuresRegistryRuntimeRegistered.tsx lines 270-275
      used_for: unDrifted dispatch list/article route
      chamber_or_shell: Lapis
      public_policy_dependency: public read for published dispatch rows
      notes: drives RegisteredStructuralDrift
    - table: public.map_commerce_contracts
      read_location: MeasuresRegistryRuntimeRegistered.tsx lines 276-280
      used_for: MAP product/contracts/payment boundary display
      chamber_or_shell: Marble
      public_policy_dependency: public read for active commerce contracts
      notes: active release filter is a review risk before payment changes
    - table: public.measures_iis_eval_gate1_capture
      read_location: MeasuresRegistryRuntimeRegistered.tsx lines 443-447
      used_for: reconstruct assessment carry-forward for MAP surface
      chamber_or_shell: Obsidian to Marble
      public_policy_dependency: read access must be governed; write path also exists at lines 649-727
      notes: carry-forward read/write boundary should be isolated
  write_dependencies_seen:
    - table: public.measures_iis_eval_gate1_capture
      write_location: MeasuresRegistryRuntimeRegistered.tsx lines 649-727
      used_for: contact-gated assessment result capture
      chamber_or_shell: Obsidian
    - table: public.measures_publication_subscription_capture
      write_location: MeasuresRegistryRuntimeRegistered.tsx lines 799-809
      used_for: publication subscription capture
      chamber_or_shell: Lapis
```

## Held Or Legacy Runtime Residue

```yaml
held_or_legacy_runtime_residue:
  count: 7
  rows:
    - educational_diagnostic_passage alias maps to eval_passage
    - marble_pathway_reveal alias maps to map_integrity_governance
    - /structural-drift redirects to /undrifted
    - /publication/structural_drift retained as dispatch route
    - assessment capture metadata carries destination_legacy_alias marble_pathway_reveal
    - fallback unknown surface renders intro instead of missing-state boundary
    - payment return/scheduling release UI lives inside current runtime file
```

## Future Refactor Sequence

```yaml
future_refactor_sequence:
  - step: 1_runtime_shell_extraction
    purpose: isolate DB loading, route resolution, media/design binding, and missing-state rendering
    mutation_required: true
    blocker: requires future refactor OAR
  - step: 2_lapis_module_extraction
    purpose: isolate unDrifted/publication/subscription and landing support
    mutation_required: true
    blocker: preserve publication DB policy and no launch-standing claims
  - step: 3_obsidian_module_extraction
    purpose: isolate assessment mechanics, contact capture, scoring, and passage
    mutation_required: true
    blocker: preserve seated seven-question contract and capture payload behavior
  - step: 4_marble_module_extraction
    purpose: isolate MAP directory, commerce contract display, and payment provider boundary
    mutation_required: true
    blocker: payment and scheduling must remain provider-evidence gated
  - step: 5_crystal_seat_hold_module
    purpose: isolate Crystal Seat final confirmation/held standing surface
    mutation_required: true
    blocker: crystal_chamber must not become active encounter or launch authority by default
  - step: 6_legacy_route_quarantine
    purpose: move deprecated aliases and fallback behavior into explicit held adapter
    mutation_required: true
    blocker: route continuity must be preserved
  - step: 7_runtime_validation
    purpose: build, route, DB-read, and no-hardcoded-truth validation
    mutation_required: false
    blocker: requires full future implementation evidence
```

## Upload Readiness Impact

```yaml
upload_readiness_impact:
  current_SEAT_doc_package_clean_for_upload: true
  runtime_organization_blocks_doc_upload: false
  reason: audit found structural organization/refactor risk but no active runtime drift that invalidates the confirmed SEAT documentation upload package
  refactor_required_after_upload_or_before_launch_runtime_mutation: true
  recommended_next_oar2_if_upload_can_proceed: OAR2 - Upload Confirmed Measures Registry SEAT Folder Package to Supabase Bucket v1
  recommended_next_oar2_if_runtime_blocks_upload: OAR2 - Resolve Measures Registry Runtime Organization Blockers Before SEAT Upload v1
```

## Boundary Confirmation

```yaml
boundary_confirmation:
  runtime_files_edited: false
  renderer_files_edited: false
  routes_changed: false
  database_mutation: false
  policy_mutation: false
  row_mutation: false
  public_copy_mutation: false
  bucket_upload_performed: false
  bucket_delete_performed: false
  bucket_overwrite_performed: false
  seat_folder_submitted: false
```
