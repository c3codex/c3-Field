---
document_type: oar1
authority_level: working
document_scope: measures_registry
title: OAR1 — Audit Chamber Directories, Orphaned Surfaces, and Public Semantic Pairings
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_chamber_directories_orphaned_surfaces_and_public_semantic_pairings_v1.meta.md
executor: claude
execution_date: 2026-06-09
tags:
  - oar1
  - measures-registry
  - audit
  - chamber-directory
  - obsidian
  - marble
  - lapis
  - crystal
  - orphaned-surfaces
  - public-semantics
  - no-mutation
---

# OAR1 — Audit Chamber Directories, Orphaned Surfaces, and Public Semantic Pairings v1

## OBJECTIVE

Audit existing chamber directory support, surface inventories across all four chambers, orphaned encounters, public/private boundary integrity, MAP circuit contract binding, and media/style/copy contract consumption. No mutation.

## ACTION

Inspection only. No source, DB, CSS, or route changes made.

Queries executed: `v_measures_chamberplate_v1`, `v_measures_registry_state_v2`, `measures_encounter_def`, `measures_media_map`, `map_commerce_contracts`, `measures_registry`, `information_schema.columns` for all relevant tables.

Source read: `MeasuresRegistryRuntimeRegistered.tsx` — surface handler list, copy derivation, carry-forward logic.

---

## VALIDATION OUTPUT

### 1. Existing Chamber-Directory Support

**CONFIRMED. Schema and runtime already support chamber directory resolution.**

Three tables/views provide this function:

| Mechanism | Purpose |
|---|---|
| `v_measures_chamberplate_v1` | Chamber directory view — joins `measures_registry` + `measures_encounter_def` + `measures_release_state` for `surface_type = chamberplate` entries |
| `measures_registry` rows with `registry_family = 'chamber_directory'` | Explicit directory entries: `antechamber_directory` (Lapis), `epithet_directory` (Lapis), `marble_directory` (Marble) |
| `v_measures_encounter_manifest_v1` | Encounter manifest with `presentation`, `media`, `actions`, `sequence`, `phase_map` JSONB columns — full encounter runtime contract |

**Important structural note:** The chamberplate system serves the **Inanna's Descent narrative** (gates, epithets, MEs). The Measures Registry runtime surfaces (`measures_assessment`, `marble_pathway_reveal`, etc.) are all `surface_type = threshold` and exist **outside** the chamberplate directory. These two encounter systems share `material_family` labels (obsidian, marble, lapis, crystal) but are structurally separate. They have not been unified under a common directory contract.

**Gaps in existing directory support:**
- No `obsidian_directory` registry entry exists
- No `map_integrity_governance` encounter exists in `measures_encounter_def` or `measures_registry`
- `marble_directory` registry entry (seq 4, released/visible) is bound to the Inanna ME sequence, not the MAP commerce circuit
- Runtime threshold surfaces have no directory bindings — no parent-child relation, no chamber assignment in chamberplate

---

### 2. Obsidian Surface Inventory

**Actively handled surfaces (source has a case handler):**

| surface key | encounter key (copy source) | display_title | status |
|---|---|---|---|
| `intro` | `ai_isnt_broken_intro` | Measures Registry | active_needs_semantic_correction — runtime alias does not match encounter key |
| `path_choice` | `evaluate_structure_path` | AI isn't broken. Systems are. | active_needs_semantic_correction — runtime alias does not match encounter key |
| `ai_operations_assessment_landing` | `ai_operations_assessment_landing` | AI Operations Assessment \| Measures Registry | active_valid |
| `eval_passage` | `eval_passage` | Evaluation Passage | active_valid |
| `structure_passage` | `structure_passage` | Understand the Environment | active_valid |
| `measures_assessment` | `measures_assessment` | AI Operations Assessment | active_valid |
| `obsidian_to_marble_passage_video` | `obsidian_to_marble_passage_video` | Before the Pathway | active_valid |

