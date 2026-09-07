---
document_type: oar1
authority_level: working
title: OAR1 — Database Term Sweep Before Native Architecture Normalization
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_database_term_sweep_before_native_architecture_normalization_v1.meta.md
---

# OAR1 — Database Term Sweep Before Native Architecture Normalization

## OBJECTIVE

Read-only sweep of live database for stale, deprecated, missing, and misaligned terms.

No DB mutations. No code changes. No content seeding. Inventory only.

Tables swept: `measures_registry`, `measures_encounter_def`,
`measures_encounter_surface_assignment`, `measures_release_state`,
`measures_transition_rule`, `measures_registry_root.metadata`

---

## REQUIRED FINDINGS

### 1. Which stale terms exist in live DB?

| Term | Tables present | Current state |
|---|---|---|
| `crystal_chamber` | measures_registry, measures_encounter_def, measures_transition_rule | `is_active: true`, `release_state: "held"` |
| `eval_passage` | measures_registry, measures_encounter_def, measures_transition_rule, registry_root encounter_structure | `is_active: true`, `release_state: "released"` |
| `structure_passage` | measures_registry, measures_encounter_def, measures_transition_rule, registry_root encounter_structure | `is_active: false`, `release_state: "held"` |
| `marble_pathway_reveal` | measures_registry, measures_encounter_def | `is_active: true`, `release_state: "released"` |
| `iis_eval_gate1` | measures_registry, measures_encounter_def, measures_iis_eval_gate1_capture (table) | `is_active: true`, `release_state: "released"` |
| `evaluate_structure_path` | measures_registry, measures_encounter_def, measures_transition_rule | `is_active: true`, `release_state: "released"` |
| `structural_drift_publication` | measures_registry, measures_encounter_def, measures_transition_rule | `is_active: true`, `release_state: "released"` |

---

### 2. Which deprecated terms are still active?

Five terms are `is_active: true` and `release_state: "released"`:

| Term | Active | Released | Severity |
|---|---|---|---|
| `marble_pathway_reveal` | ✓ | ✓ | HIGH — serving live traffic |
| `iis_eval_gate1` | ✓ | ✓ | HIGH — serving live traffic |
| `evaluate_structure_path` | ✓ | ✓ | MEDIUM — crystal seat path choice, still required |
| `eval_passage` | ✓ | ✓ | MEDIUM — obsidian passage, still required |
| `structural_drift_publication` | ✓ | ✓ | LOW — lapis, needs audit |

One term is active but held (not serving live):
- `crystal_chamber` — `is_active: true`, `release_state: "held"`

---

### 3. Which replacement terms already exist?

| Replacement term | measures_registry | measures_encounter_def | measures_encounter_surface_assignment |
|---|---|---|---|
| `crystal_seat_orientation_passage` | **MISSING** | **MISSING** | **MISSING** |
| `obsidian_chamber_orientation_passage` | **MISSING** | **MISSING** | **MISSING** |
| `marble_chamber_orientation_passage` | **MISSING** | **MISSING** | **MISSING** |

None of the three orientation passage replacement terms exist anywhere in the database.

---

### 4. Which required replacement terms are missing?

All three:

- `crystal_seat_orientation_passage` — not in measures_registry, encounter_def, surface_assignment, transition_rule
- `obsidian_chamber_orientation_passage` — not in measures_registry, encounter_def, surface_assignment, transition_rule
- `marble_chamber_orientation_passage` — not in measures_registry, encounter_def, surface_assignment, transition_rule

Also missing from measures_release_state: none of the target terms have explicit release state entries. All rely on `measures_registry.release_state` directly (measures_release_state returned 0 rows for all target keys).

---

### 5. Which tables/columns require migration later?

