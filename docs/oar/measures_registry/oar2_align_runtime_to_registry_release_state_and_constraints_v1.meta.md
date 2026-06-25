---
document_type: oar2
authority_level: working
document_scope: runtime_registry_constraints
title: OAR2 — Align Runtime to Registry Release State and Constraints
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Align Runtime to Registry Release State and Constraints

## OBSERVED

Authority audit found runtime surfaces rendering even when registry records are inactive or held.

Examples:

- structure_passage registry entry is held/inactive but runtime renders it
- about_measures_registry registry entry is held/inactive but runtime renders it

This creates ghost-live surfaces.

Runtime must align to registry standing.

## ALIGNED

Registry governs runtime visibility.

Runtime may not render a surface as live unless registry standing permits it.

DB-first does not mean every DB value is valid authority.

Executable runtime requires:

- registry record exists
- is_active = true
- release_state permits rendering
- encounter definition exists where required
- approved content contract exists where required
- media mapping resolves where required
- transition target is registered and permitted
- no working residue governs execution

If registry standing is held, inactive, missing, deprecated, or unknown:

render held state.

Do not continue as live.

## ROUTED

### 1. Runtime Release Gate

Implement a shared runtime guard for registered surfaces.

A surface may render live only when:

- registry_key resolves
- registry record is active
- release_state is released / active / published as appropriate
- required encounter_def exists
- required content contract exists when the renderer depends on it

Otherwise render governed held state.

### 2. Surface Registry Alignment

Audit and apply the guard to:

- structure_passage
- about_measures_registry
- map_integrity_governance_landing
- ai_operations_assessment_landing
- structural_drift_dispatches
- eval_passage
- measures_assessment
- obsidian_to_marble_passage_video

Do not activate registry records to match runtime.

Runtime must align to registry.

### 3. Transition Constraints

Before navigating to a next surface, confirm the target is allowed by registry standing.

If target is held/inactive/missing:

- do not navigate silently
- render held/unavailable state
- log/report in OAR1

### 4. Residue Constraints

Runtime must not execute from:

- working residue
- deprecated aliases
- migration artifacts
- unknown authority
- component-owned truth
- DB-only residue not approved for runtime

### 5. Held State Contract

Held state must be clear and public-safe.

Held state may say:

This surface is not currently available.

Held state may not expose:

- internal chamber terminology
- SEAT
- c3 Key
- certification
- conversion
- DAO
- private governance terms

### 6. No Design Rewrite

Do not redesign surfaces.

Do not change public copy except held-state copy required by the guard.

Do not add new public claims.

This OAR is runtime authority enforcement only.

## CLAUDE ROLE

Claude acts as Measures Registry implementation executor.

Claude may:

- inspect registry state
- inspect runtime gating
- implement shared guard
- repair renderer visibility
- repair transition constraints
- remove ghost-live behavior
- validate flow behavior
- report exact affected surfaces

Claude may not:

- activate DB records to satisfy runtime
- invent missing authority
- bypass release state
- redesign surfaces
- publish held content
- expose internal terms

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- runtime renders held/inactive surfaces as live
- next_surface bypasses release state
- registry record is missing but renderer still renders
- encounter_def is missing but renderer fabricates content
- deprecated alias remains executable
- DB-only residue influences runtime
- held state leaks internal language

## VALIDATION

Success is achieved when:

- runtime obeys registry release state
- held/inactive surfaces no longer render as live
- next_surface navigation checks target standing
- ghost-live surfaces are blocked
- public held state renders safely
- no DB record is activated merely to match runtime
- build passes
- OAR1 lists every surface affected and resulting status

Expected OAR1:

docs/oar/measures_registry/oar1_align_runtime_to_registry_release_state_and_constraints_v1.meta.md
