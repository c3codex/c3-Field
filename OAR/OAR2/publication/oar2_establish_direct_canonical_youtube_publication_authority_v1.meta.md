---
document_type: oar2
authority_level: operational
document_scope: canonical_youtube_activation
title: OAR2 - Establish Direct Canonical YouTube Publication Authority
operator: op044
system: codex
governing_authority: measures_registry
executor: Cody
status: proposed
disposition: bounded_implementation_authorized
related_oar1:
  - oar1_implement_buffer_native_publication_execution_v1.meta.md
related_publication_family: launch_cycle_001
---

# OAR2 - Establish Direct Canonical YouTube Publication Authority

## Objective

Revise the publication architecture so that canonical Measures Registry video assets are published directly
to the Measures Registry YouTube channel rather than relying on Buffer as the upload path.

The Buffer implementation has successfully demonstrated:

- credential separation;
- endpoint routing;
- draft generation;
- execution evidence;
- authority preservation.

However, canonical YouTube activation remains partially blocked because three canonical videos were
rejected by Buffer while two were accepted as drafts. This indicates that Buffer should not be treated as
the governing upload path for canonical institutional media.

## Governing Determination

Measures Registry YouTube is the canonical institutional media library.

Buffer is a distribution scheduler.

These are separate operational responsibilities.

Canonical media shall be established at the source.

Derivative and social distribution may then reference the canonical YouTube publication.

## Revised Publication Architecture

Replace:

```text
Canonical Video
-> Buffer
-> YouTube
```

With:

```text
Canonical Video
-> Direct YouTube Publication
-> Registry Evidence
-> Buffer Distribution
-> Social Endpoints
```

The Registry shall continue to hold publication authority.

## Objectives

### 1. Investigate Direct YouTube Publication

Determine the most appropriate governed publication path.

Evaluate:

- YouTube Data API
- authenticated upload workflow
- existing project credentials
- OAuth requirements
- channel ownership
- publication metadata support

Do not create unnecessary new infrastructure if an existing governed path already exists.

### 2. Canonical Activation Workflow

Implement or prepare the workflow required to:

- upload canonical media;
- assign title;
- assign description;
- assign playlist;
- assign visibility;
- assign thumbnail where available;
- capture YouTube video ID;
- capture public URL;
- capture publication timestamp;
- write publication evidence back to the Registry.

### 3. Canonical Activation Proof

Prepare direct publication for the five registered canonical assets:

- about_measures_registry.mp4
- ai_isnt_broken_intro.mp4
- crystal_seat_orientation.mp4
- obsidian_chamber_orientation.mp4
- assessment_report_orientation.mp4

Do not modify the source media.

### 4. Registry Evidence

After successful upload, record:

- YouTube video ID;
- public URL;
- publication timestamp;
- playlist;
- publication status;
- executor;
- execution mode;
- evidence timestamp.

Do not treat upload completion alone as publication evidence.

### 5. Buffer Relationship

Once a canonical YouTube URL exists:

Buffer may reference that URL in:

- X
- Facebook
- Instagram
- future publication derivatives.

Buffer is no longer responsible for establishing canonical media.

## Explicit Exclusions

Do not:

- generate derivatives;
- normalize media;
- edit videos;
- change canonical filenames;
- alter publication copy;
- redesign thumbnails;
- replace Registry authority.

Media normalization remains under Claude's current derivative-production OAR.

## Required Deliverable

Provide:

1. Direct YouTube publication capability assessment.
2. Recommended governed upload path.
3. Required credentials or OAuth boundary.
4. Canonical activation workflow.
5. Registry evidence design.
6. Launch Cycle 001 activation plan.
7. Remaining blockers.
8. Final disposition:

**DIRECT YOUTUBE ACTIVATION READY**

or

**HELD WITH REASON**

---

END OAR2