**Active encounters with NO source handler (orphaned or residue):**

| encounter_key | display_title | classification | recommended action |
|---|---|---|---|
| `ai_isnt_broken_intro` | Measures Registry | orphaned — copy consumed by `intro` alias | bind_to_directory or rename as route alias for `intro` |
| `connect_src` | c3 Field | orphaned + public name violation | remove_from_public_flow — c3 Field naming must not appear publicly |
| `structured_eval` | Structured Evaluation | orphaned | hold or deprecate |
| `measures_phases_reveal` | Measures Phases | orphaned | hold or deprecate |
| `about_measures_registry` | About Measures Registry | orphaned | hold or deprecate |
| `reserve_seat` | Governed Optimization | orphaned | hold |
| `measures_eval_email_contract` | Measures Evaluation Email Contract | **active residue — email contract deprecated approach** | deprecate — no source handler, no governed route |
| `phase_payment` | Phase Payment | active residue — old SEAT payment surface | hold — awaiting MAP resolution circuit replacement |
| `foundation_seat_hold` | FOUNDATION SEAT | active residue — old SEAT hold surface | hold |
| `seat_hold_notification_review` | Seat Hold Notification Review | orphaned | hold |
| `registered_process_log` | Registered Process Log | orphaned | hold |

**Inactive encounters (residue, safe to archive):**

| encounter_key | display_title | note |
|---|---|---|
| `educate_eval_encounter` | System Evaluation | inactive residue |
| `cohort_conversion_encounter` | Measures Conversion | inactive residue |
| `iis_eval_gate1` | MEASURES AI OPERATIONAL EVALUATION | inactive — old IIS eval gate, all-caps internal label |
| `understand_failure` | Deprecated Reference | inactive — literally labeled as deprecated |
| `orientation_placeholder` | About Measures Registry | inactive duplicate |
| `structural_drift_field_guide` | Structural Drift | inactive, wrong material family |
| `foundation_offering` | FOUNDATION SEAT | inactive SEAT residue |
| `systems_offering` | SYSTEMS SEAT | inactive SEAT residue |
| `systems_seat_hold` | SYSTEMS SEAT | inactive SEAT residue |

**Carry-forward status:**
- No SRC/OAR1 carry-forward creation found in `MeasuresRegistryRuntimeRegistered.tsx`. Assessment result is held in component state (`evalReport`) and threaded as a prop to `MarbleCommerceDirectory` via `sharedAssessmentProps`. This is session-state carry-forward only — no durable record is created from assessment completion to Marble entry.
- Contact capture (`post_assessment_contact`) is not represented as a separate surface in the runtime. No handler exists for a contact-gate surface between assessment result and passage.
- `src_intake_request` table exists in DB but no source writes to it from the assessment flow.

---

### 3. Marble Surface Inventory

**Actively handled surfaces:**

| surface key | encounter key | display_title | status |
|---|---|---|---|
| `marble_pathway_reveal` | `marble_pathway_reveal` | Recommended Governed Pathway | active_needs_semantic_correction |

**Chamberplate surfaces (Inanna ME sequence) — no source handlers in Measures Registry runtime:**

| encounter_key | display_title | release_state | note |
|---|---|---|---|
| `me_01` | Memory | released/visible | Inanna narrative, not MAP |
| `me_02` through `me_13` | The Measuring Cord...Craft | held/gated | Inanna narrative |
| `codexstone_encounter` | Codexstone | released/encounterable | codexstone name exposed |
| `chamber_epithets_06_concursus_cubicali_encounter` | Concursus Cubicali | held/gated | epithet |
| `chamber_epithets_08_the_last_oracle_encounter` | The Last Oracle | held/gated | epithet |

**Registry issues:**
- `marble_chamber` registry entry — display_title "Marble Chamber" — exposes chamber name, `release_state = released, access_state = encounterable`
- `codexstone` registry entry — display_title "Codexstone" — `release_state = released, access_state = visible`
- `marble_directory` registry entry — bound to Inanna ME sequence, not MAP circuit

