---
document_type: oar1
authority_level: working
title: OAR1 — Audit Runtime Authority and SEAT Source Isolation
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_runtime_authority_and_seat_source_isolation_v1.meta.md
---

## OBJECTIVE

Audit every executable runtime authority in Measures Registry. Classify all DB contents. Isolate working residue from approved standing. Return complete authority inventory.

## AUTHORITY ORDER APPLIED

Codex → Field → Measures → SEAT Approved Standing → OAR2 → Chazz → Claude → Runtime

SEAT manifest status: `registration_state: not_granted`. Runtime activation is authorized through OAR2 execution history, not formal SEAT registration. SEAT formal approval has not been granted.

"Assumed Seated" does not appear in this document.

---

## APPROVED RUNTIME AUTHORITY INVENTORY

Authority source: OAR2 execution history (lapis, obsidian, marble, crystal OARs). Runtime is live under OAR2-route authority, not SEAT registration.

### Routes

| Route | Surface | Registry Query Key | Authority |
|-------|---------|-------------------|-----------|
| `/` | `intro_hook` or null (DB-governed) | `measures_registry_root` | OAR2-authorized |
| `/ai-operations-assessment` | `measures_assessment` | — (no ROUTE_UNIT_KEY) | OAR2-authorized |
| `/undrifted` | `structural_drift_dispatches` | `undrifted_publication_landing` | OAR2-authorized |
| `/map-integrity-governance` | `map_integrity_governance` | `map_integrity_governance_landing` (not seated) | OAR2-authorized surface; route unit intentionally missing |
| `/about` | `about_measures_registry` | — (no ROUTE_UNIT_KEY) | OAR2-authorized |
| `/about-measures-registry` | `about_measures_registry` | — (alias) | Deprecated alias; routes to same surface |
| `/structural-drift` | redirect → `/undrifted` | `structural_drift_landing` | Deprecated alias; redirect in runtime |

### Encounter Keys (queried from `measures_encounter_def`)

| Encounter Key | DB Record | Display Title | Authority |
|--------------|-----------|--------------|-----------|
| `ai_isnt_broken_intro` | EXISTS | "Measures Registry" | OAR2-authorized (Crystal) |
| `evaluate_structure_path` | EXISTS | "AI isn't broken. Systems are." | OAR2-authorized |
| `eval_passage` | EXISTS | "Evaluation Passage" | OAR2-authorized |
| `measures_assessment` | EXISTS | "AI Operations Assessment" | OAR2-authorized (Obsidian) |
| `obsidian_to_marble_passage_video` | EXISTS | "Before the Pathway" | OAR2-authorized (Marble) |
| `map_integrity_governance` | EXISTS | "MAP Integrity Governance" | OAR2-authorized (Marble) |
| `structure_passage` | EXISTS | "Understand the Environment" | OAR2-authorized |
| `about_measures_registry` | EXISTS | "About Measures Registry" | OAR2-authorized |
| `structural_drift_publication` | EXISTS | "Structural Drift" | OAR2-authorized (Lapis) |
| `ai_operations_assessment_landing` | NOT IN encounter_def | — | Authority Unknown — see below |

### Registry Keys (queried from `measures_registry`)

| Registry Key | is_active | release_state | Queried By | Authority |
|-------------|-----------|---------------|-----------|-----------|
| `measures_registry_root` | true | released | `/` route | OAR2-authorized |
| `undrifted_publication_landing` | true | released | `/undrifted` | OAR2-authorized |
| `structural_drift_landing` | true | released | `/structural-drift` (deprecated) | OAR2-authorized |
| `map_integrity_governance_landing` | NOT IN DB | — | `/map-integrity-governance` | Not seated — renders held state by design |

### Media Roles (active in DB, queried by runtime, `is_active: true`)

| Media Role | Campaign | Authority |
|-----------|---------|-----------|
| `intro_hook_video` | `measures_registry_root_authority_v1` | OAR2-authorized |
| `explainer_video` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `left_hero_fracture` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `left_hero_fracture_motion` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `right_measured_hero` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `measured_hero_motion_graphic` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `background` / `lapis_background` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `watermark` / `registry_watermark` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `registry_mark` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `evaluation_reference_image` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `structured_environment_passage_video` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `measures_structured_enviroments` (typo) | `agents_of_chaos_integrity_governance` | OAR2-authorized (typo preserved — DB and runtime consistent) |
| `marble_tone` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `installation_tone_marble` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `installation_tone_marble_rise_return_v1` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `about_measures_registry_video` | `measures_registry_root_authority_v1` | OAR2-authorized |
| `agents_with_keys_cover` | both campaigns | OAR2-authorized |
| `official_codexstone_seal` | `measures_registry_root_authority_v1` | OAR2-authorized |
| `before_the_pathway_obsidian_to_marble_passage_video` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `obsidian_contact_surface_visual` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `obsidian_assessment_surface_visual` | `agents_of_chaos_integrity_governance` | OAR2-authorized |
| `obsidian_eval_result_surface_visual` | `agents_of_chaos_integrity_governance` | OAR2-authorized |

