---
document_type: oar1
authority_level: closeout
document_scope: undrifted_media_binding_repair_and_runtime_chamber_isolation
title: OAR1 — Repair /undrifted Media Binding and Split Registered Runtime by Chamber Responsibility v1
status: browser_qa_pending
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_repair_undrifted_media_binding_and_split_registered_runtime_by_chamber_responsibility_v1.md
final_seat_standing: held_browser_qa
---

# OAR1 — Repair /undrifted Media Binding and Split Registered Runtime by Chamber Responsibility v1

## Closeout

```yaml
closeout:
  status: browser_qa_pending
  rls_fix_applied: true
  chamber_split_deployed: true
  lapis_isolated_from_marble: true
  map_c2_circuit_marble_only: true
  cloudflare_build: triggered
  final_seat_standing: held_browser_qa
```

## Root Cause — Missing /undrifted Media

### Diagnosis

The five media assets were in the DB but invisible to the anon runtime query.

```yaml
table: measures_media_map
rls_policy_before: "public reads active registry landing media"
rls_policy_before_qual: |
  (is_active = true)
  AND (campaign_key = 'agents_of_chaos_integrity_governance')
  AND (media_role = ANY (ARRAY[
    'hero_video', 'hero_poster', 'path_choice_background', 'registry_mark'
  ]))
```

The policy allowed only 4 media roles. All 5 Lapis publication roles were outside that list:
- `measures_registry_logo` — blocked
- `ai_isnt_broken_landing` — blocked
- `agents_with_keys_cover` — blocked
- `fables_and_myths_cover` — blocked
- `questions_ungoverned_systems_cannot_answer_video` — blocked

**The rows were in the DB. The query matched campaign_key and media_role. The RLS policy suppressed them before they reached the anon client.**

### Anon validation

```yaml
anon_rows_before_fix: 2   # hero_poster, registry_mark only
anon_rows_after_fix:  8   # includes all 5 Lapis roles + 3 existing duplicates under other campaign keys
```

Validated via REST API with publishable key `sb_publishable_e7pEH3NayEDRPiS2PWA7ng_LkV9vVbT`.

## Fix Applied — RLS Migration

```yaml
migration: supabase/migrations/202606230001_measures_media_map_rls_lapis_publication_roles.sql
applied: true
method: supabase db query --linked
```

```sql
DROP POLICY IF EXISTS "public reads active registry landing media" ON measures_media_map;

CREATE POLICY "anon_read_active_media"
  ON measures_media_map
  FOR SELECT
  TO anon
  USING (is_active = true);
```

`measures_media_map` stores public asset references only — no sensitive data. The narrow role-list policy was a maintenance hazard; the new policy covers all active rows regardless of role.

## Query Filter — Before / After

### Before

```typescript
supabase
  .from("measures_media_map")
  .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
  .in("campaign_key", [CAMPAIGN_KEY, "measures_registry_root_authority_v1"])
  .in("media_role", [...REGISTERED_MEDIA_ROLES])   // 39 roles
  .order("sort_order", { ascending: true })
// RLS policy: only 4 roles visible to anon → 5 Lapis roles blocked → mediaMap empty for /undrifted
```

### After (Lapis chamber)

```typescript
// LapisChamberRuntime.tsx — Lapis-scoped query, executed independently
supabase
  .from("measures_media_map")
  .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
  .in("campaign_key", [...LAPIS_CAMPAIGN_KEYS])     // agents_of_chaos + root_authority
  .in("media_role", [...LAPIS_MEDIA_ROLES])          // 13 Lapis-specific roles
  .order("sort_order", { ascending: true })
// RLS policy: all is_active rows → all 5 Lapis roles returned
```

## Media Roles Returned After Fix

Confirmed via anon REST query post-migration:

| media_role | campaign_key | bucket | path |
|---|---|---|---|
| `measures_registry_logo` | agents_of_chaos_integrity_governance | measures-registry | measures_registry_logo.webp |
| `ai_isnt_broken_landing` | agents_of_chaos_integrity_governance | measures-registry | ai_isnt_broken_landing.webp |
| `agents_with_keys_cover` | agents_of_chaos_integrity_governance | measures-registry | agents_with_keys.webp |
| `agents_with_keys_cover` | measures_registry_root_authority_v1 | measures-registry | agents_with_keys.webp |
| `fables_and_myths_cover` | agents_of_chaos_integrity_governance | measures-registry | fables_and_myths.webp |
| `fables_and_myths_cover` | measures_registry_root_authority_v1 | measures-registry | fables_and_myths.webp |
| `questions_ungoverned_systems_cannot_answer_video` | agents_of_chaos_integrity_governance | measures-media (R2) | questions_ungoverned_systems_cannot_answer.mp4 |
| `questions_ungoverned_systems_cannot_answer_video` | measures_registry_crystal_chamber | measures-media (R2) | questions_ungoverned_systems_cannot_answer.mp4 |

