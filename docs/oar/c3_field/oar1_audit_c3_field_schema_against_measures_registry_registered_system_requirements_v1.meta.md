---
document_type: oar1
authority_level: working
document_scope: c3_field
title: OAR1 — Audit c3 Field Schema Against Measures Registry Registered-System Requirements
status: executed
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/oar2_audit_c3_field_schema_against_measures_registry_registered_system_requirements_v1.meta.md
executor: claude
execution_date: 2026-06-09
branch: initiative/c3-field-convergence-infra
tags:
  - oar1
  - c3-field
  - schema-audit
  - registered-systems
  - measures-registry-pressure-case
  - c3-tree
  - optics
  - passage-law
  - runtime-admission
---

# OAR1 — Audit c3 Field Schema Against Measures Registry Registered-System Requirements v1

## OBJECTIVE

Audit the existing c3 Field schema and implementation surfaces to determine whether they support the newly clarified registered-system architecture. Return gap tables, Measures Registry pressure case, and proposed next OAR sequence. No mutations performed.

---

## PRE-EXECUTION: BRANCH VERIFICATION

| check | result |
|---|---|
| git rev-parse --show-toplevel | `C:/Users/c3DAO/OneDrive/Apps/c3Field` |
| git branch --show-current at start of audit | `measures` |
| required branch | `initiative/c3-field-convergence-infra` |
| branch mismatch | YES — switched before inspection |
| branch after switch | `initiative/c3-field-convergence-infra` |
| remote branch exists | YES — `remotes/origin/initiative/c3-field-convergence-infra` |
| Measures Registry deployment branch used for audit | NO |

Branch mismatch was detected and resolved before any inspection. No audit observations were made from `measures` branch. All inspection performed from `initiative/c3-field-convergence-infra`.

---

## SECTION 1 — EXISTING c3 FIELD SCHEMA SUPPORT TABLE