| Table | Column | Change required |
|---|---|---|
| `measures_registry` | `is_active`, `release_state` | Deactivate `marble_pathway_reveal` and `iis_eval_gate1` |
| `measures_registry` | (new rows) | Seat `crystal_seat_orientation_passage`, `obsidian_chamber_orientation_passage`, `marble_chamber_orientation_passage` |
| `measures_registry` | `is_active` | Activate `about_measures_registry` (currently `is_active: false`) before FREE can render it |
| `measures_registry` | `is_active` | Activate `structure_passage` if it is to serve as crystal seat orientation passage |
| `measures_encounter_def` | `metadata` | `structure_passage` metadata contains numerous stale `crystal_chamber_*` keys — 8+ stale keys in metadata |
| `measures_encounter_def` | `metadata` | `map_integrity_governance` lacks governance framing content (`governance_header`, `map_framing`, `pathway_cards`, `action_readiness`, `seat_hold`) |
| `measures_encounter_def` | `metadata` | `structural_drift_publication` lacks FREE-format content (`brand_copy`, `issue_record`, `cover_story`, `assessment_feature`, etc.) |
| `measures_encounter_def` | `metadata` | `ai_isnt_broken_intro` metadata uses old renderer contract format; `intro_copy` not present for IntroHookSeat |
| `measures_encounter_surface_assignment` | (new rows) | Seat surface assignments for three orientation passage keys |
| `measures_registry_root` | `metadata.encounter_structure` | `eval_passage` and `structure_passage` nodes remain; `path_choice.left.next_surface` and `.right.next_surface` reference stale terms |
| `measures_transition_rule` | `rule_state` or new rows | Stale transitions: `crystal_chamber → eval_passage`, `evaluate_structure_path → eval_passage`, `evaluate_structure_path → structure_passage`, `structure_passage → crystal_chamber`, `structure_passage → connect_src` |

---

### 6. Which terms are only safe as legacy aliases or audit trace?

| Term | Recommended disposition | Evidence |
|---|---|---|
| `iis_eval_gate1` | `legacy_alias_only` | encounter_def metadata has `deprecated`, `deprecated_by`, `deprecation_reason`, `replacement_encounter_key` — self-acknowledged deprecation. Table `measures_iis_eval_gate1_capture` exists for historical data. |
| `marble_pathway_reveal` | `legacy_alias_only` | encounter_def metadata has `legacy_alias_for`, `prohibited_public_rendering: true`, `public_runtime_allowed: false` — self-acknowledged as alias. |
| `crystal_chamber` | `audit_trace_only` | Registry `release_state: "held"`. encounter_def has `crystal_chamber_content_contracts`, stale title "Crystal Chamber". Already not serving live encounters. |
| `structural_drift_publication` | `audit_trace_only` | OAR2 disposition: "deprecated_reference / legacy_route_alias / migration_note / audit_trace only". Still active/released in registry — requires deactivation OAR. |
| `evaluate_structure_path` | `hold_for_operator_review` | Still serving live traffic. Is the active `path_choice` surface registry key. OAR2 says deprecated but it is the current Crystal Seat path entry. Requires explicit replacement plan before deactivation. |

---

### 7. Whether content seeding can proceed after this sweep.

**YES — with conditions per key:**

| Key / Surface | Seeding readiness | Blocker |
|---|---|---|
| `about_measures_registry` | Ready — `approved_content_contract` is seated in encounter_def | `measures_registry.is_active = false` — must activate before FREE gate passes |
| `evaluate_structure_path` / `path_choice` | Possibly ready — encounter_def has `plaques` and `hero_paths` keys matching PathChoiceSeat | Verify format alignment; registry is active/released ✓ |
| `ai_isnt_broken_intro` / `intro`, `intro_hook` | Partial — encounter_def has `hero_paths`, `media_roles` | `intro_copy` key absent from metadata; IntroHookSeat reads `encounterDef.metadata.intro_copy.*` — format mismatch requires seeding |
| `map_integrity_governance` | Not ready — encounter_def only has title/purpose/alias fields | Needs `governance_header`, `map_framing`, `pathway_cards`, `action_readiness`, `seat_hold` seeded |
| `structural_drift_publication` | Not ready — encounter_def has old renderer-contract format | Needs FREE-format keys: `brand_copy`, `issue_record`, `cover_story`, `assessment_feature`, `role_call_feature`, `next_issue_teaser`, `footer_record`, `featured_article_set` |
| `structure_passage` | Not ready — registry `is_active: false` | Must activate registry key AND clean stale `crystal_chamber_*` metadata keys before seeding |

---

## FULL EVIDENCE BY TABLE

### measures_registry — target key standings

