---
document_type: oar1
authority_level: working
document_scope: measures_registry_encounter_contracts
title: OAR1 — Codex Seat Stub Registered Encounter Contracts
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_codex_seat_stub_registered_encounter_contracts_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - codex
  - encounter-contracts
  - stub-encounters
  - registered-runtime
  - db-contract-seating
---

# OAR1 — Codex Seat Stub Registered Encounter Contracts

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_codex_seat_stub_registered_encounter_contracts_v1.meta.md`

Seat full Codex encounter contracts for the 5 registered stub encounters. Metadata patch only — no renderer authoring, no CSS edits, no copy invention beyond operator-approved copy, no assessment scoring fork, no email dispatch implementation.

---

## EXECUTE PACKAGE

| File | Role |
|---|---|
| `docs/oar/measures_registry/execute-codex-seat-stub-registered-encounter-contracts-v1.cjs` | Execute script — prerequisite verification, contract seating × 5, readback validation |

**Phases executed:**

| Phase | Scope |
|---|---|
| 0 | Prerequisite verification — sitewide contract active, 5 stubs present, renderer_contract_status assigned, sitewide binding confirmed, transition rules count |
| 1 | Seat full encounter contracts for 5 stub encounters |
| Readback | Validate all 5 contracted, sitewide bound, assessment fork absent, email and about content seated |

---

## DB TABLES WRITTEN

| Table | Operation |
|---|---|
| `measures_encounter_def` | UPDATE metadata × 5 (contract fields merged, existing metadata preserved) |

No rows inserted. No rows deleted. No other tables modified.

---

## PREREQUISITE VERIFICATION

| Check | Result |
|---|---|
| `measures_registry_sitewide_style_contract` active in `concordance_document` | ok |
| All 5 stub encounters present in `measures_encounter_def` | ok (5 of 5) |
| All 5 have `renderer_contract_status: "assigned"` | ok |
| All 5 bound to `source_sitewide_contract` | ok |
| Active transition rules | 114 active rules (informational — no blocker) |

---

## CONTRACTS SEATED (5)

| encounter_key | renderer | clauses_seated |
|---|---|---|
| `structure_passage` | `diagnostic_explainer_passage` | styling, layout, media_behavior, transition, encounter_isolation |
| `structured_eval` | `measures_registry_evaluation_chamber` | styling, layout, media_behavior, branding, transition, encounter_isolation, shared_assessment_mechanics |
| `measures_phases_reveal` | `measures_phases_reveal` | styling, layout, media_behavior, transition, encounter_isolation |
| `about_measures_registry` | `about_measures_registry` | styling, layout, branding, footer, transition, encounter_isolation, approved_content |
| `measures_eval_email_contract` | `measures_eval_email_contract` | styling, layout, email_delivery, transition, encounter_isolation |

---

## CONTRACT FIELDS SEATED PER ENCOUNTER

All 5 encounters received or preserved:

- `source_sitewide_contract` — binding to `measures_registry_sitewide_style_contract` (version: `measures_registry_sitewide_style_contract_v1`)
- `contract_status: "contracted"` — updated from `"pending_contract"`

### Encounter-specific fields

| encounter_key | Encounter-specific contract fields |
|---|---|
| `structure_passage` | `styling_contract`, `layout_contract`, `media_behavior_contract`, `transition_contract`, `encounter_isolation_contract` |
| `structured_eval` | `styling_contract`, `layout_contract`, `media_behavior_contract`, `branding_contract`, `transition_contract`, `encounter_isolation_contract`, `shared_assessment_mechanics_contract` |
| `measures_phases_reveal` | `styling_contract`, `layout_contract`, `media_behavior_contract`, `transition_contract`, `encounter_isolation_contract` |
| `about_measures_registry` | `styling_contract`, `layout_contract`, `branding_contract`, `footer_contract`, `transition_contract`, `encounter_isolation_contract`, `approved_content_contract` |
| `measures_eval_email_contract` | `styling_contract`, `layout_contract`, `email_delivery_contract`, `transition_contract`, `encounter_isolation_contract` |

---

## MATERIAL DIRECTION BY ENCOUNTER

| encounter_key | Material family | Surface mode |
|---|---|---|
| `structure_passage` | obsidian | structure_threshold / passage_explainer |
| `structured_eval` | obsidian | evaluation_chamber / structure_path_framing |
| `measures_phases_reveal` | **marble** (lapis accent) | convergence_reveal |
| `about_measures_registry` | **marble** (lapis accent) | institutional_authority |
| `measures_eval_email_contract` | obsidian | delivery_confirmation |

`measures_phases_reveal` and `about_measures_registry` are marble/lapis — distinct from the obsidian base of all other encounters.

---

## SITEWIDE CONTRACT INHERITANCE

All 5 encounters bound to:

```
source_sitewide_contract: {
  document_key: "measures_registry_sitewide_style_contract",
  version_key: "measures_registry_sitewide_style_contract_v1",
  seating: "encounter_contract_v1"
}
```

| Encounter contract field | Inherits from sitewide clause |
|---|---|
| `media_behavior_contract` | `mrssc_v1_media_behavior_contract` |
| `branding_contract` | `mrssc_v1_branding_contract` |
| `footer_contract` | `mrssc_v1_footer_contract` |
| `transition_contract` | `mrssc_v1_transition_contract` |

---

## ASSESSMENT MECHANICS CONFIRMATION

| Check | Result |
|---|---|
| `structured_eval` assessment fork introduced | **no — not_forked** |
| `shared_assessment_mechanics_contract.mechanics_source` | `measures_assessment` |
| `shared_assessment_mechanics_contract.fork_status` | `not_forked` |
| Fork authorization condition | explicit OAR2 required |

`structured_eval` reuses `measures_registry_evaluation_chamber` with structure-path framing. No separate scoring logic. No fork. Assessment mechanics authority remains in `measures_assessment`.

---

## EMAIL DELIVERY CONTRACT CONFIRMATION

| Check | Result |
|---|---|
| `email_delivery_contract` seated | true |
| Phase reveal excluded from email | confirmed (`excludes: ["phase_reveal"]`) |
| Recommended structural response included | confirmed (`includes: ["recommended_structural_response"]`) |
| Email dispatch implemented | **no — deferred** |
| `dispatch_implementation` | `deferred` |

Email structure seated in metadata:

```
Subject: Your Measures Registry Assessment Package
Preheader: Your assessment result and recommended structural response are enclosed.
Body sections: measures_registry_assessment_package, assessment_result, primary_finding,
               recommended_structural_response, reserve_seat, record_recall_reference, footer_copyright
