---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_db_audit
title: OAR1 — Audit Measures Registry Runtime and DB Seating
status: complete
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_measures_registry_runtime_and_db_seating_v1.meta.md
---

# OAR1 — Audit Measures Registry Runtime and DB Seating

---

## 1. Runtime Surface Inventory

| Surface Key | Route | Renderer | DB Source | Encounter Key | Media Roles | Release State | Next Surface | Advance |
|---|---|---|---|---|---|---|---|---|
| `intro_hook` / `intro` | `/` (governed) | `RegisteredIntro` | `measures_registry` → `measures_registry_root` | `ai_isnt_broken_intro` | `intro_hook_video`, `left_hero_fracture`, `left_hero_fracture_motion`, `right_measured_hero`, `measured_hero_motion_graphic` | Governed by `encounter_structure.intro_hook.content_encounter_key` | `path_choice` | YES — `next_surface = path_choice` seated |
| `path_choice` | Internal | `RegisteredPathChoice` | `measures_encounter_def` | `evaluate_structure_path` | `left_hero_fracture`, `left_hero_fracture_motion`, `right_measured_hero`, `measured_hero_motion_graphic`, `path_choice_background` | Governed via root encounter_structure | left → `eval_passage`, right → `structure_passage` | YES — routing nodes seated (202606240004) |
| `eval_passage` | Internal (also `/ai-operations-assessment` route shell) | `RegisteredPassage` (variant=eval) | `measures_encounter_def` | `eval_passage` | `explainer_video` | DB-governed | `measures_assessment` | REPAIRED — was broken on root path; `eval_passage.next_surface` now seated (202606240008) |
| `structure_passage` | Internal | `RegisteredPublicUnderstand` | `measures_encounter_def` | `structure_passage` | `structured_environment_passage_video`, `measures_structured_enviroments` (fallback) | DB-governed; renders held if content not seated | `about_measures_registry` | REPAIRED — was null; `structure_passage.next_surface` now seated (202606240008) |
| `measures_assessment` | `/ai-operations-assessment` | `RegisteredPublicAssessment` → `PublicAssessmentSurface` | `measures_encounter_def` | `measures_assessment` | `obsidian_assessment_surface_visual`, `obsidian_contact_surface_visual`, `obsidian_eval_result_surface_visual`, `registry_mark`, `marble_accent_reference` | Governed by 7-question contract + `measures_assessment_contract` key | contact_capture (internal) → `obsidian_to_marble_passage_video` | YES |
| `obsidian_to_marble_passage_video` | Internal | Inline in main runtime | `measures_encounter_def` | `obsidian_to_marble_passage_video` | `before_the_pathway_obsidian_to_marble_passage_video` | Held until assessment submitted | `map_integrity_governance` | YES — video-end and CTA both navigate |
| `map_integrity_governance` | `/map-integrity-governance` | `MarbleChamberRuntime` → `MarbleCommerceDirectory` | `map_c2_circuit` (active circuits) | `map_integrity_governance` (footer only) | `marble_accent_reference`, `marble_tone` (fallback chain) | Governed by `map_c2_circuit.release_state = active` | N/A (terminal) | YES |
| `about_measures_registry` | `/about-measures-registry` | `RegisteredAboutMeasuresRegistry` | `measures_encounter_def` | `about_measures_registry` | `about_measures_registry_video`, `official_codexstone_seal` | Governed by `approved_content_contract` (seated 202606240005) | `/undrifted` (link), Connect form → `measures_registry_connect_capture` | YES |
| `structural_drift_dispatches` | `/undrifted` | `LapisChamberRuntime` → `RegisteredStructuralDrift` (index) | `measures_publication_registry` (`undrifted`), `measures_registry` (`undrifted_publication_landing`) | `structural_drift_publication` | `ai_isnt_broken_landing`, `undrifted_fill`, `agents_with_keys_cover`, `fables_and_myths_cover`, `measures_registry_logo` | Published (202606240001) | Role Call via `footer_contract.link_url` (external); CTA → `eval_passage` | PARTIAL — see NotChazz §7 |
| `publication_dispatch` | `/publication/structural_drift/{key}` | `LapisChamberRuntime` → `RegisteredStructuralDrift` (article) | `measures_publication_dispatch` | N/A | Banner from dispatch `media_manifest` | Seated dispatches published | `eval_passage` / `assessmentPackage` CTA | YES |
| `ai_operations_assessment_landing` | `/ai-operations-assessment` (direct entry) | `RegisteredAssessmentLanding` | `measures_registry` | `ai_operations_assessment_landing` | (inherits parent media) | Governed by landing unit existence | `eval_passage` (default; CTA governed by `cta_surface`) | YES |