### Transition Nodes (in `measures_registry_root.encounter_structure`)

| Node | next_surface | DB Source | Authority |
|------|-------------|-----------|-----------|
| `intro_hook.next_surface` | `path_choice` | DB | OAR2-authorized |
| `path_choice.left.next_surface` | `eval_passage` | DB | OAR2-authorized |
| `path_choice.right.next_surface` | `structure_passage` | DB | OAR2-authorized |
| `eval_passage.next_surface` | `measures_assessment` | DB | OAR2-authorized |
| `structure_passage.next_surface` | `about_measures_registry` | DB | OAR2-authorized |
| `structural_coherence_explainer.next_surface` | `measures_assessment` | DB | OAR2-authorized (legacy alias node, both paths lead to measures_assessment) |
| `measures_structured_environments.next_surface` | `about_measures_registry` | DB | OAR2-authorized |

Marble transitions are hardcoded in runtime (not DB-governed nodes):
- `evalSubmitted` → navigate `obsidian_to_marble_passage_video` (runtime constant)
- `obsidian_to_marble_passage_video.onEnded` → navigate `map_integrity_governance` (runtime constant)

### DB Writes (runtime-produced)

| Table | Trigger | Authority |
|-------|---------|-----------|
| `measures_iis_eval_gate1_capture` | Contact capture submit | OAR2-authorized; RLS: insert for `measures_assessment_contact_gated_delivery` / `assessment_result_delivery_request` |
| `measures_registry_connect_capture` | About page connect form submit | OAR2-authorized (oar2_fix_about_measures_registry_encounter) |

---

## WORKING RESIDUE INVENTORY

### 1. `measures_registry_root.encounter_structure.assessment` node

**Location:** DB — `measures_registry.measures_registry_root.metadata.encounter_structure.assessment`

**Contents:**
```json
{
  "assessment_before_contact_capture": true,
  "confirmation_email_notice": "Login details will arrive in a separate email.",
  "map_payment_logic": "preserve_existing_live_logic",
  "ordered_stages": ["assessment", "contact_capture", "result", "map_continuation", "payment"]
}
```

**Classification:** DB-only residue — working development language

**Executable:** No. The current runtime reads `intro_hook`, `path_choice`, `structural_coherence_explainer`, `measures_structured_environments`, `eval_passage`, `structure_passage` from encounter_structure. The `assessment` sub-object is NOT read by `rootStructureNode()`. None of this text reaches the renderer.

**NotChazz:** "Login details will arrive in a separate email." — login is not an active capability. "preserve_existing_live_logic" — working development directive. "map_continuation" — unapproved stage label. These are in the DB but not executed.

**Required Repair:** DB migration to remove the `assessment` node from `encounter_structure`, or replace with approved standing once MAP circuit is formally seated.

### 2. `source_oar2` traceability fields in encounter_structure nodes

**Location:** DB — `eval_passage.source_oar2`, `path_choice.left.source_oar2`, `path_choice.right.source_oar2`, `structure_passage.source_oar2`

**Classification:** Working document references in DB metadata

**Executable:** No. `rootStructureNode()` reads `next_surface` and `content_encounter_key`. `source_oar2` is never read or rendered.

**Assessment:** Traceability annotations — acceptable as audit trail fields. Not executable. Not promoting working documents to runtime authority.

---

## MIGRATION RESIDUE INVENTORY

### 1. `marble_pathway_reveal` — Deprecated alias active in DB

**registry_key:** `marble_pathway_reveal` — `is_active: true`, `release_state: released`
**encounter_key:** `marble_pathway_reveal` — EXISTS in encounter_def (display_title: "MAP Integrity Governance")

**Classification:** Deprecated Alias — remains `released/active` in DB alongside the approved `map_integrity_governance`

**Executable:** The registry entry and encounter_def row exist and are released. The Measures Registry runtime does NOT query this key. However, its `is_active: true, release_state: released` status is false authority — it presents as an active entity when it is a deprecated alias.

**NotChazz:** An alias with active/released status alongside the approved standing creates a false authority impression in the DB.