```

No email sending code authored. Contract marker only.

---

## ABOUT_MEASURES_REGISTRY APPROVED CONTENT CONFIRMATION

| Check | Result |
|---|---|
| `approved_content_contract` seated | true |
| `frontend_hardcode_allowed` | false |
| Copy authority | `measures_encounter_def.metadata` |

Approved content seated:

```
eyebrow: ABOUT MEASURES REGISTRY
title: A registered environment for governing AI behavior.
subtitle: Measures Registry helps institutions identify, structure, and govern the operational
         environments where AI systems produce influence, decisions, and risk.
primary_statement: AI governance cannot depend on model choice alone. It requires a registered
                   environment where authority, review, system behavior, and operational
                   accountability can be seen, traced, and maintained.
support_points (5): [see metadata]
cta_label: Read Structural Drift
cta_target: structural_drift_publication
```

---

## ROUTE EXPECTATIONS SEATED

| encounter_key | route_expectation |
|---|---|
| `structure_passage` | structure_passage → connect_src |
| `structured_eval` | structured_eval → measures_phases_reveal |
| `measures_phases_reveal` | measures_phases_reveal → about_measures_registry |
| `about_measures_registry` | about_measures_registry → structural_drift_publication |
| `measures_eval_email_contract` | measures_eval_email_contract → reserve_seat |

Route expectations are seated in `transition_contract.route_expectation`. Actual routing governed by `measures_transition_rule` (14 seated rules — not modified).

---

## VALIDATION QUERY

```sql
-- Contract status and clause presence for all 5 stub encounters
select
  encounter_key,
  is_active,
  metadata->>'contract_status' as contract_status,
  metadata->'source_sitewide_contract'->>'document_key' as sitewide_contract,
  metadata->>'renderer' as renderer,
  metadata->'styling_contract'->>'version' as styling_version,
  metadata->'layout_contract'->>'version' as layout_version,
  (metadata ? 'transition_contract') as has_transition,
  (metadata ? 'encounter_isolation_contract') as has_isolation,
  (metadata ? 'media_behavior_contract') as has_media_behavior,
  (metadata ? 'branding_contract') as has_branding,
  (metadata ? 'footer_contract') as has_footer,
  (metadata ? 'email_delivery_contract') as has_email_delivery,
  (metadata ? 'approved_content_contract') as has_approved_content,
  (metadata ? 'shared_assessment_mechanics_contract') as has_shared_assessment_mechanics
