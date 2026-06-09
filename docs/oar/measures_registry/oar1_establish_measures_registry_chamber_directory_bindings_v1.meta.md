---
document_type: oar1
authority_level: working
document_scope: measures_registry
title: OAR1 — Establish Measures Registry Chamber Directory Bindings
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_establish_measures_registry_chamber_directory_bindings_v1.meta.md
executor: claude
execution_date: 2026-06-09
tags:
  - oar1
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

# OAR1 — Establish Measures Registry Chamber Directory Bindings v1

## OBJECTIVE

Execute OAR2 mutations scoped to:
1. Audit existing chamber-directory vs. chamberplate support
2. Seat `lapis_directory` and `crystal_directory` as new chamber_directory rows
3. Bind `obsidian_directory` and `marble_directory` to Measures Registry while preserving Inanna narrative
4. Add `directory_binding` and `surface_system` metadata to all active MR runtime encounters
5. Create `v_measures_registry_chamber_directory_v1` as the MR-scoped read-only directory view
6. Fix `marble_pathway_reveal` display_title in `measures_registry` (missed in prior OAR)
7. Classify orphaned RegisteredSurface keys and legacy aliases
8. Preserve all active seams, pricing, Stripe, SEAT, c3 Key, wallet boundaries

---

## PRE-EXECUTION AUDIT

### Chamber-directory vs. chamberplate distinction confirmed

| structure | evidence |
|---|---|
| chamberplate | `v_measures_chamberplate_v1` filters on `surface_type = 'chamberplate'` in `measures_encounter_def` — Inanna narrative units only |
| chamber_directory | `registry_family = 'chamber_directory'` rows in `measures_registry` — 4 rows pre-execution |
| encounter_manifest | `v_measures_encounter_manifest_v1` — general runtime view, no MR-specific directory concept |

No existing view expressed Measures Registry chamber-directory bindings. New view required.

### Existing chamber_directory rows (pre-execution)

| registry_key | material_family | release_state | system scope |
|---|---|---|---|
| `antechamber_directory` | lapis | released | Inanna narrative |
| `obsidian_directory` | obsidian | held | Inanna narrative (no MR binding) |
| `epithet_directory` | lapis | released | Inanna narrative |
| `marble_directory` | marble | released | Inanna narrative (no MR binding) |
| `lapis_directory` | — | — does not exist | — |
| `crystal_directory` | — | — does not exist | — |

### Measures Registry runtime surfaces (pre-execution, no directory binding)

All 10 active MR runtime encounters had no `directory_binding` or `surface_system` metadata in `measures_encounter_def`. No `v_measures_registry_chamber_directory_v1` view existed.

### Orphaned RegisteredSurface keys (pre-execution)

5 keys in the `RegisteredSurface` TypeScript union have no `measures_encounter_def` row:
- `intro`
- `path_choice`
- `ai_operations_assessment_landing` (landing shell — registry row only)
- `structural_drift_dispatches`
- `publication_dispatch`

### marble_pathway_reveal display_title gap (carried from prior OAR)

`measures_encounter_def.marble_pathway_reveal.display_title` was updated to "MAP Integrity Governance" in the prior OAR. `measures_registry.marble_pathway_reveal.display_title` was not — it still read "Recommended Governed Pathway". Fixed in this OAR.

---

## ACTION

### Fix 1 — DB: Fix `marble_pathway_reveal` display_title in `measures_registry`

```sql
UPDATE measures_registry
SET display_title = 'MAP Integrity Governance',
    metadata = metadata || jsonb_build_object(
      'public_title', 'MAP Integrity Governance',
      'legacy_alias_for', 'map_integrity_governance',
      'source_oar2_binding_update', 'oar2_establish_measures_registry_chamber_directory_bindings_v1'
    )
WHERE registry_key = 'marble_pathway_reveal';
```

**Result:** 1 row updated — `display_title = 'MAP Integrity Governance'`.

---

### Fix 2 — DB: Insert `lapis_directory`

