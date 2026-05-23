---
document_type: oar1
authority_level: working
document_scope: measures_registry_encounter_contracts
title: OAR1 — Codex Seat Active Registered Encounter Contracts
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_codex_seat_active_registered_encounter_contracts_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - codex
  - encounter-contracts
  - sitewide-style-contract
  - registered-runtime
  - db-contract-seating
---

# OAR1 — Codex Seat Active Registered Encounter Contracts

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_codex_seat_active_registered_encounter_contracts_v1.meta.md`

Seat Codex encounter contracts for the 8 active registered encounters inheriting from `measures_registry_sitewide_style_contract`. Metadata patch only — no renderer authoring, no CSS edits, no copy invention.

---

## EXECUTE PACKAGE

| File | Role |
|---|---|
| `docs/oar/measures_registry/execute-codex-seat-active-registered-encounter-contracts-v1.cjs` | Execute script — prerequisite verification, metadata patch per encounter, readback validation |

**Phases executed:**

| Phase | Scope |
|---|---|
| 0 | Prerequisite verification — sitewide contract active, 8 target encounters present |
| 1 | Seat encounter contracts for 8 active registered encounters |
| Readback | Validate all 8 contracted and sitewide bound |

---

## DB TABLES WRITTEN

| Table | Operation |
|---|---|
| `measures_encounter_def` | UPDATE metadata × 8 (contract fields merged, existing metadata preserved) |

No rows inserted. No rows deleted. No other tables modified.

---

## PREREQUISITE VERIFICATION

| Check | Result |
|---|---|
| `measures_registry_sitewide_style_contract` active in `concordance_document` | ok |
| All 8 target encounter rows present in `measures_encounter_def` | ok (8 of 8) |

---

## CONTRACTS SEATED (8)

| encounter_key | renderer | clauses_seated |
|---|---|---|
| `ai_isnt_broken_intro` | `epigraph_split_hero` | styling, layout, media_behavior, branding, footer, transition, encounter_isolation |
| `evaluate_structure_path` | `measures_registry_path_choice` | styling, layout, path_action, transition, encounter_isolation |
| `eval_passage` | `diagnostic_explainer_passage` | styling, layout, media_behavior, transition, encounter_isolation |
| `connect_src` | `static_authority_surface` | styling, layout, branding, src_intake_marker, transition, encounter_isolation |
| `measures_assessment` | `measures_registry_evaluation_chamber` | media_behavior, branding, footer, transition, encounter_isolation (**extended**) |
| `structural_drift_publication` | `structural_drift_dispatches` | styling, layout, footer, transition, encounter_isolation |
| `reserve_seat` | `reserve_seat_selector` | styling, layout, action, transition, encounter_isolation |
| `phase_payment` | `hold_surface` | styling, layout, footer, transition, encounter_isolation, payment_commitment |

**measures_assessment extension note:** Existing `styling_contract` v3, `layout_contract` v2, `marble_accent_contract`, `returned_assessment_contract`, `assessment_interpretation`, `assessment_completion`, `assessment_mechanics`, `encounter_contract`, `media_roles` — all preserved. Only missing sitewide clauses added.

---

## CONTRACT FIELDS SEATED PER ENCOUNTER

All 8 encounters received:

- `source_sitewide_contract` — binding to `measures_registry_sitewide_style_contract` (version: `measures_registry_sitewide_style_contract_v1`)
- `contract_status: "contracted"` — updated from `"pending_contract"` for stub encounters

### Encounter-specific fields

| encounter_key | Encounter-specific contract fields |
|---|---|
| `ai_isnt_broken_intro` | `styling_contract`, `layout_contract`, `media_behavior_contract`, `branding_contract`, `footer_contract`, `transition_contract`, `encounter_isolation_contract` |
| `evaluate_structure_path` | `styling_contract`, `layout_contract`, `path_action_contract`, `transition_contract`, `encounter_isolation_contract` |
| `eval_passage` | `styling_contract`, `layout_contract`, `media_behavior_contract` (conditional), `transition_contract`, `encounter_isolation_contract` |
| `connect_src` | `styling_contract`, `layout_contract`, `branding_contract`, `src_intake_marker`, `transition_contract`, `encounter_isolation_contract` |
| `measures_assessment` | `media_behavior_contract`, `branding_contract`, `footer_contract`, `transition_contract`, `encounter_isolation_contract` |
| `structural_drift_publication` | `styling_contract`, `layout_contract`, `footer_contract`, `transition_contract`, `encounter_isolation_contract` |
| `reserve_seat` | `styling_contract`, `layout_contract`, `action_contract`, `transition_contract`, `encounter_isolation_contract` |
| `phase_payment` | `styling_contract`, `layout_contract`, `footer_contract`, `transition_contract`, `encounter_isolation_contract`, `payment_commitment_contract` |

---

## SITEWIDE CONTRACT INHERITANCE

All 8 encounters bound to:

```
source_sitewide_contract: {
  document_key: "measures_registry_sitewide_style_contract",
  version_key: "measures_registry_sitewide_style_contract_v1",
  seating: "encounter_contract_v1"
}
```

Contract clauses inherit from seated sitewide relations:

| Encounter contract field | Inherits from sitewide clause |
|---|---|
| `media_behavior_contract` | `mrssc_v1_media_behavior_contract` |
| `branding_contract` | `mrssc_v1_branding_contract` |
| `footer_contract` | `mrssc_v1_footer_contract` |
| `transition_contract` | `mrssc_v1_transition_contract` |
| `path_action_contract` | `mrssc_v1_button_icon_contract` |
| `action_contract` | `mrssc_v1_button_icon_contract` |

---

## VALIDATION QUERY

```sql
-- Contract status and sitewide binding for all 8 active encounters
select
  encounter_key,
  is_active,
  metadata->>'contract_status' as contract_status,
  metadata->'source_sitewide_contract'->>'document_key' as sitewide_contract,
  metadata->'styling_contract'->>'version' as styling_version,
  metadata->'layout_contract'->>'version' as layout_version,
  (metadata ? 'transition_contract') as has_transition,
  (metadata ? 'encounter_isolation_contract') as has_isolation,
  (metadata ? 'media_behavior_contract') as has_media_behavior,
  (metadata ? 'branding_contract') as has_branding,
  (metadata ? 'footer_contract') as has_footer