from public.measures_encounter_def
where encounter_key in (
  'structure_passage',
  'structured_eval',
  'measures_phases_reveal',
  'about_measures_registry',
  'measures_eval_email_contract'
)
order by encounter_key;

-- structured_eval assessment fork check
select
  encounter_key,
  metadata->'shared_assessment_mechanics_contract'->>'fork_status' as fork_status,
  metadata->'shared_assessment_mechanics_contract'->>'mechanics_source' as mechanics_source
from public.measures_encounter_def
where encounter_key = 'structured_eval';

-- about_measures_registry approved content check
select
  encounter_key,
  metadata->'approved_content_contract'->>'title' as title,
  metadata->'approved_content_contract'->>'cta_target' as cta_target,
  metadata->'approved_content_contract'->>'frontend_hardcode_allowed' as frontend_hardcode_allowed
from public.measures_encounter_def
where encounter_key = 'about_measures_registry';

-- measures_eval_email_contract email delivery check
select
  encounter_key,
  metadata->'email_delivery_contract'->>'contract_type' as contract_type,
  metadata->'email_delivery_contract'->>'dispatch_implementation' as dispatch_implementation,
  metadata->'email_delivery_contract'->'excludes' as excludes,
  metadata->'email_delivery_contract'->'includes' as includes
from public.measures_encounter_def
where encounter_key = 'measures_eval_email_contract';
```

---

## READBACK CONFIRMATION

```
db_connection: ok
prereq_sitewide_contract: ok
prereq_stub_encounters: ok (5 of 5 found)
prereq_renderer_contract_status: ok (all 5 assigned)
prereq_sitewide_binding: ok (all 5 bound)
prereq_transition_rules: 114 active rules (informational)

phase_1_contract_seating: ok (5 encounters)

