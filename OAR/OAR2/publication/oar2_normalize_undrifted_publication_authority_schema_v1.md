# OAR2 · Normalize unDrifted Publication Authority Schema v1

## Identity
- OAR2: oar2_normalize_undrifted_publication_authority_schema_v1
- Execution instance: normalize_undrifted_publication_schema_codex_008
- Operator: op044
- Registrar: chazz
- Executor: codex
- System: c3ops
- Process: cancom_oar_delivery_retrieval_v1
- Origin: unDrifted DesignPAC implementation HLD #3 schema review
- Operator confirmation: confirmed in thread 2026-10-05

## Objective
Normalize the unDrifted publication authority model so one governed fact has one canonical writable authority. Competing representations must become explicitly derived/cache, evidence-only, or obsolete. Preserve historical contradictory values as provenance. Do not make new editorial decisions.

## Confirmed authority decisions
1. Active Issue authority: measures_publication_release. Publication registry issue_record and WebPAC current issue/release are derived projections.
2. Feature authority: active release Feature relation. Issue-page featured_article flags are derived and may not independently select Feature. Current State / c3 Field Environment remains the confirmed Issue 003 Feature.
3. Issue membership authority: released + visible issue-page relations. Release/package arrays and summaries are derived.
4. Desk membership authority: issue-page to registered Desk relation. Repeated labels/eligibility metadata are derived.
5. Desk lead authority: registered resolution rule applied to eligible issue membership. Explicit *_desk_object_key and latest_current_candidate values are derived/cache only and may not override the rule.
6. Article route/public body authority: measures_publication_dispatch and admitted FREE/runtime binding. Issue-page route/live metadata and SEO canonical URL are derived; metadata cannot manufacture publication standing.
7. Media identity/integrity authority: registered asset/runtime binding. URLs, hashes, and verification observations copied into issue-page/release metadata are derived/evidence only.
8. Archive authority: frozen historical release/index. WebPAC/renderer may render verified historical state but may not reconstruct or invent missing final authority.
9. Presentation authority: BrandPAC + DesignPAC + PubPAC resolved through WebPAC; renderer consumes resolved authority and does not become authority.

## Required work
A. Inspect current schema, functions, triggers, views, JSON metadata writers/readers, FREE resolution, WebPAC resolution, and publication renderer inputs that write or consume the facts above.
B. Produce a responsibility map for each duplicated semantic fact: canonical source; derived projections; evidence-only fields; obsolete fields; all current writers/readers.
C. Implement the minimum schema/function normalization necessary to prevent independently writable duplicate authority.
D. Where compatibility requires a projection/cache, derive it deterministically from canonical authority and label it derived; it must not be accepted as authority on write/read paths.
E. Preserve displaced/conflicting prior values in evidence/provenance. Do not delete historical evidence.
F. Recompute Issue 003 derived state from canonical authority and prove that the result is internally coherent.
G. Re-run the DesignPAC implementation preflight/acceptance predicates affected by this schema defect. Do not alter the DesignPAC implementation merely to satisfy authority checks.

## Explicit Issue 003 expected derivations
- Feature resolves to undrifted_issue003_current_state_c3_field_environment.
- Hole in the Map does not independently assert Feature.
- Desk lead resolution follows the registered desk resolution rule; stale explicit desk pointers cannot override it.
- If the current rule resolves Drift Report to DR006, report that derived result rather than making an editorial selection.

## HOLD / exclusion boundary
Do NOT:
- invent or promote a dispatch/body/route/FREE binding for Current State or any other object;
- promote custody-only PubPAC material into issue membership;
- fabricate archive final state for Issues 001/002;
- convert media observation into standing without the registered authority transition;
- change editorial membership, Feature selection, Desk rule, publication copy, BrandPAC, DesignPAC, or WebPAC authority;
- deploy the DesignPAC renderer under this OAR2;
- perform external publication/distribution/correspondence;
- erase contradictory historical metadata/evidence.

If normalization requires an editorial or authority decision not already enumerated above, HOLD and return exact evidence.

## Validation
Return PASS/HOLD for:
1. one canonical writable source per governed publication fact;
2. derived projections cannot override canonical authority;
3. Issue 003 Feature singularly resolves Current State;
4. Desk leads resolve deterministically from registered rule;
5. route/body/FREE authority remains dispatch/binding-owned;
6. media integrity standing remains asset/binding-owned;
7. archive missing authority remains HOLD rather than invention;
8. BrandPAC/DesignPAC/PubPAC -> WebPAC -> renderer boundary remains intact;
9. historical conflicting values retained as evidence;
10. no unauthorized editorial/publication/external effects.

## OAR1 required
Return exact:
- schema/function/view/trigger changes;
- Registry mutations;
- before/after semantic authority map;
- Issue 003 derived fixture;
- validation matrix 1-10;
- retained evidence references;
- source commits, if any;
- DB migration identifiers, if any;
- external effects;
- unresolved HOLDs;
- explicit statement whether the original DesignPAC OAR2 can resume without further schema normalization.

Thread -> confirmation -> CanCom -> execution -> return -> Chazz review -> Operator disposition.
