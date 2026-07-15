---
document_type: oar2
authority_level: operational
document_scope: launch_cycle_001_publication_asset_registration
title: OAR2 - Register Uploaded Launch Cycle 001 Publication Assets
operator: op044
system: measures_registry
participating_systems:
  - unDrifted
  - codex
executor: Claude
status: proposed
disposition: bounded_asset_registration_authorized
related_publication_family: launch_cycle_001
related_publications:
  - publication_001
  - publication_002
related_asset_package:
  - launch_cycle_001_publication_asset_package_v1.meta.md
---

# OAR2: Register Uploaded Launch Cycle 001 Publication Assets

## Objective

Register the completed and publicly uploaded Launch Cycle 001 publication assets as governed derivative and publication-support assets.

Creative production and public storage upload are complete.

Nineteen delivered assets have verified public Supabase Storage URLs.

This OAR authorizes asset registration and publication-relationship seating only.

It does not authorize:

- additional creative production;
- Buffer draft creation;
- scheduling;
- publication;
- social posting;
- correspondence;
- modification of canonical publications;
- modification or replacement of uploaded files.

---

# Governing Relationship

Preserve:

Canonical Publication or Canonical Media  
→ Governed Derivative Asset  
→ Public Storage Object  
→ Endpoint Assignment  
→ Buffer Execution  
→ Publication Evidence

The uploaded assets are governed descendants and publication-support assets.

They do not replace the canonical articles, canonical media records, or registered source files.

---

# Registration Authority

Use the following source package as the authoritative registration input:

`docs/_source/codex/publications/launch_cycle_001_publication_asset_package_v1.meta.md`

Use its existing:

- asset IDs;
- filenames;
- parent relationships;
- dimensions;
- durations;
- checksums;
- public URLs;
- system voices;
- endpoint recommendations;
- approval states;
- hold reasons.

Do not recreate, rename, re-render, or reinterpret the assets.

---

# Assets to Register

## Publication 001 — Field Findings 2026-W28

Register:

- `ff_landscape_v1`
- `ff_square_v1`
- `ff_story_v1`
- `ff_quote_01_v1`
- `ff_discussion_01_v1`

Parent:

`publication_001`

Relationship:

`direct_derivative`

System voice:

`unDrifted / Field Findings`

---

## Publication 002 — unDrifted Response 001

Register:

- `rs_landscape_v1`
- `rs_square_v1`
- `rs_story_v1`
- `rs_quote_01_v1`
- `rs_discussion_01_v1`

Parent:

`publication_002`

Relationship:

`direct_derivative`

System voice:

`unDrifted Response`

---

## Measures Registry Evergreen Stills

Register as evergreen Measures Registry publication assets:

- `obsidian_thumbnail_v1`
- `obsidian_dramatic_v1`
- `crystal_presenter_thumbnail_v1`

Register with explicit textual-context holds:

- `about_accountability_quote_v1`
- `about_fragmented_network_explainer_v1`

Required standing for the two About Measures Registry stills:

`held_text_context_verification`

They may be registered as existing uploaded assets.

They must not be marked approved for distribution until their burned-in caption context is verified against the source narration.

---

## Video Derivatives

Register:

- `intro_9x16_captioned_v1`
- `assessment_primary_clip_v1`
- `assessment_alt_clip_v1`
- `obsidian_primary_clip_v1`
- `crystal_primary_clip_v1`

Preserve each canonical parent-media relationship.

Do not register an asset for:

`about_primary_clip`

That derivative does not exist and remains:

`held_with_reason`

---

# Required Registration Fields

Record for each asset:

- asset ID;
- title;
- asset class;
- governing system;
- system voice;
- canonical parent publication or media asset;
- derivative relationship;
- source filename;
- local master location;
- public storage URL;
- storage bucket;
- storage object path;
- MIME type;
- dimensions;
- duration where applicable;
- checksum;
- intended endpoints;
- platform compatibility;
- publication family;
- approval status;
- hold status and reason;
- created date;
- executor;
- version;
- registration source.

Use the existing asset and publication registry structures.

Do not create a competing registry.

---

# Public Storage Verification

Bucket:

`measures-registry`

Image object family:

