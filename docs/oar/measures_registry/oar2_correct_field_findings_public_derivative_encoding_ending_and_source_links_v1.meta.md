---
document_type: oar2
authority_level: operational
document_scope: launch_cycle_001_field_findings_public_derivative_correction
title: OAR2 - Correct Field Findings Public Derivative Encoding, Ending, and Source Links
version: v1
status: routed_for_immediate_execution
operator: op044
system: codex
executor: Cody
date: 2026-07-13
initiative: Measures Registry / unDrifted
publication_key: undrifted
launch_cycle: launch_cycle_001
publication_id: publication_001
asset_id: field_findings_2026_w28_public_article_v2
continues: docs/oar/measures_registry/oar2_immediately_contain_codex_governance_leak_and_restore_publication_boundary_v1.meta.md
release_state: hold_pending_operator_approval
---

# OAR2 - Correct Field Findings Public Derivative Encoding, Ending, and Source Links

## Observed

The registered public derivative for `Field Findings 2026-W28` has passed the internal-governance boundary review. No public Codex, OAR, Ledger, Standing Review, maturation-governance, or internal routing material remains.

The derivative is not yet approved for release because three bounded publication defects remain:

1. UTF-8 punctuation is visibly corrupted.
2. The article ends abruptly after `Computational Systems Governance` because the public-safe `Longitudinal Baseline` was removed with the internal appendix.
3. The named sources are not linked to their verified public locations.

Affected registered derivative:

```text
Assets/Articles/unDrifted/LaunchCycle001/registered/field_findings_2026_w28_public_article_v2.md
```

Current registered checksum before this correction:

```text
73CDC79845AE7924719680E46DBBA000F17B4ABA2EBF9299EC50DAC79DF37DD3
```

The article is already publicly addressable on Measures Registry and Paragraph. Corrections must therefore update the registered asset and both public projections without creating a competing article or URL.

## Aligned

### Correction Boundary

This is a mechanical and previously authored publication correction. It does not authorize a conceptual rewrite, new research claim, new finding, new source, new section beyond the previously authored public-safe baseline, or restoration of any internal governance appendix.

The following content classes remain prohibited from the public derivative:

- Codex as an internal authority or addressee;
- OAR execution or advisory routing;
- internal Ledger keys or maturation procedures;
- Standing Review eligibility or disposition;
- internal authority-change instructions;
- internal registry implementation details;
- unpublished SEAT criteria or deliberation;
- `Recommended Institutional Actions`;
- `Standing Impact`;
- the internal `Ledger Review` appendix.

### Required Correction 1 - Repair Encoding

Repair every mojibake sequence in the public derivative using UTF-8 without BOM.

At minimum, correct:

```text
July 4â€“10, 2026
```

to:

```text
July 4–10, 2026
```

Correct every drift-indicator separator currently rendered as:

```text
â€”
```

to:

```text
—
```

Scan the complete file for malformed UTF-8 sequences, including but not limited to:

```text
â€
â€™
â€œ
â€
Â
�
```

The corrected registered asset, generated projection, HTML, Paragraph payload, metadata, and social-source payload must contain zero mojibake markers.

### Required Correction 2 - Restore the Public-Safe Ending

Restore the following previously authored section verbatim after `Computational Systems Governance`:

```markdown
## Longitudinal Baseline

This is the first formal weekly Field Findings sweep.

Its baseline observation is:

> By July 2026, mainstream enterprise security, cloud infrastructure, standards, and policy discourse had begun converging on the need to govern AI agents as operational actors. However, most remedies remained focused on controls applied after deployment rather than determining whether the receiving environment and assigned institutional function were governable before deployment.
```

Do not append `Ledger Review`, `Candidate Relational Points of Contact`, `Candidate New Inquiry`, `Recommended Institutional Actions`, `Standing Impact`, or any internal routing language after the restored baseline.

The `Longitudinal Baseline` is the final public article section unless an already registered public footer or attribution component is rendered separately by the publication system.

### Required Correction 3 - Add Verified Source Links

Convert the titles in `Sources Examined` into Markdown links using these verified URLs:

1. Carnegie Endowment for International Peace:

```text
https://carnegieendowment.org/europe/research/2026/07/when-ai-agents-attack-autonomous-cyber-operations-and-europes-governance-gap
```

2. The Register:

```text
https://www.theregister.com/security/2026/07/07/enterprise-ai-still-smarting-from-leaping-before-looking/5267353
```

3. Google Cloud:

```text
https://cloud.google.com/blog/products/ai-machine-learning/20-questions-for-the-agentic-enterprise
```

4. Cloud Security Alliance / Zenity:

```text
https://cloudsecurityalliance.org/artifacts/enterprise-ai-security-starts-with-ai-agents
```

5. NIST / CAISI:

```text
https://www.nist.gov/publications/summary-analysis-responses-request-information-regarding-security-considerations-ai
```

Preserve the existing source names, titles, groupings, and publication dates. Add links without rewriting the source descriptions.

Do not add tracking parameters, affiliate parameters, redirectors, invented citations, or inaccessible internal URLs.

### Source and Statistical Preservation

The verified source set supports the article's existing source identities and core figures. This OAR2 does not authorize statistical rewriting.

Preserve attribution distinctions:

- The Register reported on DigiCert's research.
- DigiCert is the underlying source for the enterprise survey figures described in Significant Development 2.
- CSA/Zenity is the underlying source for the contextual figures concerning permission exceedance, agent incidents, unsanctioned agents, ownership, and response time.
- NIST/CAISI is the source for the institutional finding that established cybersecurity practices remain relevant but require adaptation for AI agents.