**Missing:**
- No `map_integrity_governance` encounter or registry entry
- No `/map-integrity-governance` route alias
- `marble_pathway_reveal` display_title is "Recommended Governed Pathway" — not "MAP Integrity Governance"
- No governed Marble visual contract after `marble_accent_reference` deactivation

---

### 4. Lapis Surface Inventory

Lapis functions as: **SEO/social route holder** + **landing page section registry** + **Inanna antechamber spine**.

**Keep (valid active surfaces):**

| registry_key | display_title | classification |
|---|---|---|
| `measures_registry_runtime` | Measures Registry Runtime | keep — runtime container |
| `landing_video_hero` | Integrity Governance for AI Systems | keep — landing section |
| `landing_intro_video` | AI isn't broken. Systems are. | keep — landing section |
| `landing_problem` | AI acceleration is outpacing institutional coherence. | keep — landing section |
| `landing_courses` | Courses seat practice before deployment pressure. | keep — landing section |
| `landing_principle` | Measure precedes acceleration. | keep — landing section |
| `landing_final_cta` | Enter the June cohort with the system in view. | keep — landing section |
| `ai_operations_assessment_landing` | AI Operations Assessment \| Measures Registry | keep — SEO route |
| `structural_drift_landing` | Structural Drift \| unDrifted | keep — SEO route |
| `antechamber`, `antechamber_directory` | Antechamber / Antechamber Directory | keep — Inanna backbone |
| `epithet_directory` | Epithet Directory | keep — Inanna backbone |
| `harrumuk_passage`, `kumurrah_passage` | passages | keep — Inanna backbone |
| `evaluate_structure_path` | AI isn't broken. Systems are. | keep — copy source for path_choice surface |

**Correct:**

| registry_key | display_title | issue | action |
|---|---|---|---|
| `src1_connect_view` | SRC1 Connect | exposes SRC1 internal naming publicly | correct — rename display_title to not expose SRC terminology |

**Hold:**

| registry_key | display_title | reason |
|---|---|---|
| `return_antechamber` | Return Antechamber | valid Inanna surface but no current active display path |
| `chamber_epithets_02_gemynd_corpus` | Gemynd Corpus | epithet, gated |
| `chamber_epithets_07_aphrodite` | Aphrodite | epithet, held |

---

### 5. Crystal Surface Inventory

Crystal functions as: **Understand the Environment passage** + **Inanna narrative chamber**.

**Active and handled:**

| surface key | encounter key | display_title | status |
|---|---|---|---|
| `structure_passage` | `structure_passage` | Understand the Environment | active_valid |
| `crystal_chamber` | `crystal_chamber` | Crystal Chamber | active_needs_semantic_correction — "Crystal Chamber" exposes material name |
| `structural_drift_dispatches` | `structural_drift_publication` | Structural Drift | active_needs_semantic_correction — surface/encounter key mismatch |

**Crystal encounters with no source handler:**

| encounter_key | display_title | classification | action |
|---|---|---|---|
| `inanna_encounter` | A Letter to My Divine Feminine Energy | hold | hold — no current active route |
| `epigraph_view` | Epigraph | hold | hold — aspect type, no current handler |
| `temple_harrumuk_passage_view` | Temple — Harrumuk Passage | hold | hold — Inanna narrative |
| `temple_antechamber_return_view` | Temple — Antechamber Return | hold | hold — Inanna narrative |
| `epithets_passage_01_encounter` through `_08_encounter` | Epithets Passage 01-08 | hold | hold — Inanna narrative passages |

**Crystal registry issues:**
- `crystal_chamber` registry: `release_state = held, access_state = encounterable` — but source handles it and route exists. Registry state is inconsistent with live behavior.
- `crystal_temple_home` registry: `release_state = open, access_state = visible` — no source handler.

**Classification:**

