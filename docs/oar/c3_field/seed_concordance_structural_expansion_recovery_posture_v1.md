# Seed Concordance Structural Expansion Recovery Posture v1

Source OAR2: `docs/oar/c3_field/oar2_seed_concordance_structural_expansion_seating_v1.meta.md`

This recovery posture is non-destructive.

If structural expansion seating fails before rows are inserted, stop and route a correction OAR2.

If structural term rows are inserted but relation seating fails, do not delete inserted terms. Mark affected expansion terms `blocked` only under a separate correction OAR2 and preserve trace in metadata.

If structural relation rows are inserted incorrectly, do not update or delete relation rows through improvised rollback. The authority schema append-protects relation mutation. Route a correction OAR2 that seats a superseding relation or records a blocked correction path.

Slug must remain routing-only. If slug authority appears seated, stop and route correction.

Protected Systems Intelligence must not be exposed in reconstructible runtime or public-readable execution form.

`Codex seating = authority`

`snapshot != authority`

`markdown != authority`
