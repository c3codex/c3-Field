---
document_type: oar1
authority_level: working
title: OAR1 — Align unDrifted Lapis Publication and Register Structural Drift Article
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_align_undrifted_lapis_publication_and_register_structural_drift_article_v1.meta.md
commit: a3c0d38
---

# OAR1 — Align unDrifted Lapis Publication and Register Structural Drift Article

## OBJECTIVE

Verify /unDrifted route. Seat undrifted in measures_registry.
Confirm Structural Drift article is already registered.
Mark structural_drift_publication encounter_def as stale publication identity.
No legacy keys deactivated. No routes removed.

---

## FILE CHANGED

| File | Change |
|---|---|
| `supabase/migrations/202606260004_align_undrifted_lapis_standing_and_mark_structural_drift_publication_stale.sql` | Created — INSERT undrifted registry row; UPDATE stale flags |

---

## VALIDATION

### 1. /unDrifted route/page exists

`src/app/App.tsx` — `/undrifted` route present with full page metadata:
- title: "unDrifted | Measures Registry"
- url: https://measuresregistry.com/undrifted
- route_unit: `undrifted_publication_landing`

`/structural-drift` also exists, canonical URL points to `/undrifted`. PASS

### 2. Existing page behavior preserved

No TypeScript files modified. No route changes. Existing page behavior intact. PASS

### 3. unDrifted verified as Lapis landing page/publication surface

`measures_registry`:
- `registry_key: undrifted` — is_active: true, release_state: released, material_family: lapis
- `current_function: landing_page_publication`

`measures_publication_registry`:
- `publication_key: undrifted` — status: published, title: "unDrifted" (pre-existing, not created in this OAR)

PASS

### 4. Future social registry function documented as planned, not active

`measures_registry.metadata.planned_function: "social_registry_surface"`
`measures_registry.metadata.planned_function_status: "not_active"`

PASS

### 5. Structural Drift is registered as a published article

Already registered in `measures_publication_dispatch` as `structural_drift_dispatch_v1`:
- `publication_key: undrifted`
- `title: Structural Drift`
- `status: published`
- `external_url: https://paragraph.com/@undrifted/structural-drift`
- `external_platform: paragraph`
- `primary_cta: Continue to Structural Evaluation`

No new row created — record already existed with complete standing. PASS

### 6. Paragraph URL stored exactly

`measures_publication_dispatch.external_url: https://paragraph.com/@undrifted/structural-drift`

Matches OAR2 required URL exactly. PASS

### 7. No article content was invented

No article content written. Structural Drift dispatch row was pre-existing. PASS

### 8. Optional metadata stored only if verified

Optional fields (published_at, author, excerpt, paragraph_id, canonical_url, image_url) not added — only pre-existing dispatch row confirmed. PASS

### 9. structural_drift_publication not used as native publication identity

`measures_encounter_def` for `structural_drift_publication` updated with:
- `stale_publication_identity: true`
- `legacy_route_alias: true`
- `replacement_publication_key: "undrifted"`
- `replacement_article_key: "structural_drift"`
- `disposition: "audit_trace_only"`

PASS

### 10. structural_drift_publication remains active

`measures_registry.is_active: true` for `structural_drift_publication` — unchanged. PASS

### 11. FREE does not infer publication/article standing

No renderer code changed. No inference path added. PASS

---

## DISCOVERY FINDINGS (pre-mutation)

| Finding | Detail |
|---|---|
| `/undrifted` route | Present in `App.tsx`, route unit `undrifted_publication_landing` |
| `undrifted` in measures_publication_registry | EXISTS — published, title "unDrifted" |
| `undrifted` in measures_registry | MISSING — created in this OAR |
| `structural_drift_dispatch_v1` | EXISTS — full Paragraph standing already registered |
| `structural_drift_publication` stale flags | ABSENT — added in this OAR |
| Article tables found | `measures_publication_registry`, `measures_publication_dispatch`, `measures_publication_subscription_capture` |

---

## NOTCHAZZ FLAGS

None raised.

- unDrifted treated as existing page — not newly created
- Social registry function marked `planned_function_status: not_active`
- Structural Drift is a registered article, not the publication identity
- No article content invented
- No optional metadata fabricated
- No routes removed
- structural_drift_publication remains active, deactivation not performed
- No frontend inference added
- Operator not governed

---

## CLOSE

unDrifted is the Lapis landing page and publication surface.

Structural Drift is a registered published article (`structural_drift_dispatch_v1`).

Social registry is documented as planned — not active.

`structural_drift_publication` retains active standing as legacy bridge only. Stale identity is now documented in encounter_def metadata.

Nothing is invented.

Commit: a3c0d38