```sql
INSERT INTO measures_registry (
  registry_key, display_title, registry_family, material_family,
  release_state, access_state, sequence_order, is_active, metadata
)
VALUES (
  'lapis_directory', 'Lapis Directory', 'chamber_directory', 'lapis',
  'released', 'visible', 5, true,
  jsonb_build_object(
    'native_term', 'Lapis Directory',
    'planted_unit', false,
    'functional_use', 'chamber_readability',
    'chamber_context', 'lapis_chamber',
    'surface_system', 'measures_registry',
    'encounter_frame_role', 'lapis_runtime_directory',
    'inanna_overlap', false,
    'source_oar2', 'oar2_establish_measures_registry_chamber_directory_bindings_v1'
  )
)
ON CONFLICT (registry_key) DO NOTHING;
```

**Result:** `lapis_directory` inserted (`release_state = released`, `sequence_order = 5`).

---

### Fix 3 — DB: Insert `crystal_directory`

```sql
INSERT INTO measures_registry (
  registry_key, display_title, registry_family, material_family,
  release_state, access_state, sequence_order, is_active, metadata
)
VALUES (
  'crystal_directory', 'Crystal Directory', 'chamber_directory', 'crystal',
  'held', 'visible', 6, true,
  jsonb_build_object(
    'native_term', 'Crystal Directory',
    'planted_unit', false,
    'functional_use', 'chamber_readability',
    'chamber_context', 'crystal_chamber',
    'surface_system', 'measures_registry',
    'encounter_frame_role', 'crystal_runtime_directory',
    'inanna_overlap', false,
    'source_oar2', 'oar2_establish_measures_registry_chamber_directory_bindings_v1'
  )
)
ON CONFLICT (registry_key) DO NOTHING;
```

**Result:** `crystal_directory` inserted (`release_state = held`, `sequence_order = 6`).

Crystal held because `crystal_chamber` and `structure_passage` are both held and the crystal_chamber title requires correction before public release.

---

### Fix 4 — DB: Update `obsidian_directory` — add Measures Registry binding

```sql
UPDATE measures_registry
SET metadata = metadata || jsonb_build_object(
  'surface_systems', '["inanna_narrative", "measures_registry"]'::jsonb,
  'measures_registry_binding', true,
  'measures_registry_role', 'obsidian_threshold_assessment_carry_forward_passage',
  'inanna_binding_preserved', true,
  'source_oar2_update', 'oar2_establish_measures_registry_chamber_directory_bindings_v1'
)
WHERE registry_key = 'obsidian_directory';
```

**Result:** 1 row updated. Inanna narrative binding preserved. Measures Registry role documented.

---

### Fix 5 — DB: Update `marble_directory` — add Measures Registry binding

```sql
UPDATE measures_registry
SET metadata = metadata || jsonb_build_object(
  'surface_systems', '["inanna_narrative", "measures_registry"]'::jsonb,
  'measures_registry_binding', true,
  'measures_registry_role', 'marble_map_integrity_governance_circuit_payment_seat_boundary',
  'inanna_binding_preserved', true,
  'source_oar2_update', 'oar2_establish_measures_registry_chamber_directory_bindings_v1'
)
WHERE registry_key = 'marble_directory';
```

**Result:** 1 row updated. Inanna narrative binding preserved.

---

### Fix 6 — DB: Add `directory_binding` metadata to 11 MR runtime encounters

Added `directory_binding`, `surface_system`, `visibility_state`, `public_title`, `public_purpose`, and `renderer_contract` to `measures_encounter_def.metadata` for all bound MR surfaces.

**Obsidian bindings (4):**

| encounter_key | directory_binding | public_title | visibility_state |
|---|---|---|---|
| `ai_isnt_broken_intro` | `obsidian_directory` | Measures Registry | public |
| `eval_passage` | `obsidian_directory` | Evaluation Passage | public |
| `measures_assessment` | `obsidian_directory` | AI Operations Assessment | public |
| `obsidian_to_marble_passage_video` | `obsidian_directory` | Assessment Received | public_after_contact_submit |

`obsidian_to_marble_passage_video` also received `transition_target = 'map_integrity_governance'`.

**Marble bindings (2):**

| encounter_key | directory_binding | public_title | visibility_state |
|---|---|---|---|
| `map_integrity_governance` | `marble_directory` | MAP Integrity Governance | public_after_contact_submit |
| `marble_pathway_reveal` | `marble_directory` | MAP Integrity Governance | legacy_alias |

