---
document_type: oar1
authority_level: operational
document_scope: launch_cycle_001_field_findings_public_derivative_correction_closeout
title: OAR1 - Correct Field Findings Public Derivative Encoding, Ending, and Source Links
version: v1
status: completed
operator: op044
system: codex
executor: Cody
date: 2026-07-13
initiative: Measures Registry / unDrifted
publication_key: undrifted
launch_cycle: launch_cycle_001
publication_id: publication_001
asset_id: field_findings_2026_w28_public_article_v2
source_oar2: docs/oar/measures_registry/oar2_correct_field_findings_public_derivative_encoding_ending_and_source_links_v1.meta.md
evidence_artifact: docs/oar/measures_registry/field_findings_public_derivative_correction_evidence_v1.json
release_state: hold_pending_operator_approval
recommendation: ready_for_operator_publication_review
---

# OAR1 - Correct Field Findings Public Derivative Encoding, Ending, and Source Links

## Corrected Asset

Before and after asset path:

```text
Assets/Articles/unDrifted/LaunchCycle001/registered/field_findings_2026_w28_public_article_v2.md
```

Prior registered checksum:

```text
73CDC79845AE7924719680E46DBBA000F17B4ABA2EBF9299EC50DAC79DF37DD3
```

Corrected checksum:

```text
07BC2BA306B87780E96A1EFE722EBC726DD8A06C603D74C2DEBC282CC94DD537
```

The internal source record remains unchanged:

```text
Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_field_findings_2026_w28_article_v1.md
FF491C9478AE3D2B6FA9FD59FED7608ED29B1C37BF2CC2D53234195AD1D95806
```

## Corrections Applied

- Restored UTF-8 en dash in `July 4–10, 2026`: 1 occurrence.
- Restored UTF-8 em dash in drift-indicator separators: 7 occurrences.
- Added the five verified source links specified by OAR2.
- Restored `Longitudinal Baseline` verbatim as the final public article section.
- Removed public derivative frontmatter fields that exposed the internal source path and checksum into the public JS bundle.
- Preserved the public derivative asset identity.

Mojibake marker scan on corrected derivative: zero matches for `â`, `Â`, `Ã`, `�`.

Internal-governance marker scan on corrected derivative: zero matches.

## Changed Files

- `Assets/Articles/unDrifted/LaunchCycle001/registered/field_findings_2026_w28_public_article_v2.md`
- `docs/_source/codex/publications/publication_record_001_field_findings_2026_w28.meta.md`
- `docs/oar/measures_registry/oar2_correct_field_findings_public_derivative_encoding_ending_and_source_links_v1.meta.md`
- `OAR/OAR1/publication/oar1_correct_field_findings_public_derivative_encoding_ending_and_source_links_v1.meta.md`
- `docs/oar/measures_registry/field_findings_public_derivative_correction_evidence_v1.json`

No migration, runtime source, route, social, or Buffer files were changed.

## Publication Execution

Build:

```text
npm run build:registry
result: pass
```

Paragraph:

- method: `PUT /api/v1/posts/8UdwP2yt8pw9FacBWIbw`
- URL: `https://paragraph.com/@undrifted/field-findings-2026-w28`
- status: `published`
- `sendNewsletter`: `false`
- duplicate post created: no

Deployment:

- pushed commit: `c079f94b8f9ca664d6583b60612e6acb61c1b82c`
- deployment authority: existing push-triggered Measures Registry production path
- deployment CLI/run ID: unavailable locally (`gh` not installed; Wrangler not used)
- deployed route status: `200`
- deployed entry bundle: `https://measuresregistry.com/assets/index-RBiJi1DK.js`
- deployed article bundle: `https://measuresregistry.com/assets/LapisChamberRenderer-A_HVeQt8.js`

Cache purge:

- Cloudflare purge performed: no
- reason: no non-Wrangler purge authority available in this thread
- replacement evidence: cache-busted production HTML, bundle, Paragraph, feed, metadata, and hydrated DOM checks

## Public Verification

Measures Registry route:

```text
https://measuresregistry.com/undrifted/field-findings-2026-w28/
```

Production byte-decoded article-body verification:

- `Longitudinal Baseline`: present
- five verified source links: present
- `July 4–10, 2026`: present
- drift-indicator em dash separators: present
- internal source path/checksum: absent
- incident markers: zero
- mojibake markers: zero

Hydrated DOM verification:

- desktop viewport `1440x1000`: pass
- mobile viewport `390x844`: pass
- required article text present: yes
- five source links present: yes
- forbidden text/HTML markers: zero

Browser connector note:

- in-app Browser bootstrap failed with `missing field sandboxPolicy`;
- standalone Playwright was used for hydrated desktop/mobile verification.

Metadata, structured-data, feed, and preview checks:

- route title: `Field Findings 2026-W28 | unDrifted`
- canonical URL: `https://measuresregistry.com/undrifted/field-findings-2026-w28`
- Open Graph title/description: present
- structured data: present
- feed surfaces checked: `/feed.xml`, `/rss.xml`, `/atom.xml`, `/undrifted/feed.xml`
- sitemap checked: `/sitemap.xml`
- forbidden markers across checked metadata/feed surfaces: zero

Source-link resolution:

- Carnegie Endowment for International Peace: `200`
- The Register: `200`
- Google Cloud: `200`
- Cloud Security Alliance / Zenity: `200`
- NIST / CAISI: `200`

## Social Standing

No Buffer derivative was created, scheduled, recreated, approved, or sent under this OAR2.

The publication hold remains active pending operator approval.

Final recommendation:

```text
ready_for_operator_publication_review
```

---

END OAR1