| registry_key | is_active | release_state | Disposition |
|---|---|---|---|
| `crystal_chamber` | true | held | `audit_trace_only` |
| `eval_passage` | true | released | `hold_for_operator_review` (active, maps to obsidian_chamber_orientation_passage) |
| `evaluate_structure_path` | true | released | `hold_for_operator_review` (active path_choice surface) |
| `iis_eval_gate1` | true | released | `legacy_alias_only` — deactivation required |
| `marble_pathway_reveal` | true | released | `legacy_alias_only` — deactivation required |
| `map_integrity_governance` | true | released | `active_keep` — FREE renderer target, needs content seeding |
| `structure_passage` | false | held | `migration_required` — activation + metadata cleanup before FREE use |
| `structural_drift_publication` | true | released | `audit_trace_only` — deactivation required |
| `about_measures_registry` | **false** | held | `migration_required` — activation required before FREE gate passes |
| `ai_isnt_broken_intro` | true | released | `active_keep` — intro_copy format alignment needed |
| `crystal_seat_orientation_passage` | MISSING | — | `missing_required` |
| `obsidian_chamber_orientation_passage` | MISSING | — | `missing_required` |
| `marble_chamber_orientation_passage` | MISSING | — | `missing_required` |

---

### measures_encounter_def — metadata content status

| encounter_key | display_title | Metadata depth | Key finding |
|---|---|---|---|
| `about_measures_registry` | "About Measures Registry" | Rich — has `approved_content_contract` | CrystalSeatRenderer can read it; registry activation needed |
| `ai_isnt_broken_intro` | "Measures Registry" | Rich — old format | Has `hero_paths`, missing `intro_copy` for IntroHookSeat |
| `crystal_chamber` | "Crystal Chamber" | Rich — stale | `display_title` is deprecated term; stale content contracts |
| `eval_passage` | "Evaluation Passage" | Rich — has `deprecated_trace` | Self-acknowledged deprecation in metadata |
| `evaluate_structure_path` | "AI isn't broken. Systems are." | Rich — has `plaques`, `hero_paths` | Possible PathChoiceSeat alignment; has `deprecated_language` key |
| `iis_eval_gate1` | "MEASURES AI OPERATIONAL EVALUATION" | Rich — has `deprecated`, `deprecated_by`, `replacement_encounter_key` | Self-acknowledged deprecation with replacement key noted |
| `map_integrity_governance` | "MAP Integrity Governance" | Thin — 11 keys | Missing all governance framing content |
| `marble_pathway_reveal` | "MAP Integrity Governance" | Medium — has `legacy_alias_for` | Self-acknowledged legacy; `prohibited_public_rendering: true` |
| `structural_drift_publication` | "Structural Drift" | Rich — old format | `publication_encounter_contract_v1` present but not FREE-format |
| `structure_passage` | "Understand the Environment" | Rich — 60+ keys | 8+ stale `crystal_chamber_*` keys embedded in metadata |

---

### measures_encounter_surface_assignment — current assignments

| surface_key | registry_key | chamber_assignment | Status |
|---|---|---|---|
| `intro` | `ai_isnt_broken_intro` | `crystal_seat` | active_keep |
| `intro_hook` | `ai_isnt_broken_intro` | `crystal_seat` | active_keep |
| `path_choice` | `evaluate_structure_path` | `crystal_seat` | hold_for_operator_review |
| `eval_passage` | `eval_passage` | `obsidian` | hold_for_operator_review |
| `structural_coherence_explainer` | `eval_passage` | `obsidian` | hold_for_operator_review |
| `measures_assessment` | `measures_assessment` | `obsidian` | active_keep |
| `obsidian_to_marble_passage_video` | `obsidian_to_marble_passage_video` | `obsidian` | active_keep |
| `map_integrity_governance` | `map_integrity_governance` | `marble` | active_keep |
| `structure_passage` | `structure_passage` | `crystal_seat` | migration_required (registry inactive) |
| `measures_structured_environments` | `structure_passage` | `crystal_seat` | migration_required (registry inactive) |
| `structural_drift_dispatches` | `structural_drift_publication` | `lapis` | audit_trace_only |
| `publication_dispatch` | `structural_drift_publication` | `lapis` | audit_trace_only |
| `about_measures_registry` | `about_measures_registry` | `crystal_seat` | migration_required (registry inactive) |

No surface assignments exist for `crystal_seat_orientation_passage`, `obsidian_chamber_orientation_passage`, or `marble_chamber_orientation_passage`.

---

### measures_transition_rule — stale transitions