| surface/key | classification | action |
|---|---|---|
| `structure_passage` | keep | keep — active, handled |
| `crystal_chamber` | correct | rename display_title, resolve registry/source state mismatch |
| `structural_drift_dispatches` | correct | bind source alias to encounter key |
| `inanna_encounter`, passages, epithets | hold | hold — Inanna narrative, not active public path |

---

### 6. Orphaned Surface List

Full cross-chamber orphan report:

| current_key | surface/route | current_public_title | expected chamber | status | recommended_action |
|---|---|---|---|---|---|
| `ai_isnt_broken_intro` | `?surface=intro` (alias) | — | Obsidian threshold | deprecated_alias | bind_to_directory (alias for `intro`) |
| `connect_src` | none | c3 Field | Obsidian threshold | orphaned + public violation | remove_from_public_flow |
| `structured_eval` | none | Structured Evaluation | Obsidian threshold | orphaned | hold |
| `measures_phases_reveal` | none | Measures Phases | Obsidian threshold | orphaned | hold |
| `about_measures_registry` | none | About Measures Registry | Obsidian threshold | orphaned | hold |
| `reserve_seat` | none | Governed Optimization | Obsidian threshold | orphaned | hold |
| `measures_eval_email_contract` | none | Measures Evaluation Email Contract | Obsidian threshold | residue — email contract | deprecate |
| `phase_payment` | none | Phase Payment | Obsidian threshold | residue — old SEAT | hold |
| `foundation_seat_hold` | none | FOUNDATION SEAT | Obsidian threshold | residue — old SEAT | hold |
| `seat_hold_notification_review` | none | Seat Hold Notification Review | Obsidian threshold | orphaned | hold |
| `registered_process_log` | none | Registered Process Log | Obsidian threshold | orphaned | hold |
| `crystal_temple_home` | none | Crystal Temple Home | Crystal spine | orphaned | hold |
| `inanna_encounter` | none | A Letter to My Divine Feminine Energy | Crystal threshold | hold | hold |
| `codexstone_encounter` | none | Codexstone | Marble chamberplate | residue | remove_from_public_flow |

---

### 7. Deprecated/Residue Surface List

| encounter_key | display_title | reason |
|---|---|---|
| `understand_failure` | Deprecated Reference | explicitly labeled deprecated, inactive |
| `educate_eval_encounter` | System Evaluation | old eval approach, inactive |
| `iis_eval_gate1` | MEASURES AI OPERATIONAL EVALUATION | old IIS gate, inactive, internal label |
| `cohort_conversion_encounter` | Measures Conversion | cohort conversion approach retired |
| `orientation_placeholder` | About Measures Registry | inactive duplicate |
| `structural_drift_field_guide` | Structural Drift | inactive, wrong material |
| `foundation_offering` | FOUNDATION SEAT | old SEAT offering, inactive |
| `systems_offering` | SYSTEMS SEAT | old SEAT offering, inactive |
| `systems_seat_hold` | SYSTEMS SEAT | inactive |
| `measures_eval_email_contract` | Measures Evaluation Email Contract | active but no handler — deprecated email contract approach |

---

### 8. Internal Semantic → Public Title Pairing Table

Currently paired and valid:

| internal_key | public_title | visibility | directory_binding | route_alias |
|---|---|---|---|---|
| `measures_assessment` | AI Operations Assessment | public | — (no directory binding) | `?surface=measures_assessment` |
| `eval_passage` | Evaluation Passage | public | — | `?surface=eval_passage` |
| `structure_passage` | Understand the Environment | public | — | `?surface=structure_passage` |
| `obsidian_to_marble_passage_video` | Before the Pathway | public_after_eval | — | `?surface=obsidian_to_marble_passage_video` |
| `marble_pathway_reveal` | Recommended Governed Pathway | public_after_contact | — | `?surface=marble_pathway_reveal` |
| `ai_operations_assessment_landing` | AI Operations Assessment \| Measures Registry | public | lapis spine | `/ai-operations-assessment` |
| `structural_drift_publication` | Structural Drift | public | lapis spine | `/structural-drift` |

