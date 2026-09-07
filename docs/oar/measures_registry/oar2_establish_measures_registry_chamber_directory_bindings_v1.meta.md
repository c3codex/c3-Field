---
document_type: oar2
authority_level: working
document_scope: measures_registry
title: OAR2 — Establish Measures Registry Chamber Directory Bindings
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-registry
  - chamber-directory
  - chamberplates
  - obsidian
  - marble
  - lapis
  - crystal
  - interoperability
  - public-semantics
  - directory-bindings
---

# OAR2 — Establish Measures Registry Chamber Directory Bindings v1

## OBSERVED

Measures Registry chamber-directory support is expected to exist or be expressible through current registry structures, but Measures Registry runtime threshold surfaces are not yet fully bound into chamber-directory architecture.

Important correction:

Chamberplates and chamber_directory are not the same thing.

- Chamberplates are rendered encounter units or chamberplate surfaces.
- Chamber_directory is the chamber-level interoperability, ordering, and resolution contract.

A chamberplate view may be inspected as evidence of rendered chamberplate standing, but it must not be treated as proof that chamber_directory has been established for Measures Registry runtime surfaces.

Prior audit confirmed:

- existing chamberplate/directory-adjacent structures exist
- existing chamberplate support is mostly serving the Inanna narrative structure
- Measures Registry runtime surfaces such as `measures_assessment`, `obsidian_to_marble_passage_video`, and the former `marble_pathway_reveal` operate as threshold/runtime surfaces outside full chamber-directory binding
- `map_integrity_governance` has now been seeded as canonical Marble-side encounter
- `marble_pathway_reveal` has been demoted to legacy alias
- `/map-integrity-governance` has been added as public route
- Obsidian-to-Marble carry-forward now writes durable carry-forward state into `measures_iis_eval_gate1_capture.metadata.carry_forward`

The current risk is that runtime surfaces may continue acting like website pages instead of chamber-bound encounters.

Current drift pattern to eliminate:

route  
→ component  
→ copy

Correct architecture:

Codex state  
→ chamber directory  
→ encounter contract  
→ renderer

This OAR establishes Measures Registry chamber-directory bindings across:

- Obsidian
- Marble
- Lapis
- Crystal

It does not complete every future runtime correction. It establishes the directory binding layer so future corrections resolve through chamber architecture instead of loose surfaces.

## ALIGNED

A chamber directory is not a simple page list.

A chamber directory is the interoperability contract for a chamber.

It must resolve:

- chamber identity
- encounter inventory
- encounter order
- active / held / released state
- internal semantic key
- public title
- public purpose
- route alias
- media contract
- style contract
- copy/text contract
- transition rule
- carry-forward requirement
- visibility boundary
- commerce contract where applicable
- release boundary
- renderer contract
- validation requirement

A chamberplate is not the directory.

A chamberplate may be one rendered unit within a chamber structure, but it does not define the directory contract for the chamber.

Public copy must not expose chamber or material language.

Internal semantics may retain chamber/material context where needed for registry operation.

Correct distinction:

Internal semantic key governs structure.  
Public title explains the experience.

Correct native order:

Codex holds.  
Field structures.  
Measures registers.  
Chazz routes.  
Cody executes from OAR2.  
`src` renders seated state only.

The chamber-directory layer must prevent:

- orphaned surfaces
- legacy aliases becoming authority
- public/internal semantic drift
- frontend-owned route meaning
- chamber/material exposure in public copy
- MAP / SEAT / assessment boundary collapse
- Crystal / Lapis / Obsidian / Marble role collapse

## ROUTED

### 1. Audit current chamber-directory support before mutation

Inspect existing directory-capable surfaces and related schema:

- `measures_registry`
- `measures_encounter_def`
- `measures_release_state`
- `v_measures_encounter_manifest_v1`
- existing `registry_family = 'chamber_directory'` rows
- route alias / metadata / manifest fields
- media/style/copy contract fields
- transition or sequence fields

