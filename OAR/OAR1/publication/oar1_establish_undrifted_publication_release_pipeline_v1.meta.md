---
document_type: oar1
authority_level: proof
document_scope: publication_release
title: OAR1 — Establish unDrifted Publication Release Pipeline
closes: OAR/OAR2/publication/oar2_establish_undrifted_publication_release_pipeline_v1.meta.md
depends_on:
  - oar1_establish_registered_asset_file_structure_v1.meta.md
  - oar1_add_asset_registry_and_sidecar_metadata_convention_v1.meta.md
  - oar1_register_undrifted_issue01_launch_assets_v1.meta.md
  - oar1_register_undrifted_issue_model_and_current_issue_renderer_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-07
---

# OAR1: Establish unDrifted Publication Release Pipeline

## Status by Routed Item

| # | Routed Item | Status |
|---|---|---|
| 1 | Seat Publication Release as the missing governance object | SEATED — file registry + DB table + Issue 01 shell row |
| 2 | Resolve Issue 01 content authority | NOT DECIDED (by design) — decision surface returned for operator review |
| 3 | Define DB sync path | SEATED — governed, guarded script; not yet run (release not approved) |
| 4 | Prepare renderer routing after release model is seated | DEFERRED — release authority not yet "clear" (content decision pending); see below |
| 5 | Preserve future expansion as registry objects | RECORDED — Contributor / Social / Feed registries documented, not implemented |
| 6 | Maintain launch scope | HELD — no contributor/social/feed UI, no comment system, no new libraries installed |

---

## 1. Publication Release — Governance Object Seated

**File layer** (mirrors the Issue Registry convention from the prior OAR2):
```
Assets/Releases/unDrifted/README.md
Assets/Releases/unDrifted/release_registry.md
Assets/Releases/unDrifted/Issue01/release01.meta.md
Assets/Releases/unDrifted/Issue01/issue01_content_authority_decision.meta.md
```

**DB layer** — new table `public.measures_publication_release`, seated via migration `20260707201537_seat_undrifted_publication_release_governance_object` (applied directly to project `zfihrspxvennjzazxcbj` / Measures Codex, and mirrored locally at `supabase/migrations/20260707201537_seat_undrifted_publication_release_governance_object.sql`). Additive only — no existing table, column, or row was altered.

Table shape: `release_id`, `issue_id`, `active_issue`, `approved_article_asset_ids[]`, `approved_banner_asset_ids[]`, `publication_state` (checked enum: `pending_content_authority_decision | approved | synced | superseded`), `archive_state`, `renderer_eligibility`, `db_sync_status`, `db_sync_path`, `related_oar2`, `related_oar1`, `is_active`, `metadata`, timestamps. RLS enabled, mirroring the exact policy pattern already in place on `measures_encounter_def` (public read where `is_active = true`; all writes `service_role` only) — confirmed by querying `pg_policies` before writing the migration rather than guessing.

One row seeded: `release_id = undrifted_issue01_release01`, `issue_id = undrifted_issue01`, `publication_state = pending_content_authority_decision`, `renderer_eligibility = false`, `approved_article_asset_ids = {}`, `approved_banner_asset_ids = {}`. Verified present via direct query after migration.

**Relation now exists end-to-end:** `Issue (undrifted_issue01) -> Publication Release (undrifted_issue01_release01) -> Registered Assets (asset_registry.md, unresolved) -> Publication State (pending) -> FREE (not yet eligible)`.

## 2. Issue 01 Content Authority — Explicit Decision Surface Returned, Not Decided

Live-queried `measures_encounter_def.metadata` for `encounter_key = 'undrifted'` again to confirm current state before writing the decision document. Live `featured_article_set` is unchanged from the prior OAR1's finding: "Agents With Keys" and "Fables & Myths" (both published, both linking to `paragraph.com/@undrifted/...`).

Wrote `Assets/Releases/unDrifted/Issue01/issue01_content_authority_decision.meta.md` laying out all four options named in the OAR2 (keep live / replace / append / split into separate issue), what each requires, and what happens next per option. **No option was selected.** `decision_status: undecided` in its frontmatter.

**No live article link was touched.** This satisfies the OAR2's hard constraint directly.

## 3. DB Sync Path — Implemented, Guarded, Not Executed

`scripts/sync-undrifted-publication-release.cjs` — the single governed path from registered asset state to DB-rendered state (approach: **controlled script-driven sync**, generating a traceable `measures_encounter_def.metadata` update from the Release row and the registered asset files themselves, never from hand-typed content).

Behavior:
- Reads the named release row (`undrifted_issue01_release01` by default) from `measures_publication_release`.
- **Hard guard:** if `publication_state !== 'approved'`, it prints the reason and exits without any write. Currently this guard fires — verified by inspection against the live row's `publication_state = pending_content_authority_decision`.
- If approved, it resolves each `approved_article_asset_id` against its registered `.md` file frontmatter (source of truth = `Assets/Articles/...`, not hand-edited DB content) and each `approved_banner_asset_id` against its sidecar.
- **Refuses to invent publish URLs:** an article is skipped (not silently included) if its frontmatter has no `article_url`/`paragraph_url` — currently true for both newly registered articles, since neither has been published externally yet. This directly enforces the OAR2's "do not invent unpublished article URLs" constraint at the code level, not just as a convention.
- Only on success does it upsert `measures_encounter_def.metadata.featured_article_set` (merged into existing metadata, not a destructive full overwrite of unrelated fields) and flip the release row to `synced` / `renderer_eligibility: true`.