**Required DB Migration:** Deactivate `marble_pathway_reveal` in both `measures_registry` and `measures_encounter_def`. Set `is_active: false` on both records.

### 2. `iis_eval_gate1` — Legacy encounter key active in DB

**registry_key:** `iis_eval_gate1` — `is_active: true`, `release_state: released`
**encounter_key:** `iis_eval_gate1` — EXISTS in encounter_def (display_title: "MEASURES AI OPERATIONAL EVALUATION")

**Classification:** Legacy Runtime — superseded by `measures_assessment`

**Executable:** The runtime queries `measures_assessment`, not `iis_eval_gate1`. The capture table is still named `measures_iis_eval_gate1_capture` (table name, not encounter key — the table name is acceptable). The encounter key `iis_eval_gate1` is a legacy identifier that remains released/active in the DB.

**Required DB Migration:** Deactivate `iis_eval_gate1` in `measures_registry`. Set `is_active: false`. The `iis_eval_gate1` encounter_def row may be deactivated as well after operator review.

### 3. Legacy landing section encounter_def rows

**encounter_keys:** `landing_courses`, `landing_final_cta`, `landing_intro_video`, `landing_principle`, `landing_problem`, `landing_video_hero`, `cohort_conversion_encounter`, `orientation_placeholder`

**Classification:** Migration Residue — from pre-registered-runtime landing page architecture

**Executable:** NOT queried by current runtime `REGISTERED_ENCOUNTER_KEYS`. Not in scope for Measures Registry registered runtime.

**Assessment:** These belong to a prior landing architecture that has been superseded. They are not executable in the current runtime. Operator may choose to deactivate or archive.

### 4. `structural_drift_field_guide` — Correctly deactivated

**registry_key:** `structural_drift_field_guide` — `is_active: false`, `release_state: released`

**Classification:** Migration Residue — correctly deactivated

**Assessment:** Deactivation was applied by prior OAR. No further action required.

---

## DEPRECATED RUNTIME INVENTORY

### 1. `ai_operations_assessment_landing` — Dead surface

**Runtime:** Surface type defined in `RegisteredSurface`, `SURFACE_QUERY` mapping exists, render branch exists in dispatcher
**DB registry:** `is_active: true`, `release_state: released`
**DB encounter_def:** NOT PRESENT
**Navigation:** UNREACHABLE — no `navigate("ai_operations_assessment_landing")` call exists in the runtime

**Classification:** Legacy Runtime / Dead Surface

**Assessment:** The surface is defined in code and has a registry entry but nothing navigates to it. The runtime formerly used this surface as an intermediate landing before the assessment, but the routing was simplified so `/ai-operations-assessment` now maps directly to `measures_assessment`. The registry entry remains released/active.

**Required Runtime Repair:** Remove `ai_operations_assessment_landing` from `RegisteredSurface`, `SURFACE_QUERY`, and the dispatcher. The registry entry should be deactivated.

### 2. `about_measures_registry` registry entry — Held but runtime renders

**registry_key:** `about_measures_registry` — `is_active: false`, `release_state: held`
**Runtime:** Surface renders via `/about` route and via `structure_passage.next_surface`

**Classification:** Authority Gap — DB says held but runtime renders unconditionally

**Assessment:** The runtime does NOT gate `about_measures_registry` on the registry entry's `is_active` state. The surface renders regardless. The registry entry's held state does not prevent rendering. This is a DB/runtime authority disconnect.

**Assessment of risk:** LOW. The `about_measures_registry` surface has content seated in encounter_def. The held registry entry was likely an oversight, not a governance decision to suppress the surface.

**Required DB Repair:** Either activate the registry entry (`is_active: true`) to match runtime behavior, or add a registry gate check to the `about_measures_registry` render branch.

### 3. `structure_passage` registry entry — Held but runtime renders

**registry_key:** `structure_passage` — `is_active: false`, `release_state: held`
**Runtime:** Surface renders when navigated from `path_choice.right` or directly via `navigate("structure_passage")`

**Classification:** Authority Gap — DB says held but runtime renders unconditionally

**Assessment:** Same pattern as `about_measures_registry`. The surface renders with content from encounter_def. The held registry entry does not suppress rendering.

**Required DB Repair:** Activate the registry entry (`is_active: true`) or add a registry gate to the surface renderer.

### 4. `/about-measures-registry` route alias

**Runtime:** `ROUTE_SURFACE_ALIASES["/about-measures-registry"] = "about_measures_registry"`

**Classification:** Deprecated Alias — superseded by `/about`