| architecture requirement | existing support | table / view / file | gap | recommendation |
|---|---|---|---|---|
| c3 Field as coherent environment | Partial — `field_origin` table exists but is empty; no Field identity row seated | `field_origin` (0 rows) | No c3 Field anchor row | Seat c3 Field as `field_origin` row in future OAR |
| c3 Tree as coherent living operation | Not in schema | — | No tree-level concept or table | OAR2 — Seat c3 Registered-System Law Schema |
| Measures of Inanna as immutable passage pattern | Partial — passage behavior in `ant_passage_state`, Inanna narrative in `measures_registry` | `ant_passage_state`, `measures_registry` | No Inanna-passage as c3 Field law table | Document as architecture boundary; MR handles runtime |
| Codexstone / integrity governance | Partial — `codex_source_record`, `codex_source_relation`, lineage views exist | `codex_source_record`, `v_codex_source_lineage` | No explicit integrity-governance contract table | Treat Codex source layer as Codexstone backing |
| Roots / immutable memory | Partial — `c3_oar_transition_event` is append-only (immutable); `codex_source_record` has lineage | `c3_oar_transition_event`, `codex_source_record` | No explicit roots/Field-connection schema | Roots expressed through immutable transition event and Codex source record; sufficient for P1 |
| c3 Model (Connect / Contribute / Create) | Not in schema | — | No trunk/model layer | Deferred — OAR after registered-system standing |
| Branches / interoperability | Partial — `field_relation_edge`, `field_dependency_edge` exist with typed relation_state | `field_relation_edge`, `field_dependency_edge` | Scoped to OAR governance; not registered-system interoperability | Extend in registered-system OAR |
| c3 Optics as displayed relational geometry | Partial — `opticsSurfaceRegistry.ts`, `coherenceOpticsGrammarRegistry.ts`, `glyphOperatorRegistry.ts` — TypeScript-only | `src/c3_field_convergence/opticsSurfaceRegistry.ts` | No DB-backed optics contract table; optics expressed as derived runtime, not contract law | OAR2 — Seat c3 Optics contract layer |
| Canopy / communications and encounters | Partial — `ant_envelope`, `ant_inbox`, `ant_attachment_map`, `ant_signal_record` | `ant_*` tables | ANT layer is present; not yet bound to c3 Field canopy law | Canopy tables exist; binding law needed |
| Registered System standing | NOT IN SCHEMA | — | No `registered_system` table, no `standing = registered / unregistered` column anywhere | **Priority 1** — OAR2 must seat |
| Unregistered System distinction | NOT IN SCHEMA | — | No binary standing; no unregistered classification | **Priority 1** — OAR2 must seat |
| Registration standing separation from runtime admission | NOT IN SCHEMA | — | No separation; no registration record | **Priority 1** |
| Runtime admission | NOT IN SCHEMA | — | No `runtime_admission` table or view | **Priority 2** — after registration |
| Chamber directory law | Present in MR scope — `registry_family = 'chamber_directory'`, `v_measures_registry_chamber_directory_v1` | `measures_registry`, MR view | Not expressed as c3 Field law contract; lives only in MR | Bind MR chamber directory to c3 Field law in future OAR |
| Passage law (cross-family) | Partial — `measures_transition_rule` + `ant_passage_state` | `measures_transition_rule`, `ant_passage_state` | No cross-family passage contract table at c3 Field law level | OAR2 — Passage taxonomy |
| Same-family passage law | Partial — `measures_transition_rule` expresses passage rules | `measures_transition_rule` | No same-family passage standing table | OAR2 — Passage taxonomy |
| Secure external passage law | NOT IN SCHEMA | — | No secure passage or external boundary contract | **Priority 3** |
| Role contract law | Partial — `c3_key_permission_map` has permission_class, role_key, branch_key, branch_scope | `c3_key_permission_map` | Permission mapping exists; not a full role contract with AI boundary, authorization responsibility, actor scope | OAR2 — Role contract |
| Authorization responsibility | Partial — `c3_key_permission_map.permission_class` + `permission_status` | `c3_key_permission_map` | Not a formal authorization responsibility table | Role contract OAR |
| AI allowed / disallowed action law | NOT IN SCHEMA | — | No AI action boundary table | **Priority 2** |
| External / non-native system boundary law | NOT IN SCHEMA | — | No external system contract | **Priority 3** |
| Material / chamber replication law | Not in schema at c3 Field law level | — | MR handles material families; no c3 Field replication law | Deferred |
| Optics contract law | NOT IN SCHEMA (TypeScript only) | `src/c3_field_convergence/opticsSurfaceRegistry.ts` | DB-backed optics contract per system/encounter not present | **Priority 2** |
| Evidence contract law | Partial — `system_oar_execution_evidence` per OAR queue | `system_oar_execution_evidence` | Evidence contracts are OAR-scoped only; no per-encounter/system contract | OAR2 — Evidence contract |
| Memory / trace contract law | Partial — `c3_oar_transition_event` (immutable), `oar1_log`, `codex_source_record` | `c3_oar_transition_event`, `oar1_log` | No formal per-system trace contract | OAR2 — Trace contract |
| Revocation / correction contract law | Partial — `c3_oar_process_instance` has correction lineage (correction_oar2_path, held_standing) | `c3_oar_process_instance` | OAR-level correction only; no system-level revocation contract | OAR2 — Correction/revocation |

---

## SECTION 2 — MEASURES REGISTRY PRESSURE CASE TABLE

| MR requirement | belongs to c3 Field law | belongs to MR binding | current support | gap |
|---|---|---|---|---|
| Chamber directory binding | c3 Field law (contract type definition) | MR binding (content) | Present — `v_measures_registry_chamber_directory_v1`, `registry_family = 'chamber_directory'` | Not formally tied to c3 Field law contract |
| Runtime encounter surfaces | MR binding | MR binding | Present — `measures_encounter_def`, 11 surfaces bound | Functional; no c3 Field registration backing yet |
| Assessment carry-forward | MR binding | MR binding | Present — `measures_iis_eval_gate1_capture`, `metadata.carry_forward` | Functional |
| MAP Integrity Governance | MR binding | MR binding | Present — `map_integrity_governance` canonical, `/map-integrity-governance` route, Marble directory bound | Functional |
| Contact capture | MR binding | MR binding | Present — post-assessment contact capture write | Functional |
| MAP commerce / payment boundary | MR binding | MR binding | Present — `map_commerce_contracts`, Stripe server-side checkout | Functional; Stripe authority is external |
| SEAT held boundary | MR binding | MR binding | Present — SEAT held; `measures_seat_hold_capture`, holds not yet released | Functional |
| External / private system needs | **c3 Field law** | MR binding | NOT PRESENT | External system boundary not seated anywhere |
| Optics needs (public/private surface display) | **c3 Field law** | MR binding | TypeScript optics only; no DB optics contract per MR surface | Gap: optics contract not DB-backed per encounter |
| Role / authorization needs | **c3 Field law** | MR binding | `c3_key_permission_map` partial | Role contract with AI boundary not seated |
| AI action boundary | **c3 Field law** | MR binding | NOT PRESENT | No AI action boundary table |
| Runtime admission | **c3 Field law** | MR binding | NOT PRESENT | No `v_c3_field_runtime_admission_v1` view or backing table |
| Registered System standing for MR itself | **c3 Field law** | MR binding | NOT PRESENT | MR is not formally registered as a Registered System — no `registered_system` row |