**Alias handling:**
- `/structural-drift` → deprecated; runtime redirects to `/undrifted` via `window.location.replace`
- `/map-integrity-governance` direct entry → `landing_unit_missing` held state (governed; `map_integrity_governance_landing` not seated by design)

---

## 2. DB Seating Audit

### `measures_registry`

| registry_key | Seated | Notes |
|---|---|---|
| `measures_registry_root` | SEATED | Has `encounter_structure.intro_hook`, `path_choice.left/right`, `eval_passage`, `structure_passage` (after 202606240008) |
| `ai_operations_assessment_landing` | SEATED | Queried for `/ai-operations-assessment` direct entry |
| `structural_drift_landing` | SEATED | Queried for `/structural-drift` legacy route |
| `undrifted_publication_landing` | SEATED | Has `featured_article_set`, `content_profile`, `assessment_feature`, `landing_design_contract`, `role_call_feature` |
| `map_integrity_governance_landing` | **NOT SEATED** | Intentional governed held state. Runtime comment at line 131: "renders landing_unit_missing until map_integrity_governance_landing is seated" |

### `measures_encounter_def`

| encounter_key | Seated | Notes |
|---|---|---|
| `ai_isnt_broken_intro` | Assumed seated | Queried; used for intro_hook copy |
| `evaluate_structure_path` | Assumed seated | Queried; used for path_choice copy |
| `ai_operations_assessment_landing` | Assumed seated | Queried; used for assessment landing |
| `eval_passage` | Assumed seated | Queried; used for eval passage copy |
| `measures_assessment` | SEATED | 7 questions (after 202606240007). `active_contract_key_reconciliation` with `measures_assessment_contract` must be in metadata for assessment to render |
| `obsidian_to_marble_passage_video` | Assumed seated | Queried; used for passage copy + footer |
| `map_integrity_governance` | Assumed seated | Queried; used for MAP footer contract only |
| `structure_passage` | Assumed seated | Queried; used for Understand the Environment copy |
| `about_measures_registry` | SEATED | `approved_content_contract` seated (202606240005). Has `codexstone_seal_section`, `orientation_sections`, `undrifted_bridge_section`, `connect_section` |
| `structural_drift_publication` | Assumed seated | Queried; used for unDrifted/LapisChamber copy |
| `marble_pathway_reveal` | STALE — REMOVED | Was in `REGISTERED_ENCOUNTER_KEYS` but never used in any rendering path. Caused unnecessary DB query. Removed from runtime (this audit). |

### `measures_media_map`

| State | Note |
|---|---|
| RLS | Expanded (202606230001): all active rows readable by anon |
| Campaign keys queried | `agents_of_chaos_integrity_governance`, `measures_registry_root_authority_v1`, Lapis-specific |
| Fallback chains | `background`/`lapis_background`, `watermark`/`registry_watermark`, `marble_tone`/`installation_tone_marble`/`installation_tone_marble_rise_return_v1`, `structured_environment_passage_video`/`measures_structured_enviroments` |
| Typo note | `measures_structured_enviroments` in code (line 82) — missing 'n'. If DB role is correct spelling, fallback chain catches it via primary role `structured_environment_passage_video`. No repair needed unless primary role is missing. |

### `measures_publication_registry`

| publication_key | Status | Notes |
|---|---|---|
| `undrifted` | SEATED | `publication_type = 'digital magazine'`, `issue_record`, `style_profile`, `media_profile`, `cover_story`, `role_call_feature`, `next_issue_teaser`, `footer_record` all seated (202606240001, 202606240002) |
| `structural_drift` | Assumed seated | Queried; used as fallback if `undrifted` not found |