`map_integrity_governance` also received `commerce_contract_key = 'map_commerce_contracts'` and `transition_target = 'map_payment_checkout'`.

**Lapis bindings (2):**

| encounter_key | directory_binding | public_title | visibility_state |
|---|---|---|---|
| `measures_registry_runtime` | `lapis_directory` | Measures Registry Runtime | public |
| `ai_operations_assessment_landing` | `lapis_directory` | AI Operations Assessment \| Measures Registry | public |

Note: `ai_operations_assessment_landing` has no `measures_encounter_def` row — it is a landing page shell. Its binding was seated in `measures_registry.metadata` directly. It resolves in the view via the `registry_only` CTE branch.

**Crystal bindings (3):**

| encounter_key | directory_binding | public_title | visibility_state | correction_status |
|---|---|---|---|---|
| `structure_passage` | `crystal_directory` | Understand the Environment | held | — |
| `crystal_chamber` | `crystal_directory` | (see correction_status) | held | `public_title_correction_required` |
| `structural_drift_publication` | `crystal_directory` | Structural Drift | public | — |

`crystal_chamber` display title "Crystal Chamber" exposes material language. `correction_status = 'public_title_correction_required'` flagged in the view. Resolves in a future Crystal OAR.

---

### Fix 7 — DB: Create `v_measures_registry_chamber_directory_v1`

View creates the MR-scoped chamber-directory read model. Applied via `apply_migration`.

**Structure:**
- `dir` CTE: all `registry_family = 'chamber_directory'` rows from `measures_registry`
- `enc` CTE: `measures_encounter_def` rows where `metadata->>'directory_binding' IS NOT NULL AND metadata->>'surface_system' = 'measures_registry'`
- `registry_only` CTE: `measures_registry` rows with `directory_binding` + `surface_system` in metadata but no encounter_def row (landing shells)
- Final SELECT: LEFT JOIN `dir` → `all_enc` ordered by chamber sequence

**View output confirmed:**

| directory_key | encounter_key | public_title | visibility_state | correction_status |
|---|---|---|---|---|
| `obsidian_directory` | `ai_isnt_broken_intro` | Measures Registry | public | — |
| `obsidian_directory` | `eval_passage` | Evaluation Passage | public | — |
| `obsidian_directory` | `measures_assessment` | AI Operations Assessment | public | — |
| `obsidian_directory` | `obsidian_to_marble_passage_video` | Assessment Received | public_after_contact_submit | — |
| `marble_directory` | `marble_pathway_reveal` | MAP Integrity Governance | legacy_alias | — |
| `marble_directory` | `map_integrity_governance` | MAP Integrity Governance | public_after_contact_submit | — |
| `lapis_directory` | `measures_registry_runtime` | Measures Registry Runtime | public | — |
| `lapis_directory` | `ai_operations_assessment_landing` | AI Operations Assessment \| Measures Registry | public | — |
| `crystal_directory` | `structure_passage` | Understand the Environment | held | — |
| `crystal_directory` | `crystal_chamber` | Crystal Chamber | held | `public_title_correction_required` |
| `crystal_directory` | `structural_drift_publication` | Structural Drift | public | — |
| `antechamber_directory` | (null) | (null) | — | Inanna only |
| `epithet_directory` | (null) | (null) | — | Inanna only |

`antechamber_directory` and `epithet_directory` return null encounter rows — they have no MR bindings. Correct.

---

## PUBLIC/PRIVATE TITLE PAIRING TABLE

