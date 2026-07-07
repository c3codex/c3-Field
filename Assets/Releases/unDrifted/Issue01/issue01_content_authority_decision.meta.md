---
decision_id: undrifted_issue01_content_authority_decision
issue_id: undrifted_issue01
release_id: undrifted_issue01_release01
decision_status: undecided
decided_by: pending
decided_at: pending
related_oar2: OAR/OAR2/publication/oar2_establish_undrifted_publication_release_pipeline_v1.meta.md
related_oar1: pending
---

# Issue 01 Content Authority Decision

**Status: undecided.** This document exists to give the operator a single place to make this call — it does not make the call. Per `oar2_establish_undrifted_publication_release_pipeline_v1`, executors may not overwrite live DB article links without explicit operator direction, so no option below has been acted on.

## The situation

Issue 01 is live at `/undrifted` today with two published articles seated in `measures_encounter_def.metadata.featured_article_set`:

1. **"Agents With Keys"** — *Systems Without Governance* — published to `https://paragraph.com/@undrifted/agents-with-keys`
2. **"Fables & Myths"** — *Institutional Narrative and Policy Risk* — published to `https://paragraph.com/@undrifted/fables-and-myths`

Separately, this OAR2 chain registered two new articles as file-based assets (not yet published, not yet in the DB):

1. **"Measures Registry Is Now Live"** — `Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_measures_registry_launch_article_v1.md`
2. **"From Measures Registry to Computational Systems Governance"** — `Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1.md`

Both sets share the same issue window (Issue 01, July 2026, Launch Edition). They are not the same content.

## Options

### Option A — Keep live DB articles
Leave `featured_article_set` as-is. The two newly registered articles remain registered-but-unsynced assets, held for a future issue or a manual publish decision later. No DB write occurs.

### Option B — Replace with newly registered launch/research assets
Sync replaces "Agents With Keys" and "Fables & Myths" with "Measures Registry Is Now Live" and "From Measures Registry to Computational Systems Governance" in `featured_article_set`. The two currently-published Paragraph links stop being featured on `/undrifted` (they remain live at their own URLs, just no longer surfaced on the index).

### Option C — Append registered assets to the current live issue
`featured_article_set` grows to four entries: the two existing plus the two newly registered. Requires the two new articles to actually be published somewhere externally (or internally) before an `article_url` can be set — right now they only exist as registered file assets with no publish target confirmed. This option needs that gap closed first.

### Option D — Split into separate issue states
Treat "Agents With Keys" / "Fables & Myths" as Issue 01 (as currently live), and register the two new articles under a distinct issue (e.g. Issue 02, or a sub-edition of Issue 01) rather than merging them. Requires creating a second Issue object under `Assets/Issues/unDrifted/` and its own Release.

## What happens next, per option

| Option | Requires |
|---|---|
| A | Nothing — release stays `pending_content_authority_decision` indefinitely, or is explicitly marked `approved` with `approved_article_asset_ids: []` (i.e. "approved to change nothing"). |
| B | Operator confirms replacement is intended → update `release01.meta.md` (`approved_article_asset_ids`, `publication_state: approved`) → run the governed sync script. |
| C | Operator confirms append + supplies/confirms publish destinations for the two new articles → same as B once resolved. |
| D | Operator confirms split → new Issue + Release objects created under a follow-up OAR2 → then sync only that new issue's release, leaving Issue 01's live content untouched. |

## Recording the decision

When decided, fill in `decision_status`, `decided_by`, `decided_at` in this file's frontmatter, and update `Assets/Releases/unDrifted/Issue01/release01.meta.md` accordingly.
