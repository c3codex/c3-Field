# OAR2 · Bind CampaignPac Speaking Identity Into Lapzuli Runtime v1

Operator: op044
Authority: Operator
Standing: approved for bounded implementation
External effects authorized: 0

## Established state
The operator-established Registry process campaignpac_responsibility_boundary_v1 defines:
- PubPac = WHAT: published object, canonical publication identity/URL, source/media custody, publication standing/evidence/authority.
- CampaignPac = WHO / WHERE / HOW: public speaking identity, destination/account selection, destination derivatives/captions, CTA treatment, sequence/scope, campaign authorization, return-evidence requirements.
- Lapzuli = distribution capability/executor. It may not choose publisher, public speaking identity, or campaign authority.
- Evidence = what actually happened.
Destinations are replaceable reachable capabilities and do not own the environment or identity.

Issue 003 CampaignPac campaign_pac_undrifted_issue003_published_recovery_v1 explicitly carries public_speaking_identity=unDrifted and responsibility_boundary=campaignpac_responsibility_boundary_v1. Preserve historical evidence.

## Defect
The generalized FREE/Lapzuli resolver resolves route, asset, desk/outlet, channel, executor and provider but does not yet require CampaignPac public speaking identity as an upstream governed input.

## Required implementation
1. Resolve the CampaignPac governing the exact distribution route/object from existing Registry relations/state. Do not infer speaker from outlet/account, desk, hostname, frontend, or executor.
2. Require explicit CampaignPac public_speaking_identity before a NEW distribution encounter may be EXECUTABLE.
3. Return public_speaking_identity separately from destination/account in FREE/Lapzuli preflight/readback.
4. Preserve PubPac as source WHAT. Do not move publication custody/body/canonical publication authority into CampaignPac.
5. Lapzuli may consume resolved speaker but may not create, choose, substitute, or rewrite it.
6. Preserve source holds, duplicate guards, qualification constraints, provider preflights and return-evidence requirements.
7. Preserve historical routes/evidence unchanged. Missing historical speaker state must be reported, not invented.
8. Update generalized runtime/API/portal readback and tests; no destination-specific workaround.
9. No external distribution under this OAR2.

## Required proofs
- unDrifted CampaignPac + facebook_measures_registry resolves WHO=unDrifted and WHERE=facebook_measures_registry.
- same PubPac/object can participate in different CampaignPacs/speakers without changing PubPac.
- missing CampaignPac speaker prevents a new EXECUTABLE result.
- executor/outlet/desk cannot substitute for speaker.
- existing holds and duplicate evidence still win.
- dry-run/preflight creates zero external effects.

## OAR1 return
Return through registered CanCom lifecycle with source commits, Registry mutations if any, tests/build, deployment receipt/readback if deployed, live dry-run showing speaker and destination separately, historical records changed count, external effects=0, and exact HLD predicate if incomplete.