**Assessment:** Both routes map to the same surface. The `/about` route is the canonical path. No route head is generated for `/about-measures-registry`. The alias is harmless but is legacy routing.

---

## UNSAFE RUNTIME AUTHORITY INVENTORY

**None identified.**

All executable runtime references trace to OAR2-authorized standing or are correctly handled as held/null states. No working folder content, historical OAR language, or unapproved terminology reaches the renderer.

---

## SOURCE ISOLATION AUDIT

### Working Folder References

**runtime (`MeasuresRegistryRuntimeRegistered.tsx`) imports:** None from `docs/`, `docs/working/`, or non-SEAT folders.

**DB `source_oar2` traceability fields:** Stored in DB metadata but never rendered or executed.

**`submitConnect` metadata payload:**
```ts
metadata: {
  source_surface: "about_measures_registry",
  source_oar2: "docs/oar/measures_registry/oar2_fix_about_measures_registry_encounter_v1.meta.md",
}
```

**Classification:** Traceability annotation embedded in DB write. Not executable. Stored in `measures_registry_connect_capture.metadata.source_oar2`. This is audit trail data, not authority reference.

**Assessment:** The `docs/oar` path in DB metadata is a traceability pointer, not a runtime authority reference. It is acceptable.

### Deprecated Migration References

The `assessment` node in `encounter_structure` contains `map_payment_logic: "preserve_existing_live_logic"` and `ordered_stages` including `payment`. These are NOT read by the runtime. They are working development directives stored in DB metadata from a prior migration phase.

**Classification:** DB-only residue. Source is isolated from working folders. The DB metadata is not source isolation failure — it is DB residue requiring a migration repair.

---

## AUTHORITY DRIFT AUDIT

| Item | Location | Type | Currently Executable | Why It Remains |
|------|---------|------|---------------------|----------------|
| `marble_pathway_reveal` registry + encounter_def | DB | Deprecated Alias | No — runtime doesn't query it | Migration did not deactivate the old entry |
| `iis_eval_gate1` registry + encounter_def | DB | Legacy Runtime | No — runtime queries `measures_assessment` | Old assessment encounter_key; not deactivated |
| `assessment` node in encounter_structure | DB metadata | Working Residue | No — runtime doesn't read this node | Working development content in DB metadata |
| `confirmation_email_notice: "Login details..."` | DB metadata | Working Residue | No | Embedded in non-executed `assessment` node |
| `map_payment_logic: "preserve_existing_live_logic"` | DB metadata | Working Residue | No | Embedded in non-executed `assessment` node |
| `ai_operations_assessment_landing` surface | Runtime + DB | Legacy Runtime | No — never navigated to | Prior routing architecture; not removed |
| `about_measures_registry` registry held | DB | Authority Gap | DB says held; runtime ignores | Registry entry not updated when surface was activated |
| `structure_passage` registry held | DB | Authority Gap | DB says held; runtime ignores | Registry entry not updated when surface was activated |
| `path_choice_background` in REGISTERED_MEDIA_ROLES | Runtime (prior to this OAR) | Dead Query | No — is_active: false in DB | Media deactivated but query not cleaned up |
| `marble_accent_reference` in REGISTERED_MEDIA_ROLES | Runtime (prior to this OAR) | Dead Query | No — is_active: false in DB | Media deactivated but query not cleaned up |
| `measures_structured_enviroments` typo | DB + Runtime | Migration Artifact | Yes — both DB and runtime use typo consistently | Typo introduced at creation; consistent so functional |
| `epigraph_video` media role | DB | Deprecated Alias | No — runtime queries `intro_hook_video` | Old media role name; not queried |
| Legacy media roles (15+) | DB | Migration Residue | No — not in REGISTERED_MEDIA_ROLES | From prior landing architecture |
| `landing_*` encounter_def rows | DB | Migration Residue | No — not in REGISTERED_ENCOUNTER_KEYS | From prior landing architecture |
| `structural_coherence_explainer` legacy alias | Runtime SURFACE_QUERY | Legacy Runtime | Yes — maps to `eval_passage` | Both keys exist; `structural_coherence_explainer` is a legacy alias for `eval_passage` in SURFACE_QUERY |

---

## NOTCHAZZ FLAGS

**Flag 1: `marble_pathway_reveal` active in DB**

`marble_pathway_reveal` has `is_active: true, release_state: released` in `measures_registry` and an encounter_def row. It is a deprecated alias for `map_integrity_governance`. A released/active record alongside the approved standing creates a false authority impression. **DB residue treated as released standing.**

