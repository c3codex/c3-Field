---
document_type: oar1
authority_level: governance
document_scope: undrifted_editorial_identity_asset_registration
title: OAR1 - Register unDrifted Editorial Identity Assets
closes: OAR/OAR2/publication/oar2_register_undrifted_editorial_identity_assets_v1.meta.md
operator: op044
system: measures_registry
executor: Claude/Cody
date: 2026-07-12
status: registered
disposition: REGISTERED_WITH_MINOR_NORMALIZATION
---

# OAR1: Register unDrifted Editorial Identity Assets

## 1. Asset Registration Confirmation

Both Editorial Identity Assets registered. Neither was assumed present from the OAR2 text — both were verified
against live storage first (§2), since the OAR2 itself instructed the executor to "locate the operator-supplied
asset... and confirm its canonical storage path," not to assume it.

## 2. Canonical Storage Locations

Verified via direct HTTP request to Supabase Storage (bucket `measures-registry`), since the MCP Supabase
management API was unauthenticated in this environment (same limitation encountered earlier this session):

| Asset | Path | Content-Type | Size | Last-Modified |
|---|---|---|---|---|
| Field Findings Section Banner | `measures-registry/field_findings_section_banner_2026_w28_v1.webp` | `image/webp` | 144,616 bytes | 2026-07-12T11:50:04Z |
| unDrifted Response Section Banner | `measures-registry/undrifted_response_section_banner_2026_w28_v1.webp` | `image/webp` | 1,782,830 bytes | 2026-07-12T05:30:22Z |

Both files exist exactly at the paths the OAR2 named. Neither was downloaded or visually inspected — existence,
content-type, and size were confirmed; visual content (correctness of masthead/title/subtitle/motto rendering)
was not.

## 3. Asset Registry Entries

- `Assets/Banners/unDrifted/LaunchCycle001/field_findings_section_banner_2026_w28_v1.meta.md` (new sidecar,
  binary remains in Supabase Storage, no duplicate upload)
- `Assets/Banners/unDrifted/LaunchCycle001/undrifted_response_section_banner_2026_w28_v1.meta.md` (same)
- `Assets/Registry/asset_registry.md` — two new rows added, plus a new "Editorial Identity Assets (New Asset
  Subclass)" section documenting the class definition and the normalization decision (§6).

## 4. Publication-Record Relationships

`docs/_source/codex/publications/publication_record_001_field_findings_2026_w28.meta.md` and
`publication_record_002_undrifted_response_001.meta.md` both updated with an `editorial_identity_asset` field
and a corresponding body section, referencing (not merging into) the respective banner. Per the OAR2's explicit
constraint, neither record's canonical article content, publication standing, title, or voice was touched.

## 5. Version and Checksum Confirmation

Version: `v1` for both, matching filename convention. Checksum: not computed — the OAR2 asked for it "where
current asset conventions support those fields," and no existing banner sidecar in this repo (checked against
the Issue01 banner precedents) records a checksum; ETags were captured instead (`d50869d7df6e86b7c9febd9037aa3d64-1`
and `2086f60def7131aefbbc2e47952ba006-1`), which is the nearest equivalent Supabase Storage actually exposes.

## 6. Asset-Class Normalization Used

`asset_registry.md`'s controlled `asset_type` enum has no `editorial_identity_asset` value. Both rows use
`asset_type: banner` with the subclass noted in the same cell (`banner (subclass: editorial_identity_asset)`)
and in each sidecar's `asset_subclass` field. No enum/schema change was made to the registry itself — this is
the "minor normalization" driving this OAR1's disposition.

## 7. Unresolved Media-Delivery Issues

The OAR2 asked the executor to "confirm whether public rendering should use direct bucket paths, signed URLs,
copied public assets, or an existing governed media-delivery path." Not resolved in this pass: the two files
were confirmed reachable at public bucket URLs (`.../storage/v1/object/public/measures-registry/...`), which
matches the pattern already used by other unDrifted banners in this registry (e.g. the Issue01 banners), but no
comparison was made against `src/shared/media/runtimeMediaUrl.ts` (the existing governed media-delivery
resolver mentioned in this session's `c3field.online` advisory) to confirm this is the intended long-term path
rather than a direct-URL shortcut. Flagged as open, not silently assumed correct.

## 8. Ledger Note Handling

`docs/_source/codex/ledger/c3_ledger_0003_governance_enables_regeneration.meta.md`'s note field was extended,
not rewritten: the original 2026-07-12 observation (that Editorial Identity Assets were unconfirmed) is
preserved verbatim, with a clearly separated "Registration-status update" appended stating the gap has since
been closed, referencing this OAR2. A `related_oars_subsequent` frontmatter field was added to record the
forward relationship distinctly from `related_oars` (the entry's originating OARs) — no historical field was
altered.

## 9. Final Disposition

**REGISTERED WITH MINOR NORMALIZATION.** Both assets registered and confirmed present in storage; the only
deviation from the OAR2's literal request is the `asset_type` enum normalization (§6), which the OAR2 itself
explicitly anticipated and authorized as an acceptable outcome.

---

## Constraints Confirmed

No new publication, publication family, or unDrifted system was created. Measures Registry authority was not
modified. Neither approved article was modified. No artwork was generated or redesigned. No social posts were
created. Nothing was published. No additional c3 Field architecture was activated. No database migration was
created — this registration path (filesystem sidecar + existing asset_registry.md) supported the records
without one. No assumption was made that every publication graphic is an Editorial Identity Asset — only the
two named banners were registered as this class.
