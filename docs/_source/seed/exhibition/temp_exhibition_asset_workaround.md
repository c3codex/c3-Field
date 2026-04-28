Temporary Exhibition Media Bridge — Minimal DB Standing

Purpose

Create the smallest possible temporary database surface needed to stop hardcoding exhibition media into the frontend and get the website live.

This is a temporary workaround only.

It is not:

final SRC2 schema
final Codex contribution seating
final Measures registry seating
final contribution engine architecture

This bridge exists only so exhibition media can render from database-backed rows while development continues on conversion, UI, and final system structure. This keeps the workaround separate from native authority and registry surfaces, which must not be used as intake or temporary parking layers.

Standing

Use one temporary table and one read view only.

Recommended names:

temp_exhibition_media
v_temp_exhibition_media_active

Use a separate private bucket:

pre-codex-exhibition

No final-system naming should leak into this bridge.
Do not use SRC2, Codex contribution, registry_key, env_key, OAR, or other future-system schema terms here.

Minimum Table Purpose

The table only answers:

what media should render
where it should render
in what order
from what bucket/path
whether it is active

That is all.

Recommended Columns

id
display_context
surface_type
surface_key
label
media_type
bucket_name
storage_path
render_order
is_active
notes
created_at
updated_at

Column Meaning

display_context
current exhibition context, likely measures_of_inanna
surface_type
where media belongs in the exhibition, such as:
temple
antechamber
passage
phase_map
gate
epithet
me
surface_key
the placement handle the frontend uses to match the surface
label
simple human-readable title
media_type
one of:
image
video
audio
document
bucket_name
should point to the separate temporary bucket
storage_path
exact object path inside bucket
render_order
ordering within a surface
is_active
whether frontend should render the row
notes
optional temporary operator note

Read View Purpose

v_temp_exhibition_media_active should expose only currently renderable rows.

It should filter:

is_active = true

It may also sort by:

display_context
surface_type
surface_key
render_order

Boundary Rules

This bridge is temporary.
This bridge is presentation-facing only.
This bridge does not create authority.
This bridge does not replace later contribution architecture.
This bridge does not seat anything in Measures registry.
This bridge exists only to keep the frontend from hardcoding exhibition media while the real system continues to be built. This preserves the native order where Codex holds authority, Field structures relation, Measures registers reveal, and Chazz executes, without pretending this temporary surface is any of those final layers.

Retirement Rule

Once final contribution and exhibition architecture is seated, this bridge should be:

retired
migrated
or emptied and removed

It should not be normalized into permanent system language.

Closing

This is a minimal render bridge only.

Its job is simple:
move exhibition media out of frontend hardcoding and into a temporary database-backed read surface, while preserving separation from final architecture.

If you want, next I’ll turn this exact one-page draft into the SQL for just:
temp_exhibition_media
and
v_temp_exhibition_media_active