If implementation reveals a factual mismatch not covered by this OAR2, hold that specific statement and report it. Do not silently rewrite it.

### Registry and Checksum Update

After applying the bounded corrections:

1. Calculate the corrected asset SHA256.
2. Update the registered checksum and version evidence using the existing asset-registry convention.
3. Preserve the relationship to the unchanged internal source record.
4. Preserve the public derivative asset identity unless the registered versioning convention requires a new version.
5. If a new version is required, supersede v2 explicitly and repoint every public release surface to the corrected version.
6. Do not alter the internal source record or its checksum.

### Measures Registry Update

Update the existing public route without changing its URL:

```text
https://measuresregistry.com/undrifted/field-findings-2026-w28
```

Verify that the production article:

- renders correct UTF-8 punctuation;
- contains the restored `Longitudinal Baseline`;
- ends cleanly after the baseline;
- contains all five verified source links;
- contains zero incident markers;
- contains zero mojibake markers;
- does not expose the internal source path or checksum;
- preserves the existing title, article body, public Measures Registry relation, and stable URL.

### Paragraph Update

Update the existing Paragraph post in place. Do not create a duplicate post or change its public URL.

Existing post:

```text
post_id: 8UdwP2yt8pw9FacBWIbw
url: https://paragraph.com/@undrifted/field-findings-2026-w28
```

Required Paragraph outcome:

- corrected UTF-8 punctuation;
- restored public-safe baseline;
- five verified source links;
- no internal governance material;
- no duplicate newsletter send;
- no new subscriber notification unless separately authorized;
- unchanged public URL.

### Cache and Preview Verification

After deployment and Paragraph update:

1. Purge or invalidate the affected Measures Registry route where current authority permits.
2. If direct Cloudflare purge authority remains unavailable, use cache-busted requests and record that limitation.
3. Verify raw HTML and hydrated DOM from a fresh browser context.
4. Verify title, description, canonical URL, Open Graph data, structured data, feed content, and preview payloads contain no mojibake or internal incident markers.
5. Confirm all five source links resolve successfully without changing the article route.

### Buffer and Social Standing

Do not recreate or publish Buffer derivatives under this OAR2.

The publication hold remains active pending operator review of the corrected rendered article and a subsequent explicit release authorization.

Existing connected endpoint standing remains observational only:

- Measures Registry YouTube;
- Measures Registry Instagram;
- Measures Registry X;
- Measures Registry Facebook;
- unDrifted Facebook;
- unDrifted X.

Do not connect new endpoints or create new social copy.

### Explicit Exclusions

This OAR2 does not authorize:

- restoration of internal governance sections;
- changes to the internal research record;
- new editorial claims or analysis;
- broad redesign of `/undrifted`;
- active Issue 01 redesign or projection work;
- Buffer draft recreation or social publication;
- changes to Response 001;
- changes to assessment, MAP, Stripe, payment, certification, c3 Key, DAO, or encounter sequence;
- exposure of credentials, internal paths, private metadata, or secrets on public surfaces.

## Routed

### Execution Route

1. Read the registered public derivative and this OAR2.
2. Preserve the internal source record unchanged.
3. Repair all mojibake sequences using UTF-8 without BOM.
4. Restore the authorized `Longitudinal Baseline` verbatim.
5. Add the five verified source links to `Sources Examined`.
6. Scan the full derivative for prohibited internal-governance and encoding markers.
7. Calculate and register the corrected checksum.
8. Update the Measures Registry projection from registered asset state.
9. Build and test locally.
10. Deploy through the existing Measures Registry production authority.
11. Update the existing Paragraph post in place without newsletter send.
12. Purge or independently invalidate/verify affected caches where authorized.
13. Verify Measures Registry and Paragraph on desktop and mobile.
14. Return OAR1 with complete evidence and keep social release held.

### Required OAR1 Evidence

The OAR1 must include:

- exact asset path before and after correction;
- prior checksum and corrected checksum;
- confirmation that the internal source record and checksum are unchanged;
- complete list of repaired encoding sequences and occurrence counts;
- confirmation that the baseline was restored verbatim;
- confirmation that all five verified source links are present;
- prohibited internal-governance marker scan result;
- mojibake marker scan result;
- exact registry, source, projection, migration, metadata, or script files changed;
- commit SHA and push evidence;
- deployment identifier, deployed commit, and deployment status;
- build and test results;
- Measures Registry desktop/mobile verification;
- Paragraph update method, post ID, URL, result, and `newsletter_send: false` evidence;
- raw HTML, hydrated DOM, metadata, structured-data, feed, and preview verification;
- source-link resolution results;
- cache purge evidence or explicit statement that purge authority remained unavailable;
- confirmation that no Buffer derivative was created, scheduled, or sent;
- confirmation that the publication hold remains active pending operator approval;
- recommendation: `ready_for_operator_publication_review` or `correction_incomplete`.

### Completion Condition

This OAR2 is complete when:

1. the registered public derivative contains correct UTF-8 punctuation;
2. the public-safe `Longitudinal Baseline` is restored verbatim as the ending;
3. all five verified source links are present;
4. the registered checksum and public projection are updated;
5. Measures Registry and Paragraph render the corrected article at their existing URLs;
6. all public surfaces contain zero internal-governance and mojibake markers;
7. no social derivative has been recreated or released;
8. OAR1 returns sufficient evidence for operator publication review.

---

## Operator Direction

Apply only the bounded publication corrections authorized here. Preserve the article's analysis and the internal research record. Return the corrected public article for operator review before any social release resumes.