Inspect chamberplate surfaces separately:

- `v_measures_chamberplate_v1`
- chamberplate-related rows
- Inanna narrative chamberplate bindings

Do not use chamberplates as proof of chamber_directory.

Required audit distinction:

- chamber_directory support
- chamberplate support
- encounter manifest support
- Measures Registry threshold/runtime support

Determine the safest current binding method.

Do not create a new chamber-directory schema unless existing support cannot express required bindings.

Preferred result:

Use existing `measures_registry` / `measures_encounter_def` / manifest metadata patterns to bind Measures Registry runtime surfaces into chamber-directory standing.

### 2. Define Measures Registry chamber directories

Verify or seat directory standing for:

- `obsidian_directory`
- `marble_directory`
- `lapis_directory`
- `crystal_directory`

If a directory already exists, do not duplicate it.

If an existing directory belongs only to Inanna narrative standing, do not overwrite it. Instead, create a Measures Registry-specific binding or metadata scope that preserves distinction.

Required distinction:

- Inanna narrative chamber directory
- Inanna chamberplates
- Measures Registry runtime chamber directory
- Measures Registry threshold/runtime encounters

Do not collapse Inanna chamberplate surfaces with Measures Registry public runtime surfaces.

### 3. Establish Obsidian directory binding

Bind Obsidian runtime surfaces to Obsidian directory standing.

Expected Obsidian scope:

- `ai_operations_assessment_landing`
- `eval_passage`
- `measures_assessment`
- post-assessment contact capture state
- `obsidian_to_marble_passage_video`

Obsidian internal role:

Assessment threshold, reduction, scoring, contact capture, carry-forward, passage.

Public-facing titles/purposes:

- Assess the Environment
- AI Operations Assessment
- Assessment received
- Before the Pathway or approved passage title if still seated

Required bindings for each valid Obsidian encounter:

- internal_key
- public_title
- public_purpose
- route_alias if public-facing
- active/held/released state
- directory binding
- transition target
- required carry-forward state
- media contract
- style contract
- renderer contract

Public copy must not expose:

- Obsidian
- chamber
- material
- SRC
- OAR1
- schema
- table
- route key
- carry_forward

### 4. Establish Marble directory binding

Bind Marble runtime surfaces to Marble directory standing.

Expected Marble scope:

- `map_integrity_governance`
- `marble_pathway_reveal` as legacy alias only
- selected MAP circuit contract binding
- MAP payment boundary
- MAP deliverables/resolution boundary
- SEAT held/release boundary

Marble internal role:

MAP integrity governance, contract selection, payment opening, deliverables/resolution boundary, SEAT release boundary.

Public-facing title:

MAP Integrity Governance

Required public route:

`/map-integrity-governance`

Required Marble binding:

- `map_integrity_governance` is canonical encounter
- `marble_pathway_reveal` is legacy alias only
- selected MAP circuit resolves from carried `circuit_identification`
- payment opens MAP work only
- SEAT remains held until MAP deliverables/resolution
- MAP pricing remains DB-driven
- no public material/chamber language

Required selected circuit labels:

- Pre-Deployment MAP
- Optimization MAP
- Remediation MAP

Do not expose:

- Marble
- chamber
- chamber directory
- `marble_pathway_reveal`
- `map_commerce_contracts`
- raw JSON
- SRC/OAR language
- c3 Key
- wallet
- DAO
- certification
- registered system

### 5. Establish Lapis directory binding

Bind Lapis-related Measures Registry runtime surfaces to Lapis directory standing without disturbing Inanna antechamber/spine records.

Expected Lapis roles to classify:

- landing support
- SEO/social support route holder
- relational orientation support
- Structural Drift / unDrifted route holder
- any old education-route residue
- any route that improperly inherits Lapis styling outside Lapis scope

Required output:

For each Lapis-linked surface:

- internal_key
- public_title
- public_purpose
- directory_binding
- route_alias
- status:
  - keep
  - correct
  - hold
  - deprecate
  - orphaned
- correction required if public title exposes internal language

Known issue to check:

- `src1_connect_view` public title exposes SRC1 naming and must be corrected or held if still active/public.

Do not mutate SEO copy broadly in this OAR.

Do not touch route-specific SEO metadata except to classify missing bindings.

### 6. Establish Crystal directory binding

Bind Crystal-related Measures Registry runtime surfaces to Crystal directory standing without disturbing held Inanna narrative records.

Expected Crystal roles to classify:

- Understand the Environment path
- `structure_passage`
- questions / ungoverned systems video surface
- public education orientation
- any structural drift dispatch residue
- any foundational leadership residue
- any Inanna narrative surfaces currently held

Required output:

For each Crystal-linked surface:

- internal_key
- public_title
- public_purpose
- directory_binding
- route_alias
- status:
  - keep
  - correct
  - hold
  - deprecate
  - orphaned
- correction required if public title exposes material/chamber language

Known issue to correct or route:

- `crystal_chamber` display title must not publicly render as “Crystal Chamber.”
- `structure_passage` must remain public-safe as Understand the Environment.
- held Inanna narrative surfaces must not be accidentally activated.

### 7. Establish directory binding table/read model if existing structures cannot express runtime surfaces

If existing structures cannot express Measures Registry threshold/runtime directory bindings, create or recommend a DB view/read model.

Preferred view name:

`v_measures_registry_chamber_directory_v1`

Purpose:

Resolve Measures Registry chamber-directory state without replacing authority tables.

The view may derive from:

- `measures_registry`
- `measures_encounter_def`
- release/access state
- media map
- route metadata
- style/copy metadata
- commerce contract where applicable

The view must not become authority.

It is a resolved read model only.

Minimum output fields:

- chamber_key
- directory_key
- encounter_key
- legacy_aliases
- internal_semantic
- public_title
- public_purpose
- route_alias
- material_family_internal
- visibility_state
- release_state
- access_state
- surface_type
- encounter_type
- sequence_order
- media_contract_key
- style_contract_key
- copy_contract_key
- transition_target
- required_carry_forward_keys
- commerce_contract_key
- renderer_contract
- public_boundary_status
- correction_status

Do not use the view to invent missing records.

If required source records are missing, report missing records and seat only with explicit OAR scope.

### 8. Establish public/private semantic pairing

For each active or held Measures Registry chamber encounter, produce a pairing:

internal_key  
→ chamber_directory  
→ public_title  
→ public_purpose  
→ route_alias  
→ visibility_state  
→ renderer_contract

Required pairing examples:

`measures_assessment`  
→ `obsidian_directory`  
→ AI Operations Assessment  
→ Scores the organization’s current AI operating environment.  
→ assessment route / current surface alias  
→ public  
→ assessment renderer

`obsidian_to_marble_passage_video`  
→ `obsidian_directory`  
→ Assessment Received  
→ Confirms assessment receipt and prepares the next step.  
→ passage surface alias  
→ public_after_contact_submit  
→ passage renderer

`map_integrity_governance`  
→ `marble_directory`  
→ MAP Integrity Governance  
→ Presents the selected MAP review path after assessment completion.  
→ `/map-integrity-governance`  
→ public_after_contact_submit  
→ MAP renderer

### 9. Classify and bind legacy aliases

Legacy aliases may remain for migration but must not carry public meaning.

Known alias:

`marble_pathway_reveal`  
→ legacy alias for `map_integrity_governance`

Other aliases to inspect:

- `intro`
- `path_choice`
- `structural_drift_dispatches`
- any query-surface alias that does not match encounter key

Required output:

- alias_key
- canonical_encounter_key
- public_title
- active/held/deprecated state
- migration recommendation

No legacy alias may display obsolete public semantics.

### 10. Maintain active seam priority

This OAR establishes chamber-directory bindings.

