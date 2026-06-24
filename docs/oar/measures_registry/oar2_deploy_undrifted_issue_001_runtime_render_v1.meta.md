---
document_type: oar2
authority_level: working
document_scope: deployment
title: OAR2 — Deploy unDrifted Issue 001 Runtime Render
status: proposed
version: v1
operator: op044
system: measures_registry
surface: undrifted
source_oar1: docs/oar/measures_registry/oar1_render_undrifted_issue_001_from_seated_publication_profiles_v1.meta.md
---

# OAR2 — Deploy unDrifted Issue 001 Runtime Render v1

## OBJECTIVE

Deploy the already-rendered unDrifted Issue 001 runtime changes to production.

This OAR2 is deployment-only.

No design mutation.

No DB mutation.

No copy mutation.

No media mutation.

---

## OBSERVED

The runtime render OAR1 reports:

- src mutation completed
- frontend mutation completed
- /undrifted renderer updated
- browser QA pending

Operator QA confirms production did not change.

Conclusion:

Local/runtime changes were not deployed to production.

---

## ALIGNED

Production must render from seated Issue 001 publication profiles.

Expected production `/undrifted`:

- unDrifted magazine masthead
- THE PUBLICATION FOR GOVERNED SYSTEM ENVIRONMENTS
- ISSUE 001 • JUNE 2026 • LAUNCH EDITION
- AI ISN'T BROKEN. SYSTEMS ARE.
- static ai_isnt_broken_landing hero
- Measures Registry as cover story
- Assess the Environment editor feature
- Agents With Keys feature
- Fables & Myths feature
- Role Call
- Next Issue
- minimal publication footer

---

## ROUTED

### Route 1 — Preflight

Verify working tree contains the runtime render changes from:

- src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
- src/measures_registry/registered_runtime/chambers/LapisChamberRuntime.tsx
- src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
- src/measures_registry/registered_runtime/styles/registry.visual-system.css

Verify no unrelated mutation is included unless already present and intentionally preserved.

### Route 2 — Build

Run registry build.

Required:

- build passes
- no TypeScript errors
- dist-registry output generated

### Route 3 — Commit

Commit only the authorized runtime render/deployment files and OAR logs.

Suggested commit message:

Deploy unDrifted Issue 001 runtime render

### Route 4 — Push

Push current branch to remote.

### Route 5 — Cloudflare Deployment

Verify Cloudflare Pages deployment is triggered.

If deployment does not trigger automatically, report deployment blockage.

Do not invent deployment success.

### Route 6 — Production QA

After deployment completes, verify production `/undrifted`.

Required visible checks:

- unDrifted masthead renders
- static hero image renders
- no hero video renders
- AI ISN'T BROKEN. SYSTEMS ARE. renders
- Agents With Keys renders
- Fables & Myths renders
- Role Call renders
- Next Issue renders
- footer renders

### Route 7 — OAR1

Write deployment OAR1 beside this file.

Expected file:

docs/oar/measures_registry/oar1_deploy_undrifted_issue_001_runtime_render_v1.meta.md

OAR1 must include:

- commit hash
- pushed branch
- deployment status
- production QA result
- any held items

---

## CODY ROLE

Cody may:

- verify working tree
- build
- commit
- push
- trigger deployment
- verify production
- write OAR1

Cody may not:

- change copy
- change DB
- change media mappings
- change publication profiles
- change assessment flow
- modify MAP
- modify payment
- activate SEAT
- claim deployment without evidence

---

## VALIDATION

This OAR2 resolves when:

- runtime changes are committed
- branch is pushed
- deployment completes
- production `/undrifted` reflects Issue 001 magazine render
- deployment OAR1 is written

## CLOSE

The render is ready.

Deploy it.

Verify production.