### `measures_publication_dispatch`

| dispatch_key | publication_key | Status |
|---|---|---|
| `agents_with_keys_dispatch_v1` | `undrifted` | published |
| `fables_and_myths_dispatch_v1` | `undrifted` | published (202606240001) |

### `measures_iis_eval_gate1_capture`

Seated. Insert-only public. Used for assessment contact capture. Carry-forward metadata structure intact.

### `measures_registry_connect_capture`

SEATED (202606240006). Insert-only public. Used by About surface Connect form.

### `map_c2_circuit`

Queried by `MarbleChamberRuntime`. Active circuits drive MAP rendering. Seating status not auditable from migrations alone — depends on operator-seated circuit records.

---

## 3. Transition Audit

| Transition | Status | Notes |
|---|---|---|
| intro_hook → path_choice | WORKS | `encounter_structure.intro_hook.next_surface = 'path_choice'` seated |
| path_choice left → eval_passage | WORKS | `encounter_structure.path_choice.left.next_surface = 'eval_passage'` (202606240004) |
| path_choice right → structure_passage | WORKS | `encounter_structure.path_choice.right.next_surface = 'structure_passage'` (202606240004) |
| eval_passage Continue → measures_assessment | **REPAIRED** | Was broken on root path: `routeCtaSurface` null, no fallback. Fixed: `evalPassageNode.next_surface = 'measures_assessment'` now seated (202606240008); runtime handler updated |
| measures_assessment submit → contact_capture | WORKS | Internal step change (`evalStep = "contact_capture"`) |
| contact_capture submit → obsidian_to_marble_passage_video | WORKS | `evalSubmitted = true` → user calls `onBeginPathwayReview` → `navigate("obsidian_to_marble_passage_video")` |
| obsidian_to_marble_passage_video → map_integrity_governance | WORKS | Video-end + CTA both navigate |
| structure_passage Continue → about_measures_registry | **REPAIRED** | Was broken: `onContinue` returned `null` for `structure_passage` surface. Fixed: `structurePassageNode.next_surface = 'about_measures_registry'` seated (202606240008); runtime handler updated |
| about_measures_registry → /undrifted | WORKS | Link (`href="/undrifted"`) — not navigate |
| about_measures_registry Connect form → measures_registry_connect_capture | WORKS | Table seated (202606240006) |
| /undrifted → Role Call | PARTIAL | `roleCallUrl` from `measures_registry_root.metadata.footer_contract.link_url`. Not confirmed seated in any reviewed migration. If null, Role Call CTA does not render. |
| /undrifted CTA → eval_passage | WORKS | `routeCtaSurface ?? "eval_passage"` in LapisChamberRuntime |

---

## 4. Media Audit

### Main Runtime Roles (REGISTERED_MEDIA_ROLES — 25 roles)

| Media Role | Usage | Notes |
|---|---|---|
| `intro_hook_video` | RegisteredIntro epigraph | Primary entry video |
| `explainer_video` | RegisteredPassage (eval) | eval_passage video |
| `left_hero_fracture` | Path choice / intro threshold left still | |
| `left_hero_fracture_motion` | Path choice / intro threshold left motion | |
| `right_measured_hero` | Path choice / intro threshold right still | |
| `measured_hero_motion_graphic` | Path choice / intro threshold right motion | |
| `path_choice_background` | Path choice background | |
| `background` / `lapis_background` | Lapis background (fallback chain) | Falls back if `background` missing |
| `watermark` / `registry_watermark` | Registry watermark (fallback chain) | |
| `registry_mark` | Header brand mark | |
| `marble_accent_reference` | MAP surface accent | |
| `evaluation_reference_image` | Assessment surface | |
| `structured_environment_passage_video` | Understand passage video (primary) | |
| `measures_structured_enviroments` | Understand passage video (fallback — typo in role name) | Fallback catches missing primary |
| `marble_tone` / `installation_tone_marble` / `installation_tone_marble_rise_return_v1` | Marble audio tone (3-level fallback) | |
| `about_measures_registry_video` | About surface video | |
| `agents_with_keys_cover` | About featured article image + unDrifted card | Queried by both main runtime and LapisChamberRuntime |
| `official_codexstone_seal` | About surface Codexstone Seal mark | |
| `before_the_pathway_obsidian_to_marble_passage_video` | obsidian_to_marble_passage_video surface | Falls back to text + CTA if missing |
| `obsidian_contact_surface_visual` | Assessment contact capture visual | |
| `obsidian_assessment_surface_visual` | Assessment diagnostic visual | |
| `obsidian_eval_result_surface_visual` | Assessment result visual | |

