---
document_type: clarification
authority_level: governance
document_scope: c3_ledger_relational_maturation_architecture_analysis
title: Codex Clarification — Relational Points of Contact
related_advisory: OAR/OAR1/codex/oar1_analyze_c3_ledger_relational_maturation_and_standing_readiness_v1.meta.md
operator: op044
system: codex
executor: Claude
date: 2026-07-10
status: accepted
disposition: incorporate_into_future_registration_oar2
---

# Codex Clarification — Relational Points of Contact

## Related Advisory

`OAR/OAR1/codex/oar1_analyze_c3_ledger_relational_maturation_and_standing_readiness_v1.meta.md`

## Purpose

Refine the terminology used in the Ledger maturation advisory before the registration OAR2 is composed.

The architectural recommendation remains accepted:

- Ledger entries should remain stable records.
- Maturation should accumulate around the entry rather than forcing the entry through an artificial linear
  lifecycle.
- Distinct forms of observation, application, contradiction, review, and evidence should be recorded as
  accumulating relational records.
- Crossing a diversity threshold may establish eligibility for Standing Review but must never grant standing
  automatically.

The term **reference**, however, is too narrow for the relationship being modeled.

## Terminology Determination

Replace the proposed canonical concept:

> Ledger Relational Reference

with:

> **Relational Point of Contact**

A Relational Point of Contact records a materially relevant encounter between a Ledger entry and something
beyond the entry itself.

This may include: an observation; a repeated observation in another context; a functional demonstration; an
operational application; an independent evaluation; external evidence; another Ledger entry; an OAR; a
contradiction; a failed application; a qualifying condition; a governed system or initiative.

These are not merely citations or references. They are points at which the inquiry comes into contact with
observation, function, evidence, contradiction, another reasoning environment, or operational reality.

## Six-Touch-Point Clarification

The six-touch-point theory shall therefore be expressed as:

> A Ledger entry may become eligible for Standing Review after demonstrating sufficient diversity across at
> least six governed Relational Points of Contact, subject to risk, independence, contradiction, and
> qualitative Codex review.

The number six is not: a vote count; a popularity measure; a citation threshold; an automatic score; proof of
truth; sufficient by itself to grant standing.

The six points must be materially relational rather than repetitive. Six statements from one source do not
necessarily create six points of contact. Six AI-generated summaries derived from the same source do not create
independent contact. A contradiction may count as a valid point of contact because it increases the maturity of
the inquiry even if it weakens the candidate proposition.

## Proposed Minimum Shape

The advisory's recommended lightweight inline structure remains appropriate, but the field and object naming
should be normalized.

Recommended field: `relational_points_of_contact:`

Recommended minimum item shape:

```yaml
- contact_type:
  disposition:
  source:
  date:
  relation:
  independence:
```

Where: `contact_type` identifies the form of encounter; `disposition` records whether the contact is
supportive, qualifying, or contradictory; `source` identifies the external record, OAR, system, event,
publication, or context; `date` records when contact was recognized; `relation` briefly explains how the
contact relates to the Ledger entry; `independence` records whether the contact originated outside the
environment that shaped the entry.

The executor may recommend minor field-name normalization if required by repository conventions, but the
governing concept shall remain **Relational Point of Contact**, not Reference.

## Controlled Contact Types

The eight categories recommended in the advisory remain accepted in substance and should be normalized as
contact types: observational; repeated observation; functional demonstration; relational demonstration;
independent evaluation; operational application; evidentiary contact; contradiction or failure.

## Independence Rule

An independent evaluation point of contact must originate from a participant, reviewer, reasoning environment,
or source that did not originate or substantially shape the Ledger entry.

An executor who materially shaped an entry may still provide architectural or operational contact, but that
contact must not be classified as independent evaluation.

## Standing Boundary

Relational Points of Contact establish maturity around an inquiry. They do not establish standing.

The Ledger records contact. The Codex determines standing.

Eligibility for Standing Review remains a separate qualitative governance determination.

## Registration Direction

Incorporate this terminology and distinction into the future OAR2 that registers Ledger maturation governance.

No existing Ledger entry was modified under this clarification. No new entry was created. No standing was
granted. No automated scoring was introduced. This is a terminology and architecture clarification only.
