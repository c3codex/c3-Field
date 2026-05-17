# Seed Concordance Audit Findings Disposition Recovery Posture v1

Source OAR2: `docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md`

This disposition seats one term and records two non-seating standings.

If validation fails, do not perform broad rollback or schema mutation inside this route.

Route correction by issue:

- If `Current Seed Scope` was seated, open a correction OAR2 to retire or mark invalid that unintended term.
- If `TREE Layer Terms` was seated, open a correction OAR2 to retire or mark invalid that unintended term unless a separate TREE semantic incorporation route explicitly authorized it.
- If `Conversion Engine Distinction` is missing or incomplete, open a bounded correction OAR2 naming the missing row or relation.
- If unresolved references appear, correct only the specific relation reference through a routed OAR2.

Do not:

- alter authority schema
- mutate unrelated seated terms
- collapse TREE Layer Terms into semantic authority
- expose protected systems intelligence
- treat markdown as authority
- repair silently

`Codex seating = authority`

`snapshot != authority`

`markdown != authority`

`frontend != authority`
