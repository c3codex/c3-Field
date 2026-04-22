---
title: contract_surface_query_rule
doc_type: process_rule
circuit: c1
---

# Contract Surface Query Rule

## Purpose

Keep frontend files from guessing structure.

## Rule

Encounter-side files read only from validated contract surfaces.

## Allowed

- EncounterResolution
- defined execution surfaces
- validated view surfaces

## Not Allowed

- ad hoc raw table stitching
- frontend-side schema guessing
- deep coupling to unstable table assumptions

## Failure Pattern Observed

Frontend behavior drifted because structure was inferred instead of contract-read.

## Correction

Route encounter reads through resolveEncounter and contract-defined payload surfaces.

## Result

Stable encounter-side reads and reduced drift.
