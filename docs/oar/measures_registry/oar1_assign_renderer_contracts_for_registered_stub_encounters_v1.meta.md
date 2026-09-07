---
document_type: oar1
authority_level: working
document_scope: measures_registry_renderer_contracts
title: OAR1 — Assign Renderer Contracts for Registered Stub Encounters
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_assign_renderer_contracts_for_registered_stub_encounters_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - renderer-contracts
  - registered-runtime
  - stub-encounters
  - codex-first
---

# OAR1 — Assign Renderer Contracts for Registered Stub Encounters

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_assign_renderer_contracts_for_registered_stub_encounters_v1.meta.md`

Assign renderer contracts for the 5 registered stub encounters. Metadata patch only — no renderer authoring, no CSS edits, no full contract seating, no copy invention beyond approved structure_passage copy.

---

## EXECUTE PACKAGE

| File | Role |
|---|---|
| `docs/oar/measures_registry/execute-assign-renderer-contracts-for-registered-stub-encounters-v1.cjs` | Execute script — prerequisite verification, current state inspection, media mapping check, renderer assignment per stub, readback validation |

**Phases executed:**

| Phase | Scope |
|---|---|
| 0 | Prerequisite verification — sitewide contract active, 5 stub encounters present |
| 0b | Current stub state inspection |
| 0c | Media mapping check for `measures_structured_enviroments` |
| 1 | Assign renderer contracts for 5 stub encounters |
| Readback | Validate all 5 renderer-assigned and sitewide bound |

---

## DB TABLES WRITTEN

| Table | Operation |
|---|---|
| `measures_encounter_def` | UPDATE metadata × 5 (renderer assignment fields merged, existing metadata preserved) |

No rows inserted. No rows deleted. No other tables modified.

---

## PREREQUISITE VERIFICATION

| Check | Result |
|---|---|
| `measures_registry_sitewide_style_contract` active in `concordance_document` | ok |
| All 5 target stub encounters present in `measures_encounter_def` | ok (5 of 5) |

---

## CURRENT STUB STATE (pre-execution)

| encounter_key | renderer | is_active | contract_status | renderer_contract_status |
|---|---|---|---|---|
| `about_measures_registry` | null | false | pending_contract | null |
| `measures_eval_email_contract` | null | false | pending_contract | null |
| `measures_phases_reveal` | null | false | pending_contract | null |
| `structure_passage` | null | false | pending_contract | null |
| `structured_eval` | null | false | pending_contract | null |

---

## MEDIA MAPPING CHECK

| Check | Result |
|---|---|
| `measures_media` table accessible | no — table not found in schema cache |
| `measures_structured_enviroments` in dedicated media table | not checked — no dedicated media table |
| Media key status | approved for future seating; seated in `structure_passage` metadata `media_roles` |

No dedicated `measures_media` table exists in the current schema. The media key `measures_structured_enviroments` is approved and seated in `structure_passage.metadata.media_roles` pending dedicated media asset seating. No blocker to renderer assignment.

---

## SCHEMA NOTE

`renderer` is stored in `metadata.renderer` (jsonb field), not as a separate column in `measures_encounter_def`. The column schema is: `id, registry_id, encounter_key, display_title, encounter_type, material_family, surface_type, sequence_order, pause_allowed, is_entry_surface, is_active, metadata, created_at, updated_at`. Renderer assignment updates `metadata.renderer` and `metadata.intended_renderer` via merge patch.

---

## ASSESSMENT MECHANICS REUSE

| Check | Result |
|---|---|
| `structured_eval` reuses `measures_registry_evaluation_chamber` | confirmed |
| Scoring logic fork required | no |
| Immediate renderer code changes required | no |
| Fork condition | explicit OAR2 required to seat distinct mechanic |

`structured_eval` shares the assessment engine with `measures_assessment`. No fork authorized. Fork requires explicit OAR2.

---

## RENDERER ASSIGNMENTS (5)

| encounter_key | renderer_assigned | renderer_type | sitewide_bound |
|---|---|---|---|
| `structure_passage` | `diagnostic_explainer_passage` | reused (mirrors `eval_passage`) | yes |
| `structured_eval` | `measures_registry_evaluation_chamber` | reused (shared assessment engine) | yes |
| `measures_phases_reveal` | `measures_phases_reveal` | new renderer name | yes |
| `about_measures_registry` | `about_measures_registry` | new renderer name | yes |
| `measures_eval_email_contract` | `measures_eval_email_contract` | new renderer name | yes |

---

## METADATA FIELDS ASSIGNED PER ENCOUNTER

All 5 encounters received:

- `renderer` — assigned renderer name (in metadata.renderer)
- `intended_renderer` — same as renderer (assignment authority marker)
- `renderer_contract_status: "assigned"` — updated from null
- `source_sitewide_contract` — binding to `measures_registry_sitewide_style_contract`

### Encounter-specific fields

| encounter_key | Encounter-specific metadata fields |
|---|---|
| `structure_passage` | `media_roles` (passage_media / measures_structured_enviroments), `approved_copy_pending_contract` (eyebrow, title, subtitle) |
| `structured_eval` | `assessment_mechanics_note` (shared mechanic, fork blocked) |
| `measures_phases_reveal` | `renderer_purpose` (post_assessment_phase_reveal, convergence point) |
| `about_measures_registry` | `renderer_purpose` (institutional_authority_context_surface) |
| `measures_eval_email_contract` | `renderer_purpose` (assessment_delivery_email_contract) |

### structure_passage approved copy (pending full contract seating)

```
eyebrow: STRUCTURE READINESS
title: How does a structured environment optimize AI performance?
subtitle: AI performance improves when the operating environment is structured enough to clarify authority, connect relevant systems, define review paths, and make decisions traceable. Structure reduces drift and gives AI output a governed place to act.
```

Copy seated in `metadata.approved_copy_pending_contract`. `frontend_hardcode_allowed: false`.

---

## SITEWIDE CONTRACT BINDING

All 5 encounters bound to:

```
source_sitewide_contract: {
  document_key: "measures_registry_sitewide_style_contract",
  version_key: "measures_registry_sitewide_style_contract_v1",
  seating: "encounter_contract_v1"
}
```

---

## VALIDATION QUERY

```sql
-- Renderer assignment status for all 5 stub encounters
select
  encounter_key,
  is_active,
  metadata->>'renderer' as renderer,
  metadata->>'intended_renderer' as intended_renderer,
  metadata->>'renderer_contract_status' as renderer_contract_status,
  metadata->'source_sitewide_contract'->>'document_key' as sitewide_contract,
  metadata->>'contract_status' as contract_status,
  (metadata ? 'approved_copy_pending_contract') as has_approved_copy,
  (metadata ? 'media_roles') as has_media_roles
