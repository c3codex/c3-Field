---
document_type: oar1
title: OAR1 — Landing Path Surface Restructure
version: v1
status: executed
system: measures_registry
surface: landing_path_surface
source_oar2: docs/oar/measures_registry/oar2_landing_path_surface_restructure_v1.meta.md
---

# OAR1 — landing_path_surface_restructure_v1

## Objective
Redistribute landing signal so entry functions as recognition, paths carry directional meaning, and About is reduced to institutional context.

## Actions
- Updated `landing_path_choice` with recognition-only content:
  - `AI isn't broken. Systems are.`
  - `Most AI failures aren't intelligence problems. They're system failures.`
  - compressed system signal
- Added renderer support for the compressed landing signal.
- Updated `understand_failure` with drift-based statements only.
- Updated `reserve_seat` / Build Coherence with:
  - `Integrity governance for AI-accelerated systems.`
  - `Register behavior.`
  - `Surface drift.`
  - `Govern system alignment.`
  - `Before automation outruns accountability.`
- Updated About content to retain only institutional context.
- Removed SaaS-style explanatory blocks from About:
  - `WHAT IT IS`
  - `WHAT IT DOES`
- Preserved routing keys and existing surface sequence:
  - epigraph → `landing_path_choice` → path selection

## Canonical Surface Key
`landing_path_choice` remains the canonical implementation key for the OAR2 `landing_path_surface` role. No alias key was introduced.

## Validation
```json
{
  "dbConnection": "active",
  "landingContainsOnlyRecognition": true,
  "landingCompressedSignal": [
    "Register behavior.",
    "Surface drift.",
    "Govern alignment."
  ],
  "understandFailureStatements": [
    "Outputs drift.\nResults change without cause.",
    "Decisions don't stabilize.\nEvery pass produces a new answer.",
    "Systems don't align.\nTools operate without shared structure.",
    "Scale increases noise.\nMore input, less resolution."
  ],
  "understandFailureAnchor": "This isn't an AI problem.\nIt's a system problem.",
  "buildCoherenceStatement": "Integrity governance for AI-accelerated systems.",
  "buildCoherenceLines": [
    "Register behavior.",
    "Surface drift.",
    "Govern system alignment."
  ],
  "aboutReducedToInstitutionalContext": true,
  "noSaasBlocks": true,
  "routingIntegrity": "epigraph -> landing_path_choice -> path selection",
  "build_registry": "passed"
}
```

## Files
- docs/oar/measures_registry/oar2_landing_path_surface_restructure_v1.meta.md
- docs/oar/measures_registry/oar1_landing_path_surface_restructure_v1.meta.md
- docs/oar/measures_registry/execute-landing-path-surface-restructure.cjs
- src/measures_registry/MeasuresRegistryRuntime.tsx
- src/index.css