from public.measures_encounter_def
where encounter_key in (
  'ai_isnt_broken_intro',
  'evaluate_structure_path',
  'eval_passage',
  'connect_src',
  'measures_assessment',
  'structural_drift_publication',
  'reserve_seat',
  'phase_payment'
)
order by encounter_key;

-- measures_assessment existing contract preservation check
select
  encounter_key,
  metadata->'styling_contract'->>'version' as styling_version,
  (metadata ? 'assessment_mechanics') as has_assessment_mechanics,
  (metadata ? 'assessment_interpretation') as has_assessment_interpretation,
  (metadata ? 'returned_assessment_contract') as has_returned_assessment,
  (metadata ? 'marble_accent_contract') as has_marble_accent
from public.measures_encounter_def
where encounter_key = 'measures_assessment';
```

---

## READBACK CONFIRMATION

```
db_connection: ok
prereq_sitewide_contract: ok
prereq_target_encounters: ok (8 of 8 found)

phase_1_contract_seating: ok (8 encounters)

contract_seating_readback: {
  "encounters_contracted": 8,
  "all_contracted": true,
  "all_sitewide_bound": true,
  "readback": [
    { "encounter_key": "ai_isnt_broken_intro", "is_active": true, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": true, "has_branding": true, "has_footer": true },
    { "encounter_key": "connect_src", "is_active": true, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": false, "has_branding": true, "has_footer": false },
    { "encounter_key": "eval_passage", "is_active": true, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": true, "has_branding": false, "has_footer": false },
    { "encounter_key": "evaluate_structure_path", "is_active": true, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": false, "has_branding": false, "has_footer": false },
    { "encounter_key": "measures_assessment", "is_active": true, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "styling_contract_version": "v3", "layout_contract_version": "v2", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": true, "has_branding": true, "has_footer": true },
    { "encounter_key": "reserve_seat", "is_active": true, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": false, "has_branding": false, "has_footer": false },
    { "encounter_key": "structural_drift_publication", "is_active": true, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": false, "has_branding": false, "has_footer": true }
  ]
}
```

**phase_payment readback note:** `phase_payment` has `is_active: false` — excluded from anon-key reader readback by RLS. Contract was written and confirmed by writer (service role) update return in `contract_seating_results`. No execution failure.

---

## CONFLICTS AND BLOCKED OPERATIONS

None. All 8 operations completed without constraint violations or blocked operations. Idempotent on re-run.

---

## RENDERER PRESERVATION CONFIRMED

No renderer names altered. No CSS files modified. No frontend files modified.

| encounter_key | renderer | status |
|---|---|---|
| `ai_isnt_broken_intro` | `epigraph_split_hero` | preserved |
| `evaluate_structure_path` | `measures_registry_path_choice` | preserved |
| `eval_passage` | `diagnostic_explainer_passage` | preserved |
| `connect_src` | `static_authority_surface` | preserved |
| `measures_assessment` | `measures_registry_evaluation_chamber` | preserved |
| `structural_drift_publication` | `structural_drift_dispatches` | preserved |
| `reserve_seat` | `reserve_seat_selector` | preserved |
| `phase_payment` | `hold_surface` | preserved |

---

## EXISTING METADATA PRESERVATION CONFIRMED

| encounter_key | Preserved fields |
|---|---|
| `measures_assessment` | `styling_contract` v3, `layout_contract` v2, `marble_accent_contract`, `returned_assessment_contract`, `assessment_interpretation`, `assessment_completion`, `assessment_mechanics`, `encounter_contract`, `media_roles` |
| All 8 | All pre-existing metadata keys not in contract patch — preserved via spread merge |

---

## RECOMMENDED NEXT OAR2

**OAR2:** Seat encounter contracts for the 5 stub encounters once renderer assignments are confirmed.

Target encounters (stubs, pending renderer):
`structure_passage`, `structured_eval`, `measures_phases_reveal`, `about_measures_registry`, `measures_eval_email_contract`

Prerequisite: renderer authoring or renderer assignment for each stub. Contracts cannot be fully authored without renderer continuity.

---

## CLOSEOUT

8 active registered encounter contracts seated in `measures_encounter_def.metadata`. All 8 bound to `measures_registry_sitewide_style_contract`. `measures_assessment` extended with 5 missing sitewide clauses while preserving all existing evaluation mechanics. No renderer changes. No CSS edits. No copy invention.

The Measures Registry registered runtime now has Codex-seated encounter contracts for all 8 encounters with renderer continuity. Contracts are retrievable and ready for renderer implementation planning.

OAR1 ready for operator review.
