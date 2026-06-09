---
document_type: oar2
authority_level: working
document_scope: measures_registry
title: OAR2 — Audit Chamber Directories, Orphaned Surfaces, and Public Semantic Pairings
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
  - obsidian
  - marble
  - lapis
  - crystal
  - orphaned-surfaces
  - public-semantics
  - map-integrity-governance
  - audit-first
---

# OAR2 — Audit Chamber Directories, Orphaned Surfaces, and Public Semantic Pairings v1

## OBSERVED

Measures Registry now has multiple active and legacy chamber-related surfaces across Obsidian, Marble, Lapis, and Crystal.

Current standing indicates that some surfaces are functioning, some are residue, and some are missing valid chamber-directory context.

Known examples:

- `measures_assessment` is the active assessment surface.
- `obsidian_to_marble_passage_video` is the registered passage from assessment completion toward Marble.
- `marble_pathway_reveal` currently acts as the opening Marble-side page but has weak or incorrect context.
- `map_integrity_governance` is the intended Marble encounter context.
- Crystal, Lapis, Obsidian, and Marble each need internal semantic standing checked against public-facing title/copy.
- Some surfaces may still carry deprecated language, internal material naming, schema bleed, old route labels, or no valid public title.
- Existing chamber-directory support is expected to exist and should be verified before adding new structure.

The current issue is not merely visual polish.

The issue is chamber interoperability coherence:

- what chamber a surface belongs to
- what encounter it represents
- what public title it should render
- what internal key it should retain
- what surfaces are orphaned
- what routes are deprecated aliases
- what copy/media/style/transition contracts apply
- what carry-forward state is required

## ALIGNED

Chamber directories must be treated as chamber-level interoperability contracts, not simple web page directories.

A chamber directory should resolve:

- chamber identity
- encounter inventory
- encounter order
- active / held / released state
- media contracts
- copy contracts
- style contracts
- commerce contracts where applicable
- carry-forward requirements
- transition rules
- validation requirements
- public/private visibility boundaries
- renderer contract

Internal semantics and public presentation must remain distinct.

Internal semantic examples:

- `obsidian_chamber`
- `marble_chamber`
- `lapis_chamber`
- `crystal_chamber`
- `map_integrity_governance`
- `obsidian_to_marble_passage_video`

Public-facing titles must not expose:

- chamber names
- material names
- schema terms
- SRC
- OAR1
- route keys
- table/view names
- internal directory language

Correct public principle:

Internal semantics govern structure.  
Public titles explain the experience.

Correct architecture principle:

Codex holds.  
Field structures.  
Measures registers.  
Chazz routes.  
`src` renders.

Frontend may not invent missing directory logic, chamber meaning, route meaning, public titles, or fallback truth.

## ROUTED

### 1. Audit existing chamber directory support

Verify whether schema and runtime already support chamber directory resolution.

Audit for existing records, views, fields, or contracts equivalent to:

- chamber directory
- chamber key
- encounter inventory
- encounter parent/child relation
- public title
- internal title
- route alias
- release state
- transition rule
- media binding
- style binding
- copy/text binding
- commerce binding
- carry-forward requirement

Do not create a new chamber-directory schema unless audit proves the existing schema cannot support the required function.

### 2. Audit Obsidian chamber content

Audit all Obsidian-related surfaces and records.

Minimum expected surfaces:

- AI Operations Assessment
- assessment question set
- current AI usage dropdown
- environment score
- circuit identification
- post-assessment contact capture
- SRC/OAR1 carry-forward creation
- Obsidian-to-Marble passage

Find and report:

- orphaned Obsidian surfaces
- long evaluation report residue
- deprecated email evaluation contract residue
- invalid public copy
- internal material/chamber/schema exposure
- incorrect result behavior
- missing carry-forward payload
- missing public title
- missing route alias
- missing or incorrect media/style contract

Required Obsidian public semantic direction:

- Public path: Assess the Environment
- Public assessment title: AI Operations Assessment
- Public result transition: Assessment received
- Public carry-forward meaning: result recorded and matched to a structured review path

Do not expose:

- Obsidian
- chamber
- SRC
- OAR1
- schema
- internal carry-forward mechanics

### 3. Audit Marble chamber content

Audit all Marble-related surfaces and records.

Minimum expected internal structure:

- Marble chamber directory
- MAP Integrity Governance encounter
- Pre-Deployment MAP contract
- Optimization MAP contract
- Remediation MAP contract
- MAP payment boundary
- MAP deliverables / resolution boundary
- SEAT release boundary
- SEAT Integrity Governance held/release state

