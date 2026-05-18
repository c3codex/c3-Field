# Source Set Rule Summary — Seeded Reference Control

## Purpose

Preserve distinction between working docs and docs that have already entered active implementation standing, so downstream system or database changes do not proceed from incomplete reference surfaces.

## Core Rule

Once a doc or doc set has fully executed into:

- active process
- system incorporation
- code behavior
- implementation reference

it must be marked as **seeded** and kept distinct from docs that are still **unseeded**.

## Standing Distinction

### Unseeded
Docs that are still:

- draft
- under review
- newly written
- committed but not yet incorporated
- proposed but not yet governing downstream action

### Seeded
Docs that are:

- validated
- written
- committed
- incorporated into live process, system behavior, code, or implementation reference
- required upstream references for downstream review

## Preflight Rule

Before any database change occurs, the relevant **seeded references must be checked first**.

Database review must not proceed from:

- thread memory
- unseeded drafts
- recently committed but not yet incorporated docs
- mixed source sets where seeded standing is unclear

## Workflow Implication

The working sequence becomes:

1. thread validation  
2. transfer/write  
3. file check  
4. git commit  
5. incorporation-state check  
6. seeded / unseeded distinction  
7. DB preflight against seeded references  
8. database change

## Lifecycle States

Docs may move through these states:

- drafted
- validated
- written
- committed
- seeded

**Committed is not the same as seeded.**

## Structural Requirement

Seeded and unseeded docs must remain separable so active reference surfaces can be identified before mutation, implementation, or review.

## Source-Set Use

This rule is for Chazz source-set discipline only.

It ensures that:
- active reference surfaces are distinguishable
- seeded docs are checked before DB change
- unseeded docs cannot silently govern implementation
- source control reflects actual incorporation standing