---

## SECTION 3 — REGISTERED / UNREGISTERED STANDING SUPPORT

| requirement | supported now | missing | risk |
|---|---|---|---|
| System registration table | NO | `c3_registered_system` table needed | MR cannot bind to Field law without a registration record |
| Registration standing binary (Registered / Unregistered) | NO | Binary standing column with no mapped/direct/federated drift | Standing language not present in any table |
| Standing separation from runtime admission | NO | Both registration table and admission contract needed | Collapse risk — admission without standing |
| External / private / non-native system standing | NO | External system row on registration table | Cannot register systems that live outside infrastructure |
| Branch standing (interoperability relation) | Partial — `field_relation_edge` exists with typed relation | Full registered-system branch standing not seated | Branches not tied to registered-system standing |
| Participation in c3 Tree | NO | Tree-level concept not in schema | No tree participation record |
| Binary standing vs. drift | N/A — no standing table yet | Must be seated as binary from start | Risk: if seated as enum with mapped/direct/federated values, standing drifts immediately |
| Implementation patterns separated from standing | Not yet expressible | Must be enforced by schema design | registration_standing ≠ implementation_pattern |

---

## SECTION 4 — PASSAGE TAXONOMY SUPPORT

| passage type | supported now | missing contracts | blocker |
|---|---|---|---|
| Cross-family passage | Partial — `measures_transition_rule` + `ant_passage_state` | No c3 Field-level passage contract table; no source-to-target directory contracts | Not blocking for MR (MR uses its own transition rules); blocking for c3 Field law |
| Same-family passage | Partial — `measures_transition_rule` expresses same-material transitions | Same — no formal same-family passage contract | Same |
| Secure external passage | NOT PRESENT | `c3_secure_passage_contract` table needed; data minimization, credential boundary, return-state contract needed | Blocking for any external system participation |
| Passage source and target directories | Partial — `measures_transition_rule` has from/to registry and encounter IDs | No c3 Field-level source/target directory contract | Present at MR level only |
| Transition contracts | Partial — `measures_transition_rule` (from_registry_id, to_registry_id, transition_kind, requires_*) | No c3 Field-level transition contract table | MR-scoped only |
| Return-state contracts | NOT PRESENT | No return-state contract table | Missing |
| Passage validation contracts | Partial — `measures_transition_rule.requires_release`, `requires_passage_ready` | No validation contract table; validation embedded in rule row | Embedded, not contract-law governed |
| Signal carry without defining standing | Partial — ANT envelope/inbox carries signal | ANT not formally bound to canopy law | ANT layer exists; not law-bound |

---

## SECTION 5 — CHAMBER DIRECTORY LAW SUPPORT

| chamber law requirement | supported now | gap | recommended schema / view |
|---|---|---|---|
| Directory key | Present — `registry_key` for `registry_family = 'chamber_directory'` rows | Not expressed as c3 Field law | Seat formal `chamber_directory` law layer in c3 Field |
| Chamber key | Present — `material_family` + `registry_family` | Not a formal chamber_key column | Add `chamber_key` to formal layer |
| Material family | Present — `material_family` on measures_registry | MR-scoped | Move to c3 Field law |
| Role contract | NOT PRESENT | No role contract per chamber | OAR2 — role contract |
| Allowed / disallowed contract types per chamber | NOT PRESENT | No contract placement enforcement | OAR2 — contract placement law |
| Required contract list | NOT PRESENT | | |
| Public / private boundary | Present — `visibility_state` in metadata | Not formal DB column | Add `visibility_state` as explicit column |
| Release / access state | Present — `release_state`, `access_state` | Functional | OK |
| Runtime admission status | NOT PRESENT | | |
| Blocking gaps / unknown field disallowance | NOT PRESENT | No schema enforcement of unknown fields | |
| Chamberplates ≠ chamber_directory | Confirmed — `surface_type = 'chamberplate'` vs `registry_family = 'chamber_directory'` | Distinction is clear in MR | OK |