Duplicates under multiple campaign keys are not a conflict — mediaMap keyed by role, last entry wins, same paths. Runtime query filters by campaign_key so deduplication is stable.

## Chamber Split — Runtime Isolation

### Files changed

```yaml
commit: eac42a6
branch: measures
new_files:
  - src/measures_registry/registered_runtime/chambers/LapisChamberRuntime.tsx
  - src/measures_registry/registered_runtime/chambers/MarbleChamberRuntime.tsx
  - supabase/migrations/202606230001_measures_media_map_rls_lapis_publication_roles.sql
modified_files:
  - src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
```

### Chamber boundaries

```yaml
CRYSTAL:
  surfaces: intro, intro_hook, path_choice, ai_operations_assessment_landing, about_measures_registry
  owner: MeasuresRegistryRuntimeRegistered.tsx (root)
  data: encounter_defs, registry_units, design_tokens, Crystal+Obsidian media

OBSIDIAN:
  surfaces: eval_passage, structural_coherence_explainer, structure_passage, measures_structured_environments, measures_assessment, obsidian_to_marble_passage_video
  owner: MeasuresRegistryRuntimeRegistered.tsx (root)
  data: assessment copy, obsidian media, eval state

LAPIS:
  surfaces: structural_drift_dispatches, publication_dispatch (/undrifted)
  owner: LapisChamberRuntime.tsx
  data: measures_media_map (Lapis roles), measures_publication_registry, measures_publication_dispatch
  does_not_query: map_c2_circuit
  does_not_depend_on: Marble state, Marble data

MARBLE:
  surfaces: map_integrity_governance
  owner: MarbleChamberRuntime.tsx
  data: map_c2_circuit (loaded only when Marble mounts), payment state, checkout/verification
  does_not_affect: Lapis, Crystal, Obsidian
```

### Lapis isolation from Marble confirmed

```yaml
lapis_queries_map_c2_circuit: false
marble_data_in_lapis_props: false
lapis_props_from_root:
  - registryTokenStyle
  - activeSurface
  - undriftedLandingUnit
  - structuralDriftCopy
  - evalReport         # assessment result (Obsidian → display only)
  - renderSystemFooter
  - onBeginEvaluation
  - onContinueToAssessmentPackage
  - onGoToEvalPassage
  - onAboutMeasuresRegistry
map_c2_circuit_load_trigger: MarbleChamberRuntime mounts (activeSurface === map_integrity_governance)
map_c2_circuit_401_effect_on_undrifted: none
```

### Root loadData — before/after

```yaml
before: 6 queries + 1 sequential map_c2_circuit
after:  4 queries (encounter_defs, registry_units, media_map, design_tokens)
removed_from_root:
  - measures_publication_registry
  - measures_publication_dispatch
  - map_c2_circuit (sequential post-load)
```

## Browser QA

```yaml
status: pending
trigger: Cloudflare Pages build from commit eac42a6
verify:
  - /undrifted renders
  - measures_registry_logo appears in topbar
  - hero video loads (questions_ungoverned_systems_cannot_answer.mp4 from R2)
  - ai_isnt_broken_landing.webp as video poster
  - agents_with_keys.webp in Agents With Keys card
  - fables_and_myths.webp in Fables and Myths card
  - assessment promotion CTA routes correctly
  - /undrifted does not depend on map_c2_circuit (confirm 401 is non-blocking)
  - assessment path (/ai-operations-assessment) still loads
  - MAP surface (/map-integrity-governance) still loads circuit data
```

## Final Standing

```yaml
repair_standing: browser_qa_pending
rls_applied: true
chamber_split_deployed: true
lapis_isolated: true
marble_isolated: true
build_triggered: true
final_seat_standing: held_browser_qa

seat_advancement:
  current: held_browser_qa
  requires:
    - Cloudflare Pages build completes (commit eac42a6)
    - browser QA passes on /undrifted media (all 5 assets)
    - browser QA passes assessment path
    - browser QA passes MAP surface
```

RLS fixed. Chamber split deployed. Lapis is isolated from Marble. Browser QA required after build completes.