It must not interrupt the active assessment-to-MAP seam.

Preserve:

- assessment scoring
- current AI usage dropdown
- post-assessment contact capture
- durable carry-forward write
- passage autoload
- `map_integrity_governance`
- `/map-integrity-governance`
- MAP contract selection
- MAP pricing
- Stripe checkout
- SEAT hold
- c3 Key hold
- wallet hold

### 11. Do not expand into unrelated systems

Do not implement:

- MRM
- SEO metadata seating
- `src_intake_request` write
- `oar1_log` schema changes
- Stripe webhook configuration
- c3 Key
- wallet connect
- DAO standing
- certification
- registered system standing
- broad visual redesign

Those remain separate OARs.

## EXECUTOR MAY

- inspect current DB schema and views
- inspect existing chamber_directory rows
- inspect chamberplate rows separately
- inspect `measures_registry`
- inspect `measures_encounter_def`
- inspect release/access state
- inspect route alias metadata
- inspect media/style/copy contracts
- inspect runtime surface handlers
- seat missing Measures Registry chamber directory rows if existing pattern supports it
- bind active runtime encounters to chamber directories through metadata/registry pattern
- create a read-only resolved directory view if existing views cannot express runtime surfaces
- correct public title metadata where public/private boundary is clearly violated
- classify orphans and aliases
- run build if runtime code touched
- write OAR1

## EXECUTOR MAY NOT

- treat chamberplates as chamber_directory
- use `v_measures_chamberplate_v1` as proof of chamber_directory support
- create a parallel authority layer
- overwrite Inanna chamber directories
- collapse Inanna narrative chamberplates with Measures Registry runtime surfaces
- delete records without deprecation/hold review
- change MAP pricing
- change Stripe checkout
- activate SEAT
- activate c3 Key
- activate wallet
- introduce MRM
- seat SEO metadata
- write to `src_intake_request`
- modify `oar1_log`
- touch public copy broadly outside title/purpose correction required for directory binding
- hardcode chamber meaning in frontend
- expose chamber/material/schema/SRC/OAR language publicly
- treat legacy aliases as canonical encounters

## VALIDATION

Return proof:

1. Existing chamber-directory support inspected separately from chamberplate support.
2. Chamberplates and chamber_directory distinction confirmed.
3. Existing Inanna directory/chamberplate standing preserved.
4. Measures Registry runtime directory binding strategy documented.
5. Obsidian directory standing confirmed or seated.
6. Marble directory standing confirmed or seated.
7. Lapis directory standing confirmed or seated.
8. Crystal directory standing confirmed or seated.
9. Active Obsidian surfaces bound or listed with blocker.
10. Active Marble surfaces bound or listed with blocker.
11. Active Lapis surfaces bound or listed with blocker.
12. Active Crystal surfaces bound or listed with blocker.
13. `map_integrity_governance` bound to Marble directory standing.
14. `marble_pathway_reveal` remains legacy alias only.
15. Public route `/map-integrity-governance` preserved.
16. Public/private title pairing table returned.
17. Legacy alias table returned.
18. Orphan/residue list updated.
19. No public copy exposes chamber/material/schema/SRC/OAR language.
20. Assessment-to-MAP seam remains functional.
21. MAP pricing unchanged.
22. Stripe checkout unchanged.
23. SEAT remains held.
24. c3 Key/wallet remain held.
25. Crystal/Lapis held Inanna narrative surfaces not accidentally activated.
26. MRM not introduced.
27. SEO metadata not seated.
28. Build passes if runtime touched.
29. OAR1 written.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_establish_measures_registry_chamber_directory_bindings_v1.meta.md

## CLOSE

Chamberplates are rendered encounter units.

Chamber_directory is the interoperability contract.

Chamber directories determine what each chamber contains, what each encounter means, what state it requires, what public title it carries, what it releases, and what renderer contract applies.

This OAR establishes Measures Registry as a repeatable integrity-governance system rather than a one-off website flow.
