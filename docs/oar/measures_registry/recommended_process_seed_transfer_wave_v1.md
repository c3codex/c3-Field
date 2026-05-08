---
document_type: transfer_evidence
title: Recommended Process Seed Transfer Wave Evidence
version: v1
source_oar2: oar2_recommended_process_seed_transfer_wave_v1.meta.md
status: transfer_complete_seeded_standing_withheld
---

# Recommended Process Seed Transfer Wave Evidence

## Result

The recommended transfer wave completed against the private `measures-seed` Supabase storage bucket.

Seeded standing was not claimed.

## Bucket

- bucket: `measures-seed`
- private: true
- transfer count: 5

## Transferred Objects

| relation | source path | object path | bytes | sha256 |
| --- | --- | --- | ---: | --- |
| governing_candidate | `docs/process/oar_lifecycle.meta.md` | `process/oar_lifecycle.meta.md` | 1757 | `49695b1300c6bd08792fd83f857481668f03772b2860483c5025f9ed1c818dac` |
| governing_candidate | `docs/process/oar/oar2_generation_and_handoff_process.meta.md` | `process/oar/oar2_generation_and_handoff_process.meta.md` | 781 | `d4af3dbbd75b3c6dd220d35f131895cd106f0529515b018492315af68faf84e7` |
| reference_candidate | `docs/process/oar/templates/oar1_template.meta.md` | `process/oar/templates/oar1_template.meta.md` | 350 | `ebf40cf7e5cad96549dde3440530f7437634fdef7561c55fb8d55fc6a23ca309` |
| reference_candidate | `docs/process/oar/templates/oar2_template.meta.md` | `process/oar/templates/oar2_template.meta.md` | 553 | `9691bd40b7e5982f7856a22b66855c6824545dffa486c28d2640cdac08209a9d` |
| reference_candidate | `docs/process/oar/db_role_contract_supabase.meta.md` | `process/oar/db_role_contract_supabase.meta.md` | 932 | `f63472af6ac373ac460da2fb644015bfcc349180bca13fffb05951480fd958be` |

Each transferred object was listed, downloaded, and matched source bytes and SHA-256.

## Held Candidates

The following held candidates were not transferred:

- `process/publication/new-publication-dispatch.ps1`
- `process/oar/new-oar.ps1`

## NotChazz

The execution preserved the seeded authority distinction:

- bucket transfer was not treated as seeded
- reference candidates were not promoted to governing standing
- held tool/script candidates were not transferred
- bulk seeding was not performed
