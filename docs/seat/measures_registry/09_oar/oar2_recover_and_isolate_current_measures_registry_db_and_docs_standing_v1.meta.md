---
document_type: oar2
authority_level: working
document_scope: measures_registry_recovery_and_isolation
title: OAR2 - Recover and Isolate Current Measures Registry DB and Docs Standing v1
status: confirmed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar2
  - measures-registry
  - recovery
  - isolation
  - db-inventory
  - docs-inventory
  - seat-candidate
  - no-mutation
---

# OAR2 - Recover and Isolate Current Measures Registry DB and Docs Standing v1

## OBSERVED

Current Measures Registry standing is mixed across DB state, docs, SEAT package records, media records, social contracts, integration contracts, OAR files, and prior working surfaces.

Recent working conclusions:

- Measures Registry must be isolated in DB and docs before new launch or circuit implementation.
- Work already completed must be recovered before isolation.
- Prior working surfaces cannot be trusted as launch-active until classified.
- The current SEAT package is evidence/review standing, not registration.
- The assessment-to-MAP-to-payment-to-SEAT-to-Crystal Seat circuit should not be completed before recovery and isolation.
- Existing landing, unDrifted, Lapis, Obsidian, MAP, payment, Crystal Seat, social, Paragraph, and media surfaces must be inventoried first.
- Crystal Seat is not an encounter.
- Crystal Seat is final confirmation / registered standing surface.
- c3 back office remains held.
- Our Story clips were exported for review but are not selected for launch campaign.
- unDrifted Issue 01 and Lapis Chamber encounter standing must be recovered and classified before reuse.
- DB standing must be inspected before isolation.
- Docs standing must be inspected before isolation.

Current risk:

- old working files may bleed into active launch route;
- DB rows may carry stale or conflicting route state;
- social/media surfaces may imply campaign activation;
- Crystal Seat may be misclassified as an encounter;
- payment, MAP, SEAT, c3 Key, or Field access may be implied too early;
- docs may appear complete while DB isolation remains unresolved.

## ALIGNED

Perform a recovery and isolation audit only.

This OAR2 does not authorize DB mutation, frontend mutation, file deletion, route activation, payment activation, MAP activation, SEAT activation, Crystal Seat activation, c3 Key assignment, Field access, publishing, posting, scheduling, or media upload.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Recovery must precede isolation.

Isolation must precede implementation.

Nothing becomes launch-active because it exists.

Nothing becomes deprecated because it is old.

Everything must be classified first.

## ROUTED

Audit current Measures Registry standing across docs and DB-accessible references.

### Docs inventory targets

Search and classify:

- docs/seat/measures_registry/
- docs/seat/measures_registry/00_index/
- docs/seat/measures_registry/01_contracts/
- docs/seat/measures_registry/02_encounters/
- docs/seat/measures_registry/03_chamber_directories/
- docs/seat/measures_registry/04_integrations/
- docs/seat/measures_registry/05_automation/
- docs/seat/measures_registry/06_runtime_surfaces/
- docs/seat/measures_registry/07_media_assets/
- docs/seat/measures_registry/08_mrm_contact_memory/
- docs/seat/measures_registry/09_oar/
- docs/seat/measures_registry/10_validation/
- docs/seat/measures_registry/11_style_contracts/

Also search any existing project docs or working surfaces that reference Measures Registry.

### DB inventory targets

Inspect current DB-accessible configuration, migrations, seed files, schema files, SQL files, local env references, or Supabase access surfaces available in the workspace.

If direct DB access is available through current project tooling, run read-only inventory queries only.

If direct DB access is not available, report DB inventory as blocked and list what access/tooling is missing.

Do not mutate DB.

Expected DB areas to identify if available:

- Measures Registry system rows
- registry rows
- encounter rows
- release/access state
- media mappings
- runtime contracts
- route/transition rules
- contact/MRM structures
- assessment state
- MAP placeholders
- payment/governed commerce placeholders
- SEAT placeholders
- Crystal Seat / final confirmation rows
- social/integration references
- Paragraph/unDrifted references

### Search terms

Search for:

- measures_registry
- Measures Registry
- ai_isnt_broken
- epigraph_hook_20s
- questions_ungoverned_systems_cannot_answer
- assessment
- ai_operations_assessment
- assess_the_environment
- understand_the_environment
- unDrifted
- undrifted
- issue_01
- solstice
- lapis
- lapis_chamber_encounter
- obsidian
- our_story
- paragraph
- agents_with_keys
- social
- campaign
- MAP
- map_the_environment
- payment
- governed_commerce
- SEAT
- crystal
- crystal_seat
- c3_back_office
- c3_key
- field_access
- certification
- conversion

