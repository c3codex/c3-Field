---
document_type: oar2
authority_level: working
document_scope: runtime_rebuild
title: OAR2 — Rebuild Measures Registry Runtime Without Monolith Extraction
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Rebuild Measures Registry Runtime Without Monolith Extraction

## OBSERVED

Measures Registry runtime remains governed by a monolithic runtime file.

The monolith has repeatedly allowed:

- frontend authority
- hardcoded transitions
- ghost-live surfaces
- residue normalization
- stale aliases
- release-state bypass
- cross-chamber collapse

Operator does not trust the monolith as source authority.

This OAR2 does not authorize extraction from the monolith.

The monolith may be reviewed only to identify current route coverage and parity requirements.

## ALIGNED

Do not refactor the monolith.

Do not extract logic from the monolith.

Do not copy monolith behavior unless revalidated against registry standing.

Build a clean replacement runtime beside it.

Runtime must be small, registry-gated, chamber-organized, and DB-rendered.

Authority order:

Codex
→ Field
→ Measures
→ Registry Standing
→ Release Gate
→ Chamber Runtime
→ Renderer

## ROUTED

### 1. Deprecate Monolith as Authority

Mark existing monolith as:

deprecated_reference_only

It may be used only to identify:

- current surface coverage
- current public route coverage
- current renderer names
- current known gaps

It may not be used as authority for:

- routing
- transitions
- release standing
- content order
- fallback truth
- chamber logic

### 2. Build Clean Runtime Shell

Create replacement runtime shell.

Shell responsibilities only:

- load registry state
- resolve current surface key
- apply release gate
- route to chamber runtime
- request next transition from transition resolver
- render held/missing states when required

Shell may not own:

- copy
- media truth
- surface meaning
- chamber meaning
- transition authority
- release standing

### 3. Build Registry Resolver

Create registry resolver.

Resolver must provide:

- registry record
- encounter definition
- release/access standing
- media mapping references
- approved content contract
- transition nodes

No renderer may bypass resolver.

### 4. Build Release Gate

Create release gate.

Surface renders live only when:

- registry record exists
- is_active = true
- release_state permits rendering
- encounter definition exists where required
- content contract exists where required
- transition target is permitted where required

Otherwise render governed held state.

### 5. Build Chamber Runtime Split

Create chamber-organized runtimes:

- ObsidianChamberRuntime
- CrystalSeatRuntime
- LapisChamberRuntime
- MarbleChamberRuntime

Chamber responsibility:

Obsidian:
assessment, passage, contact capture, assessment-to-marble transition

Crystal Seat:
Understand the Environment, About Measures Registry, Codexstone Seal first surface, Connect role call

Lapis:
unDrifted publication and dispatches

Marble:
MAP findings and governed continuation

Chamber runtimes must receive seated contracts from shell/resolver.

They may not query authority independently.

### 6. Build Transition Resolver

All next-surface movement must resolve through transition resolver.

No hardcoded navigation constants.

Transition resolver reads:

- registry transition node
- release standing of target
- allowed chamber transition
- held/missing target state

If target is missing or held:

do not navigate live.

render held state.

### 7. Preserve Public Parity

Replacement runtime must preserve intended public flows:

Assess Flow:

Root
→ Intro
→ Paths
→ Assess the Environment
→ eval_passage
→ assessment
→ contact capture
→ obsidian-to-marble passage
→ MAP findings

Understand Flow:

Root
→ Intro
→ Paths
→ Understand the Environment
→ Crystal Seat encounter
→ About Measures Registry with Codexstone Seal first
→ unDrifted
→ Connect role call

### 8. No Design Expansion

Do not redesign surfaces during runtime rebuild.

Do not add new copy.

Do not add new public claims.

Do not change public labels.

Only rebuild runtime authority structure.

### 9. Parity and Cutover

Run replacement runtime in parallel until parity is proven.

Cutover only after:

- assess flow validates
- understand flow validates
- held-state enforcement validates
- no ghost-live surfaces remain
- build passes
- OAR1 documents parity

After cutover:

old monolith remains deprecated_reference_only.


## RUNTIME CONSTRAINTS REQUIRED FOR REBUILD

The replacement runtime must be built from these constraints.

### 1. Registry Resolver Required

No surface may render without a resolved registry record.

Resolver must return:

- registry record
- is_active state
- release_state
- encounter definition
- approved content contract
- media mappings
- transition nodes

### 2. Release Gate Required

A surface may render live only when:

- registry record exists
- is_active = true
- release_state permits rendering
- required encounter definition exists
- required content contract exists where needed

If not valid:

render governed held state.

### 3. Transition Resolver Required

No hardcoded next-surface navigation.

All transitions must resolve through:

- registry transition node
- target registry standing
- target release state
- chamber transition allowance

If target is held, inactive, missing, or unknown:

do not navigate live.

### 4. Chamber Router Required

Runtime shell routes only to chamber runtime.

Allowed chamber runtimes:

- ObsidianChamberRuntime
- CrystalSeatRuntime
- LapisChamberRuntime
- MarbleChamberRuntime

### 5. Held State Contract Required

Held state must be public-safe.

Held state may not expose:

- SEAT
- c3 Key
- certification
- conversion
- DAO
- protected internal terminology

### 6. No Monolith Extraction

Do not extract logic from the monolith.

Do not copy monolith behavior unless revalidated against registry standing.

The monolith is deprecated_reference_only.

### 7. Runtime Cannot Infer Authority

Renderer may not decide what should be visible.

Renderer may only render what registry permits.

## CLAUDE ROLE

Claude acts as Measures Registry implementation executor.

Claude may:

- build new runtime files
- create resolver modules
- create release gate
- create transition resolver
- create chamber runtime shells
- wire existing renderers only after revalidation
- validate parity
- report blockers

Claude may not:

- extract monolith logic as authority
- copy hardcoded transitions
- preserve ghost-live behavior
- bypass registry release state
- invent missing standing
- redesign public surfaces
- activate DB records to satisfy runtime

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- monolith behavior is copied without registry validation
- a chamber runtime owns authority
- shell owns copy or transition truth
- release gate can be bypassed
- a surface renders while held/inactive
- old runtime remains active after cutover
- parity cannot be proven from registry standing

## VALIDATION

Success is achieved when:

- replacement runtime exists beside monolith
- monolith is not used as authority
- shell is small and registry-gated
- chamber runtimes are separated
- release gate blocks held/inactive surfaces
- transition resolver removes hardcoded movement
- public assess flow validates
- public understand flow validates
- ghost-live surfaces are blocked
- build passes
- OAR1 reports exact files created, files bypassed, parity status, blockers, and cutover state

Expected OAR1:

docs/oar/measures_registry/oar1_rebuild_measures_registry_runtime_without_monolith_extraction_v1.meta.md