| from_key | to_key | rule_state | Finding |
|---|---|---|---|
| `crystal_chamber` | `eval_passage` | active | Both deprecated; stale transition |
| `evaluate_structure_path` | `eval_passage` | active | Deprecated destination |
| `evaluate_structure_path` | `structure_passage` | active | Inactive registry destination |
| `structure_passage` | `crystal_chamber` | active | Both deprecated |
| `structure_passage` | `connect_src` | active | Deprecated origin |

---

### measures_registry_root.metadata.encounter_structure — stale nodes

| Node key | Status | Finding |
|---|---|---|
| `eval_passage` | present | Active node referencing deprecated key |
| `structure_passage` | present | Active node referencing inactive/held registry key |
| `path_choice.left.next_surface` | `"eval_passage"` | Stale term |
| `path_choice.right.next_surface` | `"structure_passage"` | Inactive registry destination |

---

### measures_release_state — target keys

Zero rows found for any target key. All target keys rely on `measures_registry.release_state` directly. `measures_release_state` table uses UUID foreign key (`registry_id`) and is not the primary release authority for these keys.

---

### measures_iis_eval_gate1_capture — table exists

Table `measures_iis_eval_gate1_capture` confirmed present. This table holds historical capture data from the deprecated `iis_eval_gate1` key. Must not be dropped when the registry key is deactivated. Legacy alias only.

---

## SUMMARY DISPOSITIONS

| Term | Disposition | Priority |
|---|---|---|
| `marble_pathway_reveal` | `legacy_alias_only` — deactivate registry | HIGH — pending migration A |
| `iis_eval_gate1` | `legacy_alias_only` — deactivate registry, preserve capture table | HIGH — pending migration B |
| `about_measures_registry` | `migration_required` — activate registry (`is_active: true`) | HIGH — blocks FREE crystal seat rendering |
| `crystal_seat_orientation_passage` | `missing_required` — seat in all tables | HIGH — native architecture normalization |
| `obsidian_chamber_orientation_passage` | `missing_required` — seat in all tables | HIGH — native architecture normalization |
| `marble_chamber_orientation_passage` | `missing_required` — seat in all tables | HIGH — native architecture normalization |
| `structure_passage` | `migration_required` — activate registry + clean 8+ stale crystal_chamber_* metadata keys | MEDIUM |
| `evaluate_structure_path` | `hold_for_operator_review` — active path_choice surface, deprecation requires explicit replacement plan | MEDIUM |
| `eval_passage` | `hold_for_operator_review` — active obsidian passage surface, maps to obsidian_chamber_orientation_passage | MEDIUM |
| `structural_drift_publication` | `audit_trace_only` — deactivate registry | MEDIUM |
| `crystal_chamber` | `audit_trace_only` — already held, no action urgent | LOW |
| `map_integrity_governance` | `active_keep` — seat governance framing content in encounter_def | MEDIUM |
| `ai_isnt_broken_intro` | `active_keep` — seed `intro_copy` format in encounter_def metadata | MEDIUM |

---

## NOTCHAZZ FLAGS

None raised.

- No DB mutations attempted
- No content seeding performed
- No stale terms treated as active without evidence
- No replacement terms invented
- No deprecated terms silently reused
- Thread memory not used — all findings from live DB queries
- No live route behavior changed
- No monolith edited

---

## VALIDATION

| Constraint | Status |
|---|---|
| Read-only sweep only | PASS |
| All 7 required questions answered | PASS |
| Target terms searched across all required tables | PASS |
| Exact row evidence returned | PASS |
| Each finding has recommended disposition | PASS |
| Missing replacement terms identified | PASS — all three orientation passage keys absent |
| No DB mutation | PASS |
| No code changes | PASS |
| No content seeding | PASS |

---

## CLOSE

Sweep is complete.

Stale terms are known. Deprecated terms still serving live traffic are identified.
Replacement terms are missing. Content seeding conditions are understood.

Proceed to normalization OARs in this order:

1. Deactivate `marble_pathway_reveal` and `iis_eval_gate1` (migrations A + B)
2. Activate `about_measures_registry` in measures_registry
3. Seat three orientation passage keys across all required tables
4. Clean `structure_passage` metadata of stale `crystal_chamber_*` keys
5. Seed FREE-format content in `map_integrity_governance` encounter_def
6. Seed `intro_copy` format in `ai_isnt_broken_intro` encounter_def
7. Seat `evaluate_structure_path` and `eval_passage` deprecation/replacement plan

Nothing is invented. Everything above is DB evidence.

Commit: pending