`launch_cycle_001/`

Video object family:

`campaign_derivatives/`

Before registration, verify every public object for:

- HTTP 200;
- expected filename;
- expected MIME type;
- expected content length;
- no conflicting duplicate object;
- public URL resolution.

Do not re-upload objects that already verify correctly.

---

# Publication Relationship Updates

## Publication 001

Seat relationships for its:

- landscape preview;
- square social asset;
- story asset;
- quote card;
- discussion card;
- approved supporting video derivatives where a real relationship is already established.

## Publication 002

Seat relationships for its:

- landscape preview;
- square social asset;
- story asset;
- quote card;
- discussion card;
- approved supporting video derivatives where a real relationship is already established.

Do not force Measures Registry evergreen assets into either publication merely to increase distribution volume.

---

# Approval Standing

Allowed registration states:

- `ready_for_operator_approval`
- `approved_for_distribution`
- `held_text_context_verification`
- `held_with_reason`

Registration does not itself grant distribution approval.

Preserve the actual standing from the source package.

Do not approve assets on behalf of the Operator.

---

# Cody Handoff

After registration, produce one Buffer-ready handoff table containing only assets eligible for operational use.

Required fields:

- asset ID;
- parent publication or media reference;
- public URL;
- exact copy reference;
- system voice;
- intended endpoint;
- endpoint eligibility;
- approval status;
- hold status;
- governed Buffer credential reference where already established.

Use:

`BUFFER_SOCIAL_KEY`

for:

- Measures Registry YouTube;
- Measures Registry Instagram;
- Measures Registry X.

Use:

`BUFFER_PUB2_KEY`

for:

- Measures Registry Facebook;
- unDrifted Facebook;
- unDrifted X.

Do not access the credentials.

Do not create Buffer drafts.

Do not schedule or publish.

---

# Historical Integrity

Preserve:

- original PNG master references;
- WEBP public delivery objects;
- MP4 derivative checksums;
- prior local-only standing;
- upload timestamps and evidence;
- earlier Buffer holds;
- the later resolution of the public-media-URL blocker.

Do not rewrite prior records as though these assets were always uploaded or registered.

Append the new registration state as a later operational event.

---

# Required Executor Actions

1. Read the authoritative publication asset package.
2. Verify all nineteen uploaded public objects.
3. Register all nineteen existing assets.
4. Preserve the two About stills under textual-context holds.
5. Preserve the nonexistent About video derivative as held.
6. Update Publication 001 derivative relationships.
7. Update Publication 002 derivative relationships.
8. Seat appropriate Measures Registry evergreen relationships.
9. Produce the Cody Buffer-ready handoff table.
10. Return exact registry records, migrations, and files created.
11. Do not create, schedule, or publish Buffer actions.

---

# Required Deliverable

Provide:

1. Registered asset inventory.
2. Asset registry entries.
3. Publication-record relationship updates.
4. Public URL verification report.
5. Held-item register.
6. Buffer-ready Cody handoff table.
7. Exact files and migrations created.
8. Remaining gaps.
9. Final disposition:

- `LAUNCH CYCLE 001 PUBLICATION ASSETS REGISTERED`
- `REGISTERED WITH SPECIFIC ITEMS HELD`
- `HELD WITH REASON`

---

# Constraints

Do not:

- generate new assets;
- alter uploaded media;
- overwrite public storage objects;
- modify canonical articles;
- modify canonical media;
- create Buffer drafts;
- schedule or publish;
- expose credentials;
- approve assets on behalf of the Operator;
- register the nonexistent About video derivative;
- mark the two textually unverified About stills distribution-ready;
- create a second asset-registry authority.

---

# Expected Result

The completed Launch Cycle 001 creative package becomes a governed and registered publication asset set.

Cody receives stable registered asset IDs and verified public URLs instead of local files.

The publication workflow then becomes:

Registered and Approved Asset  
→ Correct Buffer Workspace  
→ Operator-Authorized Schedule  
→ Platform Publication  
→ Execution Evidence

---

# Required Disposition

LAUNCH CYCLE 001 PUBLICATION ASSETS REGISTERED

or

HELD WITH REASON

---
END OAR2