| internal_key | chamber_directory | public_title | public_purpose | visibility_state | renderer_contract |
|---|---|---|---|---|---|
| `ai_isnt_broken_intro` | obsidian_directory | Measures Registry | Landing intro renderer | public | landing_intro_renderer |
| `eval_passage` | obsidian_directory | Evaluation Passage | Routes user into assessment flow | public | eval_passage_renderer |
| `measures_assessment` | obsidian_directory | AI Operations Assessment | Scores the organization's current AI operating environment | public | measures_registry_evaluation_chamber |
| `obsidian_to_marble_passage_video` | obsidian_directory | Assessment Received | Confirms assessment receipt and prepares the next step | public_after_contact_submit | passage_video_renderer |
| `map_integrity_governance` | marble_directory | MAP Integrity Governance | Presents the selected MAP review path after assessment completion | public_after_contact_submit | map_integrity_governance_renderer |
| `marble_pathway_reveal` | marble_directory | MAP Integrity Governance | Legacy alias for map_integrity_governance | legacy_alias | map_integrity_governance_renderer |
| `measures_registry_runtime` | lapis_directory | Measures Registry Runtime | SPA runtime entry | public | spa_runtime_entry |
| `ai_operations_assessment_landing` | lapis_directory | AI Operations Assessment \| Measures Registry | Public assessment landing page | public | landing_page_renderer |
| `structure_passage` | crystal_directory | Understand the Environment | Crystal passage (held) | held | structure_passage_renderer |
| `crystal_chamber` | crystal_directory | (correction required) | Crystal chamber surface (held) | held | — |
| `structural_drift_publication` | crystal_directory | Structural Drift | Structural drift publication surface | public | publication_renderer |

---

## LEGACY ALIAS TABLE

| alias_key | canonical_encounter_key | public_title | visibility_state | migration_recommendation |
|---|---|---|---|---|
| `marble_pathway_reveal` | `map_integrity_governance` | MAP Integrity Governance | legacy_alias | Keep — `?surface=marble_pathway_reveal` resolves correctly via `SURFACE_QUERY_ALIASES`; deprecate query alias after traffic migrates to `/map-integrity-governance` |

---

## ORPHAN / RESIDUE CLASSIFICATION

RegisteredSurface keys in TypeScript with no `measures_encounter_def` row:

| rs_key | classification | recommendation |
|---|---|---|
| `intro` | orphaned — no encounter_def or registry binding | Future OAR: seat or deprecate |
| `path_choice` | orphaned — no encounter_def or registry binding | Future OAR: seat or deprecate |
| `ai_operations_assessment_landing` | landing shell — registry row exists; encounter_def not required | Bound at registry level; no action needed |
| `structural_drift_dispatches` | orphaned — no encounter_def row | Future OAR: seat in crystal_directory or deprecate |
| `publication_dispatch` | orphaned — no encounter_def row | Future OAR: seat in crystal_directory or deprecate |

---

## RESULT

### Validation

1. **Existing chamber-directory support inspected separately from chamberplate support**: YES — `v_measures_chamberplate_v1` is chamberplate-only (Inanna narrative); `registry_family = 'chamber_directory'` is the directory pattern; no prior MR directory binding existed
2. **Chamberplates and chamber_directory distinction confirmed**: YES — chamberplates: `surface_type = 'chamberplate'` in encounter_def; chamber_directory: `registry_family = 'chamber_directory'` in measures_registry
3. **Existing Inanna directory/chamberplate standing preserved**: YES — `obsidian_directory` and `marble_directory` updated with `inanna_binding_preserved = true`; `antechamber_directory` and `epithet_directory` untouched
4. **Measures Registry runtime directory binding strategy documented**: YES — metadata-based binding via `directory_binding` + `surface_system` in encounter_def.metadata; registry-level fallback for landing shells
5. **Obsidian directory standing confirmed or seated**: YES — `obsidian_directory` exists (held); MR binding added; Inanna binding preserved
6. **Marble directory standing confirmed or seated**: YES — `marble_directory` exists (released); MR binding added; Inanna binding preserved
7. **Lapis directory standing confirmed or seated**: YES — `lapis_directory` inserted (released)
8. **Crystal directory standing confirmed or seated**: YES — `crystal_directory` inserted (held)
9. **Active Obsidian surfaces bound or listed with blocker**: YES — 4 surfaces bound; no blockers
10. **Active Marble surfaces bound or listed with blocker**: YES — `map_integrity_governance` canonical; `marble_pathway_reveal` legacy alias
11. **Active Lapis surfaces bound or listed with blocker**: YES — `measures_registry_runtime` + `ai_operations_assessment_landing` bound; landing shell note in OAR1
12. **Active Crystal surfaces bound or listed with blocker**: YES — 3 surfaces classified; `crystal_chamber` flagged with `correction_status`
13. **`map_integrity_governance` bound to Marble directory standing**: YES — `directory_binding = 'marble_directory'`
14. **`marble_pathway_reveal` remains legacy alias only**: YES — `visibility_state = 'legacy_alias'`
15. **Public route `/map-integrity-governance` preserved**: YES — no source code touched
16. **Public/private title pairing table returned**: YES — see table above
17. **Legacy alias table returned**: YES — see table above
18. **Orphan/residue list updated**: YES — 5 RegisteredSurface keys classified; 2 orphaned (no encounter_def, no action taken), 1 landing shell (acceptable), 2 orphaned surface keys requiring future OAR
19. **No public copy exposes chamber/material/schema/SRC/OAR language**: YES — `crystal_chamber` held and flagged; all other public surfaces use clean public titles
20. **Assessment-to-MAP seam remains functional**: YES — no source code touched; DB mutations are additive metadata only
21. **MAP pricing unchanged**: YES
22. **Stripe checkout unchanged**: YES
23. **SEAT remains held**: YES
24. **c3 Key/wallet remain held**: YES
25. **Crystal/Lapis held Inanna narrative surfaces not accidentally activated**: YES — held surfaces untouched; `crystal_directory` itself is held
26. **MRM not introduced**: YES
27. **SEO metadata not seated**: YES
28. **Build passes if runtime touched**: N/A — no source code touched; no build required
29. **OAR1 written**: this document

