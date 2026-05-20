# DB Source Relation Map + Reconstruction Recovery Posture v1

Source OAR2: `docs/oar/process/oar2_db_source_relation_map_reconstruction_passage_v1.meta.md`

This route is non-mutating.

If validation finds missing relation continuity, do not repair inside this route.

Route correction by issue:

- Missing table: open a schema reconstruction OAR2 naming the required source, parent dependency, and reconstruction order.
- Missing column: open a bounded schema correction OAR2 for that table only.
- Missing parent relation: open a relation-continuity correction OAR2 before reseating dependent rows.
- Missing trigger: open an append/queue-protection hardening OAR2.
- Runtime consumer unreadable: open a runtime contract correction OAR2.
- Measures registry surface absent: open a Measures-specific reconstruction route, not a c3 Field fallback authority route.

Do not:

- mutate the database from this passage
- expose secrets or service-role credentials
- infer missing authority
- create fallback standing
- bypass seeded reference controls
- treat reconstruction docs as live authority
- treat frontend, markdown, or snapshots as authority

`Codex seating = authority`

`relation map = reconstruction continuity`

`snapshot != authority`

`markdown != authority`

`frontend != authority`
