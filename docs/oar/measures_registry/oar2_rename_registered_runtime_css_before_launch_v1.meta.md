---
document_type: oar2
authority_level: working
document_scope: launch_hygiene
title: OAR2 - Rename Registered Runtime CSS Before Launch
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Rename Registered Runtime CSS Before Launch

## GOVERNANCE STANDING

This OAR governs launch terminology hygiene.

It does not govern the operator.

Purpose is to remove stale runtime terminology from the registered CSS filename before public launch.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

Recent legal route work referenced:

src/measures_registry/registered_runtime/styles/registry.runtime.css

The term runtime is stale in the current architecture.

FREE has replaced inferred runtime.

Public launch source naming should avoid preserving stale architecture language where safe to rename.

## REQUIRED ACTIONS

Rename:

src/measures_registry/registered_runtime/styles/registry.runtime.css

to:

src/measures_registry/registered_runtime/styles/registry.encounter.css

Update all imports and references.

Do not change CSS contents except import path/name updates if required.

Do not change route behavior.

Do not change renderer behavior.

Do not change DB.

## VALIDATION

Return OAR1 evidence showing:

1. registry.runtime.css no longer exists.
2. registry.encounter.css exists.
3. All imports updated.
4. No CSS rules changed except filename/reference.
5. Build passes.
6. No routes changed.
7. No DB mutation.
8. No renderer logic changed.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- styling is changed beyond rename hygiene
- route behavior changes
- renderer logic changes
- DB is mutated
- old runtime filename remains referenced
- operator is governed instead of the work body

## CLOSE

Rename stale runtime CSS file.

Preserve behavior.

Nothing is invented.
