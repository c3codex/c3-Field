# Concordance Authority Execution Package Order Notes v1

Review artifact only. Execution requires a separate confirmed OAR2.

## Order

1. Run preflight SQL.
2. Confirm no incompatible existing authority tables or seated `seed_concordance_v1`.
3. Run migration SQL.
4. Run schema validation subset from post-validation SQL.
5. Run Seed Concordance v1 seating SQL.
6. Run full post-seat validation SQL.
7. If validation passes, write execution OAR1 with row counts, hashes, and standings.
8. If validation fails, stop and route correction OAR2; use rollback/recovery SQL only if explicitly routed.

## Boundaries

- Bucket snapshot is evidence only.
- Markdown file is evidence only.
- Codex/database seating is authority.
- No frontend or runtime should read these draft artifacts as live authority.