Missing pairings required:

| internal_key | required_public_title | required_route_alias | status |
|---|---|---|---|
| `map_integrity_governance` | MAP Integrity Governance | `/map-integrity-governance` | NOT SEEDED — encounter does not exist |
| `marble_pathway_reveal` | MAP Integrity Governance | `/map-integrity-governance` | needs rename + route alias hardening |
| `crystal_chamber` | Understand the Environment (or governed public title) | `/understand` or `/assess` | needs public title correction |
| `ai_isnt_broken_intro` | — | alias for `intro` surface | needs explicit route alias binding |

---

### 9. Public/Private Boundary Leak Report

| location | value | violation | severity |
|---|---|---|---|
| `connect_src` display_title | "c3 Field" | c3 Field branding — active encounter | HIGH — active, no handler but in encounter_def |
| `src1_connect_view` display_title | "SRC1 Connect" | SRC1 internal naming | HIGH — active registry entry |
| `crystal_chamber` display_title | "Crystal Chamber" | material/chamber name | MEDIUM — source renders it |
| `marble_chamber` registry display_title | "Marble Chamber" | material/chamber name | MEDIUM — registry entry, visible |
| `codexstone` registry display_title | "Codexstone" | codexstone exposed, release_state = released | HIGH — active and visible |
| `codexstone_encounter` display_title | "Codexstone" | codexstone in encounter def | HIGH |
| `measures_eval_email_contract` display_title | "Measures Evaluation Email Contract" | internal contract language, active | HIGH — active residue |
| `iis_eval_gate1` display_title | "MEASURES AI OPERATIONAL EVALUATION" | all-caps internal gate label | LOW — inactive |
| `foundation_offering` / `systems_offering` / `foundation_seat_hold` / `systems_seat_hold` display_titles | "FOUNDATION SEAT" / "SYSTEMS SEAT" | SEAT label exposure | LOW — mostly inactive |

No source-level forbidden language found in active renderer components.

---

### 10. MAP Circuit Contract Binding Report

| check | status | detail |
|---|---|---|
| `map_commerce_contracts` exists | ✓ | 3 active contracts: pre_deployment ($3333), optimization ($7777), remediation ($9999) |
| Assessment result produces environment score | ✓ | `evalReport.environmental_standing` via DB |
| Assessment result produces circuit identification | ✓ | `evalReport.standing_key` matched to `applicable_standing_keys` |
| Contact info bound after assessment | ✗ MISSING | No contact-capture surface in active route between assessment result and passage |
| SRC/OAR1 carry-forward creation | ✗ MISSING | No write to `src_intake_request` or equivalent from assessment flow. Session-state carry only. |
| Carried state resolves into correct MAP contract | ✓ | `recommendedContract` derived from `standingKey` in `MarbleCommerceDirectory` |
| Price/payment authority in commerce contract table | ✓ | `amount_usd` from `map_commerce_contracts`, not hardcoded |
| Payment opens MAP work only | ✓ | Scheduling release guarded behind `schedulingReleased` from webhook verification |
| MAP deliverables/resolution complete commerce circuit | ✗ NOT YET | `map_payment_events` table exists; no source read path for MAP deliverables state |
| SEAT opens only after MAP resolution | ✓ HELD | No SEAT activation path in active source |

---

### 11. Media/Style/Copy Contract Consumption Report

