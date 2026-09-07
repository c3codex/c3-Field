---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Normalize Lapis Chamber Publication Integrations
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_normalize_lapis_chamber_publication_integrations_v1
---

# OAR1 - Normalize Lapis Chamber Publication Integrations

## EXECUTION METHOD

Full audit of source files, live DB surface_assignment, measures_registry, and migration
history before any mutation. Scanned: `structural_drift_publication`, `structural_drift_dispatches`,
`publication_dispatch`, `lapis_publication_surface`, `lapis_chamber_encounter`, `/undrifted`,
Paragraph, Buffer, article records. One source fix applied. One DB migration applied.
TypeScript `npx tsc --noEmit` zero errors.

---

## AUDIT FINDINGS — VOCABULARY REFERENCES

### `structural_drift_publication` (deprecated)

| Location | Reference | Status |
|---|---|---|
| `measures_registry` | is_active=false, release_state=held, access_state=archived, metadata.disposition=legacy_deactivated | ✓ already archived (migration 202606260007) |
| `registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | Line 62: section key, Lines 107, 422 | dead code — registered_runtime is retired |
| Active FREE renderer | Not present | ✓ clean |
| Surface_assignment | No surface_key = 'structural_drift_publication' | ✓ clean |

`structural_drift_publication` is fully retired from active runtime. Not present in FREE
encounter renderer. Registered_runtime references are dead code (module retired).

### `structural_drift_dispatches` (deprecated surface_key)

| Location | Reference | Status |
|---|---|---|
| `LapisChamberRenderer.tsx` line 189 | `data-surface="structural_drift_dispatches"` hardcoded in UnDriftedIndex | FIXED ✓ → dynamic |
| `MeasuresRegistryOrchestrator.tsx` line 307 | `source_surface: "structural_drift_dispatches"` in `onCaptureSubscription` capture callback | PRESERVED — protected capture callback |
| `registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | Lines 107, 118, 119, 131, 175, 1148 | dead code — registered_runtime retired |
| `registered_runtime/registeredRuntimeTypes.ts` | Line 14 | dead code |
| `registered_runtime/renderers/RegisteredStructuralDrift.tsx` | Lines 349 | dead code |
| Surface_assignment | No surface_key = 'structural_drift_dispatches' | ✓ clean (renamed to lapis_chamber_encounter in prior OAR) |

### `publication_dispatch`

| Location | Reference | Status |
|---|---|---|
| Surface_assignment | surface_key = 'publication_dispatch', registry_key = 'undrifted', standing = audit_trace | classified correctly |
| Surface_assignment metadata.profile | `lapis_publication_surface` (deprecated) | NORMALIZED ✓ → `lapis_chamber_publication_dispatch` |
| `LapisChamberRenderer.tsx` | dispatch branch: `if (surface === "publication_dispatch")` → PublicationDispatch component | audit_trace surface, renders content gap state |
| `MeasuresRegistryOrchestrator.tsx` | `publication_dispatch: "/publication/structural_drift"` in PUBLIC_ROUTE_BY_SURFACE | legacy route alias — preserved, not active authority |
| `MeasuresRegistryOrchestrator.tsx` | `pathname.startsWith("/publication/structural_drift/")` → publication_dispatch | legacy dispatch — preserved |
| `EncounterSurface` union | line 27 | ✓ present, correct |
| `registered_runtime` files | Multiple references | dead code — retired |

`publication_dispatch` is correctly classified as audit_trace sub-surface. It routes via
`/publication/structural_drift/*` legacy path. It does not hide `/undrifted`. Gate passes
via `registry_key = 'undrifted'` (releases active). Content gap state renders correctly.

### `lapis_publication_surface` (deprecated profile term)

Removed from `publication_dispatch` surface_assignment metadata via migration 202606300015.
No other active references found in FREE renderer source.

### `lapis_chamber_encounter` / `/undrifted`

| Location | State |
|---|---|
| Surface_assignment | surface_key = 'lapis_chamber_encounter', registry_key = 'undrifted', profile = 'lapis_chamber_encounter' ✓ |
| measures_registry | is_active=true, released, display_title='unDrifted' ✓ |
| `MeasuresRegistryOrchestrator.tsx` ROUTE_SURFACE_MAP | `/undrifted` → `lapis_chamber_encounter` ✓ |
| `MeasuresRegistryOrchestrator.tsx` ROUTE_SURFACE_MAP | `/structural-drift` → `lapis_chamber_encounter` (legacy alias) ✓ |
| `MeasuresRegistryOrchestrator.tsx` PUBLIC_ROUTE_BY_SURFACE | `lapis_chamber_encounter` → `/undrifted` ✓ |
| `registryResolver.ts` ENCOUNTER_REGISTRY_KEYS | `"undrifted"` ✓ |
| `LapisChamberRenderer.tsx` dispatch | `if (surface === "lapis_chamber_encounter")` → UnDriftedIndex ✓ |

