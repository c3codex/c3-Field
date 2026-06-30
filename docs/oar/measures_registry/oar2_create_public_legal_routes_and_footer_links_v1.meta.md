---
document_type: oar2
authority_level: working
document_scope: launch_legal_routes
title: OAR2 - Create Public Legal Routes and Footer Links
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_compile_legal_identity_and_launch_disclosures_v1.meta.md
---

# OAR2 - Create Public Legal Routes and Footer Links

## GOVERNANCE STANDING

This OAR governs public legal route placement.

It does not govern the operator.

Purpose is to create launch-required public legal routes and link them from the site footer.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

OAR1 seated legal identity and disclosure blocks in DB.

The following remain absent:

- /privacy route
- /terms route
- legal footer links

Legal disclosure content is seated in measures_registry_root.metadata.legal_disclosures.

Measures Registry is a registered branch of C3 COMMUNITY PARTNERS DAO LLC and is not a separate legal entity.

## ALIGNED

Use dedicated static React routes for launch.

Do not expand DB surface dispatch architecture for legal pages in this OAR.

Legal routes communicate standing.

They do not determine standing.

## REQUIRED ACTIONS

### 1. Create /privacy route

Create public route:

- /privacy

Render launch-safe privacy content using seated disclosure blocks where available.

Minimum required sections:

- information collected
- assessment information
- contact information
- email communications
- third-party services
- data retention
- user rights
- contact email
- federal tax status disclosure where relevant
- contributions disclosure where relevant

Contact email:

- connect@measuresregistry.com

### 2. Create /terms route

Create public route:

- /terms

Render launch-safe terms content using seated disclosure blocks where available.

Minimum required sections:

- legal identity
- informational purpose
- no certification by default
- no professional advice
- payment boundaries
- contribution and DAO participation disclosures
- intellectual property
- prohibited use
- limitation of liability
- changes to service
- contact email

Contact email:

- connect@measuresregistry.com

### 3. Add footer legal links

Add footer links:

- Privacy -> /privacy
- Terms -> /terms
- Contact -> /about or existing contact pathway

Footer must preserve existing legal identity statement.

Do not remove current footer copy.

### 4. Preserve route behavior

Do not alter native encounter routing.

Do not change assessment flow.

Do not change payment behavior.

Do not change publication routes.

Do not activate charitable solicitation.

Do not imply federal tax-exempt status.

Do not imply tax deductibility.

## VALIDATION

Return OAR1 evidence showing:

1. /privacy route exists.
2. /privacy renders.
3. /terms route exists.
4. /terms renders.
5. footer links include Privacy and Terms.
6. Contact link resolves to /about or existing contact pathway.
7. existing legal identity footer statement preserved.
8. no federal tax-exempt status implied.
9. no tax deductibility implied.
10. no charitable solicitation activated.
11. no native encounter routes changed.
12. no payment behavior changed.
13. no publication routes changed.
14. build passes.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- Measures Registry is represented as a separate legal entity
- federal tax-exempt status is implied
- tax deductibility is implied
- charitable solicitation is activated
- donation language is added
- legal routes alter encounter routing
- privacy or terms content contradict seated disclosure blocks
- operator is governed instead of the work body

## CLOSE

Create Privacy and Terms routes.

Add footer links.

Preserve seated legal identity.

Nothing is invented.
