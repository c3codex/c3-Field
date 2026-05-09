---
document_type: oar2
authority_level: working
document_scope: process_transfer_surface
title: OAR2 — Update PowerShell Transfer Surface Rule
status: proposed
version: v1
operator: op044
system: process
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - process
  - powershell
  - transfer-surface
  - validation
  - split-ps
  - notchazz
source_alignment:
  - Thread-to-Transfer Validation Rule
  - Doc-Set Closeout Rule
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Update PowerShell Transfer Surface Rule

## OBSERVED

Recurring transfer instability has occurred during PowerShell transfer delivery.

Observed failure pattern:

- large PowerShell payloads split unexpectedly
- nested markdown code fences destabilize transfer surfaces
- malformed here-string handling causes parser errors
- payload interruption creates invalid transfer state
- operator receives incomplete or corrupted write surfaces

This is now a repeated process condition rather than an isolated event.

The current issue is recognized as process drift affecting transfer reliability.

## ALIGNED

Thread remains the validation surface.

Transfer surface remains the first file-forming action.

This update preserves:

1. thread-first validation
2. operator confirmation before transfer
3. transfer-after-confirm discipline

The correction applies specifically to PowerShell transfer formation.

Transfer surfaces must optimize for parser stability, deterministic write behavior, segmented recovery, readable validation, and predictable file output.

Authority order remains: Codex → Field → Measures → Chazz

## ROUTED

### 1. Nested markdown fences prohibited inside transfer payloads

PowerShell transfer payloads may not contain nested triple-backtick markdown fences.

### 2. Transfer-safe formatting required

When code examples are required inside transfer payloads, use indented code blocks, plain text examples, escaped formatting, segmented append blocks, or external payload variables.

Markdown fences may remain in thread review surfaces only.

### 3. Segmented transfer rule

Large transfer bodies must support segmented-safe writing.

Required pattern: Set-Content for first block only; Add-Content for continuation blocks.

Single oversized payloads should be avoided where instability risk exists.

### 4. Post-write validation required

Transfer surfaces must include file verification guidance.

Minimum validation: Get-Item path and line count check.

Validation confirms file exists, write completed, and payload did not truncate unexpectedly.

### 5. Expected file confirmation required

Transfer guidance must include expected file path, expected filename, and confirmation prompt.

Operator confirms against expected file list rather than visual assumption.

### 6. Recovery rule

If PowerShell transfer corruption occurs, stop continuation, do not append onto corrupted payload, regenerate clean transfer surface, and validate before proceeding.

### 7. Scope boundary

This rule governs PowerShell transfer formation, transfer payload structure, and parser-safe transfer delivery.

This rule does not replace thread validation discipline, OAR lifecycle, doc closeout requirements, or seeded reference controls.

## CODY ROLE

Cody may follow segmented-safe transfer patterns, use Set-Content/Add-Content sequencing, simplify payload formatting for parser stability, and validate file write success.

Cody may not bypass validation sequence, restore nested markdown fences inside transfer payloads, append onto corrupted transfer payloads, or treat partial transfer as valid completion.

## VALIDATION

This OAR2 resolves successfully when transfer surfaces no longer split from nested markdown fencing, parser stability improves, segmented-safe transfer pattern is adopted, post-write validation becomes standard, and recurring split-PS drift is reduced or eliminated.

## EXPECTED OAR1

docs/oar/process/oar1_update_powershell_transfer_surface_rule_v1.meta.md

## CLOSE

Thread first.
Validation second.
Transfer third.
Verification fourth.

Reliable transfer is part of process coherence.
