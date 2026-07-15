---
document_type: oar1
authority_level: operational
document_scope: canonical_youtube_activation
title: OAR1 - Establish Direct Canonical YouTube Publication Authority
closes: OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md
operator: op044
system: codex
governing_authority: measures_registry
executor: Codex
date: 2026-07-13
status: complete_with_holds
disposition: HELD WITH REASON
---

# OAR1: Establish Direct Canonical YouTube Publication Authority

## Summary

The publication architecture was revised so canonical Measures Registry video activation is no longer
governed through Buffer.

New architecture:

```text
Canonical Video
-> Direct YouTube Publication
-> Registry Evidence
-> Buffer Distribution
-> Social Endpoints
```

Buffer remains a downstream distribution scheduler. YouTube is now recorded as the canonical institutional
media library path for Measures Registry video publication.

No media was uploaded in this pass because the required YouTube OAuth credential boundary is absent.

Final disposition: `HELD WITH REASON`.

---

## Files Created

```text
OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md
scripts/direct-youtube-canonical-activation.cjs
docs/oar/measures_registry/direct_youtube_canonical_activation_plan_v1.json
docs/oar/measures_registry/direct_youtube_canonical_activation_plan_v1.md
supabase/migrations/20260713075607_record_direct_youtube_canonical_activation_authority_v1.sql
OAR/OAR1/publication/oar1_establish_direct_canonical_youtube_publication_authority_v1.meta.md
```

No `src` files were changed.

---

## Direct YouTube Publication Capability Assessment

Official Google/YouTube documentation checked:

- `https://developers.google.com/youtube/v3/guides/uploading_a_video`
- `https://developers.google.com/youtube/v3/docs/videos/insert`
- `https://developers.google.com/youtube/v3/docs/playlistItems/insert`
- `https://developers.google.com/youtube/v3/docs/thumbnails/set`

Findings:

- direct upload should use YouTube Data API `videos.insert`;
- upload requires OAuth 2.0 user authorization for the channel;
- `snippet` supports title, description, category, and similar metadata;
- `status.privacyStatus` supports `private`, `unlisted`, and `public`;
- playlist insertion is a separate authorized `playlistItems.insert` call after a video ID exists;
- thumbnail setting is a separate `thumbnails.set` call and should only run when a seated thumbnail file exists.

No service-account path was treated as valid for publishing to the Measures Registry channel.

---

## Recommended Governed Upload Path

Recommended path:

```text
Canonical media row
-> Direct YouTube OAuth upload
-> private video ID returned
-> registry evidence row
-> operator review / publication confirmation
-> Buffer references canonical YouTube URL downstream
```

Prepared script:

```text
scripts/direct-youtube-canonical-activation.cjs
```

The script:

- checks YouTube OAuth credential presence without exposing values;
- reads the five canonical `measures_media_map` rows;
- prepares upload metadata;
- supports direct upload only when OAuth credentials are supplied;
- supports optional playlist insertion when `YOUTUBE_PLAYLIST_ID` is supplied;
- does not edit or derive media;
- writes a non-secret activation plan.

Execution is intentionally held until credentials exist.

---

## Required Credentials / OAuth Boundary

Missing:

```text
YOUTUBE_CLIENT_ID
YOUTUBE_CLIENT_SECRET
YOUTUBE_REFRESH_TOKEN
```

or:

```text
YOUTUBE_ACCESS_TOKEN
```

Optional:

```text
YOUTUBE_CHANNEL_ID=UC84Jbvswj0ykzd5nuKxoNSA
YOUTUBE_PLAYLIST_ID=<operator-approved playlist id>
```

Required upload scope:

```text
https://www.googleapis.com/auth/youtube.upload
```

Playlist/thumbnail operations require broader YouTube authorization such as:

```text
https://www.googleapis.com/auth/youtube
https://www.googleapis.com/auth/youtube.force-ssl
```

No credential values were stored or exposed.

---

## Canonical Activation Workflow

All five canonical assets were found with public source URLs:

| Asset | Source URL | Standing |
|---|---|---|
| `about_measures_registry.mp4` | `https://media.c3field.online/about_measures_registry.mp4` | held for OAuth |
| `ai_isnt_broken_intro.mp4` | `https://media.c3field.online/ai_isnt_broken_intro.mp4` | held for OAuth |
| `crystal_seat_orientation.mp4` | `https://media.c3field.online/crystal_seat_orientation.mp4` | held for OAuth |
| `obsidian_chamber_orientation.mp4` | `https://media.c3field.online/obsidian_chamber_orientation.mp4` | held for OAuth |
| `assessment_report_orientation.mp4` | `https://media.c3field.online/assessment_report_orientation.mp4` | held for OAuth |

Activation plan:

```text
docs/oar/measures_registry/direct_youtube_canonical_activation_plan_v1.md
docs/oar/measures_registry/direct_youtube_canonical_activation_plan_v1.json
```

No source media was modified.

---

## Registry Evidence Design

DB migration applied live:

```text
supabase/migrations/20260713075607_record_direct_youtube_canonical_activation_authority_v1.sql
```

Seated:

| Registry Surface | Rows / Standing |
|---|---|
| `measures_distribution_executor` | `direct_youtube_api`, held |
| `measures_distribution_channel` | `youtube_measures_registry_direct`, held |
| `measures_publication_campaign.metadata.direct_youtube_canonical_activation` | dashboard/report paths and held disposition |
| `measures_distribution_execution` | 5 held direct YouTube action rows |

All five execution rows have:

- `execution_status: held`;
- `execution_mode: direct_youtube_api`;
- `youtube_video_id: null`;
- `public_url: null`;
- `scheduled_for: null`;
- `published_at: null`;
- `error: missing_youtube_oauth_upload_credentials`.

Upload completion alone is not treated as publication evidence. A future successful run must record the
YouTube video ID, public URL, publication timestamp, publication status, executor, execution mode, and
evidence timestamp.

---

## Buffer Relationship

Buffer is no longer the canonical upload path for institutional media.

Buffer may reference canonical YouTube URLs only after direct YouTube publication evidence exists.

Existing Buffer draft/evidence rows remain preserved as historical proof of routing and scheduler
capability, not as source-of-canonical-media authority.

---

## Safety Confirmation

| Boundary | Result |
|---|---:|
| YouTube upload | false |
| media edit / normalization | false |
| derivative generation | false |
| canonical filename change | false |
| publication copy alteration | false |
| thumbnail redesign | false |
| Registry authority replacement | false |
| Buffer replacement | false |
| renderer / `src` mutation | false |
| secret exposure | false |

---

## Remaining Blockers

1. YouTube OAuth upload credentials are not present in the local secret boundary.
2. Operator must authorize the OAuth boundary for the Measures Registry YouTube channel.
3. Optional playlist ID and thumbnail assets remain unset; upload can proceed without them, but playlist
   insertion and thumbnail setting cannot.

## Final Disposition

HELD WITH REASON