---

## SECTION 6 — CONTRACT PLACEMENT RULE SUPPORT

| contract type | allowed chamber(s) | current enforcement | gap |
|---|---|---|---|
| Contact capture | Obsidian | Not enforced — no contract placement table | No enforcement |
| Scoring / evaluation | Obsidian | Not enforced | No enforcement |
| Payment / commerce | Marble | Partial — MAP commerce contracts are Marble-family | No chamber law enforcement |
| SEAT release | Marble (or future Marble-family) | Partial — SEAT held; no formal release enforcement | No enforcement |
| Education / orientation | Crystal / Lapis | Not enforced | |
| Publication / route support | Lapis / Crystal | Not enforced | |
| Secure passage | External boundary chambers | NOT PRESENT | |
| AI action boundary | Per chamber where AI operates | NOT PRESENT | |

No contract placement enforcement exists in schema. Contract types are placed ad-hoc based on MR runtime logic.

---

## SECTION 7 — ROLE CONTRACT SUPPORT

| role contract requirement | supported now | missing | schema recommendation |
|---|---|---|---|
| Authorization responsibility | Partial — `c3_key_permission_map.permission_class`, `permission_status` | Not a formal authorization responsibility record | `c3_role_contract` table |
| Allowed actor types | Partial — `c3_key_permission_map.origin_type`, `holder_type` | Not per-chamber actor scope | |
| Allowed AI roles | NOT PRESENT | | |
| Allowed AI actions | NOT PRESENT | | |
| Disallowed AI actions | NOT PRESENT | | |
| Human approval requirements | Partial — `system_oar_queue` requires operator confirm | Not per-encounter requirement | |
| Data access scope | NOT PRESENT | | |
| External system access scope | NOT PRESENT | | |
| API / tool access scope | NOT PRESENT | | |
| Write / delete / financial / identity permission boundaries | Partial — `c3_key_permission_map.permission_class` covers some | Not granular per action type | |
| Audit / OAR logging requirements | Partial — OAR queue and evidence | Per-encounter requirement not expressed | |
| Escalation requirements | NOT PRESENT | | |
| Revocation conditions | Partial — `c3_key_permission_map.revoked_at` | Not a formal revocation contract | |

---

## SECTION 8 — c3 OPTICS SUPPORT

| optics requirement | supported now | missing | recommendation |
|---|---|---|---|
| Optics contract key | TypeScript only — `opticsSurfaceRegistry.ts` surfaceKey | No DB optics contract table | `c3_optics_contract` table |
| Visibility scope | Present in TypeScript — `allowedSurfaceScope` | Not DB-backed | |
| Audience scope | NOT PRESENT | Operator / user / AI / external-party scope not in schema | |
| Public / private boundary | Present in MR metadata — `visibility_state` | Not formal DB column | |
| Semantic exposure level | TypeScript only — `inscriptionBehavior`, `tonalEligibility` | Not in DB | |
| Internal language allowed / disallowed | NOT PRESENT | | |
| Material language allowed / disallowed | NOT PRESENT | | |
| Redaction rules | NOT PRESENT | | |
| Sensitive term blocking | NOT PRESENT | | |
| Allowed public title | Present in MR metadata — `public_title` | Not formal optics contract | |
| Allowed internal title | Present in MR metadata — `display_title` | Not formal optics contract | |
| Held / missing / permission denied states | Partial — `visibility_state` in metadata | Not formal optics standing | |
| Operator visibility | Partial — runtime console displays OAR standing | Not a contract | |
| User visibility | Present — MR public surfaces control user visibility | Not formal contract | |
| AI visibility | NOT PRESENT | | |
| External-party visibility | NOT PRESENT | | |

Current optics layer: TypeScript-only, scoped to c3 Field operations console. Not yet a DB-backed contract law governing system/encounter display.

---

## SECTION 9 — EVIDENCE, TRACE, AND CORRECTION SUPPORT

