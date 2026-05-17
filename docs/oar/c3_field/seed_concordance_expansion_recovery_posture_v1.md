# Seed Concordance Expansion Recovery Posture v1

Source OAR2: `docs/oar/c3_field/oar2_seed_concordance_expansion_seating_v1.meta.md`

This recovery posture is non-destructive.

If expansion seating fails before rows are inserted, stop and route a correction OAR2.

If term rows are inserted but relation seating fails, do not delete inserted terms. Mark affected expansion terms `blocked` only under a separate correction OAR2 and preserve trace in metadata.

If relation rows are inserted incorrectly, do not update or delete relation rows through an improvised rollback. The current authority schema append-protects relation mutation. Route a correction OAR2 that seats a superseding relation or records a blocked correction path according to the authority model.

SRC3 is outside current seed scope. If SRC3 appears during validation, stop and route correction. Do not silently remove or overwrite.

Bucket and markdown remain source/evidence only.

`Codex seating = authority`

`snapshot != authority`

`markdown != authority`