from public.measures_encounter_def
where encounter_key in (
  'structure_passage',
  'structured_eval',
  'measures_phases_reveal',
  'about_measures_registry',
  'measures_eval_email_contract'
)
order by encounter_key;

-- structure_passage media_roles and approved_copy check
select
  encounter_key,
  metadata->'media_roles' as media_roles,
  metadata->'approved_copy_pending_contract' as approved_copy
from public.measures_encounter_def
where encounter_key = 'structure_passage';
```

---

## READBACK CONFIRMATION

```
db_connection: ok
prereq_sitewide_contract: ok
prereq_stub_encounters: ok (5 of 5 found)

phase_1_renderer_assignment: ok (5 encounters)

renderer_assignment_readback: {
  "encounters_assigned": 5,
  "all_assigned": true,
  "all_renderer_set": true,
  "all_sitewide_bound": true,
  "readback": [
    { "encounter_key": "about_measures_registry", "is_active": false, "renderer": "about_measures_registry", "intended_renderer": "about_measures_registry", "renderer_contract_status": "assigned", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "contract_status": "pending_contract", "has_approved_copy": false, "has_media_roles": false },
    { "encounter_key": "measures_eval_email_contract", "is_active": false, "renderer": "measures_eval_email_contract", "intended_renderer": "measures_eval_email_contract", "renderer_contract_status": "assigned", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "contract_status": "pending_contract", "has_approved_copy": false, "has_media_roles": false },
    { "encounter_key": "measures_phases_reveal", "is_active": false, "renderer": "measures_phases_reveal", "intended_renderer": "measures_phases_reveal", "renderer_contract_status": "assigned", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "contract_status": "pending_contract", "has_approved_copy": false, "has_media_roles": false },
    { "encounter_key": "structure_passage", "is_active": false, "renderer": "diagnostic_explainer_passage", "intended_renderer": "diagnostic_explainer_passage", "renderer_contract_status": "assigned", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "contract_status": "pending_contract", "has_approved_copy": true, "has_media_roles": true },
    { "encounter_key": "structured_eval", "is_active": false, "renderer": "measures_registry_evaluation_chamber", "intended_renderer": "measures_registry_evaluation_chamber", "renderer_contract_status": "assigned", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "contract_status": "pending_contract", "has_approved_copy": false, "has_media_roles": false }
  ]
}
```

**Readback note:** All 5 stubs are `is_active: false`. Readback performed using service role writer to bypass RLS. Reader (anon key) would return 0 rows for these stubs.

---

## CONFLICTS AND BLOCKED OPERATIONS

### Schema correction (non-blocking)

`renderer` is stored in `metadata.renderer` (jsonb), not as a dedicated column. Initial script assumed a `renderer` column — corrected to metadata field before execution. No data was corrupted. Operations completed cleanly on corrected approach.

No constraint violations. No blocked operations. Idempotent on re-run.

---

## RENDERER PRESERVATION MAP

| encounter_key | renderer_assigned | status |
|---|---|---|
| `structure_passage` | `diagnostic_explainer_passage` | assigned — reuses existing renderer |
| `structured_eval` | `measures_registry_evaluation_chamber` | assigned — reuses existing renderer |
| `measures_phases_reveal` | `measures_phases_reveal` | assigned — new renderer name, not yet implemented |
| `about_measures_registry` | `about_measures_registry` | assigned — new renderer name, not yet implemented |
| `measures_eval_email_contract` | `measures_eval_email_contract` | assigned — new renderer name, not yet implemented |

No renderer files created. No CSS files modified. No frontend files modified.

---

## EXISTING METADATA PRESERVATION CONFIRMED

| encounter_key | Preserved fields |
|---|---|
| All 5 | All pre-existing metadata keys (`function_layer`, `contract_status`, `state_expression`, `reconciliation_source`) preserved via spread merge |

`contract_status` remains `"pending_contract"` — intentional. Full contract seating is the next operation.

---

## RECOMMENDED NEXT OAR2

**OAR2:** Seat full encounter contracts for all 5 stub encounters now that renderers are assigned.

Target encounters (renderer assigned, pending full contract):
`structure_passage`, `structured_eval`, `measures_phases_reveal`, `about_measures_registry`, `measures_eval_email_contract`

Notes:
- `structure_passage`: approved copy is seated; full styling, layout, media_behavior, transition, isolation contracts to be authored
- `structured_eval`: shared assessment mechanics with `measures_assessment`; no fork — contracts should reference shared mechanic
- `measures_phases_reveal`, `about_measures_registry`, `measures_eval_email_contract`: new renderer names — contracts seat the expected surface before renderer implementation begins

---

## CLOSEOUT

5 registered stub encounters have renderer assignments seated in `measures_encounter_def.metadata`. All 5 bound to `measures_registry_sitewide_style_contract`. `structure_passage` received approved copy and media role. `structured_eval` carries assessment mechanics reuse note with explicit fork block. The 3 new renderer names (`measures_phases_reveal`, `about_measures_registry`, `measures_eval_email_contract`) are assigned in metadata, pending renderer implementation after contract seating.

No renderer files created. No CSS edits. No frontend files modified. No full encounter contracts seated.

The 5 stub encounters are ready for full encounter contract seating.

OAR1 ready for operator review.
