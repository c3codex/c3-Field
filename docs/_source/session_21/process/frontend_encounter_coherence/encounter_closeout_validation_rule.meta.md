---
title: encounter_closeout_validation_rule
doc_type: process_rule
circuit: c3
---

# Encounter Closeout Validation Rule

## Purpose

Require bounded validation before forward motion after encounter-side changes.

## Sequence

1. render verified against intended payload
2. payload distinction confirmed
3. no fallback substitution present
4. file check confirm
5. git commit
6. continuation permission

## Validation Prompt

Operator confirms against:
- expected file names
- found file names
- correct folder
- no naming drift

## Result

Encounter work closes cleanly before the next active step begins.
