---
title: frontend_seam_detection_rule
doc_type: process_rule
circuit: c3
---

# Frontend Seam Detection Rule

## Purpose

Stop drift from layering on top of a wrong render.

## Rule

When a render looks off:

1. stop
2. identify the exact mismatch
3. correct the seam at source, contract, or file role
4. continue only after distinction is restored

## Failure Pattern Observed

Wrong output looked usable enough to continue, but the rendered truth was not correct.

## Correction

Do not expand on a broken seam.

## Result

Drift is corrected before further build work proceeds.
