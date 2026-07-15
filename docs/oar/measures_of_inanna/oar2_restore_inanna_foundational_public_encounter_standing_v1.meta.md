---
document_type: oar2
authority_level: execution_authority
document_scope: measures_of_inanna_foundational_runtime_restoration
title: OAR2 — Restore Inanna Foundational Public Encounter Standing
status: approved
version: v1
operator: op044
system: measures_of_inanna
branch: measures_of_inanna
date: 2026-07-14
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-of-inanna
  - foundational-restoration
  - registry
  - release-standing
  - rls
  - encounter-resolution
  - public-runtime
source_alignment:
  - Seed Concordance
  - System Concordance
  - The 7 Constraints Agreements and Resolutions
  - DB to src Manifest — Measures of Inanna Exhibition
  - Session 13 DB Preflight Verification Checklist
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Restore Inanna Foundational Public Encounter Standing

## OBJECTIVE

Restore the already-established foundational public traversal of the Measures of Inanna installation after a shared `measures_registry` public-read policy change made required parent registry rows invisible to the anonymous encounter resolver.

This is a bounded restoration.

It does not authorize reconstruction, terminology normalization, full exhibition governance migration, renderer redesign, media replacement, or new encounter invention.

## OBSERVED

The public Measures of Inanna installation currently behaves as follows:

1. `epigraph` resolves and renders.
2. Epigraph advances toward `crystal_temple_home`.
3. The runtime then displays `Encounter could not be resolved.`
4. The active encounter definition `crystal_temple_home_view` still exists.
5. Its parent registry identity is not visible through the anonymous runtime.
6. The resolver therefore cannot establish the required registry-to-encounter relation.

The current public policy on `public.measures_registry` permits anonymous reads only when:

    is_active = true
    AND release_state IN ('released', 'active')

The previous policy permitted:

    is_active = true

Historical Inanna registry rows use earlier release vocabulary, including `open`.

The shared policy change therefore altered Inanna runtime behavior even though no named Measures of Inanna policy was directly modified.

Public read inspection also found:

- 104 active encounter definitions;
- 47 active encounters with anonymously visible parent registry rows;
- 57 active encounters with parent registry rows hidden from the anonymous resolver.

Confirmed affected Inanna-related encounter definitions include:

- `crystal_temple_home_view`
- `temple_antechamber_view`
- `temple_harrumuk_passage_view`
- gate encounters
- epithet encounters
- ME encounters
- passage encounters

This establishes a shared-policy collateral effect rather than an isolated frontend failure.

## FOUNDATIONAL AUTHORITY

The established installation spine is:

    epigraph
      → crystal_temple_home
        ↔ inanna_seat
      → temple_antechamber
        → temple_harrumuk_passage
          → phase_map
            → kumurrah_passage
              → gate entry
              → epithet entry
              → codexstone entry

The database remains authority.

The frontend must continue to resolve this traversal from:

- `measures_registry`
- `measures_release_state` where applicable
- `measures_encounter_def`
- `measures_transition_rule`
- current governed media mappings

No frontend fallback, hardcoded route repair, or encounter-key alias may substitute for restoration of the parent registry standing.

## ALIGNED

Measures of Inanna remains an autonomous branch.

Measures Registry does not acquire authority over Inanna through this repair.

The shared Codex may hold both branches, but one branch’s policy work may not silently disable another branch’s established public runtime.

The correction must preserve:

1. Codex as database authority.
2. Field as structural placement.
3. Measures as registry ordering and logic.
4. Chazz and the runtime as renderers of seated state.
5. Branch autonomy.
6. Append-only OAR evidence.
7. Fail-closed behavior for genuinely missing authority.
8. Existing held and deprecated standings.
9. Existing encounter, media, and transition identities.
10. Separation between emergency restoration and later governance normalization.

## ROUTED

### 1. Perform an exact live preflight

Inspect the live database with service-role authority.

For every active `measures_encounter_def` row whose parent `measures_registry` row is not anonymously visible, return:

- registry ID;
- registry key;
- encounter ID;
- encounter key;
- surface type;
- registry `is_active`;
- registry `release_state`;
- registry `access_state`;
- encounter `is_active`;
- chamber or branch metadata;
- current transition participation;
- evidence of prior public traversal;
- proposed disposition.

Do not infer a registry key from the encounter key when the parent record can be read directly.

### 2. Classify affected rows

Classify every affected parent registry row as exactly one of:

- foundational_public_inanna
- established_public_inanna
- intentionally_held
- deprecated_or_stale
- non_inanna_other_branch
- unresolved_requires_operator_review

Classification must use existing Codex state, transition relations, source OAR evidence, and established installation structure.

Active encounter standing alone does not authorize public release.

### 3. Restore the foundational Inanna spine

For registry rows proven to be part of the established foundational public Inanna traversal:

- preserve the existing registry key;
- preserve the existing registry ID;
- preserve the existing encounter definition;
- preserve branch and chamber placement;
- preserve media mappings;
- preserve transition rules;
- preserve access standing unless it conflicts with public traversal;
- normalize only the release standing required for compatibility with the current public-read policy.

Use an allowed public release value already recognized by the shared policy:

- `released`, or
- `active`

Select the value consistent with existing Inanna release semantics and adjacent valid Inanna rows.

Do not select between them arbitrarily.

If the correct value cannot be established from existing state, stop and route the row to operator review.

### 4. Minimum required restoration set

The restoration must verify and, where existing authority supports it, restore the registry parents required for:

