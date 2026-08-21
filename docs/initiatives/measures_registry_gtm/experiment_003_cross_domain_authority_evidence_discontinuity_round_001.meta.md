# Experiment 003 — Cross-Domain Authority / Evidence Discontinuity — Round 001

status: research_only
branch: gtm-ledger-v1
operator: op044
chazz_role: research formation / evidence synthesis
registry_mutation: none

## Research question
When consequential work crosses independent organizational or system domains, does a discontinuity between represented governance state and actual system state create measurable operational or financial burden?

## Primary case: Login.gov IAL2 cross-agency dependency

### Domains
- originating / providing domain: GSA / Login.gov
- relying domains: customer federal agencies using or planning to use Login.gov for higher-assurance identity proofing
- external standard domain: NIST SP 800-63-3 IAL2 requirements

### Consequential relationship
GSA represented Login.gov to customer agencies as satisfying IAL2 identity-proofing requirements. Customer agencies relied on that represented state in interagency agreements, planning, procurement, and identity-assurance decisions.

### Observed discontinuity
GSA OIG found Login.gov had never included the physical or biometric comparison required for IAL2 and that customer agencies were not timely informed of the noncompliance. The represented governance/capability state therefore did not match the actual service state.

### Measurable burden / consequence
Observed:
- 22 customer agencies were billed for purported IAL2 services.
- GSA billed more than $10 million for services that did not meet IAL2 requirements.
- SBA paused plans to use Login.gov after the noncompliance became known and performed additional data calls and reviews to understand cost and security issues.
- Twelve of 21 agencies later surveyed by GAO reported challenges related to Login.gov's noncompliance with IAL2 guidance.
- Federal agencies reported approximately $209 million in commercial identity-verification spending versus $32.5 million on Login.gov during FY2020-2023; commercial spending reflected, among other factors, capabilities Login.gov did not provide. This aggregate spending comparison must not be attributed solely to the discontinuity event.

### Repair / continuity restoration
Observed:
- GSA updated public documentation and notified partner agencies of the true IAL1 state after the OIG findings.
- GSA later implemented additional identity-proofing functionality.
- By March 2025, Login.gov completed a remote IAL2 pilot and a third-party reviewer helped confirm the functionality worked as intended; Login.gov then began offering remote IAL2 services.

### Evidence-state interpretation
This case demonstrates that cross-domain operational burden can arise when one domain's represented standing/capability is not synchronized with its actual state and relying domains cannot independently verify the mismatch before acting.

The strongest supported sequence is:
represented standing -> reliance by autonomous domains -> actual-state mismatch -> delayed discovery -> pause / re-review / financial consequence -> corrected representation -> independent verification -> restored usable standing.

### What this supports
- Cross-domain governance-state discontinuity is observable.
- The discontinuity can produce measurable financial and operational consequences.
- Independent or externally reviewable verification can be part of restoring trusted standing.
- Access to a service or an interagency agreement did not itself establish the truth of the service's claimed assurance state.

### What this does NOT yet support
- It does not prove Measures Registry would have prevented the failure.
- It does not prove a neutral relationship-state layer is the only or best remedy.
- It does not isolate the exact share of downstream commercial spending caused by the discontinuity.
- It does not establish a general causal law from one case.
- It does not establish that all cross-domain relationships require the same governance-state bundle.

## Secondary corroborating case: IRS / ID.me contracted AI oversight gap

Observed:
- IRS relied on ID.me as its sole IAL2 credential service provider for many applications.
- Users accessed IAL2 applications more than 150 million times from 2021-2024.
- IRS had not included ID.me's AI technologies in its AI inventory as of March 2025 and had therefore not applied its own required AI oversight process to those uses.
- IRS officials reported $234.7 million obligated for ID.me licenses and support services from June 2021 to April 2025.
- GAO found gaps in measurable objectives, independent evaluation, and internal communication of vendor performance data.
- In September 2025 IRS added two identity-proofing use cases to its internal AI inventory; by June 2026 those use cases had passed several required oversight steps, including preliminary high-impact determination and assignment of an accountable agency official.

Interpretation:
This corroborates the broader mechanism: a consequential capability can be operationally present across an institutional boundary while its governance state is absent or incomplete in the relying institution's own control system. Later repair consisted of bringing the external capability into the institution's own inventory and oversight path.

## Current experimental disposition
result: strong_support_for_cross_domain_discontinuity_mechanism
causal_strength: moderate
mr_specificity: unproven

This is the strongest empirical support so far for the narrow thesis that consequential relationships crossing autonomous domains can carry a state mismatch that creates measurable burden when represented authority, evidence, or standing is not current and independently verifiable.

## Candidate relation-state variables surfaced by the case
- service / capability identity
- claimed assurance / standing
- actual assurance / standing
- governing standard
- source of representation
- relying authority
- evidence of compliance
- change/noncompliance event
- notification timestamp
- discovery timestamp
- reviewer / verifier
- financial reliance
- operational reliance
- corrective action
- restored standing

## Falsifier carried forward
The MR differentiation narrows substantially if widely deployed mechanisms already provide relying institutions with current, independently verifiable, cross-domain standing plus change notification, evidence, exception state, and closure/disposition without requiring repeated manual reconstruction.

## External sources
- GSA OIG, "GSA Misled Customers on Login.gov’s Compliance with Digital Identity Standards," Report JE23-003, March 7, 2023.
- GAO-25-106640, "Identity Verification: GSA Needs to Address NIST Guidance, Technical Issues, and Lessons Learned."
- GAO-25-107000, "Identity Verification: GSA Should Demonstrate Its Implementation of Policies for Testing Data Backups on Login.gov."
- GAO-26-109261, "Identity Verification: GSA Needs to Address Fraud Threats and Technical Issues."
- GAO-25-107273, "Taxpayer Identity Verification: IRS Should Strengthen Oversight of Its Identity-Proofing Program."
- GAO-26-107522, "Artificial Intelligence: IRS Actions Needed to Address Skills Gaps, Information Quality, and Strategic Management."