| contract | status | detail |
|---|---|---|
| Obsidian eval result visual | ✓ FIXED | `--registry-obsidian-eval-result-visual` now consumed by `[data-material-family="obsidian"][data-layout-contract="result_gate"]` |
| Obsidian contact/assessment visuals | ✓ | CSS variables set and consumed |
| Marble accent visual | ✗ ABSENT | `marble_accent_reference` deactivated — no governed Marble visual seated |
| Passage video (Before the Pathway) | ✓ | `before_the_pathway_obsidian_to_marble_passage_video` active, resolves via R2 |
| `questions_ungoverned_systems_cannot_answer_video` | ✓ | active in `structure_passage`, resolves via R2 |
| Landing media (left/right hero, epigraph video) | ✓ | active media roles for landing |
| `hero_video` | ✗ INACTIVE | `hero_video` for `landing_intro_video` is inactive — landing plays no video, only `hero_poster` |
| Glyph media roles | ✗ ALL INACTIVE | All `glyph_*` entries are inactive — no glyph renders |
| Old exhibition images | ✗ INACTIVE | `marble_chamber_codexstone.webp`, etc. — inactive as expected after deactivation |
| `installation_tone_marble` / `marble_tone` | ✓ active but no handler | Bound to `iis_eval_gate1` encounter which is inactive — stale binding |

**Known issue:**
Deactivating `marble_accent_reference` removed the codexstone bleed but exposed a missing Marble visual contract. `MarbleCommerceDirectory` renders no accent image. This is the correct state until a governed Marble visual is seated.

---

### 12. `marble_pathway_reveal` Standing

| dimension | value |
|---|---|
| encounter_key | `marble_pathway_reveal` |
| display_title | "Recommended Governed Pathway" |
| encounter_type | view |
| material_family | marble |
| surface_type | threshold |
| release_state | active (in `measures_encounter_def`) |
| directory_binding | none — threshold, not in chamberplate |
| route_alias | none — `?surface=marble_pathway_reveal` only |
| public_title | none matched to intended "MAP Integrity Governance" |
| source handler | `MarbleCommerceDirectory` ✓ |
| classification | `active_needs_semantic_correction` |

---

### 13. `/map-integrity-governance` Readiness Assessment

**NOT READY.**

| requirement | status |
|---|---|
| `map_integrity_governance` encounter in `measures_encounter_def` | ✗ MISSING |
| `map_integrity_governance` registry entry | ✗ MISSING |
| Public title "MAP Integrity Governance" | ✗ MISSING |
| Route alias `/map-integrity-governance` in `measures_registry` | ✗ MISSING |
| Directory binding to marble chamber directory | ✗ MISSING |
| `marble_pathway_reveal` → `map_integrity_governance` redirect | ✗ NOT YET |

Hardening `marble_pathway_reveal` into `/map-integrity-governance` requires: seeding the encounter, creating the registry entry with a route alias, and updating the source handler to consume it.

---

### 14. Obsidian Carry-Forward Readiness Assessment

**NOT READY.**

- Assessment result is session-state only (`evalReport` held in component state)
- No contact-capture surface is in the active Obsidian→Marble route
- No write to `src_intake_request` or any durable carry-forward table from assessment completion
- `src_intake_request` table exists in DB — schema and table are present but not connected to assessment flow
- Contact capture form (`iis_eval_gate1_capture` table) exists — no active surface handler

Required for carry-forward: assessment contact capture surface between `measures_assessment` result and `obsidian_to_marble_passage_video`, writing to `src_intake_request` or `iis_eval_gate1_capture`, and carrying the SRC ID into `marble_pathway_reveal`.

---

### 15. Crystal Correction Needs

1. `crystal_chamber` display_title "Crystal Chamber" — exposes material name — rename to governed public title (e.g. "Understand the Environment")
2. `crystal_chamber` registry `release_state = held` conflicts with active source handling — registry state needs correction
3. `structural_drift_dispatches` surface key ≠ `structural_drift_publication` encounter key — alias mapping should be explicit
4. `crystal_temple_home` registry (`release_state = open`) has no source handler — hold or bind
5. `inanna_encounter`, `epigraph_view`, `temple_harrumuk_passage_view`, `epithets_passage_*` — no source handlers — hold all

---

### 16. Lapis Correction Needs