contract_seating_readback: {
  "encounters_contracted": 5,
  "all_contracted": true,
  "all_sitewide_bound": true,
  "no_assessment_fork": true,
  "email_delivery_contract_seated": true,
  "about_approved_content_seated": true,
  "renderer_files_modified": false,
  "css_files_modified": false,
  "readback": [
    { "encounter_key": "about_measures_registry", "is_active": false, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "renderer": "about_measures_registry", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": false, "has_branding": true, "has_footer": true, "has_email_delivery": false, "has_approved_content": true, "has_shared_assessment_mechanics": false, "assessment_fork_status": null },
    { "encounter_key": "measures_eval_email_contract", "is_active": false, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "renderer": "measures_eval_email_contract", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": false, "has_branding": false, "has_footer": false, "has_email_delivery": true, "has_approved_content": false, "has_shared_assessment_mechanics": false, "assessment_fork_status": null },
    { "encounter_key": "measures_phases_reveal", "is_active": false, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "renderer": "measures_phases_reveal", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": true, "has_branding": false, "has_footer": false, "has_email_delivery": false, "has_approved_content": false, "has_shared_assessment_mechanics": false, "assessment_fork_status": null },
    { "encounter_key": "structure_passage", "is_active": false, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "renderer": "diagnostic_explainer_passage", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": true, "has_branding": false, "has_footer": false, "has_email_delivery": false, "has_approved_content": false, "has_shared_assessment_mechanics": false, "assessment_fork_status": null },
    { "encounter_key": "structured_eval", "is_active": false, "contract_status": "contracted", "source_sitewide_contract": "measures_registry_sitewide_style_contract", "renderer": "measures_registry_evaluation_chamber", "styling_contract_version": "v1", "layout_contract_version": "v1", "has_transition_contract": true, "has_encounter_isolation": true, "has_media_behavior": true, "has_branding": true, "has_footer": false, "has_email_delivery": false, "has_approved_content": false, "has_shared_assessment_mechanics": true, "assessment_fork_status": "not_forked" }
  ]
}
```

**Readback note:** All 5 stubs are `is_active: false`. Readback performed using service role writer to bypass RLS. Reader (anon key) would return 0 rows for these stubs.

---

## CONFLICTS AND BLOCKED OPERATIONS

None. All 5 operations completed without constraint violations or blocked operations. Idempotent on re-run.

---

## RENDERER PRESERVATION CONFIRMED

No renderer files created. No CSS files modified. No frontend files modified.

| encounter_key | renderer | status |
|---|---|---|
| `structure_passage` | `diagnostic_explainer_passage` | assigned — renderer implementation pending |
| `structured_eval` | `measures_registry_evaluation_chamber` | assigned — reuses existing renderer |
| `measures_phases_reveal` | `measures_phases_reveal` | assigned — new renderer, implementation pending |
| `about_measures_registry` | `about_measures_registry` | assigned — new renderer, implementation pending |
| `measures_eval_email_contract` | `measures_eval_email_contract` | assigned — new renderer, implementation pending |

---

## EXISTING METADATA PRESERVATION CONFIRMED

| encounter_key | Preserved fields |
|---|---|
| `structure_passage` | `renderer`, `intended_renderer`, `renderer_contract_status`, `source_sitewide_contract`, `approved_copy_pending_contract`, `media_roles`, `function_layer`, `state_expression`, `reconciliation_source` |
| `structured_eval` | `renderer`, `intended_renderer`, `renderer_contract_status`, `source_sitewide_contract`, `assessment_mechanics_note`, `function_layer`, `state_expression`, `reconciliation_source` |
| `measures_phases_reveal` | `renderer`, `intended_renderer`, `renderer_contract_status`, `source_sitewide_contract`, `renderer_purpose`, `function_layer`, `state_expression`, `reconciliation_source` |
| `about_measures_registry` | `renderer`, `intended_renderer`, `renderer_contract_status`, `source_sitewide_contract`, `renderer_purpose`, `function_layer`, `state_expression`, `reconciliation_source` |
| `measures_eval_email_contract` | `renderer`, `intended_renderer`, `renderer_contract_status`, `source_sitewide_contract`, `renderer_purpose`, `function_layer`, `state_expression`, `reconciliation_source` |

All pre-existing metadata keys preserved via spread merge.

---

## REGISTERED 13 CONTRACT STANDING — COMPLETE

All 13 registered public encounters now have seated contracts:

| # | encounter_key | contract_status | renderer |
|---|---|---|---|
| 1 | `ai_isnt_broken_intro` | contracted | `epigraph_split_hero` |
| 2 | `evaluate_structure_path` | contracted | `measures_registry_path_choice` |
| 3 | `eval_passage` | contracted | `diagnostic_explainer_passage` |
| 4 | `connect_src` | contracted | `static_authority_surface` |
| 5 | `measures_assessment` | contracted | `measures_registry_evaluation_chamber` |
| 6 | `structure_passage` | **contracted** | `diagnostic_explainer_passage` |
| 7 | `structured_eval` | **contracted** | `measures_registry_evaluation_chamber` |
| 8 | `measures_phases_reveal` | **contracted** | `measures_phases_reveal` |
| 9 | `about_measures_registry` | **contracted** | `about_measures_registry` |
| 10 | `structural_drift_publication` | contracted | `structural_drift_dispatches` |
| 11 | `measures_eval_email_contract` | **contracted** | `measures_eval_email_contract` |
| 12 | `reserve_seat` | contracted | `reserve_seat_selector` |
| 13 | `phase_payment` | contracted | `hold_surface` |

**Bold = contracted in this OAR1.** All 13 are now contracted.

---

## RECOMMENDED NEXT OAR2

Renderer implementation is now unblocked for the 5 previously-stub encounters.

Priority order by path dependency:

1. `structure_passage` — reuses `diagnostic_explainer_passage`; approved copy and media role seated; no new renderer required
2. `structured_eval` — reuses `measures_registry_evaluation_chamber`; shared assessment mechanics; structure-path framing needed
3. `measures_phases_reveal` — new renderer; convergence surface; marble/lapis material
4. `about_measures_registry` — new renderer; approved content fully seated; marble/lapis material
5. `measures_eval_email_contract` — new renderer; email delivery contract seated; dispatch deferred

`structure_passage` and `structured_eval` may be implementable without new renderer code — confirm renderer reuse scope before authoring.

---

## CLOSEOUT

5 registered stub encounter contracts seated in `measures_encounter_def.metadata`. All 5 bound to `measures_registry_sitewide_style_contract`. Assessment mechanics not forked — `structured_eval` references `measures_assessment` mechanics authority. Email delivery contract seated without dispatch implementation. `about_measures_registry` approved content seated from metadata with `frontend_hardcode_allowed: false`. No renderer files created. No CSS edits. No copy invention.

All 13 registered public encounters in the Measures Registry now have Codex-seated encounter contracts. The registered runtime is fully contracted. Renderer implementation is unblocked.

OAR1 ready for operator review.
