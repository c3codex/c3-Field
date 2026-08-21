---
document_type: research_case
initiative: measures_registry_gtm
status: research_only
version: v1
operator: op044
assistant: chazz
branch: gtm-ledger-v1
date: 2026-08-21
registry_mutation: false
---

# Mapped and Measured — Clinical Encounter Round 001

## Purpose
Test the compute-to-consequence and inner-perimeter model on an outpatient clinical encounter, chosen to be orthogonal to mortgage origination in authority structure, evidence type, consequence, regulation, and human oversight.

## Comparison frame
This is not a pre-digital vs AI comparison. The correct baseline is a mature pre-agentic digital clinical encounter using EHRs, conventional decision support, billing systems, and established clinical workflows, compared with a 2025–2026 AI-augmented encounter using ambient documentation, generative summarization, decision support, or agentic functions.

The clinical act remains substantially recognizable: patient presents; clinician observes and examines; evidence is reviewed; assessment and plan are formed; documentation is entered; orders/referrals/prescriptions may follow; coding/billing and follow-up occur.

## Observed current AI fruiting point
Cleveland Clinic reports more than 4,000 physicians and advanced practice providers using Ambience Healthcare ambient AI after a year-long pilot. The tool records the patient visit with verbal patient consent, generates a structured clinical note into Epic, and produces an after-visit summary. Physicians must review and approve AI-generated content before it enters the EHR. Cleveland Clinic selected the vendor after evaluating multiple tools and is considering additional uses including clinical orders and billing-code recommendations.

This creates an observable consequential frontier around one ordinary encounter:
patient ↔ clinician conversation
→ capture/recording layer
→ ambient AI vendor
→ model/runtime
→ generated clinical note
→ clinician review/approval
→ EHR
→ patient after-visit summary
→ possible downstream coding/order systems.

## New or materially changed consequential relationships
The important change is not necessarily new parties; it is new consequential edges among existing and external actors.

1. Patient ↔ ambient AI capture layer
   - patient speech becomes computational input.
   - consent state becomes consequential.

2. Clinician ↔ AI scribe
   - clinician delegates documentation synthesis but retains review/approval responsibility.

3. AI scribe ↔ clinical conversation
   - model converts lived encounter into structured evidence/documentation.

4. AI vendor ↔ health system
   - external vendor now participates directly in generation of the clinical record.

5. AI vendor ↔ model/runtime provider
   - where applicable, vendor dependencies may introduce additional authority and custody domains. This must be observed, not assumed for every implementation.

6. AI output ↔ EHR
   - generated content crosses into the system of record.

7. Clinician ↔ generated note
   - clinician review is the boundary between computational draft and accountable clinical record.

8. Generated note ↔ downstream coding/billing
   - documentation may influence billing and reimbursement.

9. Generated note ↔ downstream care
   - future clinicians may rely on the note as longitudinal clinical evidence.

10. AI runtime ↔ monitoring/governance process
    - health systems need mechanisms for hallucination, bias, incident, and quality review.

11. Health system ↔ patient regarding AI use
    - consent, transparency, and trust become part of the encounter state.

12. Health system ↔ regulator/accreditor/payer where AI is consequential
    - requirements differ depending on whether the tool is documentation support, predictive decision support, regulated device software, or another class.

## Observed governance signals
AMA guidance for ambient documentation recommends physician review/approval before AI-generated notes are finalized, training that reinforces professional judgment, simple escalation/reporting of AI issues, and periodic audits of generated notes and source recordings.

AMA policy adopted June 2026 states that AI in clinical decision support should remain assistive and under physician oversight rather than replace physician judgment.

Mayo Clinic states AI must improve care/patient experience and fit clinical workflow before deployment; it describes continuous testing, refinement, and real-world validation for healthcare AI. Its June 2026 Microsoft collaboration explicitly says healthcare AI requires deep clinical context, longitudinal understanding, rigorous governance, and real-world validation.

FDA's AI-enabled device work emphasizes total-product-lifecycle monitoring because performance can change as input data and real-world environments change; the relevance depends on whether a given tool falls within FDA-regulated device software.

ONC/ASTP's HTI-1 framework adds transparency and intervention-risk-management requirements for predictive decision support in certified health IT.