## CLASSIFICATION STATES

Classify every recovered surface as one of:

- launch_active
- candidate
- held
- deprecated
- drift
- unclear

Use these meanings:

launch_active:
  allowed to inform current launch docs after operator confirmation

candidate:
  usable but not active until seated

held:
  valid or potentially valid but not launch-active

deprecated:
  old route/language preserved as trace only

drift:
  conflicts with current architecture and must not govern

unclear:
  requires operator review before classification

## REQUIRED DISTINCTIONS

Preserve these distinctions:

- direct landing URL surface is not the same as Epigraph route
- Epigraph hook media is not mandatory routing layer
- unDrifted Issue 01 may be a Lapis page/signal issue but must be classified explicitly
- Lapis Chamber encounter is relational context surface
- Lapis Chamber encounter is not Obsidian assessment
- Obsidian assessment is the assessment encounter
- Our Story full video is long-form context asset
- Our Story clips are exported review derivatives, not campaign-selected
- Paragraph article registry is not publication execution
- social media contract is not social posting
- MAP the Environment is not assessment
- payment is not registration
- SEAT review is not Crystal Seat
- Crystal Seat is not an encounter
- Crystal Seat is final confirmation / registered standing surface
- c3 back office remains held

## AUDIT QUESTIONS

Cody must answer:

1. What Measures Registry docs currently exist?
2. What Measures Registry DB or DB-reference surfaces currently exist?
3. What surfaces appear to be current launch candidates?
4. What surfaces are prior working surfaces only?
5. What surfaces are held?
6. What surfaces are deprecated?
7. What surfaces conflict with the current architecture?
8. What files imply Crystal Seat is an encounter?
9. What files imply social posting/campaign activation?
10. What files imply Paragraph publishing authorization?
11. What files imply MAP/payment/SEAT/c3 Key/Field access activation?
12. What docs are missing before isolation can complete?
13. What DB references are missing before isolation can complete?
14. What is the recommended one-folder isolation path?
15. What is the recommended DB isolation plan?
16. What should be the next OAR2 after recovery?

## EXPECTED ISOLATION OUTPUT SHAPE

Do not create this folder yet unless already present.

Recommend a contained isolation path such as:

docs/seat/measures_registry_isolated/

or another path grounded in existing project structure.

The recommended isolated docs surface should eventually contain:

- recovered_active_index
- recovered_candidate_index
- held_surfaces_index
- deprecated_surfaces_index
- drift_flags_index
- db_inventory_report
- docs_inventory_report
- launch_surface_decision
- assessment_to_crystal_circuit_gap_report
- isolation_preflight_checklist

This OAR2 only audits and recommends.

It does not create the final isolation folder unless Cody determines an existing folder already serves that function and reports it.

## CODY ROLE

Cody may:

- search files
- inspect docs
- inspect project DB references
- run read-only DB inventory if tooling is already configured
- classify recovered surfaces
- produce audit report
- recommend isolation folder path
- recommend DB isolation plan
- write OAR1 closeout evidence

Cody may not:

- mutate DB
- mutate frontend runtime
- create or activate new launch route
- publish Paragraph articles
- post or schedule social media
- upload media
- delete files
- rename files
- activate MAP
- activate payment
- activate SEAT
- activate Crystal Seat
- assign c3 Key
- activate Field access
- activate c3 back office
- infer missing authority
- complete new circuit docs

## VALIDATION

Cody must return:

1. searched docs folders
2. searched DB/reference locations
3. DB access standing: available / blocked / partial
4. docs inventory table
5. DB inventory table or blocked-access report
6. recovered work list
7. classification table
8. launch-active candidate list
9. held surface list
10. deprecated surface list
11. drift/conflict list
12. missing critical docs
13. missing critical DB references
14. recommended one-folder isolation path
15. recommended DB isolation plan
16. recommended next OAR2 title
17. confirmation no DB mutation occurred
18. confirmation no frontend mutation occurred
19. confirmation no publishing/posting/upload/scheduling occurred
20. OAR1 path

Expected OAR1:

docs/seat/measures_registry/09_oar/oar1_recover_and_isolate_current_measures_registry_db_and_docs_standing_v1.meta.md

## CLOSE

This OAR2 succeeds when current Measures Registry docs and DB standing are recovered, inventoried, classified, and reported without mutation.

No DB mutation, frontend mutation, file deletion, route activation, publishing, posting, scheduling, upload, payment activation, MAP activation, SEAT activation, Crystal Seat activation, c3 Key assignment, Field access, certification, conversion, or c3 back office activation is authorized.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody audits.
src remains unchanged.
