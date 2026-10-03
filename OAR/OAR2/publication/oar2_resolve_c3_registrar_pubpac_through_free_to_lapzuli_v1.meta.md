---
document_type: oar2
authority_level: working
document_scope: c3_registrar_pubpac_free_lapzuli_projection
title: OAR2 - Resolve Registrar PubPAC Through FREE to Lapzuli
status: proposed
version: v1
operator: op044
system: c3_field
executor: FREE
publication_authority: c3_registrar
publication_surface: c3 Registrar - Field Reporter
initiative: 47pct
desk_key: 47pct_desk
pubpac_key: pubpac_47pct_mapped_measured_cost_claim_v1
registrar_registration_key: c3reg_pub_47pct_mm_cost_claim_v1
target_surface: /relational-operations/lapzuli
external_effects_authorized: false
return_evidence_required: true
---

# OAR2 — Resolve Registrar PubPAC Through FREE to Lapzuli

## Role call
Chazz: systems / OAR2 formation.
Executor: FREE.
Registrar: c3 Field publication authority.
PubPAC: bounded publication custody.
Lapzuli: distribution execution surface; not publication authority.

## Observed state
The Cost of a Claim is approved under c3 Registrar - Field Reporter, 4.7% Desk, using Mapped & Measured as editorial voice. Its PubPAC is formed and registered. Candidate Lapzuli routes exist for c3 Facebook Page, c3 Instagram, and Bluesky.

Runtime evidence shows the Lapzuli portal still surfaces the older 4.7% Week 1 Soft Launch assets. The new Registrar-native publication does not surface because the runtime read path is still centered on measures_publication_distribution_asset. Route existence alone is insufficient.

## Required resolution
FREE MUST call/resolve the registered PubPAC and project its bounded, authorized distribution work onto the c3Ops Lapzuli relational-operations surface.

Canonical passage:

c3 Registrar - Field Reporter
-> 4.7% Desk
-> registered PubPAC
-> FREE resolve/call
-> bounded Lapzuli work projection
-> /relational-operations/lapzuli
-> authorized executor/channel
-> return evidence

## Invariants
1. Do not create a Measures Registry publication or distribution asset merely to make a c3 Field-native publication visible.
2. Measures Registry/unDrifted remains a separate MR-native publication path that may project into c3 Field.
3. FREE resolves registered custody; it does not invent article content, standing, destinations, derivatives, or authority.
4. Lapzuli consumes resolved work; it does not determine publication standing.
5. Preserve originating identity (4.7%), desk, editorial voice, PubPAC provenance, and Registrar authority in the projection.
6. Exact approved article body remains held until durably persisted; FREE MUST NOT reconstruct it from summaries.
7. Quantified/evidentiary content remains bound to evidence_pac_47pct_v1 and source/citation gates.
8. External publication effects remain 0 during this OAR2. This OAR2 authorizes surface projection/readback only, not dispatch.
9. Existing historical Measures/Lapzuli records must not be destructively rewritten.

## Implementation requirements
- Extend the FREE/c3Ops Lapzuli read path to resolve Registrar registrations with distribution_standing=available_to_lapzuli through their registered PubPAC.
- Produce the normalized callable work shape expected by the Lapzuli portal without requiring measures_publication_distribution_asset as the universal source.
- Preserve existing Measures distribution-asset ingestion as one valid source for MR-native/historical work.
- Resolve PubPAC members, Registrar registration, desk, editorial voice, candidate routes, channel/executor standing, canonical URL, media references, and evidence-return requirement from registered state.
- Surface The Cost of a Claim as a distinct Lapzuli work item under c3 Registrar - Field Reporter / 4.7% Desk.
- Do not mark the item published, accepted, or externally executed merely because it surfaces.
- Add regression coverage proving both Registrar-native PubPAC work and existing Measures-native work can coexist on the Lapzuli surface.

## Acceptance evidence
PASS requires:
- GET/readback for the Lapzuli view includes The Cost of a Claim sourced through Registrar + PubPAC.
- Returned object identifies c3_registrar, c3 Registrar - Field Reporter, 47pct_desk, mapped_and_measured, and pubpac_47pct_mapped_measured_cost_claim_v1.
- Existing Week 1 historical work remains readable.
- No new Measures publication/distribution row is required for the Registrar-native article.
- external publication effects = 0.
- tests/build pass.
- OAR1 return records changed files/commit, runtime readback, and any hold.

## Hold conditions
HOLD if FREE cannot resolve the PubPAC without inventing missing custody/content; if the runtime requires an unauthorized Measures record; if destination/executor standing is unavailable; or if implementation would dispatch externally.

## Return
Return OAR1 to Registrar/operator with implementation evidence.