---
document_type: schema_seat
authority_level: working
document_scope: measures_interoperability
title: c3 MAP — Measures Alignment Protocol
status: proposed
version: v1
operator: op044
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - c3-map
  - measures-alignment-protocol
  - institutional-assessment
  - measures-resolution-map
  - codex-seating
  - schema
  - interoperability
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Session Role — Measures Interoperability Session 2
---

# c3 MAP — Measures Alignment Protocol

## Native Name

**c3 MAP**  
**Measures Alignment Protocol**

## Public Function

c3 MAP is a c3 institutional assessment protocol that diagnoses current system standing, identifies operational drift, and maps the Measures resolutions required for governable AI operation.

## System Function

c3 MAP produces a **Measures Resolution Map**.

The Measures Resolution Map translates observed institutional standing into structured resolution requirements without treating the assessment itself as Codex authority.

## Native Placement

Codex → Field → Measures → Chazz

- Codex holds verified authority.
- Field structures the assessment schema.
- Measures registers assessment stages, resolution classes, access, and reveal.
- Chazz validates and routes the assessment output.

## Schema Seat

c3 MAP belongs in Field as a structured diagnostic protocol.

It does not define truth.

It structures the path by which observed system conditions can be:

1. gathered
2. classified
3. mapped
4. routed
5. validated
6. resolved
7. seated, where eligible

## Core Object

c3_map_assessment

## Output Object

measures_resolution_map

## Resolution Classes

c3 MAP may identify these resolution classes:

1. source_resolution — source authority needs clarification or seating.
2. schema_resolution — Field relation or structure needs correction.
3. registry_resolution — Measures registration, sequence, access, or reveal needs correction.
4. runtime_resolution — runtime behavior is misaligned with seated authority.
5. css_resolution — CSS/design layer is carrying architecture or hidden state.
6. contract_resolution — role, actor, AI, or execution contract is missing or drifted.
7. deprecation_resolution — obsolete or superseded surfaces must be removed, archived, or neutralized.
8. evidence_resolution — institutional proof chain lacks validation, OAR, file check, or commit evidence.
9. codex_seating_resolution — verified architecture is ready or required for Codex seating.

## Required Distinction

c3 MAP must preserve the distinction between:

- diagnosis and authority
- assessment and conversion
- recommendation and OAR route
- runtime expression and schema authority
- public audit output and protected system resolution

The tool cannot collapse assessment into recognition or runtime output into authority.

## Codex Seating Process Preservation

c3 MAP preserves Codex seating by requiring:

1. observed institutional state
2. source reference check
3. resolution classification
4. Measures Resolution Map
5. OAR2 route where action is needed
6. execution only through approved route
7. OAR1 closeout where execution occurs
8. validation evidence
9. file check and commit where files change
10. Codex seating only after verification

No c3 MAP result may be treated as Codex truth until verification and seating occur.

## Product Language

Public-facing:

**c3 MAP — Measures Alignment Protocol** is an institutional systems assessment that diagnoses current AI-operational standing, identifies drift, and maps the Measures resolutions required for governable AI environments.

System-facing:

c3 MAP structures observed institutional state into a Measures Resolution Map for review, routing, deprecation, contract seating, and Codex-aligned implementation.

## Initial Schema Shape

### c3_map_assessment

    create table if not exists public.c3_map_assessment (
      id uuid primary key default gen_random_uuid(),

      assessment_key text not null unique,
      institution_name text,
      institution_contact text,
      contact_email text,

      assessment_status text not null default 'draft',
      assessment_scope text not null default 'institutional_systems',

      observed_state jsonb not null default '{}'::jsonb,
      drift_findings jsonb not null default '[]'::jsonb,
      resolution_map jsonb not null default '{}'::jsonb,

      oar2_key text,
      oar1_key text,

      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

### c3_map_resolution

    create table if not exists public.c3_map_resolution (
      id uuid primary key default gen_random_uuid(),

      assessment_key text not null references public.c3_map_assessment(assessment_key),

      resolution_key text not null unique,
      resolution_class text not null,
      resolution_status text not null default 'identified',

      observed_condition text not null,
      required_resolution text not null,
      routed_action text,

      requires_oar2 boolean not null default true,
      oar2_key text,
      oar1_key text,

      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

## Guardrail

This is schema seating only.

No database execution yet.  
No migration yet.  
No runtime change yet.  
No CSS alignment yet.

Next valid move is to turn this into a bounded OAR2 after thread confirmation.

## Success Condition

c3 MAP is properly seated when:

- it exists as a Field/schema diagnostic protocol
- it produces a Measures Resolution Map
- it preserves Codex authority
- it routes action through OAR2
- it supports priced public assessment without exposing protected system logic
- it accelerates conversion without bypassing verification

## Close

c3 MAP diagnoses.
Measures resolves.
Codex seats only after verification.
