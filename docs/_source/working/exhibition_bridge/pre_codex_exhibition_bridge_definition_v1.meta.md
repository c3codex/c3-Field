---
document_type: process_definition
authority_level: working
document_scope: pre_codex_exhibition
title: Pre-Codex Exhibition Bridge — Definition
status: draft
version: v1
operator: op044
date: 2026-04-10
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - pre-codex
  - exhibition
  - bridge
  - temporary
  - measures-of-inanna
  - website-live
---

# Pre-Codex Exhibition Bridge — Definition

## Purpose

Define a temporary bridge surface for first contributed exhibition materials so the website can go live without falsely seating them as final Codex or final SRC2 architecture.

## Standing

This bridge is temporary-use only.

It is a workaround layer for live exhibition render while:

- conversion continues
- final SRC2 schema continues
- UI continues

It is not:

- the final SRC2 database model
- the final Codex contribution seat
- the final Measures registry identity
- the final long-term contribution engine

## Core Rule

No final SRC2 schema naming should leak into this temporary bridge.

This bridge preserves only what is needed now:

- contributor continuity
- upload continuity
- intended exhibition placement
- bounded render standing
- later retirement path

## Proposed Temporary Bridge Objects

### exhibition_bridge_contribution

A temporary contribution record for exhibition use only.

It preserves:

- who contributed
- which continuity line carries it
- what exhibition surface it is intended for
- whether it may render live now
- whether it is still awaiting later permanent seating

### exhibition_bridge_asset

The uploaded file/body side of the same temporary contribution.

It preserves:

- separate-bucket pathing
- file metadata
- render role
- render order
- render readiness

## Critical Rule

This bridge may support live render, but it does not create final authority.

Registry and final Codex identity remain separate and later.

## Retirement Rule

This bridge must be designed for removal or migration once final contribution architecture is seated.

## Closing

The exhibition bridge exists so the live site can breathe now without hardening temporary workaround structure into permanent system language.