## Measured local benefits
JAMA Network Open studies provide evidence of local operational benefit from ambient AI scribes:
- multicenter QI study of 263 clinicians: burnout decreased from 51.9% to 38.8% after 30 days, with improvements in after-hours documentation and cognitive burden.
- prospective outpatient study of 46 clinicians: 20.4% less time in notes per appointment (10.3 to 8.2 minutes), 30.0% less after-hours work time per workday, but 20.6% greater note length.
- 2026 ROI commentary cites subscription costs commonly around $200–$600 per clinician per month and a single-site analysis of more than 1.2 million encounters associated with 5.8% higher weekly RVUs and 2.8% more encounters per week.

These are local/organizational effects, not proof of system-wide savings or better clinical outcomes.

## Counterevidence / holds
A July 2026 JAMA commentary noted evidence from five academic systems showing only modest reductions in total EHR time and no significant overall reduction in after-hours EHR work, suggesting saved note-writing time may be reallocated to other EHR tasks.

Ambient AI may lengthen notes, increase downstream information volume, alter coding intensity, or create new review/monitoring work. A JAMA Health Forum commentary warns of possible unintended billing consequences if ambient scribe outputs are used to automate coding.

Therefore:
- do not equate task-time savings with total encounter-cost reduction;
- do not equate clinician well-being benefit with economic ROI;
- do not infer better patient outcomes without evidence;
- do not treat all ambient scribes as regulated medical devices;
- do not assume a hidden model/cloud dependency unless observed.

## Inner-perimeter test
The active consequential perimeter for one AI-augmented outpatient encounter is not the whole healthcare technology stack.

A dependency crosses the perimeter when it can materially change:
- what becomes part of the clinical record;
- what evidence a clinician sees or relies upon;
- the assessment/plan or recommended action;
- a prescription/order/referral;
- patient-facing instructions;
- coding/billing state;
- clinical standing or follow-up;
- later longitudinal interpretation of the encounter.

The map may stop expanding when newly discovered external dependencies no longer alter those consequential states.

## Candidate measurements for this cohort
1. Consequential Relationship Count per Encounter
2. External Authority-Domain Count per Encounter
3. AI-Derived Evidence Fraction — proportion of encounter record materially generated/interpreted by AI
4. Clinician Review Coverage — AI-generated consequential outputs reviewed before entering accountable record / all AI-generated consequential outputs
5. Perimeter Coverage — consequential relationships with current sufficient governance state / all consequential relationships
6. Latent-to-Consequential Transition Time — elapsed time between a dependency becoming materially consequential and its inclusion in governed review
7. Historical Continuity Coverage — consequential relationships for which later reviewers can reconstruct model/tool/version, source evidence, clinician review, and resulting state
8. Automation Capture Ratio — verified time/cost/value benefit / incremental AI + governance + monitoring + review cost

These remain research candidates and are not registered measures.

## Mortgage comparison
The mortgage and clinical cases share one structural result despite being institutionally orthogonal:
- underlying act remains recognizable;
- local AI automation can produce strong task-level gains;
- AI introduces new consequential relationships among actors, evidence, systems, and external providers;
- accountability remains anchored in the institution/human authority even when computational work expands;
- total system simplification does not automatically follow from local automation.

Healthcare adds a stronger temporal-memory requirement: AI-generated documentation may become part of longitudinal evidence used by future clinicians. A computational relationship can therefore continue affecting consequence long after the original runtime interaction ends.

## Working finding
The clinical case strengthens the relational-governance thesis because the AI layer does not merely automate a task. It participates in transforming lived encounter data into institutional memory.

That makes the critical governance question:
Can the environment later establish what the patient and clinician actually experienced, what the AI transformed, what the clinician approved, what entered the record, and what downstream decisions inherited from that record?

This is a direct test of governance memory and the inner-perimeter model.

## Sources
- Cleveland Clinic ConsultQD, “Less Typing, More Talking: AI Reshapes Clinical Workflow” (2025).
- AMA, physician AI sentiment and 2026 policy materials.
- AMA STEPS Forward, Governance for Augmented Intelligence.
- JAMA Network Open ambient AI studies (2025–2026).
- Mayo Clinic AI deployment and Microsoft collaboration materials (2026).
- FDA AI-enabled device lifecycle materials (2025–2026).
- ASTP/ONC HTI-1 decision support transparency/risk-management materials.

## Status
Research case formed. No Registry mutation. Candidate measures remain held pending cross-case population and Operator disposition.
