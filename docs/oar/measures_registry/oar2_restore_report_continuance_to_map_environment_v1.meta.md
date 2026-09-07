---
document_type: oar2
authority_level: launch_repair
document_scope: report_continuance
title: OAR2 - Restore Report Continuance to MAP the Environment
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Restore Report Continuance to MAP the Environment

## PURPOSE

Restore report continuance after approved assessment report renders.

Approved report copy now renders. The report lacks visible or reachable continuance to MAP the Environment.

Nothing is invented.

## OBSERVED

Browser QA confirms:

- approved report header renders
- approved scored report title renders
- approved report summary renders
- key environmental indicators render

But:

- no visible/reachable continuance to MAP the Environment

## REQUIRED AUDIT

Trace in active FREE renderer:

- PublicAssessmentResult CTA render path
- report_cta.label read path
- onBeginPathwayReview prop
- ObsidianToMarblePassage report phase
- next surface after report
- CSS visibility/overflow for report controls

## REQUIRED REPAIR

Ensure report page renders a visible, reachable CTA:

Label:
MAP the Environment

Action:
navigate to map_integrity_governance

Requirements:

- CTA visible after report content
- CTA reachable on laptop/tablet/mobile
- no layout trap
- no overflow trap
- no report recalculation
- no report copy change
- no scoring change
- no MAP pricing change
- no Stripe behavior change

If CTA is already rendered below fold, fix scroll/container behavior.

If onBeginPathwayReview is missing, wire it from ObsidianToMarblePassage to PublicAssessmentResult.

If next surface is missing, resolve from obsidian_to_marble_passage_video transition_target / next_surface.

## VALIDATION

Return OAR1 evidence showing:

- report CTA label reads MAP the Environment
- CTA is visible and reachable
- CTA click navigates to map_integrity_governance
- MAP cards render after CTA
- payment path remains unchanged
- report copy unchanged
- scoring unchanged
- build passes
- browser QA confirms continuance

## NOTCHAZZ FLAGS

Raise NotChazz if:

- report copy changes
- scoring changes
- MAP pricing changes
- CTA routes somewhere other than MAP
- frontend invents route without DB transition authority
- operator is governed instead of the work body

## CLOSE

Restore report continuance.

The report reveals findings.

MAP the Environment carries the next encounter.
