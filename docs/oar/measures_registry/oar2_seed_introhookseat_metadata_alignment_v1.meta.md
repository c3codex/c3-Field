---
document_type: oar2
authority_level: working
document_scope: content_seeding
title: OAR2 — Seed IntroHookSeat Metadata Alignment
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_database_term_sweep_before_native_architecture_normalization_v1.meta.md
---

# OAR2 — Seed IntroHookSeat Metadata Alignment

## GOVERNANCE STANDING

Governance belongs to the body.
Agency belongs to the individual.
Integrity belongs to both.

This OAR governs the encounter content body.
It does not govern the operator.

Purpose is to align ai_isnt_broken_intro metadata with the active IntroHookSeat renderer contract.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

OAR1 database sweep found:

- ai_isnt_broken_intro is active and released.
- ai_isnt_broken_intro has rich metadata in old format.
- IntroHookSeat expects encounterDef.metadata.intro_copy.
- intro_copy is absent.
- Current state can cause renderer gap or fallback behavior.

## ROUTED

Seed renderer-safe intro_copy metadata into existing ai_isnt_broken_intro encounter_def.

Do not change registry standing.
Do not change routes.
Do not change renderer code.
Do not alter media mappings.
Do not seed unrelated content.

## REQUIRED MUTATION

Update measures_encounter_def.metadata for encounter_key ai_isnt_broken_intro.

Add intro_copy:

headline: AI Isn't Broken. Systems Are.

subheadline: Optimization cannot occur in environments that lack Governed System Integrity.

body: Measures Registry helps organizations identify structural drift, understand system integrity, and prepare for optimized AI deployment.

cta: Assess the Environment

supporting_copy: The goal is not more tools. The goal is governable environments.

Preserve existing metadata keys.

## VALIDATION

Return OAR1 evidence showing:

1. ai_isnt_broken_intro remains active.
2. ai_isnt_broken_intro remains released.
3. metadata.intro_copy.headline exists.
4. metadata.intro_copy.subheadline exists.
5. metadata.intro_copy.body exists.
6. metadata.intro_copy.cta exists.
7. metadata.intro_copy.supporting_copy exists.
8. Existing metadata keys were preserved.
9. No renderer code changed.
10. No routes changed.
11. FREE can render IntroHookSeat without frontend inference.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- public copy is invented beyond this approved content
- existing metadata is overwritten instead of merged
- registry standing changes
- route behavior changes
- renderer logic changes
- FREE inference is added
- unrelated content is seeded
- operator is governed instead of the work body

## CLOSE

Seed only the missing renderer contract.

Preserve standing.

No inference.

Nothing is invented.