Find and report:

- `marble_pathway_reveal` residue
- surfaces without internal or external context
- generic directory language
- public “Marble” exposure
- stale “Pathway Reveal” language
- incorrect MAP label usage
- incorrect payment-as-completion logic
- missing personalization from assessment results
- missing circuit-contract binding
- missing public title
- missing style/media contract
- missing SEAT hold/release rule

Required Marble public semantic direction:

- Public route to harden: `/map-integrity-governance`
- Internal deprecated alias: `marble_pathway_reveal`
- Public title: MAP Integrity Governance
- Public selected circuit labels:
  - Pre-Deployment MAP
  - Optimization MAP
  - Remediation MAP

Required Marble copy logic:

- Load correct MAP circuit contract from carried assessment result.
- Personalize with organization context where available.
- Reference environment score.
- Surface selected assessment indicators.
- Explain that the initial assessment identified the review path.
- Explain that the MAP is not a repeat of the assessment.
- Explain that Measures Registry does not provide generic helpful suggestions because helpful suggestions do not verify authority, role boundaries, review ownership, evidence paths, or implementation readiness.
- Explain that MAP measures, audits, and prepares the organization for SEAT — System Environment Alignment Track.
- Preserve SEAT as held until MAP deliverables/resolution complete the commerce circuit.

Do not expose:

- Marble chamber
- chamber directory
- schema
- SRC
- OAR1
- internal table names
- raw commerce dump
- raw contract JSON

### 4. Audit Lapis chamber content

Audit all Lapis-related surfaces and records.

Determine whether Lapis currently functions as:

- landing-page holder
- SEO/social support route holder
- relational orientation chamber
- education support surface
- deprecated residue
- mixed-purpose surface

Find and report:

- orphaned Lapis surfaces
- Lapis-styled content incorrectly used outside Lapis
- public material naming exposure
- old education-route residue
- structural drift publication placement issues
- unDrifted route conflicts
- missing public title
- missing route alias
- missing style/media contract
- invalid inheritance into Obsidian, Marble, or Crystal

Required output:

For each Lapis surface, classify:

- keep
- correct
- hold
- deprecate
- orphaned / no valid context

Do not mutate Lapis in this OAR unless explicitly routed after audit.

### 5. Audit Crystal chamber content

Audit all Crystal-related surfaces and records.

Determine whether current Crystal content resolves to:

- Understand the Environment path
- Inanna’s Seat / coherent environment exemplar
- Questions Ungoverned Systems Cannot Answer video
- structural drift publication residue
- foundational leadership residue
- mixed landing-page content
- incorrect public chamber exposure

Find and report:

- orphaned Crystal surfaces
- content that belongs to Lapis or standalone routes
- structural drift publication bleed
- foundational leadership bleed
- oversized/cramped runtime layout
- missing public title
- internal material/chamber naming exposure
- missing style/media/copy contract
- invalid right-path continuation

Required output:

For each Crystal surface, classify:

- keep
- correct
- hold
- deprecate
- orphaned / no valid context

Do not mutate Crystal in this OAR unless explicitly routed after audit.

### 6. Identify all orphaned and residue surfaces

Produce a chamber-wide orphan report.

For every surface encountered, return:

- current key
- current route or query surface
- current public title
- current internal context
- expected chamber directory
- expected encounter
- status:
  - active_valid
  - active_needs_semantic_correction
  - deprecated_alias
  - orphaned
  - residue
  - held
- recommended action:
  - keep
  - bind_to_directory
  - rename_public_title
  - redirect_alias
  - hold
  - deprecate
  - remove_from_public_flow

### 7. Verify internal semantics have matching public titles

For every valid encounter, verify it has:

- internal key
- internal semantic definition
- public title
- public subtitle or purpose copy
- route alias if public-facing
- visibility state
- chamber directory binding
- renderer contract

Required pairing format:

internal_key  
→ public_title  
→ public_purpose  
→ visibility  
→ directory_binding  
→ route_alias

Example:

`map_integrity_governance`  
→ MAP Integrity Governance  
→ Presents the selected MAP review path after assessment completion.  
→ public_after_contact_submit  
→ marble_chamber_directory  
→ `/map-integrity-governance`

### 8. Verify public/private boundary

Audit public surfaces for forbidden language.

Forbidden public exposure includes:

