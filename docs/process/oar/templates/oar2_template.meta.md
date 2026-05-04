---
document_type: template
title: OAR2 Template
version: v1
status: seeded
system: measures_registry
---

OAR2: <system_key>_v#

OBSERVED
What is currently true.

ALIGNED
System rules and constraints.

ROUTED
Exact implementation steps.

CODY ROLE
Cody is executor only.

May:
- implement DB-driven rendering
- execute SQL contracts
- wire media and actions
- report missing records

May NOT:
- invent data
- hardcode media
- introduce slugs
- bypass RPC
- expose diagnostics publicly
- change system contracts

VALIDATION
How success is verified.