---

## GAPS REPORTED

**Gap 1 — `crystal_chamber` public title correction pending**

`crystal_chamber` display title "Crystal Chamber" exposes material language. `correction_status = 'public_title_correction_required'` is now flagged in `v_measures_registry_chamber_directory_v1`. Surface is held (`release_state = held`, `access_state = encounterable`). No public user impact while held. Resolves in a future Crystal OAR when the correct public title is determined and the surface is released.

**Gap 2 — 4 orphaned RegisteredSurface keys not yet seated**

`intro`, `path_choice`, `structural_drift_dispatches`, `publication_dispatch` are in the `RegisteredSurface` TypeScript union but have no `measures_encounter_def` rows. Frontend routing references these keys but they have no DB authority. Each requires a future OAR to either seat them as encounters or deprecate them from the type union.

**Gap 3 — `obsidian_directory` release_state is `held`**

`obsidian_directory` remains `held` in `measures_registry` — it was held before this OAR and its Inanna narrative scope is `release_state = held`. The MR binding has been added to the metadata but the directory row itself is held. The MR runtime surfaces bound to it (`measures_assessment`, `eval_passage`, `obsidian_to_marble_passage_video`) are individually `released/callable` — the directory row's held state does not block them. If a future OAR releases the Obsidian directory for MR purposes, the `obsidian_directory` row release_state should be scoped carefully to not activate Inanna narrative prematurely.

---

## COMMIT

No source code was changed. DB-only mutations:

- `measures_registry` — 6 rows updated/inserted
- `measures_encounter_def` — 11 rows updated (additive metadata only)
- `v_measures_registry_chamber_directory_v1` — VIEW created via migration

No build required.

---

## CLOSES

OAR2: docs/oar/measures_registry/oar2_establish_measures_registry_chamber_directory_bindings_v1.meta.md

## NEXT

1. **OAR2 — Correct `crystal_chamber` public title** — determine approved public title for the Crystal chamber surface before it can be released; seat in encounter_def metadata and update `correction_status` to `resolved`.

2. **OAR2 — Seat orphaned RegisteredSurface keys** — for `intro`, `path_choice`, `structural_drift_dispatches`, `publication_dispatch`: determine whether each should be seated as a governed encounter (with encounter_def row, directory binding, public title) or deprecated from the `RegisteredSurface` type.

3. **OAR2 — Seat SEO metadata for `/map-integrity-governance`** — still pending from prior OAR; seed `seo` block in `measures_registry.metadata` for `map_integrity_governance` and add route to `generate-registry-route-heads.cjs`.

4. **OAR2 — Harden DB carry-forward reconstruction** — add `evalScore` and `conditionTraces` to the DB resolution useEffect.
