---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Seat DB-Held Content Profiles, Media Locators, Directory Keys and FREE Consumption
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Seat DB-Held Content Profiles, Media Locators, Directory Keys and FREE Consumption

## OBSERVED

All 13 registered Measures Registry surfaces now render.

The remaining work is authority consumption.

DB-held standing exists or is partially seated for:

- style_profile
- content_profile
- media_locator
- directory_key

FREE does not yet fully consume these authorities.

The system must complete the transition from hardcoded renderer assumptions to DB-held authority consumption.

## ALIGNED

Native order:

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

FREE is the public render surface of Field.

This OAR does not create new architecture.

This OAR wires DB-held authority into FREE rendering.

## OBJECTIVE

Seat and consume:

- content profiles
- media locators
- chamber directory keys
- style profiles already seated in DB

through DB-held authority and FREE consumption.

No redesign.
No report rewrite.
No payment rewrite.
No scoring changes.

## CONTENT PROFILE RULE

Each registered surface must resolve:

- registered_surface
- style_profile
- content_profile

Content profile answers:

What content belongs to this surface?

Content profiles may contain:

- eyebrow
- title
- subtitle
- body
- CTA labels
- support copy
- orientation copy
- publication copy
- payment copy
- resolution copy

Content is not owned by CSS.

Content is not owned by components.

Content is DB-held.

## MEDIA LOCATOR RULE

Each media-bearing surface must resolve:

- media_locator

Media locator answers:

Where does media resolve from?

Media locator may point to:

- media_key
- media_role
- bucket path
- R2 path
- storage URL
- media map row

Media locator is not content authority.

Media locator is retrieval authority.

## DIRECTORY KEY RULE

Each surface must resolve:

- directory_key

Directory answers:

What chamber contents are available?

Directory is not merely a list.

Directory is chamber access.

Directory may resolve:

- registered_surface
- style_profile
- content_profile
- media_locator
- encounter_def
- compact
- agreement
- resolution
- release standing
- role actions

Directory does not make content public.

Measures determines public standing.

## MEASURES RULE

Measures determines:

- registered
- active
- public
- held
- encounterable
- optional
- required
- sequenced

Measures allows what directory-held content becomes public in FREE.

## FIELD RULE

Field arranges:

- style profiles
- content profiles
- media relationships
- public composition
- FREE appearance

FREE is Field public render surface.

## REQUIRED FREE CONSUMPTION

FREE must consume:

- metadata.style_profile
- metadata.content_profile
- metadata.media_locator
- metadata.directory_key

Consumption may occur through:

- RenderableEncounter
- ComposedEncounter
- encounterComposition
- chamber renderers
- encounter metadata props

Do not infer these from CSS.

Do not infer these from routes.

Do not infer these from hardcoded surface assumptions.

## REQUIRED IMPLEMENTATION

Cody must:

1. Audit all 13 registered surfaces.
2. Seat content profiles where absent.
3. Seat media locators where absent.
4. Seat directory keys where absent.
5. Wire FREE consumption.
6. Thread metadata into render surfaces.
7. Preserve existing rendering behavior.
8. Preserve public routes.
9. Preserve scoring.
10. Preserve payment.
11. Preserve report copy.

## SPECIAL MEDIA REQUIREMENT

Seat:

assessment_report_orientation

This media is now the only known render gap.

Requirements:

- measures_media_map row
- valid campaign key
- valid media role
- resolver fetch support
- successful playback in marble_chamber_orientation

If the media file or source path is missing, report exact blocker and do not invent media.

## CHAMBER DIRECTORY REQUIREMENT

Each chamber directory must resolve all chamber-held contents.

Required directories:

- crystal_seat_directory
- lapis_chamber_directory
- obsidian_chamber_directory
- marble_chamber_directory

Directory must expose standing where applicable:

- hot
- held
- released
- legacy_alias
- audit_trace
- secured_scale
- gap

## REQUIRED OAR1 TABLE

For each registered surface, OAR1 must include:

- registered_surface
- style_profile
- content_profile
- media_locator
- directory_key
- FREE consumption yes/no
- fallback behavior
- final standing

## DO NOT TOUCH

This OAR does not authorize:

- new public sequence
- passage activation
- antechamber activation
- report rewrite
- scoring change
- Stripe/payment rewrite
- article rewrite
- social profile invention
- registered_runtime restoration
- visual redesign

## VALIDATION

Validation succeeds when:

- all 13 surfaces resolve style_profile
- all 13 surfaces resolve content_profile
- media-bearing surfaces resolve media_locator
- all 13 surfaces resolve directory_key
- FREE consumes all four authorities
- no hardcoded authority remains where DB standing exists
- assessment_report_orientation media renders or exact media blocker is reported
- no report rewrite occurs
- no payment rewrite occurs
- no scoring changes occur
- TypeScript/build passes or exact failure is reported
- OAR1 records before/after proof

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_db_held_content_profiles_media_locators_directory_keys_and_free_consumption_v1.meta.md

## CLOSE

The 13 are registered.
The 13 render.

The remaining work is authority consumption.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