| contract family | supported now | gap | recommendation |
|---|---|---|---|
| **Evidence contract** | | | |
| Evidence required | Partial — OAR execution requires evidence path | Not per-encounter | |
| Evidence source | `system_oar_execution_evidence.evidence_type` (7 types) | Not per-system | |
| Validation query | `system_oar_execution_evidence.validation_query` | OAR-scoped only | |
| Proof visibility | NOT PRESENT | | |
| Proof retention | Partial — append-only execution evidence | No formal retention policy | |
| **Memory / trace contract** | | | |
| OAR attachment | Present — `oar1_log.src_intake_request_id`, `env_key` | Not system-level | |
| envKey continuity | Present — `src_intake_request.env_key`, `oar1_log.env_key` | MR-scoped | |
| Carry-forward state | Present — `measures_iis_eval_gate1_capture.metadata.carry_forward` | MR-scoped | |
| Audit trace | Present — `c3_oar_transition_event` (append-only, actor, timestamp) | Full c3 Field coverage needed | |
| Return state | Partial — `measures_transition_rule.requires_passage_ready` | Not formal | |
| Immutable memory | Present — `c3_oar_transition_event` has UPDATE/DELETE triggers preventing mutation | Strong | |
| Lineage | Present — `v_codex_source_lineage`, `codex_source_relation` | Codex-scoped | |
| **Correction / revocation contract** | | | |
| Hold state | Present — `c3_oar_process_instance.held_standing` (6 types) | OAR-level only | |
| Redaction state | NOT PRESENT | | |
| Correction path | Present — `c3_oar_process_instance.correction_oar2_path` | OAR-level only | |
| Revocation trigger | Partial — `c3_key_permission_map.revoked_at` | Not contract-based | |
| Rollback boundary | NOT PRESENT | | |
| Return-to-prior-valid-state | NOT PRESENT | | |
| Re-admission requirements | NOT PRESENT | | |

---

## SECTION 10 — EXTERNAL / NON-NATIVE SECURE SYSTEM SUPPORT

| external system requirement | supported now | gap | blocker |
|---|---|---|---|
| External system contract | NOT PRESENT | No `c3_external_system_contract` table | YES — blocking for external participation |
| Secure passage contract | NOT PRESENT | No `c3_secure_passage_contract` table | YES |
| Authorization contract | Partial — `c3_key_permission_map` | Not external-scoped | |
| Data minimization contract | NOT PRESENT | | YES |
| Redaction contract | NOT PRESENT | | |
| Audit log contract | Partial — OAR evidence | Not external-scoped | |
| Return-state contract | NOT PRESENT | | |
| API contract | NOT PRESENT | | |
| Credential storage contract | NOT PRESENT | Stripe keys in Cloudflare env — not governed | |
| Webhook contract | NOT PRESENT | Stripe webhook present but not governed through c3 Field law | |
| Failure-state contract | NOT PRESENT | | |
| External system active / inactive state | NOT PRESENT | | |
| Sensitive data prohibition | NOT PRESENT in schema | | |
| Minimized return state | NOT PRESENT | | |

---

## SECTION 11 — RUNTIME ADMISSION SUPPORT

| admission check | supported now | missing | recommendation |
|---|---|---|---|
| Registration standing | NOT PRESENT | No `registered_system` table | Priority 1 |
| Runtime admission standing | NOT PRESENT | No admission table or view | Priority 2 |
| Required contracts present check | NOT PRESENT | | |
| Contract type placement valid | NOT PRESENT | | |
| Role contract valid | NOT PRESENT | | |
| Authorization valid | Partial — OAR operator confirm | Not encounter-level | |
| AI action boundary valid | NOT PRESENT | | |
| Optics valid | NOT PRESENT (TypeScript only) | | |
| Evidence valid | Partial — OAR evidence | Not encounter-level | |
| Trace valid | Partial — `c3_oar_transition_event` | Not encounter-level | |
| Correction valid | Partial — OAR correction lineage | Not encounter-level | |
| External boundary valid | NOT PRESENT | | |
| Release / access state valid | Present — `measures_registry.release_state`, `access_state` | MR-scoped | |
| `v_c3_field_runtime_admission_v1` view | NOT PRESENT | View cannot be created until backing tables exist | Priority 2 after registration |