---

## CHANGES APPLIED

### Source: `LapisChamberRenderer.tsx`

**Line 189** — `UnDriftedIndex` component:
```tsx
// Before:
data-surface="structural_drift_dispatches"

// After:
data-surface={encounter.surface}
```

The `data-surface` attribute now reflects the actual live surface name (`lapis_chamber_encounter`)
rather than the prior stale string. Follows same dynamic pattern applied to CrystalSeatRenderer
in the normalize_free_runtime OAR.

### Migration: `202606300015_normalize_lapis_publication_dispatch_profile.sql`

Updated `publication_dispatch` surface_assignment metadata:
- `profile`: `lapis_publication_surface` → `lapis_chamber_publication_dispatch`
- `standing`, `standing_note` unchanged

`metadata.profile` has zero runtime consumers (confirmed in oar1_normalize_measures_registry_terms).
This is vocabulary alignment only — no runtime behavior change.

---

## CHANGES PRESERVED (NOT MODIFIED)

| Reference | Reason |
|---|---|
| `onCaptureSubscription` `source_surface: "structural_drift_dispatches"` (Orchestrator line 307) | Protected capture callback — writes archival metadata to `measures_registry_connect_capture`; must not be changed |
| `aria-label="Subscribe to Structural Drift"` (LapisChamberRenderer line 395) | User-visible copy referencing the concept of structural drift — not surface/registry naming |
| `registered_runtime` files | Module retired — not modified under prior authority |
| `/publication/structural_drift` route alias (Orchestrator lines 41, 56, 57) | Legacy route alias for backward compatibility; redirects to `lapis_chamber_encounter`; stable |

---

## INTEGRATION INVENTORY

### Lapis Chamber gate (measures_registry)

| registry_key | is_active | release_state | display_title |
|---|---|---|---|
| `undrifted` | true | released | unDrifted |

`undrifted` registry metadata:
```json
{
  "material_identity": "lapis",
  "chamber_assignment": "lapis",
  "native_architecture": true,
  "lapis_publication_integrations": {
    "paragraph": { "env_binding": "PARAGRAPH_PUBLISH_KEY", "automation_status": "missing_required", "disposition": "hold_for_operator_review" },
    "buffer": { "env_binding": "BUFFER_SOCIAL_KEY", "automation_status": "missing_required", "disposition": "hold_for_operator_review" }
  }
}
```

### Registered article records (measures_publication_dispatch)

| dispatch_key | title | platform | external_url | status |
|---|---|---|---|---|
| `measures_registry_dispatch_v1` | Measures Registry | paragraph | `@undrifted/measures-registry` | published |
| `undrifted_dispatch_v1` | unDrifted | paragraph | `@undrifted/undrifted` | published |

Both records seeded in migration 202606260008. Bodies empty (`''`) — external URL is standing authority.
Not present in `measures_encounter_def` — only accessible via registered_runtime data model.

### Paragraph integration

- Env binding: `PARAGRAPH_PUBLISH_KEY` (present in env)
- Process record: `paragraph_publication_integration` in `system_process_registry` (status=seeded, process_status=draft, automation_status=held)
- Automation: not active — separate OAR required for activation
- External handle confirmed: `@undrifted` on paragraph.com
- Sync direction: DB_to_Paragraph (planned, not active)

### Buffer integration

- Env binding: `BUFFER_SOCIAL_KEY` (present in env)
- Process record: NOT YET in `system_process_registry` — gap
- Automation: missing_required — separate OAR required
- Disposition: hold_for_operator_review

### Social media profile references

No social_profile or social_registry record found in live DB.
Buffer is the designated social distribution integration.
Social profile records not yet seated.

### Publication dispatch records (measures_publication_dispatch)

2 records seeded (detailed above). No additional dispatch records found beyond the
two Paragraph articles. Article body content is external-URL-only — no body text seated in DB.

---

## LINK INVENTORY: /undrifted

### /undrifted → /about-measures-registry