- `epigraph`
- `crystal_temple_home`
- `inanna_seat`
- `temple_antechamber`
- `temple_harrumuk_passage`
- `phase_map`
- `kumurrah_passage`
- the first valid gate entry
- the first valid epithet entry
- the first valid ME or exhibition entry required by the established traversal
- `codexstone` entry where already publicly seated

Use exact live registry identities.

Do not invent missing rows or substitute deprecated identities.

### 5. Preserve held and deprecated rows

Do not change rows classified as:

- intentionally_held
- deprecated_or_stale
- non_inanna_other_branch
- unresolved_requires_operator_review

Do not reactivate deprecated terms or surfaces, including known stale Measures Registry identities, merely because they appear among the 57 hidden parents.

This OAR2 does not authorize global conversion of every `open`, `held`, or inactive registry row.

### 6. Do not broaden the shared public policy

Do not restore Inanna by reverting the shared policy to unrestricted active-row visibility.

Do not add an anonymous policy that exposes all `is_active = true` registry rows.

Do not modify protected c3 Field policies.

Do not modify unrelated Measures Registry release standing.

If the present schema cannot express branch-safe release standing without broad exposure, stop after preflight and return the schema gap for operator review.

### 7. Validate registry-to-encounter pairing

For each restored foundational unit, verify:

- parent registry row is anonymously readable;
- encounter definition is anonymously readable;
- encounter `registry_id` matches the restored parent;
- requested registry key resolves to the intended encounter key;
- surface type remains correct;
- transition targets resolve to visible parent registry rows;
- no duplicate active encounter definition competes for resolution;
- no fallback identity is required.

### 8. Validate governed media without changing it

For each restored foundational unit, verify existing media resolution through:

- `measures_surface_media_map`;
- `codex_media_asset`;
- current storage provider;
- current public URL or governed runtime URL.

Record retrieval status.

Do not replace, upload, remap, or invent media under this OAR2.

A media failure must be reported separately from encounter resolution.

### 9. Validate the deployed public runtime

After the database correction, verify both:

- `https://measuresofinanna.com`
- `https://www.measuresofinanna.com`

Required browser/runtime checks:

1. Epigraph loads.
2. Epigraph advances without an encounter-resolution error.
3. Crystal Temple Home renders.
4. Inanna Seat route resolves where currently seated.
5. Antechamber route resolves.
6. Harrumuk passage resolves.
7. Phase Map resolves.
8. Kumurrah return behavior resolves.
9. The first valid gate path resolves.
10. The first valid epithet path resolves.
11. No restored surface depends upon a hardcoded frontend fallback.
12. Browser console contains no registry or encounter query failure for the verified path.

### 10. Produce the larger governance inventory separately

Record the complete 57-row classification as restoration evidence.

Do not normalize the entire exhibition under this OAR2.

Return a recommended next OAR2 for:

- Inanna branch registry governance;
- release/access vocabulary normalization;
- canonical registry-to-encounter pairing;
- passage and return-law verification;
- gate, epithet, ME, and Codexstone classification;
- orphan and deprecated-row disposition;
- complete exhibition traversal QA.

## EXECUTION CONSTRAINTS

The executor may:

- perform read-only live preflight;
- classify affected rows from existing authority;
- update release standing for verified foundational Inanna registry parents;
- perform anonymous readback;
- run browser/runtime verification;
- create execution evidence;
- write the required OAR1.

The executor may not:

- change frontend source;
- add hardcoded routing;
- invent registry or encounter identities;
- broaden anonymous table access;
- modify unrelated branches;
- release held content without evidence;
- delete rows;
- rename keys;
- rewrite transition logic;
- alter media mappings;
- claim full Inanna governance completion;
- claim Registry Standing, SEAL standing, or c3 Key assignment.

All database mutations must be transactional and exactly enumerated in the OAR1.

If preflight contradicts this OAR2, stop before mutation and report the contradiction.

## VALIDATION

This OAR2 resolves successfully only when:

- the exact policy-induced failure is recorded;
- affected active encounters with hidden parents are inventoried;
- foundational Inanna rows are distinguished from held, stale, and unrelated rows;
- only verified foundational parent registry standing is corrected;
- `crystal_temple_home` resolves from its canonical registry key;
- the foundational public traversal proceeds beyond the epigraph;
- anonymous registry and encounter readback succeeds;
- governed media resolution is checked separately;
- deployed browser verification succeeds;
- no frontend fallback is introduced;
- no broad public policy is restored;
- no unrelated branch state changes;
- OAR1 records exact before/after evidence.

## REQUIRED EVIDENCE

Create evidence sufficient to show:

- policy predicate in effect;
- before-state registry rows;
- before-state encounter rows;
- 57-row affected-parent classification;
- exact rows mutated;
- before and after release/access standing;
- anonymous readback after mutation;
- registry-to-encounter resolution results;
- transition-target resolution results;
- media retrieval results;
- deployed traversal QA;
- browser console result;
- git diff;
- mutation count.

Do not expose service-role credentials or full public keys in evidence.

## EXPECTED OAR1

Path:

docs/oar/measures_of_inanna/oar1_restore_inanna_foundational_public_encounter_standing_v1.meta.md

The OAR1 must report one final standing:

- completed_verified
- completed_with_held_gaps
- blocked_before_mutation
- failed_rolled_back

No OAR1 means the restoration is not complete.

## CLOSEOUT

The restoration closes only after:

1. OAR2 execution;
2. live database readback;
3. anonymous resolver verification;
4. deployed traversal QA;
5. OAR1 creation;
6. expected-file confirmation;
7. repository capture.

Restore the established temple path first.

Govern the full installation next.
