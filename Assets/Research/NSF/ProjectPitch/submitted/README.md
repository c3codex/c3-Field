# Submitted Research Assets — NSF Project Pitch

## Asset purpose
Holds the submitted (final, execution-ready) research proposition materials for the NSF Project Pitch, once bound to an OAR2.

## Naming convention
`nsf_project_pitch_<slug>_v1.md` for narrative documents.
Supporting binary attachments retain their native extension with the same base name.

## Required metadata
Each submitted asset file must open with a frontmatter block containing:
- `asset_id` — matches the filename (without extension)
- `pitch_component` — e.g. `narrative`, `budget`, `letters_of_support`
- `status` — `submitted`
- `registered_by_oar2` — the `oar_id` of the OAR2 that registered this asset
- `published_by_oar1` — the `oar_id` of the OAR1 that proves submission

## Relationship to OAR2 authority
OAR2 files never embed research proposition content. An OAR2 concerning this pitch references the asset path here and defines submission scope and acceptance criteria.

## Relationship to OAR1 proof
The OAR1 closing out a pitch-related OAR2 must cite the exact asset path and confirm submission occurred (or note the profiles/supporting materials it drew from).
