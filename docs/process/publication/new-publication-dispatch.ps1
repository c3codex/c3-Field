param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[a-z0-9]+(_[a-z0-9]+)*$')]
  [string]$PublicationKey,

  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[a-z0-9]+(_[a-z0-9]+)*(_v[0-9]+)?$')]
  [string]$DispatchKey,

  [Parameter(Mandatory = $true)]
  [string]$Title,

  [string]$Excerpt = "OPERATOR_APPROVED_EXCERPT_REQUIRED",
  [string]$SeoDescription = "OPERATOR_APPROVED_SEO_DESCRIPTION_REQUIRED",
  [string]$PrimaryCta = "OPERATOR_APPROVED_PRIMARY_CTA_REQUIRED",
  [string]$SecondaryCta = "OPERATOR_APPROVED_SECONDARY_CTA_REQUIRED",
  [string]$ExternalPlatform = "",
  [string]$ExternalSlug = "",
  [string]$ExternalUrl = "",
  [string]$CoverImagePath = "OPERATOR_APPROVED_COVER_IMAGE_PATH_REQUIRED",
  [switch]$Force
)

$ErrorActionPreference = "Stop"

if ($ExternalSlug -and $DispatchKey -eq $ExternalSlug.Replace("-", "_")) {
  throw "DispatchKey must not be derived directly from ExternalSlug. Internal dispatch_key remains authority."
}

$root = Join-Path "docs/oar/publication_dispatches" (Join-Path $PublicationKey $DispatchKey)
if ((Test-Path -LiteralPath $root) -and -not $Force) {
  throw "Dispatch package already exists: $root. Use -Force to overwrite generated template files."
}

New-Item -ItemType Directory -Force -Path $root | Out-Null

$oarPath = Join-Path $root "oar2_$DispatchKey.meta.md"
$bodyPath = Join-Path $root "dispatch_body.md"
$paragraphPath = Join-Path $root "paragraph_metadata.json"
$captionsPath = Join-Path $root "x_captions.md"

$oar = @"
---
document_type: oar2
title: OAR2 Publication Dispatch - $Title
version: v1
status: draft_requires_operator_approval
system: measures_registry
publication_key: $PublicationKey
dispatch_key: $DispatchKey
---

# OAR2 Publication Dispatch - $Title

## Authority

- publication_key: $PublicationKey
- dispatch_key: $DispatchKey
- external_platform: $ExternalPlatform
- external_slug: $ExternalSlug
- external_url: $ExternalUrl

The internal publication_key and dispatch_key are authority.
External platform, slug, and URL are route metadata only.

## Required Approval Gates

- [ ] dispatch body approved
- [ ] references approved
- [ ] media manifest approved
- [ ] Paragraph metadata approved
- [ ] X caption option approved
- [ ] DB seating approved
- [ ] deploy approved
- [ ] public distribution approved

## Dispatch Package

- title: $Title
- excerpt: $Excerpt
- seo_description: $SeoDescription
- primary_cta: $PrimaryCta
- secondary_cta: $SecondaryCta

## Routing

No public posting is authorized by this draft.
"@

$body = @"
# $Title

OPERATOR_APPROVED_DISPATCH_BODY_REQUIRED

Do not seat this dispatch until the approved body replaces this placeholder.
"@

$paragraph = [ordered]@{
  publication_key = $PublicationKey
  dispatch_key = $DispatchKey
  title = $Title
  subtitle = $Excerpt
  preview = $SeoDescription
  tags = @()
  cover_image_path = $CoverImagePath
  external_platform = $ExternalPlatform
  external_slug = $ExternalSlug
  external_url = $ExternalUrl
  primary_cta = $PrimaryCta
  secondary_cta = $SecondaryCta
  approval_required_before_publication = $true
}

$captions = @"
# X Caption Options - $Title

Publication is not authorized from this file.

## Option 1

OPERATOR_APPROVED_X_CAPTION_REQUIRED

## Option 2

OPERATOR_APPROVED_X_CAPTION_REQUIRED

## Option 3

OPERATOR_APPROVED_X_CAPTION_REQUIRED
"@

Set-Content -LiteralPath $oarPath -Encoding UTF8 -Value $oar
Set-Content -LiteralPath $bodyPath -Encoding UTF8 -Value $body
($paragraph | ConvertTo-Json -Depth 8) | Set-Content -LiteralPath $paragraphPath -Encoding UTF8
Set-Content -LiteralPath $captionsPath -Encoding UTF8 -Value $captions

Write-Output "Created publication dispatch package: $root"
Write-Output "Review and replace all OPERATOR_APPROVED_* placeholders before DB seating."