---

## SECTION 12 — "MAPPED" LANGUAGE AUDIT

| table | column | value | classification |
|---|---|---|---|
| `map_commerce_contracts` | `map_circuit_key`, `contract_key` | `map_*` prefix | Refers to MAP = Measures Assessment Pathway, not "Mapped System" standing |
| `map_payment_events` | `map_standing` | MAP payment lifecycle | MAP = Pathway, not standing class |
| All other tables | — | No `standing = 'mapped'` value found | CLEAR |

"Mapped" as a standing category is not present in any schema table. The `map_*` prefix refers exclusively to the Measures Assessment Pathway. The dissolved "Mapped System" language is not in schema. Safe.

---

## SECTION 13 — MINIMAL SCHEMA GAP LIST

### Priority 1 — Required before any registered-system implementation

1. `c3_registered_system` table — `system_key`, `system_name`, `standing` (`registered` / `unregistered`), `registration_standing`, `system_type` (native, external, non-native), `source_oar2_path`, `registered_at`, `is_active`, `metadata`
2. Binary `standing` constraint — `check (standing in ('registered', 'unregistered'))` — no drift values permitted
3. `c3_field_origin` row for c3 Field itself in `field_origin` (or standalone) — anchors the Field as coherent environment in DB

### Priority 2 — Required before Measures Registry binding

4. `c3_runtime_admission_contract` table — per encounter, validates: registration_standing, required_contracts_present, role_contract_valid, optics_valid, evidence_valid, trace_valid, correction_valid, external_boundary_valid, release_state_valid
5. `v_c3_field_runtime_admission_v1` view — resolves all admission checks against registration + contract tables
6. `c3_ai_action_boundary` table — per system or encounter: allowed_actions, disallowed_actions, human_approval_required, audit_required

### Priority 3 — Required before external / private system participation

7. `c3_external_system_contract` — external system row, data_minimization_rule, sensitive_data_prohibition, active_state
8. `c3_secure_passage_contract` — secure passage contract between external system and registered chamber

### Priority 4 — Required before Federated SEAT

9. `c3_role_contract` — full role contract: actor_types, ai_roles_allowed, ai_actions_allowed, ai_actions_disallowed, authorization_scope, data_access_scope, external_access_scope, write_permission, financial_permission, identity_permission, escalation_path, revocation_condition
10. `c3_optics_contract` — DB-backed optics contract: visibility_scope, audience_scope, public_private_boundary, semantic_exposure_level, internal_language_allowed, material_language_allowed, redaction_rules, sensitive_term_block, allowed_public_title, renderer_state
11. `c3_evidence_contract` — per encounter: evidence_required, evidence_source, evidence_type, validation_query, proof_visibility, proof_retention

### Priority 5 — Documentation / terminology cleanup

12. Confirm `field_origin` is populated with c3 Field anchor row
13. Confirm no `standing` column anywhere resolves to `mapped`, `direct`, or `federated` as standing class
14. Dissolve any remaining "Mapped" references in metadata where they function as standing language (currently: none found — safe)

---

## SECTION 14 — PROPOSED NEXT OAR SEQUENCE

| sequence | OAR2 title | priority | scope |
|---|---|---|---|
| 1 | OAR2 — Seat c3 Field Registered-System Law Schema v1 | Priority 1 | Create `c3_registered_system` table; binary standing; `field_origin` anchor row; seat Measures Registry as first Registered System row |
| 2 | OAR2 — Seat c3 Field Runtime Admission View v1 | Priority 2 | Create `c3_runtime_admission_contract` table; create `v_c3_field_runtime_admission_v1` view; seat MR threshold encounters as admission-validated |
| 3 | OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1 | Priority 2–3 | Create `c3_optics_contract`, `c3_evidence_contract`, `c3_ai_action_boundary` tables; bind MR encounters to optics contracts |
| 4 | OAR2 — Bind Measures Registry to c3 Field Registered-System Law v1 | Priority 2 after 1+2 | Seat MR as Registered System; bind MAP seam encounters to runtime admission; bind optics contracts |
| 5 | OAR2 — Refactor Measures Registry language to Registered / Unregistered standing v1 | Priority 2–5 | Dissolve any remaining metadata references to mapped/direct/federated standing in MR rows; confirm binary standing |
| 6 | OAR2 — Seat c3 Field External System Contracts v1 | Priority 3 | Create external system contract tables; bind Stripe payment boundary as external system |
| 7 | OAR2 — Seat c3 Field Role Contract Layer v1 | Priority 4 | Create `c3_role_contract`; seat contracts for MR assessment and MAP encounters |