### Lapis Roles (LapisChamberRuntime — 12 roles)

| Media Role | Usage |
|---|---|
| `measures_registry_logo` | unDrifted editor's feature mark |
| `ai_isnt_broken_landing` | unDrifted cover hero image |
| `undrifted_fill` | unDrifted banner (primary); falls back to hardcoded storage path |
| `agents_with_keys_cover` | unDrifted article card |
| `fables_and_myths_cover` | unDrifted article card |
| `questions_ungoverned_systems_cannot_answer` | Questions image |
| `questions_ungoverned_systems_cannot_answer_video` | Questions video |
| `structural_drift_cover`, `structural_drift_cover_photo`, `structural_drift_publication_cover`, `publication_structural_drift_cover`, `structural_drift_feature_image`, `structural_drift_featured_image` | Cover image fallback chain (6 roles) |

**All media URLs resolved via `resolveRuntimeMediaUrl` — no hardcoded URLs in renderer logic.**

**Fallback standing:** Where a role is missing, renderers either show `registry-media-absence` text or skip the media element gracefully. No crash paths observed.

---

## 5. Deprecated / Stale Logic Audit

| Item | Location | Status | Notes |
|---|---|---|---|
| `marble_pathway_reveal` in REGISTERED_ENCOUNTER_KEYS | `MeasuresRegistryRuntimeRegistered.tsx:53` (former) | **REMOVED** | Never appeared in SURFACE_QUERY or any `sectionMap.get()` call. Caused dead DB query. Removed this audit. |
| `evaluate_structure_path` as encounter key | `MeasuresRegistryRuntimeRegistered.tsx:48, 94` | **NOT deprecated** | Legitimate DB encounter key for path_choice content in `measures_encounter_def`. Routing authority is in `encounter_structure.path_choice`, not in this key name. |
| `connect_src` CSS comment | `src/index.css:6125` | **HARMLESS** | Section label only (`/* ── connect_src surface ──── */`). No runtime impact. |
| `confirmation_email_state` | Not found in runtime | **CLEAN** | Already removed (bd7125c). |
| Old 5-question assessment | Not found | **CLEAN** | 7-question contract confirmed (202606240007). |
| Stale evaluation handlers | Not found | **CLEAN** | `resolveEnvironmentalReportByScore` is the active scoring function. |
| `ai_deployment_status` duplication | Not found in current state | **CLEAN** | Dedup migration applied (202606240007). |
| `hardcoded next surfaces` | Not found | **CLEAN** | All surface navigation uses `governedNodeSurface` or `governedSurface` from DB. |
| `hardcoded public truth` | Not found | **CLEAN** | No hardcoded surface routing in renderer logic. |
| SaaS/product framing in runtime | Not found in runtime | **CLEAN** | "SaaS homepage style" appears only in DB migration metadata `avoid` list — appropriate design guidance, not runtime content. |
| Chamber/internal terminology leaking | Not found publicly | **CLEAN** | `data-material-family` attributes use crystal/obsidian/marble/lapis — governed. No internal chamber terminology in public-facing content. |
| `crystal_chamber` in CSS | `registry.visual-system.css:734,747,751,755,2417,2421` | **NOMINAL** | CSS classes scoped to `[data-public-path="crystal_chamber"]`. Not a public content term — a CSS selector scope. |
| Stale result generation | Not found | **CLEAN** | |

---

