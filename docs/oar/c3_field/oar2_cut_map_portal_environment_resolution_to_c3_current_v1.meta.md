---
document_type: oar2
title: OAR2 — Cut MAP Portal Environment Resolution to c3 Current
status: routed_for_registrar_execution
version: v1
timestamp: 2026-08-08
operator: op044
system: c3_field
target_system: measures_registry
target_surface: /map-portal
registrar: cline
execution_instance_id: cut_map_portal_current_resolution_cline_001
branch: measures
source_authority: c3_current_and_operator_confirmed_environment_identity
return_destination: CanCom/review
decision_authority: op044
---

# OAR2 — Cut MAP Portal Environment Resolution to c3 Current

## Observed

1. `public.c3_environment` now contains the active canonical environment identity:
   - `env_key`: `env_measures_of_inanna`
   - `system_key`: `measures_of_inanna`
   - `standing`: `registered`
   - `is_canonical`: `true`
   - `is_active`: `true`

2. `public.c3_current_state` now resolves the governed present state for that environment as:
   - `resolution_standing`: `resolved_current_state`
   - `current_state_key`: `current_env_measures_of_inanna_v1`
   - `env_key`: `env_measures_of_inanna`
   - `state_version`: `1`
   - `standing`: `registered`

3. The Current state has three immutable evidence references:
   - `current_inanna_operations_map_v1`
   - `current_inanna_error_v2`
   - `current_inanna_seat_compact_v1`

4. The existing `/map-portal` FREE path is already routed through the governed encounter pipeline and previously returned an environmental hold because its admission logic treated `c3_src_environment_profile.env_key = held_missing_source_env_key` as the environmental identity source.

5. The Institutional Representative relation remains genuinely unresolved. The correct admission hold after this change is therefore still `held_missing_representative_relation`, not `held_missing_env_key`.

## Aligned Authority

The following distinctions are controlling for this execution:

- `c3_environment` establishes canonical environment identity.
- `c3 Current` resolves the environment's present governed standing and evidence lineage.
- `c3_src_environment_profile` may consume an `env_key` for SRC behavior but does not create canonical environment identity.
- FREE resolves governed state; it does not author environmental truth.
- `MapPortalSurface.tsx` is a renderer and may not independently determine environmental authority.
- New evidence does not itself advance c3 Current standing.
- This OAR2 does not authorize SEAT completion, Current Advance, MAP progression creation, Institutional Representative creation, SRC2 formation, commerce, deployment-state invention, or any unrelated architecture change.

## Routed Mutation

Registrar `cline` is authorized to perform one narrowly bounded source mutation for `/map-portal`.

### Required behavior

1. Locate only the existing FREE resolver/admission path used by `map_portal` and the existing `MapPortalSurface` render path.
2. Preserve the existing route sequence:

   `MeasuresRegistryOrchestrator → EncounterEntry → Registry/FREE resolver → ChamberRouter → MarbleChamberRenderer → MapPortalSurface`

3. Replace only the obsolete environmental-identity dependency that treats `c3_src_environment_profile.env_key = held_missing_source_env_key` as the authority for MAP Portal environment identity.
4. Resolve environment present standing through the existing c3 Current read surface using:

   `public.resolve_c3_current('env_measures_of_inanna')`

5. Require the resolver result to match:
   - `resolution_standing = resolved_current_state`
   - `current_state_key = current_env_measures_of_inanna_v1`
   - `env_key = env_measures_of_inanna`

6. Make the resolved Current result available to the FREE admission context needed by `/map-portal`, including its evidence-reference projection where already supported by the resolver.
7. Do not create a fake fallback if Current is missing or mismatched. Return or surface a governed hold from the FREE resolver instead.
8. Preserve `held_missing_representative_relation` exactly. Do not create, infer, or simulate an Institutional Representative.
9. Do not create MAP progression records. Existing absence of `measures_encounter_progress` remains evidence; this OAR2 does not convert it into completion.
10. Keep `MapPortalSurface.tsx` render-only for environmental standing. If it currently queries or decides environment authority directly, remove only that authority decision and consume the resolved FREE admission state instead.

## Prohibited

Do not:

- mutate `public.c3_environment`;
- mutate or advance `public.c3_current_state`;
- mutate `public.c3_current_evidence_ref`;
- alter the three Inanna MAP evidence assets;
- alter `c3_src_environment_profile` rows;
- create an Institutional Representative;
- create MAP progression/completion rows;
- change SEAT standing;
- change SRC1/SRC2/SRC3 architecture;
- perform broad CSS/runtime cleanup;
- rename FREE concepts;
- repair Git history or repository corruption;
- run `git fetch`, `git pull`, `git rebase`, `git reset`, broad `db push`, or unrelated migration work;
- deploy or publish unrelated surfaces.

If the local source does not contain the expected `/map-portal` FREE pipeline, stop with `held_expected_map_portal_free_pipeline_not_found` rather than reconstructing architecture.

## Verification

Registrar must verify all of the following after the bounded mutation:

1. `/map-portal` still enters the existing FREE route and reaches `MarbleChamberRenderer → MapPortalSurface`.
2. Environmental identity resolves as `env_measures_of_inanna`.
3. `resolve_c3_current('env_measures_of_inanna')` resolves `current_env_measures_of_inanna_v1` with `standing = registered`.
4. The three existing Current evidence references remain visible through the Current resolver projection.
5. The obsolete environmental hold `held_missing_env_key` is not produced solely from `c3_src_environment_profile.held_missing_source_env_key`.
6. Institutional Representative standing remains unresolved and overall admission remains honestly held as `held_missing_representative_relation`.
7. No MAP progression record was created.
8. No Current state was advanced.
9. No database mutation occurred under this OAR2.
10. The changed source scope is limited to files required for the resolver/admission cut and render-only handoff.

## Return Package

Return exactly to `G:\My Drive\CanCom\review`:

1. `oar1_cut_map_portal_current_resolution_cline_001.meta.md`
2. `map_portal_current_resolution_readback_cline_001.meta.md`
3. `map_portal_representative_hold_verification_cline_001.meta.md`
4. `changed_files_cut_map_portal_current_resolution_cline_001.txt`
5. `hashes_cut_map_portal_current_resolution_cline_001.sha256`

The OAR1 must state:

- exact files changed;
- exact resolver path used;
- exact Current readback observed;
- whether the environmental hold was removed;
- whether the representative hold was preserved;
- any held mismatch without workaround or architecture substitution.

## Success Standing

Success is:

`map_portal_environment_resolution_cut_to_c3_current_representative_hold_preserved`

A successful execution does not itself establish MAP completion or SEAT progression.
