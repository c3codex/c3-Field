---
document_type: oar1
authority_level: proof
document_scope: publication_asset_registration
title: OAR1 - Register unDrifted Issue 001 Cover Story AI Isnt Broken Systems Are
closes: OAR/OAR2/publication/oar2_register_undrifted_issue001_cover_story_ai_isnt_broken_systems_are_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-07
---

# OAR1: Register unDrifted Issue 001 Cover Story "AI Isn't Broken. Systems Are."

## Summary

**Updated 2026-07-08.** The cover story is registered, bound to its banner, and now carries the **full approved draft** (supplied verbatim by the operator, applied 2026-07-08) — `status: ready_for_publication`, both in the file asset and the Publication Dispatch row. A live Paragraph publish was attempted, following the same explicit-confirmation pattern used for the Editor's Letter, using the same governed script (`scripts/publish-undrifted-dispatch-to-paragraph.cjs`, extended with a `ai_isnt_broken_systems_are_dispatch_v1` entry). **All three publish attempts were rejected by Paragraph's API with `429 Too many requests`** (retried after 75s, then 300s, then stopped per instruction rather than looping indefinitely). The cover story is therefore **not yet live**. The cover region on `/undrifted` remains non-clickable and `featured_article_set` remains untouched, unchanged from the original pass.

---

## 1. Article Asset — Path and Standing

```
Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_ai_isnt_broken_systems_are_article_v1.md
```

**Content-depth blocker resolved.** Originally registered `status: registered_draft` with a short, honest cover statement (canonical `cover_story` copy + two CTA sections) because no long-form draft could be found anywhere in the repo. The operator subsequently supplied the full approved draft directly (verbatim, ~7,300 characters) — the article body was replaced in full, no content added or altered beyond what was supplied, and `status` advanced to `ready_for_publication`. `subtitle: "Responsible AI deployment requires governable systems."` added to frontmatter, matching the supplied document.

The corresponding `measures_publication_dispatch` row (`ai_isnt_broken_systems_are_dispatch_v1`) was revised the same way — full `dispatch_body`, `title`, `excerpt`, and `metadata.subtitle` updated via migration `20260708004054_revise_undrifted_cover_story_dispatch_full_approved_draft`. `status` remains `draft` (see §7 — publish did not succeed).

## 2. Banner Binding

**Bound to an existing asset — no duplication.** Queried `measures_media_map` for `media_role = 'ai_isnt_broken_landing'` (the exact image already rendered as the `/undrifted` cover visual) and confirmed it resolves to `measures-registry/ai_isnt_broken_landing.webp` in Supabase Storage. Created a sidecar registering that existing binary under the Asset Registry convention — no new upload, no duplicate binary:

```
Assets/Banners/unDrifted/Issue01/undrifted_ai_isnt_broken_landing_banner_v1.meta.md
```

## 3. Asset Registry Update

`Assets/Registry/asset_registry.md` — two new rows added: the article (`registered_draft`) and the banner (`registered`), both bound to `issue_id: undrifted_issue01`, both carrying `issue_role: cover_story` context in the accompanying note. No existing row modified.

## 4. Publication Dispatch — Status

**Created, as a draft row — safe and additive.** Checked `measures_publication_dispatch` for constraints before writing: only `UNIQUE(dispatch_key)` and a primary key, no status enum to satisfy, and `ai_isnt_broken_systems_are_dispatch_v1` did not previously exist, so this is a pure insert with zero risk to any existing row. Applied via migration `20260707234752_register_undrifted_ai_isnt_broken_systems_are_draft_dispatch` (project `zfihrspxvennjzazxcbj`, mirrored locally):

- `status: 'draft'`, `article_url: null`, `external_url: null`, `published_at: null` — confirmed via query after insert.
- `dispatch_body` mirrors the registered article asset's body verbatim (single source, not two independently-editable copies).
- `metadata` records `issue_role: cover_story`, `cta_route`, `connect_route`, the linked file `asset_id`, and an explicit note: *"Do not mark published or set article_url/external_url until a real Paragraph URL exists."*

## 5. Cover Region — Route Status

**No valid route exists yet, and none was created.** Confirmed unchanged: `featured_article_set` in `measures_encounter_def` still contains only Agents With Keys and Fables & Myths (untouched); `encounter_profile` untouched; no `onClick`/`href` was added to the cover story region in `LapisChamberRenderer.tsx`; no CSS or renderer file was touched at all this pass. The cover remains visually present but non-interactive, exactly as instructed — wiring it up is explicitly deferred to a later OAR2 once a real route (internal or Paragraph) exists.

