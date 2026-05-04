param(
  [Parameter(Mandatory=$true)]
  [ValidateSet("oar1","oar2")]
  [string]$Type,

  [Parameter(Mandatory=$true)]
  [string]$Key
)

$folder = "docs\oar\$Key"
New-Item -ItemType Directory -Force -Path $folder | Out-Null

if ($Type -eq "oar1") {
  $file = "$folder\oar1_$Key.meta.md"
  @"
---
document_type: oar1
title: OAR1 $Key
version: v1
status: draft
system: measures_registry
---

OAR1: ${Key}_v1

OBJECTIVE


ACTION


RESULT


CONTEXT


VALIDATION

"@ | Set-Content -Encoding UTF8 $file
}

if ($Type -eq "oar2") {
  $file = "$folder\oar2_$Key.meta.md"
  @"
---
document_type: oar2
title: OAR2 $Key
version: v1
status: draft
system: measures_registry
---

OAR2: ${Key}_v1

OBSERVED


ALIGNED


ROUTED


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

"@ | Set-Content -Encoding UTF8 $file
}

Write-Host "Created $file"
