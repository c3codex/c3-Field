---
document_type: o$path = "docs/oar/measures_registry/oar2_seat_institutional_metadata_authority_v1.meta.md"

@'
---
document_type: oar2
authority_level: working
document_scope: measures_registry_metadata
title: OAR2 — Seat Institutional Metadata Authority
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
  cody: frontend_executor
tags:
  - oar2
  - measures-registry
  - metadata-authority
  - founder-authority
  - article-metadata
  - undrifted
  - json-ld
  - about-page
---

# OAR2 — Seat Institutional Metadata Authority

## OBSERVED

AI visibility and crawlable homepage authority have been restored.

The next gap is metadata authority.

Current frontend/schema work still depends partly on hardcoded or incomplete metadata because DB-seated records are missing for:

- founder authority
- public founder sameAs links
- unDrifted article authorship
- unDrifted publication dates
- new unDrifted article registration
- Article or BlogPosting schema
- About page legal identity standing
- About page Our Story standing

Frontend must not invent these values.

Codex must seat them first.

## ALIGNED

Institutional metadata must be seated before frontend schema expansion.

Codex remains authority.

Field structures the metadata.

Measures registers what can render.

Chazz validates and routes.

Cody implements only from seated metadata.

No public pricing, certification, DAO-standing, c3 Key, permission, or Measures Conversion claims may be introduced.

## ROUTED

### 1. Seat founder authority metadata

Seat founder metadata for Measures Registry.

Approved public representation:

- founder_name: Stephanie Joanne Gaffney
- founder_title: Systems Designer
- founder_description: Artist, Systems Designer, and founder of c3 Community Partners DAO, LLC.

Remove or stop using "Measures Registry Instructor" from public JSON-LD founder metadata.

Measures Registry Instructor may remain available only where specifically seated for educational or course-facing surfaces.

### 2. Seat founder sameAs links

Seat all approved public profile links as founder sameAs metadata where already publicly active:

- LinkedIn
- X
- Instagram
- Paragraph / unDrifted

These must be DB-seated or metadata-seated before being rendered into Person JSON-LD.

Do not hardcode new public profile links in frontend schema generation unless they already exist in seated metadata.

### 3. Seat unDrifted article author authority

Seat article author identity:

- author_name: unDrifted Editorial
- author_slug: undrifted-editorial

This author authority applies to public unDrifted article schema unless a specific article carries its own seated author override.

Do not use Stephanie Joanne Gaffney as article author unless separately seated for a specific article.

### 4. Seat article publication dates

Seat publication dates for existing unDrifted articles.

Required records:

- Fables & Myths
  - date_published: 2026-06-13
  - author_name: unDrifted Editorial
  - author_slug: undrifted-editorial

- Agents With Keys
  - date_published: 2026-06-23
  - author_name: unDrifted Editorial
  - author_slug: undrifted-editorial

- The New AI Bottleneck Isn't Compute, It's Governance
  - date_published: 2026-06-30
  - author_name: unDrifted Editorial
  - author_slug: undrifted-editorial
  - article_url: https://paragraph.com/@undrifted/the-new-ai-bottleneck-isnt-compute-its-governance

date_modified may remain null unless a revision date is seated.

No invented modified dates.

### 5. Register new Paragraph article

Add the new article to the unDrifted publication set.

Required article:

- title: The New AI Bottleneck Isn't Compute, It's Governance
- article_url: https://paragraph.com/@undrifted/the-new-ai-bottleneck-isnt-compute-its-governance
- date_published: 2026-06-30
- author_name: unDrifted Editorial
- author_slug: undrifted-editorial

Add teaser and description only if provided in an existing source or approved by operator.

If teaser or description is missing, report the gap instead of inventing.

### 6. Seat About page legal identity standing

The About page legal identity statement is approved for public rendering.

Standing:

- legal_identity_statement: public

Approved statement:

Measures Registry operates under the authority and governance framework of c3 Community Partners DAO, LLC and is not a separate legal entity.

This may render on About Measures Registry where DB metadata already contains or is updated to contain this field.

### 7. Seat About page Our Story standing

The About page c3field_links_section may be reclassified as public Our Story standing.

Standing:

- c3field_links_section: public_as_our_story

Approved concept:

Measures Registry emerged from the broader c3 Field research and governance framework and applies those findings to institutional AI governance and structural integrity.

Do not make the About page feel like an external redirect.

If external c3field.online links remain intentionally removed, preserve that decision and render Our Story conceptually without outbound c3field links unless separately approved.

### 8. Prepare Article or BlogPosting schema support

After DB metadata is seated, Cody may implement schema generation for unDrifted articles using seated fields only.

Schema may include:

- Article or BlogPosting
- headline
- author
- publisher
- datePublished
- dateModified only when seated
- description when seated
- url

No Article schema may be generated for an article missing date_published or author authority.

### 9. Preserve authority boundaries

Do not introduce:

- pricing claims
- certification claims
- DAO-standing claims
- c3 Key issuance claims
- Measures Conversion claims
- private MAP standing
- private SEAT standing

Metadata authority improves citation readiness only.

It does not create governed standing.

## VALIDATION

This OAR resolves successfully when:

- founder public metadata is seated
- founder public title is Systems Designer
- "Measures Registry Instructor" is removed from public founder JSON-LD
- founder sameAs links are seated
- unDrifted Editorial author authority is seated
- publication dates are present for the three listed articles
- the new Paragraph article is registered
- Article or BlogPosting schema can be generated without invented dates/authors
- About legal identity statement standing is public
- About Our Story standing is public_as_our_story
- no unseated public authority is introduced

## CODY ROLE

Cody may:

- read seated metadata
- update schema generation to use seated metadata
- add Article or BlogPosting schema only when metadata is complete
- wire approved About page fields
- render Our Story conceptually if seated
- rebuild dist-registry

Cody may not:

- invent metadata
- hardcode new authority
- invent article descriptions or dates
- restore removed outbound c3field links without explicit seated approval
- expose pricing, certification, conversion, permission, c3 Key, DAO-standing, or SEAT claims

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_institutional_metadata_authority_v1.meta.md

## CLOSE

Metadata authority must be seated before citation authority can compound.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders seated state only.