## 6. Publication Standing of Existing Articles (Read-Only Verification)

Queried `measures_publication_dispatch` fresh for every `dispatch_key` under `publication_key='undrifted'`:

| Article | Status | Live Paragraph URL | Notes |
|---|---|---|---|
| Agents With Keys | `published` | `paragraph.com/@undrifted/agents-with-keys` | Published 2026-06-23. Currently featured on `/undrifted`. |
| Fables & Myths | `published` | `paragraph.com/@undrifted/fables-and-myths` | Published 2026-06-23. Currently featured on `/undrifted`. |
| Agents of Chaos | `published` | `paragraph.com/@undrifted/agents-of-chaos` | Published 2026-05-06. **Not** currently featured on `/undrifted` (unchanged from the prior audit's finding). |
| Structural Drift | `published` | `paragraph.com/@undrifted/structural-drift` | Published 2026-05-06, tagged `issue_number: "ISSUE 002"` in its own row (pre-existing oddity, not something this OAR touched). **Not** currently featured. |
| Computational Systems Governance / NSF pitch | **No dispatch row exists** | none | Exists only as a registered file asset (`Assets/Articles/.../undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1.md`, `status: registered`) from an earlier OAR2 this session — never entered Publication Dispatch, never published anywhere. |
| Measures Registry launch article | **No dispatch row for this asset** | none | Exists only as a registered file asset (`undrifted_issue01_measures_registry_launch_article_v1.md`, `status: registered`). **Do not confuse with** the pre-existing `measures_registry_dispatch_v1` dispatch row, which is a different, bodyless stub (`dispatch_body` length 0, `published_at: null`, only an `external_url` set) that predates this session and does not correspond to this file asset's content. |

## 7. Paragraph Publication — Attempted, Blocked by Rate Limiting

Per the same reasoning applied to the Editor's Letter (irreversible, externally-visible action; stopped and got explicit operator confirmation before attempting it — confirmed "Yes, publish it now"), ran `scripts/publish-undrifted-dispatch-to-paragraph.cjs ai_isnt_broken_systems_are_dispatch_v1`, extending its `DISPATCHES` map with this article's title, subtitle, slug (`ai-isnt-broken-systems-are`), and banner URL (`ai_isnt_broken_landing.webp`).

**Result: not published.** All three attempts failed at the script's own safety check — the `GET /api/v1/me` call (which verifies the API key resolves to the `undrifted` publication *before* any post is attempted) was itself rejected with `429 Too many requests, please try again later`:

| Attempt | Wait beforehand | Result |
|---|---|---|
| 1 | — | 429 |
| 2 | 75s | 429 |
| 3 | 300s | 429 |

Stopped after the third attempt per explicit instruction not to loop indefinitely. **No partial or malformed publish occurred** — the script aborts before the `POST /posts` call whenever `/me` fails, so nothing was sent to Paragraph. This is very likely resolvable by waiting longer (the Editor's Letter publish + verification calls earlier in this session may have consumed most of a shared rate-driven budget); it is not a code or content problem.

## Blockers

1. **Not published to Paragraph** (primary, see §7) — three attempts rate-limited. Retry later, either by re-running the same command or asking for another attempt.
2. **No route exists for the cover story yet** (§5) — expected and correctly left alone per the original OAR2's Routed §5; a follow-up OAR2 should wire it up once it's actually published.
3. **Two stub dispatch rows** (`measures_registry_dispatch_v1`, `undrifted_dispatch_v1`) — unchanged, still flagged only for awareness, not touched.

## Next Recommended OAR2

Retry the Paragraph publish once rate limiting has cleared (`node scripts/publish-undrifted-dispatch-to-paragraph.cjs ai_isnt_broken_systems_are_dispatch_v1`), then sync the result into `measures_publication_dispatch`/`measures_publication_registry` exactly as done for the Editor's Letter (migration `20260708003402` is the template). After that, a follow-up OAR2 can wire the cover region to the real route and decide whether `featured_article_set` should include it — a content-authority decision, same category as the still-open Issue 01 decision from the earlier Publication Release OAR2, not resolved here.