1. `src1_connect_view` display_title "SRC1 Connect" — exposes SRC1 internal naming — rename display_title
2. `evaluate_structure_path` — display_title is section copy ("AI isn't broken. Systems are.") — this is the intended copy, not a naming issue — keep
3. Landing sections are valid SEO/social infrastructure — no corrections needed
4. No Lapis-to-assessment direct path that bypasses eval passage — confirm this remains the case

---

### 17. Recommended Next OAR2 Priority List

In priority order based on audit findings:

**Priority 1 — Deactivate Obsidian residue (safety)**
`OAR2 — Deactivate Obsidian Residue Encounters: email contract, SEAT holds, and orphaned threshold surfaces`
- Deactivate `measures_eval_email_contract`, `phase_payment`, `foundation_seat_hold`, `connect_src`, and `understand_failure` / `orientation_placeholder` / `iis_eval_gate1` / `educate_eval_encounter` / `cohort_conversion_encounter`
- These are active or inactive encounters with no handler that create namespace pollution and public boundary risk

**Priority 2 — Correct `marble_pathway_reveal` public semantics**
`OAR2 — Harden marble_pathway_reveal to MAP Integrity Governance: encounter, registry entry, public title, route alias`
- Seed `map_integrity_governance` in `measures_encounter_def` (threshold, marble)
- Create `map_integrity_governance` registry entry with public title "MAP Integrity Governance", route alias `/map-integrity-governance`
- Update `marble_pathway_reveal` display_title to "MAP Integrity Governance" or deprecate in favor of new key
- No source change required for this OAR (surface handler can remain `marble_pathway_reveal` until route is hardened)

**Priority 3 — Seat Obsidian contact-capture carry-forward**
`OAR2 — Seat Obsidian Assessment Contact Capture and SRC Carry-Forward`
- Add contact-capture surface between `measures_assessment` result and `obsidian_to_marble_passage_video`
- Write to `iis_eval_gate1_capture` or `src_intake_request` on contact submission
- Thread contact/SRC ID to passage and `marble_pathway_reveal` as carry-forward

**Priority 4 — Correct public/private boundary violations**
`OAR2 — Correct Public Title Violations: codexstone, crystal_chamber, marble_chamber, src1_connect_view`
- `codexstone` registry: set `is_active = false` or `release_state = held`
- `crystal_chamber` display_title: rename to governed public title
- `marble_chamber` display_title: rename
- `src1_connect_view` display_title: rename to not expose SRC1

**Priority 5 — Seat governed Marble visual contract**
`OAR2 — Seat Governed Marble Accent Visual for MAP Integrity Governance Surface`
- Upload governed Marble/MAP visual asset to `measures-registry` bucket
- Update `marble_accent_reference` with governed path and reactivate
- Confirm visual renders correctly in `MarbleCommerceDirectory`

**Priority 6 — Correct surface/encounter key alias mismatches**
`OAR2 — Bind Runtime Surface Aliases to Encounter Keys: intro, path_choice, structural_drift_dispatches`
- Document and formalize: `intro` → `ai_isnt_broken_intro`, `path_choice` → `evaluate_structure_path`, `structural_drift_dispatches` → `structural_drift_publication`
- Add route alias fields to relevant registry entries
- No functional change — formalization only

**Priority 7 (post-MAP) — Seat MRM**
`OAR2 — Seat Measures Relational Management after Obsidian/Marble seam is stable`
- Do not proceed until Priorities 1-3 are resolved

---

### 18. No Mutation Performed

Confirmed. No source, DB, CSS, route, or media changes were made in this audit.

---

### 19. Build Not Required

Confirmed. Audit touched no runtime files.

---

### 20. OAR1 Written

This document.

---

## CLOSES

OAR2: docs/oar/measures_registry/oar2_audit_chamber_directories_orphaned_surfaces_and_public_semantic_pairings_v1.meta.md

## NEXT

OAR2-Next (Priority 1): OAR2 — Deactivate Obsidian Residue Encounters: email contract, SEAT holds, and orphaned threshold surfaces