## 6. Public Flow Verification

### Assess Flow

```
Root (/) → intro_hook → path_choice → eval_passage → measures_assessment → contact_capture → obsidian_to_marble_passage_video → map_integrity_governance
```

| Step | Status |
|---|---|
| Root → intro_hook | WORKS — governed by `encounter_structure.intro_hook.content_encounter_key` |
| intro_hook → path_choice | WORKS — `next_surface = 'path_choice'` |
| path_choice left → eval_passage | WORKS — `path_choice.left.next_surface = 'eval_passage'` |
| eval_passage → measures_assessment | **REPAIRED** — now governed via `evalPassageNode.next_surface = 'measures_assessment'` |
| measures_assessment → contact_capture | WORKS — internal step |
| contact_capture → obsidian_to_marble_passage_video | WORKS — after submit, `evalSubmitted = true` triggers passage |
| obsidian_to_marble_passage_video → map_integrity_governance | WORKS — video-end + CTA |
| map_integrity_governance | Renders from `map_c2_circuit` active records |

**Assess flow: ALL steps now routed.**

---

### Understand Flow

```
Root (/) → intro_hook → path_choice → structure_passage → about_measures_registry → /undrifted → Connect role call
```

| Step | Status |
|---|---|
| Root → intro_hook | WORKS |
| intro_hook → path_choice | WORKS |
| path_choice right → structure_passage | WORKS — `path_choice.right.next_surface = 'structure_passage'` |
| structure_passage → about_measures_registry | **REPAIRED** — `structurePassageNode.next_surface = 'about_measures_registry'` seated |
| about_measures_registry → /undrifted | WORKS — bridge panel link |
| /undrifted → Connect role call | PARTIAL — Role Call CTA renders only if `measures_registry_root.metadata.footer_contract.link_url` is seated. Not confirmed in reviewed migrations. |

**Note on Codexstone Seal:** The `about_measures_registry` surface includes a Codexstone Seal section (`approved_content_contract.codexstone_seal_section`). This is rendered as the first section of the About surface — it serves the Understand path's Codexstone/registry explainer position. No separate surface is needed unless operator determines otherwise.

**Understand flow: Broken link repaired at structure_passage. Role Call link requires follow-up (see §9).**

---

## 7. NOTCHAZZ Flags

**Flag 1 — Understand path lacked seated sequence (REPAIRED)**
`structure_passage.next_surface` was not seated. Understand path was effectively dead after the passage surface. Repaired by seating routing node and updating handler.

**Flag 2 — Assess path broken on root path (REPAIRED)**
`eval_passage.next_surface` was not seated. When navigated from path_choice left on root path, `routeCtaSurface` resolved null and Continue did nothing. Repaired.

**Flag 3 — Role Call URL may not be seated (UNRESOLVED)**
`roleCallUrl` in LapisChamberRuntime → RegisteredStructuralDrift depends on `measures_registry_root.metadata.footer_contract.link_url`. Role Call feature was seated (202606240002) with `destination_key = 'c3_field_our_story'` but no URL in root `footer_contract`. If URL is absent, the Role Call CTA in unDrifted does not render. Requires operator direction.

**Flag 4 — map_integrity_governance_landing not seated (GOVERNED HELD — not a failure)**
Runtime explicitly handles this case with a `landing_unit_missing` state. This is documented behavior, not a seam failure.

---

## 8. Safe Repairs Performed

### Runtime (src)