---

## VALIDATION

1. **c3 Field deployment branch verified**: YES — `initiative/c3-field-convergence-infra`
2. **Branch mismatch check performed**: YES — mismatch detected and resolved before inspection
3. **No Measures Registry deployment branch used for audit**: YES
4. **Existing c3 Field schema support table returned**: YES — Section 1 (22-row table)
5. **Measures Registry pressure-case table returned**: YES — Section 2
6. **Registered / Unregistered standing support audited**: YES — Section 3 — NOT PRESENT
7. **Passage taxonomy support audited**: YES — Section 4
8. **Chamber directory law support audited**: YES — Section 5
9. **Contract placement support audited**: YES — Section 6
10. **Role contract support audited**: YES — Section 7
11. **Authorization and AI allowed actions support audited**: YES — Section 7 — NOT PRESENT
12. **c3 Optics support audited**: YES — Section 8 — TypeScript only, not DB contract
13. **Evidence contract support audited**: YES — Section 9
14. **Memory / trace contract support audited**: YES — Section 9
15. **Correction / revocation support audited**: YES — Section 9
16. **External / non-native secure system support audited**: YES — Section 10 — NOT PRESENT
17. **Runtime admission support audited**: YES — Section 11 — NOT PRESENT
18. **Minimal schema gap list returned**: YES — Section 13 (14 gaps, prioritized)
19. **Proposed next OAR sequence returned**: YES — Section 14 (7 OARs)
20. **No schema mutation performed**: YES
21. **No runtime mutation performed**: YES
22. **No Measures Registry mutation performed**: YES
23. **No pricing / Stripe / SEAT / c3 Key / wallet mutation performed**: YES
24. **OAR1 audit log written**: this document

---

## CRITICAL FINDINGS SUMMARY

**Three critical gaps block any registered-system implementation:**

1. **No `c3_registered_system` table.** Measures Registry cannot bind to c3 Field registered-system law because the table that would carry that standing does not exist. This is Priority 1 before any further binding work.

2. **No `v_c3_field_runtime_admission_v1` view or backing contract tables.** Runtime admission is resolved ad-hoc in MR source code today. This must be elevated to a c3 Field law contract before MR threshold encounters can be formally admitted through governed standing.

3. **No AI action boundary table.** Measures Registry assessment uses AI scoring. The AI action boundary for that evaluation is not governed in schema. This is required before MR can formally bind its assessment encounter to c3 Field law.

**What is already well-seated:**
- OAR governance lifecycle (`c3_oar_process_instance`, `c3_oar_transition_event`, `system_oar_queue`) — strong
- Immutable memory (`c3_oar_transition_event` with triggers) — strong
- MR chamber directory bindings (`v_measures_registry_chamber_directory_v1`) — functional
- MR assessment-to-MAP seam — functional
- c3 Optics runtime expressions (TypeScript) — expressed; needs DB elevation to contract law
- "Mapped" standing language — confirmed absent from schema

---

## CLOSES

OAR2: docs/oar/c3_field/oar2_audit_c3_field_schema_against_measures_registry_registered_system_requirements_v1.meta.md

## NEXT

1. **OAR2 — Seat c3 Field Registered-System Law Schema v1** — Priority 1; creates `c3_registered_system` table with binary `standing` constraint; seats Measures Registry as first Registered System row; anchors c3 Field in `field_origin`. Branch: `initiative/c3-field-convergence-infra`.

2. **OAR2 — Seat c3 Field Runtime Admission View v1** — Priority 2 after (1); creates `c3_runtime_admission_contract` table and `v_c3_field_runtime_admission_v1` view; binds MR threshold encounters to admission validation.

3. **OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1** — Priority 2–3; creates `c3_optics_contract`, `c3_evidence_contract`, `c3_ai_action_boundary` tables; elevates TypeScript optics to DB contract law.

4. **OAR2 — Bind Measures Registry to c3 Field Registered-System Law v1** — Priority 2 after (1+2); formally binds MR to registered-system standing and runtime admission.
