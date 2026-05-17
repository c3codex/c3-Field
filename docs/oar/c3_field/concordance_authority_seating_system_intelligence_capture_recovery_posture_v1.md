# Concordance Authority Seating System Intelligence Capture Recovery Posture v1

Source OAR2: `docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md`

This route captures process/system intelligence only.

If validation fails, do not perform broad rollback, schema mutation, or semantic-term repair inside this route.

Route correction by issue:

- If the system intelligence document is missing, open a bounded correction OAR2 to seat only the missing document row.
- If the system intelligence version is missing, open a bounded correction OAR2 to seat only the missing version row.
- If capture relations are incomplete, open a bounded correction OAR2 naming the missing relation keys.
- If semantic terms were created under the system intelligence version, open a correction OAR2 to block or retire unintended terms.
- If source snapshot evidence is incorrect, open a snapshot correction route and preserve the original trace.

Do not:

- alter authority schema
- create new semantic authority strata
- mutate Concordance authority terms
- mutate seated semantic relations
- infer unrelated governance behavior
- silently rewrite prior semantic standing
- expose protected systems intelligence
- treat frontend, markdown, or snapshot evidence as authority

`Codex seating = authority`

`snapshot != authority`

`markdown != authority`

`frontend != authority`