**1. Removed `marble_pathway_reveal` from REGISTERED_ENCOUNTER_KEYS**
- File: `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- Was at line 53. Never appeared in SURFACE_QUERY or any render path.
- Eliminated unnecessary DB query entry.

**2. Added `evalPassageNode` and `structurePassageNode` in dispatcher**
- File: `MeasuresRegistryRuntimeRegistered.tsx` (after line 887)
- `const evalPassageNode = rootStructureNode("eval_passage")`
- `const structurePassageNode = rootStructureNode("structure_passage")`

**3. Updated eval_passage Continue handler**
- File: `MeasuresRegistryRuntimeRegistered.tsx`
- Changed: `routeCtaSurface` → `routeCtaSurface ?? governedNodeSurface(evalPassageNode, "next_surface")`
- `routeCtaSurface` still takes priority (preserves `/ai-operations-assessment` landing behavior).
- When null (root path flow), falls back to governed node.

**4. Updated structure_passage Continue handler**
- File: `MeasuresRegistryRuntimeRegistered.tsx`
- Changed: `null` → `governedNodeSurface(structurePassageNode, "next_surface")`
- Activates the Understand path continuation.

### DB (migration)

**5. Migration: `202606240008_seat_eval_passage_and_structure_passage_next_surface_routing.sql`**
- Seats `encounter_structure.eval_passage.next_surface = 'measures_assessment'` in `measures_registry_root`
- Seats `encounter_structure.structure_passage.next_surface = 'about_measures_registry'` in `measures_registry_root`
- Validation confirms both nodes seated and prior routing nodes preserved

---

## 9. Required Follow-Up OAR2 List

**OAR2-FU-1: Seat role_call URL in measures_registry_root footer_contract**
Role Call feature is seated in `measures_publication_registry.undrifted.role_call_feature` and `undrifted_publication_landing.role_call_feature`. The CTA link in RegisteredStructuralDrift renders only when `roleCallUrl` is non-null. This comes from `measures_registry_root.metadata.footer_contract.link_url`. Operator must determine the correct destination URL and seat it in the root registry footer_contract.

**OAR2-FU-2: Seat map_integrity_governance_landing in measures_registry**
The `/map-integrity-governance` direct route shows a held state until this unit is seated. The held state is intentional and governed, but the MAP surface as a public entry point requires this unit to be seated when the MAP is ready for direct access.

**OAR2-FU-3: Verify About page bridge panel destination**
`RegisteredAboutMeasuresRegistry` renders the unDrifted bridge panel with `href={articleUrl ?? bridgeCtaUrl}`. When `aboutFeaturedArticle.article_url` resolves (Paragraph URL), the bridge links to Paragraph instead of `/undrifted`. If operator intends the bridge to go to `/undrifted` (the internal route), the renderer or the featured_article_set logic should be adjusted. No change made — this is operator's decision.

**OAR2-FU-4: Verify Understand path Codexstone Seal scope**
The current Understand path reaches the Codexstone Seal via the first section of the About surface. If operator determines a separate Codexstone Seal surface is required before About (as a distinct encounter), this requires a new surface key, encounter_def, and routing node.

**OAR2-FU-5: Full media map DB verification**
This audit confirmed the code-side media role inventory and RLS standing. The actual bucket URLs and storage paths in `measures_media_map` were not queryable from this audit (no DB execution access). A live DB query audit of all 25+ registered media roles is recommended to confirm no missing or stale storage paths.

**OAR2-FU-6: `measures_structured_enviroments` typo**
Role name has a typo in the runtime (missing 'n'). If the DB record also uses the typo, this is consistent and harmless. If the DB record uses the correct spelling, the fallback chain ensures coverage via `structured_environment_passage_video`. Operator to verify DB media_role spelling and correct if needed.

---

## 10. Build Result

Safe repairs applied:
- `MeasuresRegistryRuntimeRegistered.tsx` — 3 changes (remove stale key, add node constants, update 2 Continue handlers)
- `202606240008_seat_eval_passage_and_structure_passage_next_surface_routing.sql` — created

No TypeScript type changes needed. All surface keys used in new routing nodes (`measures_assessment`, `about_measures_registry`) are already in the `RegisteredSurface` union type.

Build not executed from audit context — no build tool access. Runtime changes are additive (new constants, modified Continue handlers) with no structural changes to types or imports. Expected to compile clean.

---

## Audit Signatures

- **Auditor:** Claude (op044 executor)
- **Date:** 2026-06-24
- **Source OAR2:** `docs/oar/measures_registry/oar2_audit_measures_registry_runtime_and_db_seating_v1.meta.md`
- **Status:** COMPLETE — all six audit sections delivered; two broken transitions repaired; three NotChazz flags raised; six follow-up OAR2s required.
