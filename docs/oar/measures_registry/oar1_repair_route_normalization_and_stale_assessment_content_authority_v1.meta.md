---
document_type: oar1
authority_level: closeout
document_scope: live_route_and_assessment_authority_repair
title: OAR1 — Repair Route Normalization and Stale Assessment Content Authority
status: route_normalization_deployed_assessment_authority_held
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_repair_route_normalization_and_stale_assessment_content_authority_v1.meta.md
final_seat_standing: held_assessment_q1_authority
---

# OAR1 — Repair Route Normalization and Stale Assessment Content Authority v1

## Closeout

```yaml
closeout:
  status: route_normalization_deployed_assessment_authority_held
  execution_started: true
  route_normalization_applied: true
  route_normalization_deployed: true
  assessment_authority_repaired: false
  stopped_at_gate: missing_approved_q1_authority_in_db
  final_seat_standing: held_assessment_q1_authority
```

## Step 1 — Route Normalization Applied

### Root cause

`initialSurface()` and component-level route lookups used `window.location.pathname` as a raw key:

```typescript
// Before — trailing slash missed
const routeSurface = ROUTE_SURFACE_ALIASES[window.location.pathname]
const activeRouteUnitKey = ROUTE_UNIT_KEYS[window.location.pathname] ?? null
const activeRouteDefaultSurface = ROUTE_SURFACE_ALIASES[window.location.pathname] ?? null
```

`ROUTE_SURFACE_ALIASES` and `ROUTE_UNIT_KEYS` have keys without trailing slashes (`/undrifted`, `/ai-operations-assessment`). A request to `/undrifted/` or `/ai-operations-assessment/` produced a lookup miss, falling through to the root authority error state.

### Fix

`normalizePathname()` added:

```typescript
function normalizePathname(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
}
```

Applied at all three lookup sites:

```typescript
// initialSurface()
const pathname = normalizePathname(window.location.pathname)
const routeSurface = ROUTE_SURFACE_ALIASES[pathname]
if (pathname.startsWith(...))
if (pathname === STRUCTURAL_DRIFT_DISPATCHES_ROUTE)

// component level
const activeRouteUnitKey = ROUTE_UNIT_KEYS[normalizePathname(window.location.pathname)] ?? null
const activeRouteDefaultSurface = ROUTE_SURFACE_ALIASES[normalizePathname(window.location.pathname)] ?? null
```

Root (`/`) is unaffected — `normalizePathname` only strips when `pathname.length > 1`.

## Step 2 — c3field Redirect — Trailing Slash Added

`/c3field/` was not covered by the prior redirect rule. Added to `_redirects`:

```
/c3field https://c3field.online 301
/c3field/ https://c3field.online 301
/* /index.html 200
```

`REGISTRY_REDIRECT_RULES` in `generate-registry-route-heads.cjs` updated to include both rules. Both will be written on every future `npm run build:registry`.

## Step 3 — c3field Route Head Persistence Fixed

`dist-registry/c3field/index.html` was being wiped on every Vite build because it was created manually outside the build script. `writeC3FieldRouteHead(outDir, template)` added to `generate-registry-route-heads.cjs` `main()` — the redirect-aware route head is now regenerated automatically on each build.

## Step 3 — Assessment Source Audit

```yaml
assessment_source_audit:
  source: db
  table: measures_encounter_def
  row: encounter_key = measures_assessment
  path: metadata.assessment_mechanics.questions
  question_count: 7
  contract_key: measures_assessment_contract
  frontend_hardcode_allowed: false
  active_contract_keys_include_measures_assessment_contract: true
```

Current Q1 in DB:

```yaml
question_key: ai_output_review_pathway
question: "How are AI-generated outputs currently reviewed before they influence operational decisions?"
context_label: Review Pathway
```

This is the stale review-pathway question. Source is the DB, not a hardcoded frontend array. `frontend_hardcode_allowed` is explicitly `false` in the DB record.

## Step 4 — Assessment Authority — HELD

```yaml
assessment_authority:
  approved_q1_seated_in_db: false
  approved_q1_source: not_found
  gate_status: blocked
  reason: >
    Approved deployment-stage/status Q1 is not seated in any DB record.
    Cannot replace without operator providing the approved question content.
    frontend_hardcode_allowed is false — hardcoding is not permitted.
```

Execution stopped at this gate. The approved deployment-stage/status Q1 must be provided by the operator before Step 4 can proceed.

Required from operator:

```yaml
required_to_unblock:
  - question_key: <approved key>
  - question: <approved deployment-stage/status question text>
  - context_label: <approved label>
  - context_statement: <approved context>
  - options:
      - label: <option 1>
        value: <value 1>
        condition_tags: [...]
      - label: <option 2>
        value: <value 2>
        condition_tags: [...]
      - label: <option 3>
        value: <value 3>
        condition_tags: [...]
```

The question must replace `questions[0]` in `measures_encounter_def.measures_assessment.metadata.assessment_mechanics.questions`. Total question count must remain 7 after replacement.

## Deployment

```yaml
deployment:
  commit: 31ab876
  branch: measures
  remote: https://github.com/c3codex/c3-Field.git
  push_confirmed: true
  deploy_target: measuresregistry.com (Cloudflare Pages)
  files_deployed:
    - src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    - scripts/generate-registry-route-heads.cjs
    - dist-registry/_redirects
    - dist-registry/assets/index-vmkJUE4l.js
    - dist-registry/index.html
    - dist-registry/c3field/index.html
    - dist-registry/ai-operations-assessment/index.html
    - dist-registry/structural-drift/index.html
    - dist-registry/undrifted/index.html
```

## Mutation Confirmation

```yaml
mutation_confirmation:
  runtime_mutation: true
  runtime_mutation_scope: normalizePathname — trailing slash stripped before route lookups
  renderer_mutation: false
  db_mutation: false
  content_mutation: false
  map_mutation: false
  payment_mutation: false
  social_campaign_mutation: false
  publication_mutation: false
  release_state_mutation: false
  dist_redirects_mutation: true
  dist_redirects_scope: /c3field/ rule added
  build_script_mutation: true
  build_script_scope: writeC3FieldRouteHead + /c3field/ in REGISTRY_REDIRECT_RULES
```

## Final Standing

```yaml
repair_standing: partial
route_normalization_applied: true
route_normalization_deployed: true
c3field_trailing_slash_redirect: true
c3field_route_head_persistent: true
assessment_q1_repaired: false
final_seat_standing: held_assessment_q1_authority

remaining_gates:
  - operator provides approved deployment-stage/status Q1 content
  - DB update: replace questions[0] in measures_encounter_def.measures_assessment
  - rebuild and deploy
  - browser verification: Q1 renders approved question, all routes resolve with and without trailing slash
```

SEAT remains HELD. Route normalization is deployed. Assessment Q1 repair requires operator authority before proceeding.