**Not executed in this pass** — correctly, since the release is not `approved`. Verified the guard logic by code review and by confirming the live release row's state via SQL rather than by running the script (no `SUPABASE_SERVICE_ROLE_KEY` is available in this local environment's `.env`, matching how `scripts/seed-registry-landing.cjs` is also only runnable with that credential present).

## 4. Renderer Routing — Deferred (Not Prepared This Pass)

The OAR2 permits route preparation "only after release authority is clear." Release authority is **not** clear yet: `publication_state = pending_content_authority_decision`. Per the OAR2's own gate, I did not touch routing or renderer code this pass. Recorded here precisely so the next OAR2 can execute directly rather than re-investigate:

**What "prepare" requires, traced to exact files** (from the prior OAR1's `/undrifted` inspection, extended this pass):
- Routing is **not** dynamically derived from `measures_encounter_surface_assignment.public_routes` despite that DB column existing — it's a separate, hardcoded `ROUTE_SURFACE_MAP` / `PUBLIC_ROUTE_BY_SURFACE` in `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx` (lines ~63–87).
- `EncounterSurface` is a closed TypeScript union in `src/measures_registry/encounter_renderer/types/encounterRendererTypes.ts` (lines ~14–39) — adding a route requires adding a new literal there.
- A new DB row in `measures_encounter_surface_assignment` (new `surface_key`, `public_routes`) would also be needed, following the existing pattern (confirmed only two rows exist for `registry_key = 'undrifted'` today: `lapis_chamber_encounter` → `/undrifted`, `publication_dispatch` → `/publication/structural_drift`).
- A new dispatch branch in `LapisChamberRenderer.tsx`'s surface switch (currently only handles `lapis_chamber_encounter` and `publication_dispatch`; anything else falls through to the existing honest "renderer gap" state).

**Why not build it anyway with an honest-empty-state, even though it'd be low-risk:** `/undrifted/library` could arguably be seated safely regardless of the content decision (`"if only Issue 01 exists, library may render an honest empty/archive-pending state"` per the OAR2). I chose not to, because this system's routing/gating plumbing (`EncounterEntry` / `EncounterBoundary`, release gates, held states, role-call standing) has more moving parts than I fully traced this pass, and the OAR2's own gate ties *all* route prep to release authority being clear — treating that gate as a unit rather than splitting hairs on which sub-route is "safe enough" keeps this OAR2's change surface small and matches "maintain launch scope." This is a judgment call, flagged explicitly rather than silently deferred.

## 5. Future Registry Expansion — Recorded Only

Contributor Registry, Social Registry, and Feed Registry field lists recorded verbatim (from the OAR2) in `Assets/Releases/unDrifted/release_registry.md` under "Future Registry Expansion (Recorded, Not Implemented)." No schema, table, route, or UI was created for any of them.

## 6. Launch Scope Maintained

Confirmed not built: contributor onboarding, public contributor profiles, social registry UI, independent feed runtime, comment system, social network features, page-flip animation library. No new npm dependency was installed — `gray-matter` and `@supabase/supabase-js`, both already in `package.json`, cover the sync script's needs.

---

## Files Changed

```
Assets/Releases/unDrifted/README.md                                          (new)
Assets/Releases/unDrifted/release_registry.md                                (new)
Assets/Releases/unDrifted/Issue01/release01.meta.md                          (new)
Assets/Releases/unDrifted/Issue01/issue01_content_authority_decision.meta.md (new)
scripts/sync-undrifted-publication-release.cjs                               (new)
supabase/migrations/20260707201537_seat_undrifted_publication_release_governance_object.sql (new)
```

## DB Migrations

Created and applied: `20260707201537_seat_undrifted_publication_release_governance_object` (table `measures_publication_release`, RLS policies, one shell row). No other migration created or needed this pass — explicitly did not touch `measures_encounter_def` or any content table.

## Publication Release Model Standing

Seated and queryable (file + DB), one release in `pending_content_authority_decision` state, `renderer_eligibility: false`. This is the correct standing given the content decision is still open.

## Issue 01 Content Authority Decision Status

`undecided`. Decision surface exists at `Assets/Releases/unDrifted/Issue01/issue01_content_authority_decision.meta.md` — awaiting explicit operator choice among the four documented options.

## /undrifted, /undrifted/issue-01, /undrifted/library Status

All three: **prepared at the design/documentation level, not implemented in code or DB routing.** Deferred per the OAR2's own "release authority must be clear" gate — see section 4 above for the exact, traced follow-up plan.

## Unresolved Blockers

1. **Content authority decision** — blocks everything downstream (sync execution, renderer eligibility, route prep). This is squarely an operator decision, not an execution blocker.
2. **No externally published URL** for either newly registered article — even once content authority is decided in favor of the new articles (Option B or C), the sync script will still skip them until `article_url`/`paragraph_url` is set in their frontmatter, which requires an actual publish action (Paragraph or otherwise) outside this pipeline's scope.
3. **Route implementation** — real code changes across 3 files + 1 DB row, fully scoped above, ready to execute once release authority is clear.

## Next Recommended OAR2

Operator resolves Issue 01 content authority (updates `issue01_content_authority_decision.meta.md` and `release01.meta.md`). Once `publication_state: approved` and (if applicable) the chosen articles carry real `article_url`s, run `scripts/sync-undrifted-publication-release.cjs undrifted_issue01_release01` to perform the governed sync, then seat `/undrifted/issue-01` and `/undrifted/library` per the file/line plan in section 4.
