# OAR2 · Establish 4.7% Field Reporter Publication Surface

operator: op044
authority: operator
action: establish_47pct_field_reporter_publication_surface
initiative: 47pct
publication_authority: c3_registrar
desk: 47pct_desk
editorial_voice: mapped_and_measured

## Required result

Establish a minimal functional c3 Registrar — Field Reporter publication encounter inside the existing 47pct.c3field.online surface. This is a bounded publication surface, not a redesign.

Canonical route pattern:
- /field-reporter/<publication-slug>
- first publication: /field-reporter/the-cost-of-a-claim

The route must resolve registered publication state from Registry authority and must not invent article body, media, evidence, standing, or canonical URL in frontend source.

For The Cost of a Claim:
- publication object: 47pct_mm_cost_of_a_claim_v1
- PubPAC: pubpac_47pct_mapped_measured_cost_claim_v1
- registration: c3reg_pub_47pct_mm_cost_claim_v1
- desk: 47pct_desk
- authority: c3_registrar
- banner: 47pct_mm_cost_of_a_claim_banner_v1
- inline visual: 47pct_mm_fy2024_money_out_visual_v1
- article member: 47pct_mm_cost_of_a_claim_article_v1
- evidence: evidence_pac_47pct_v1

## Critical body rule

Registry currently records REGISTRY_APPROVED_BODY_NOT_YET_PERSISTED_TO_RUNTIME. Do not reconstruct, summarize, infer, or manufacture the approved article body from metadata or conversation summaries. If the exact approved body is not available from authoritative persisted custody, return/hold the publication encounter on that exact predicate rather than publishing substitute prose.

## Publication lifecycle

PubPAC -> NotChazz -> Registrar -> FREE -> Field Reporter encounter -> PUBLISH -> canonical live URL + publication evidence return.

After successful live publication, register the exact canonical article URL and publication evidence. Only then may distribution standing advance for Lapzuli.

Lapzuli distributes only. It does not publish.
Paragraph/social readiness must not block Field Reporter publication.

## Minimal presentation

Functional first. Use existing 4.7% visual language and current WebPAC shell. Required visible identity only:
- c3 Registrar — Field Reporter
- 4.7% Desk
- Mapped & Measured
- publication title
- registered media/body/evidence projection when authoritative state permits

No beautification work is required in this OAR.

## Naming guard

Do not create new filenames or object identifiers containing the token "contract" unless the object is an actual Web3 smart contract. Use binding, definition, specification, interface, manifest, protocol, or rule as appropriate.

## Effects

Source/database/deploy changes required to establish the encounter are authorized.
No social or Paragraph distribution is authorized by this OAR.
Return OAR1 with source commit, deployment receipt, live route readback, Registry mutations, canonical URL if publication succeeds, and exact hold predicate if publication cannot succeed.
