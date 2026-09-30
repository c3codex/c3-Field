---
document_type: oar2
authority_level: correction
document_scope: c2me_public_encounter_operator_surface_leak
title: OAR2 - C2ME Public Encounter Operator Surface Leak v1
status: confirmed_correction
version: v1
operator: op044
system: c3_field
optics_consumption: c3_oar_spine_runtime_coherence_optics
---

# OAR2 - C2ME Public Encounter Operator Surface Leak v1

## Primary finding

A participant-facing C2ME_env public encounter surfaced operator/system operations.

This is the system-level fracture.

The specific PAC approval and registration of Run Aground was a concrete consequence of the fracture, not the whole finding.

## Boundary that failed

Expected separation:

- participant My Env -> persisted CURRENT -> C2ME_env participant/public encounter
- operator My Env -> direct C3OPS link -> operator/system surface -> protected C2ME_env PAC governance encounter

Observed failure:

- the Million Dollar Mission C2 participant shell exposed a PAC ENCOUNTERS control
- the PAC governance endpoint accepted C2 passage plus PAC custody without independently requiring governed operator context
- therefore participant/public encounter context and operator/system operations were collapsed onto one surface

## Structural drift classification

- boundary: participant/public encounter vs operator/system operations
- role: participant context vs operator context
- authority: PAC custody was treated as sufficient where operator-system standing was also required
- environment: C2ME_env correctly hosted both encounter classes, but the renderer failed to preserve the distinction between them
- persistence: an approval and Registry registration trace was created before the boundary was corrected

## Concrete consequence

Run Aground WebPAC:
- was approved from the improperly surfaced participant-facing C2 placement
- was registered before the operator-system provenance requirement existed
- was later returned to private/held/unregistered
- preserves the superseded approval/registration as audit evidence only

## Correction requirements

1. Remove PAC governance controls from participant-facing MDM encounter.
2. Keep MDM as the primary participant encounter from qualifying My Envs.
3. Keep PAC governance in C2ME_env, but enter it only from an operator/system surface.
4. Make C3OPS the operator route into PAC governance.
5. Require governed operator context at the API boundary.
6. Require operator-system provenance in PAC approval records.
7. Require matching operator-system provenance at Registry registration.
8. Supersede any approval/registration created through the leaked participant surface.
9. Preserve the historical trace as evidence; do not erase it.
10. Seat this finding and resolution in the OAR spine so Runtime Coherence Optics can render the fracture and correction lineage.

## Optics interpretation

This event should appear as a correction lifecycle with:

- fracture: system operations surfaced inside public/participant C2 encounter
- evidence: Run Aground approval/registration trace
- hold: public registration authority invalid until operator-system reapproval
- correction: UI separation + API operator gate + DB provenance gate
- resolution: participant encounter and operator/system encounter become separately reachable and separately authorized

No new Optics truth source is authorized.