Not rendered via UnDriftedIndex component. The component has no hardcoded link to
`/about-measures-registry`. An assessment feature section (`assessmentFeature.route_path`)
would be the route entry point, but this is read from `encounter.encounterDef.metadata`
which is null (see critical gap below).

### /undrifted → /ai-operations-assessment

Assessment CTA link is rendered via `assessmentRoute` from `encounterDef.metadata.assessment_feature.route_path`.
With null encounterDef, this CTA does not render. The assessment route is currently NOT
linked from `/undrifted` in the FREE renderer.

### /undrifted → Paragraph article URLs

Planned via `featuredArticleSet` rendered as article cards with `article_url` links.
With null encounterDef, `featuredArticleSet` is empty — no article cards render.

---

## CRITICAL GAP: ENCOUNTER_DEF MISSING FOR UNDRIFTED

**No `measures_encounter_def` row exists for `encounter_key = 'undrifted'`.**

The FREE encounter renderer (`LapisChamberRenderer` / `UnDriftedIndex`) reads all
publication content from `encounter.encounterDef?.metadata` — brand copy, featured
article set, assessment feature, role call feature, footer record, landing contract, etc.

Because no encounter_def row exists, `encounterDef` is null. All content fields are null.
`UnDriftedIndex` renders a structural shell with no content: no masthead copy, no cover
story, no assessment CTA, no article cards, no role call section, no footer.

Content for unDrifted exists in:
- `measures_publication_registry` (publication record, style profile, cover story)
- `measures_publication_dispatch` (2 article dispatch records)

These tables are the registered_runtime data model and are NOT queried by the FREE
encounter resolver.

**Required next step:** A dedicated OAR to seed a `measures_encounter_def` row for
`encounter_key = 'undrifted'` that ports the relevant display content from
`measures_publication_registry` into the format expected by `UnDriftedIndex`. This
includes: `brand_copy`, `featured_article_set`, `assessment_feature`, `role_call_feature`,
`next_issue_teaser`, `footer_record`, `landing_design_contract`, `issue_record`, `cover_story`.

This is the primary blocking gap for `/undrifted` Lapis Chamber content in the FREE renderer.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| `structural_drift_publication` not in active runtime | ✓ already archived before this OAR |
| `structural_drift_dispatches` surface_key not in surface_assignment | ✓ renamed to lapis_chamber_encounter (prior OAR) |
| `data-surface="structural_drift_dispatches"` hardcode removed | ✓ → dynamic {encounter.surface} |
| `lapis_publication_surface` removed from active profile | ✓ migration 202606300015 |
| `/undrifted` resolves as `lapis_chamber_encounter` | ✓ confirmed |
| Lapis Chamber confirmed holder of pub/social/dispatch integration standing | ✓ documented |
| Paragraph: inventoried (2 dispatches, env key, process record draft) | ✓ |
| Buffer: inventoried (env key, no process record, hold_for_operator_review) | ✓ |
| Social media profile records: not yet seated — reported | ✓ gap reported |
| Article records: 2 Paragraph dispatches, external URL only | ✓ |
| /undrifted → article links: NOT rendering (null encounterDef) | ✓ gap reported |
| /undrifted → /ai-operations-assessment CTA: NOT rendering (null encounterDef) | ✓ gap reported |
| `publication_dispatch` isolated as audit_trace, not hiding main Lapis encounter | ✓ |
| `/undrifted` remains optional, promoted, non-sequence | ✓ |
| Capture callback preserved | ✓ |
| registered_runtime not modified | ✓ |
| No article/social truth invented | ✓ |
| No assessment/report/payment mutation | ✓ |
| TypeScript: tsc --noEmit zero errors | ✓ |
| OAR1 records evidence, inventory, and remaining gaps | ✓ |

---

## FINAL DISPOSITION

**SEATED** — Lapis Chamber publication vocabulary normalized. Integration inventory completed.

`structural_drift_publication` remains fully retired. `structural_drift_dispatches` surface
naming removed from FREE renderer (last hardcoded reference fixed). `lapis_publication_surface`
profile term removed from active DB record. `/undrifted` resolves cleanly as `lapis_chamber_encounter`.

Primary unresolved gap: no `measures_encounter_def` row for `undrifted` — the FREE renderer
`UnDriftedIndex` component renders an empty shell. Content exists in registered_runtime
data model tables (`measures_publication_registry`, `measures_publication_dispatch`)
and must be ported to `measures_encounter_def` via a dedicated content-seeding OAR.

Lapis relates.
Lapis publishes.
Lapis distributes.
Lapis does not force sequence.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
