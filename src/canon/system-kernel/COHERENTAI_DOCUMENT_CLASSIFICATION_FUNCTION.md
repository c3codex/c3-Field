---
title: CoherentAI Document Classification Function
slug: coherentai-document-classification-function
document_type: architecture
document_scope: kernel
document_status: draft
canonical: true
authority_level: structural
related_pillar: c3
related_system: coherentai
version: 0.1
tags:
  - architecture
  - coherentai
  - documents
  - kernel
  - classification
summary: Defines the CoherentAI function contract for detecting document need, classifying document type, and prompting for storage or event registration.
---

# CoherentAI Document Classification Function #IMPLEMENTED#

## Purpose

This function exists to determine whether a piece of content should become a stored document, where it belongs, and whether a document event should be created.

It is not a source of truth.  
It is a coherence support function.

Its role is to help classify and prompt, not to override canon.

## Function Name

`classify_and_prompt_document_storage`

## Core Responsibility

The function evaluates whether a piece of text, code-held prose, changed file, or document event should result in:

- document creation
- document storage
- document relocation
- document event registration
- no action

It operates as a reasoning layer above mechanical file checks.

## Why It Exists

Not every text belongs in code.  
Not every markdown file belongs in Measures content.  
Not every structural thought should remain in conversation only.

This function exists to help distinguish between:

- structure
- pillar document
- system document
- encounter content
- state record
- draft / non-canonical material

## Inputs

The function may accept:

- `source_path`
- `content`
- `change_type`
- `known_slug`
- `known_scope`
- optional database context
- optional repository context

### Example Input

```json
{
  "source_path": "src/pillars/measures/gates/ObsidianGatePlate.tsx",
  "content": "string",
  "change_type": "extract",
  "known_slug": null,
  "known_scope": null,
  "db_context": {
    "existing_document": false,
    "existing_event": false,
    "existing_slug": null
  }
}