**Flag 2: Working development language in live DB**

`measures_registry_root.encounter_structure.assessment` contains:
- `confirmation_email_notice: "Login details will arrive in a separate email."`
- `map_payment_logic: "preserve_existing_live_logic"`
- `ordered_stages: [..., "map_continuation", "payment"]`

These are working development directives in a live DB record. They are not currently executed but remain seated in the DB as if they have standing.

**Flag 3: Prior OAR normalized residue**

`oar1_repair_assessment_contact_capture_to_marble_passage_transition_v1` reported `confirmation_email_state` as "a column that does not exist." The column DOES exist in the live DB with a NOT NULL default of `'queued'`. The prior OAR normalized a misdiagnosis as a root cause rather than verifying DB state first. This is corrected in the subsequent OAR1 (live repair) and by this audit. The actual failure cause was the stale dist-registry bundle.

---

## REQUIRED SEAT MIGRATIONS

These require operator approval before execution. Claude is not authorized to apply them unilaterally.

### Migration A: Deactivate `marble_pathway_reveal`

```sql
UPDATE public.measures_registry
SET is_active = false, updated_at = now()
WHERE registry_key = 'marble_pathway_reveal';

UPDATE public.measures_encounter_def
SET updated_at = now(),
    metadata = jsonb_set(metadata, '{authority_standing}', '"deprecated"', true)
WHERE encounter_key = 'marble_pathway_reveal';
```

### Migration B: Deactivate `iis_eval_gate1`

```sql
UPDATE public.measures_registry
SET is_active = false, updated_at = now()
WHERE registry_key = 'iis_eval_gate1';
```

### Migration C: Remove working residue from `encounter_structure.assessment` node

```sql
UPDATE public.measures_registry
SET metadata = metadata #- '{encounter_structure,assessment}',
    updated_at = now()
WHERE registry_key = 'measures_registry_root';
```

### Migration D: Activate `about_measures_registry` and `structure_passage` registry entries

```sql
UPDATE public.measures_registry
SET is_active = true, release_state = 'released', updated_at = now()
WHERE registry_key IN ('about_measures_registry', 'structure_passage');
```

---

## REQUIRED RUNTIME REPAIRS

### Repair 1: Remove `ai_operations_assessment_landing` dead surface

Remove `ai_operations_assessment_landing` from:
- `RegisteredSurface` type union in `registeredRuntimeTypes.ts`
- `SURFACE_QUERY` constant
- `REGISTERED_ENCOUNTER_KEYS` array
- Surface dispatcher render branch (`} else if (activeSurface === "ai_operations_assessment_landing")`)
- `PUBLIC_ROUTE_BY_SURFACE` if present

**Authority required:** OAR2 authorizing dead surface removal.

### Repair 2: Dead media query cleanup (APPLIED in this OAR)

Removed `path_choice_background` and `marble_accent_reference` from `REGISTERED_MEDIA_ROLES`.
Both roles are `is_active: false` in DB. Queries returned no data. Runtime was already handling null gracefully.

---

## REQUIRED DB REPAIRS (Non-Migration)

None beyond the Required SEAT Migrations above.

---

## REQUIRED OAR2 FOLLOW-UPS

1. **OAR2 to apply Migrations A–D** — deactivate deprecated aliases, clean working residue node, activate held-but-rendering registry entries
2. **OAR2 to remove `ai_operations_assessment_landing` dead surface** — source cleanup requiring runtime rebuild
3. **OAR2 to govern `measures_structured_enviroments` typo** — either correct in DB + runtime consistently, or seat the correct-spelling key with a migration

---

## ACTION TAKEN IN THIS OAR

### Source Repair Applied

`src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` — removed `path_choice_background` and `marble_accent_reference` from `REGISTERED_MEDIA_ROLES`.

These roles are `is_active: false` in the live DB. The runtime was already handling them as null. Removing them from the query eliminates dead DB queries and removes residue references from the runtime authority list.

No other source changes were made. No DB changes were applied.

### Build

`npm run build:registry` — required after source change. To be run at commit time.

---

## CLOSE

Authority audit complete. Every executable reference classified. No "assumed seated" language used. Working residue isolated. Migration residue documented. Deprecated aliases identified. Two NotChazz flags raised (DB residue active as released standing; working dev language in live DB). One prior OAR normalization identified.

Source repair applied: dead media queries removed from REGISTERED_MEDIA_ROLES.

DB repairs required: Migrations A–D — pending operator approval via OAR2.

Runtime dead surface: `ai_operations_assessment_landing` — pending OAR2 for removal.
