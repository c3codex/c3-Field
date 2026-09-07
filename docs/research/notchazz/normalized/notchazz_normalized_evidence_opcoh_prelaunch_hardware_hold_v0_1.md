# NotChazz Normalized Evidence — OPCOH Prelaunch and Hardware Hold Family v0.1

**Standing:** historical research derivative; non-operative; not registered or activated  
**Primary incident window:** 2026-08-23 through 2026-08-24  
**Preservation rule:** original OAR2/OAR1 records, route receipts, hashes, executable/model identities, companion-script identities, runtime observations, flag keys, and historical standing remain unchanged in source custody.

## Scope

This derivative reconstructs the Operational Coherence Harness runtime/capability-check sequence in which separate preconditions were tested independently: runtime identity and basic executable viability, wrapper validity, source/route integrity, hardware memory fit, and model invocation authority.

The research significance is not whether the model produced useful output. In the preserved sequence, the more important result is that multiple non-model conditions were allowed to stop only the affected passage before model invocation.

## 1. Runtime-only technical check — runtime passes while model remains held

Primary source: `oar1_opcoh_llama_runtime_only_check_codex_010.meta.md`

Execution instance: `opcoh_llama_runtime_only_check_codex_010`

Final standing: `runtime_only_check_passed_model_still_held`

The preserved `llama-cli.exe` was executed exactly once with the sole argument `--version`, returned identifiable llama.cpp build/version information, exited successfully, and produced no child process, server, network activity, prompt, inference, model load, retry, cleanup, repository mutation, cloud mutation, or production action.

The runtime executable SHA-256 and preserved model SHA-256 both matched their expected identities.

### Historical contribution

A successful runtime check did **not** grant permission to cross into model loading or inference. The source explicitly states that no unused authority carried forward from predecessor executions and that the model remained held.

Normalized relation:

`runtime viability pass != model capability authority`.

This preserves state separation: one band of the system can pass while a higher-impact passage remains closed.

## 2. Prelaunch wrapper validation failure — stop before process construction

Primary source: `oar1_opcoh_qwen15_single_capability_smoke_codex_012_held_prelaunch_wrapper_validation_failed.meta.md`

Execution instance: `opcoh_qwen15_single_capability_smoke_codex_012`

Final standing: `held_prelaunch_wrapper_validation_failed`

The bounded PowerShell wrapper entered parse-continuation during construction before `System.Diagnostics.ProcessStartInfo` was completed for `llama-cli.exe`. The continuation was interrupted and, under the no-retry/no-substitution boundary, no second wrapper construction or model launch was attempted.

Recorded counts included:

- process start count: `0`
- model invocation count: `0`
- prompt count: `0`
- generation count: `0`
- retry/fallback count: `0`
- experimental invocation count: `0`
- paid API count: `0`
- production/cloud/repository mutation count: `0`

NotChazz flag `NC-OPCOH-094` was raised for host-compatible wrapper/argument validation failure; downstream runtime/model/output flags remained not raised because those passages were never reached.

### Historical contribution

The failure was located precisely at the wrapper layer. The result was not allowed to become a runtime failure, model failure, or experimental failure by inference.

Normalized relation:

`wrapper qualification failure -> hold wrapper-dependent passage; do not manufacture downstream evidence`.

## 3. Pre-hashed companion script — wrapper repaired, hardware gate holds

Primary source: `oar1_opcoh_qwen15_single_capability_smoke_codex_013.meta.md`

Execution instance: `opcoh_qwen15_single_capability_smoke_codex_013`

Final standing: `held_hardware_preflight_not_met`

The exact companion PowerShell script was acquired through authenticated Drive retrieval, written once to the authorized temp location, and verified at SHA-256 `a150e0929d280f73e8e9483ec81f8dc13b507c31db100432ae753b3e0e99876e`. The source OAR2 SHA-256 also matched its route receipt.

The script executed exactly once. It verified:

- runtime exists and hash matches;
- model exists and hash matches;
- runtime DLL inventory is present;
- no existing llama process is active;
- no network retrieval occurs;
- wrapper stdout is parseable;
- companion identity/path/hash remain exact.

The hardware memory gate then failed because minimum free memory was `2.9044 GiB`, below the configured absolute floor of `3.00 GiB`.

NotChazz flag `NC-OPCOH-106` was raised for the corrected hardware memory gate. No model process start occurred. No prompt or generation occurred. All downstream flags requiring model execution remained not raised.

### Historical contribution

This incident separates **runtime readiness** and **wrapper correctness** from **hardware fit** and from **model capability**. The system passed all earlier qualifying relations and held only at the hardware gate.

Normalized relation:

`source identity pass + route pass + wrapper pass + runtime identity pass + model artifact identity pass + process-conflict pass + hardware fit fail -> hold before model invocation`.

## 4. False-continuity prevention across execution layers

Across the sequence, the preserved standing progression is not:

`failure -> try something else until it runs`.

It is:

`qualify one relation -> preserve result -> stop at first unmet condition -> require new authority for a corrected next passage`.

The sequence therefore prevents several forms of false continuity:

- runtime success being treated as model capability;
- wrapper failure being treated as runtime/model failure;
- hardware insufficiency being treated as model incapability;
- a prior route or execution authorizing a later retry;
- successful preflight being treated as experimental authorization.

## 5. Selective-pass / hold significance

This family provides unusually concrete evidence of selective progression.

In execution 010, the runtime-only passage passed while model access remained held.

In execution 012, source and route identity were sufficient to begin wrapper work, but wrapper validation held before process launch.

In execution 013, source, route, companion, runtime, model-artifact, DLL, and process-conflict checks all passed. Only the hardware-memory relation failed, so only the model-start passage remained held.

The unaffected checks did not need to be declared failures simply because one later gate failed.

Normalized research relation:

`pass what is qualified; hold what is not; preserve each standing distinctly; never let downstream state imply itself.`

This is directly compatible with the selective-filter / notch research correspondence in which an affected band is attenuated while other frequencies remain able to pass.

## 6. Current-model interoperability

This family maps naturally to current environment-scoped NotChazz fields:

- environment/system -> OPCOH local research runtime;
- object -> OAR2, route receipt, runtime binary, model artifact, companion script;
- operation -> wrapper construction, runtime version check, hardware preflight, model start;
- passage -> prelaunch, launch, prompt/inference, experiment;
- standing -> pass / held_prelaunch / held_hardware;
- source evidence -> SHA-256, counts, process observations, memory samples;
- response -> hold affected passage and require new Operator-confirmed authority for any next execution.

NotChazz is not the source of model authority or experimental permission. It records and enforces the mismatch between an observed condition and the conditions required to continue.

## Research significance

This execution family is a strong modern specimen because the system intelligence is no longer dependent on subjective semantic interpretation alone. Several conditions are mechanically testable:

- exact SHA-256 identity;
- process count;
- invocation count;
- argument count;
- memory floor;
- runtime/model presence;
- DLL inventory;
- network/process residue;
- mutation count.

Operational coherence here is evidenced by refusal to let one kind of readiness stand in for another.

## Operator-resolution boundary

No Operator resolution is required to preserve this family as historical Observatory evidence.

No claim is made that the source thresholds, flag IDs, scripts, runtime artifacts, or capability-check rules should become current production NotChazz profiles. Any current operational adoption requires separate authority and environment-specific registration.

## Research standing

`opcoh_prelaunch_hardware_hold_family_reconstructed_normalized_derivative_nonoperative`