- Obsidian Chamber
- Marble Chamber
- Lapis Chamber
- Crystal Chamber
- chamber directory
- schema
- table
- view
- SRC
- OAR1
- OAR2
- internal route key
- raw contract
- codexstone
- C1 / C2 / C3
- c3 Key
- wallet
- DAO
- certification
- registered system
- SEAT if implied as open before MAP resolution

Flag every occurrence and identify the surface where it appears.

### 9. Verify MAP circuit contract binding

For the Marble-side MAP encounter, verify:

- assessment result produces environment score
- assessment result produces circuit identification
- contact info is bound after assessment
- SRC/OAR1 carry-forward exists or is required
- carried state resolves into correct MAP contract
- selected MAP contract determines commerce circuit
- price/payment authority remains in commerce contract table
- payment opens MAP work only
- MAP deliverables/resolution complete commerce circuit
- SEAT opens only after MAP resolution

Do not let frontend determine the MAP contract.

### 10. Verify media/style/copy contracts

For each valid chamber encounter, verify:

- media binding exists
- style binding exists
- copy/text binding exists
- renderer consumes the binding
- no stale fallback is supplying visual coherence
- no wrong material asset is bleeding into another chamber
- no raw white/default fallback appears on active public surfaces unless intentionally seated

Known issue to check:

- codexstone visual bleed was wrong authority
- deactivating it exposed missing Marble visual contract
- Marble needs governed visual/style contract, not restoration of wrong asset

### 11. Produce corrective OAR recommendations

This OAR is audit-first.

After audit, produce recommended next OAR2s in priority order.

Expected likely follow-up OARs:

1. Correct Obsidian assessment carry-forward and contact-to-passage behavior.
2. Harden `marble_pathway_reveal` into `/map-integrity-governance` through Marble chamber directory.
3. Correct Marble MAP contract personalization and SEAT release boundary.
4. Correct Crystal / Understand the Environment placement.
5. Correct Lapis / SEO-social route holder placement.
6. Seat MRM — Measures Relational Management — after Obsidian/Marble seam is stable.

Do not implement MRM in this OAR.

## EXECUTOR MAY

- inspect database schema
- inspect chamber directory support
- inspect registry tables/views
- inspect encounter definitions
- inspect release state
- inspect transition rules
- inspect media maps
- inspect copy/text records
- inspect runtime/component route handling
- inspect public routes and query surfaces
- produce audit tables
- identify orphaned surfaces
- identify residue terms
- identify public/private semantic leaks
- identify missing public title pairings
- recommend next OAR2s
- write OAR1 audit closeout

## EXECUTOR MAY NOT

- create new chamber directory schema without audit proof
- rename DB keys
- mutate payment contracts
- change MAP prices
- configure Stripe webhook
- activate SEAT
- activate c3 Key
- activate wallet
- activate MRM
- delete records without hold/deprecation review
- expose internal chamber/material/schema language publicly
- treat `marble_pathway_reveal` as a valid encounter without directory binding
- repair visual issues by restoring wrong authority assets
- implement frontend hardcoding to compensate for missing registry state

## VALIDATION

Return an audit report with:

1. Existing chamber-directory support confirmed or missing.
2. Obsidian surface inventory.
3. Marble surface inventory.
4. Lapis surface inventory.
5. Crystal surface inventory.
6. Orphaned surface list.
7. Deprecated/residue surface list.
8. Internal semantic to public title pairing table.
9. Public/private boundary leak report.
10. MAP circuit contract binding report.
11. Media/style/copy contract consumption report.
12. `marble_pathway_reveal` standing classified.
13. `/map-integrity-governance` readiness assessment.
14. Obsidian carry-forward readiness assessment.
15. Crystal correction needs.
16. Lapis correction needs.
17. Recommended next OAR2 priority list.
18. No mutation performed unless explicitly approved.
19. Build not required unless audit touches runtime.
20. OAR1 written.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_audit_chamber_directories_orphaned_surfaces_and_public_semantic_pairings_v1.meta.md

## TRANSFER FILENAME AFTER CONFIRM

oar2_audit_chamber_directories_orphaned_surfaces_and_public_semantic_pairings_v1.meta.md

## CLOSE

This audit determines whether the chamber directory architecture is coherent enough to carry Measures Registry as a repeatable system, not a one-off website.

The result must identify which chamber surfaces are valid, which are orphaned, which are residue, and which internal semantics require matching public titles before launch continuation.
