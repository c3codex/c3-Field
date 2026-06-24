---
document_type: oar1
authority_level: closeout
document_scope: undrifted_article_registration_publication
title: OAR1 — Register and Publish unDrifted Agents With Keys Article
status: completed
version: v1
operator: op044
system: measures_registry
process_key: register_and_publish_undrifted_agents_with_keys_article
source_oar2: docs/oar/measures_registry/oar2_register_and_publish_undrifted_agents_with_keys_article_v1.meta.md
executed_at: 2026-06-23
---

# OAR1 — Register and Publish unDrifted Agents With Keys Article v1

## RESULT

Agents With Keys was registered as a distinct DB-governed unDrifted dispatch, created as a Paragraph draft, verified, published without newsletter distribution, and written back to DB authority.

This execution did not rename or overwrite the existing `Agents of Chaos` article.

## ARTICLE REGISTRATION RECORD

```yaml
article_registration:
  db_id: 7e6059be-a40a-43ff-bb6e-1c1f25ff5b51
  publication_key: undrifted
  dispatch_key: agents_with_keys_dispatch_v1
  title: Agents With Keys
  subtitle: Systems Without Governance
  external_slug: agents-with-keys
  status: published
  internal_route: null
  article_url: https://paragraph.com/@undrifted/agents-with-keys
  external_url: https://paragraph.com/@undrifted/agents-with-keys
  publish_state: published_to_paragraph
  source_oar2: docs/oar/measures_registry/oar2_register_and_publish_undrifted_agents_with_keys_article_v1.meta.md
```

The DB-first intermediate state was `publish_ready`. Paragraph publication occurred only after that live registration passed readback validation.

## PARAGRAPH RESULT

```yaml
paragraph:
  cli: "@paragraph-com/cli v0.3.1"
  package_source: previously_verified_local_cache
  authenticated_publication_id: leouxPnZrCGqMYqnboYx
  authenticated_publication_name: unDrifted
  authenticated_publication_slug: undrifted
  duplicate_title_or_slug_found_before_create: false
  draft_created: true
  draft_verified_before_publish: true
  post_id: 1iTDNlKWqWFOm0zkMgtS
  slug: agents-with-keys
  status: published
  published_at: 2026-06-23T15:36:26.413Z
  url: https://paragraph.com/@undrifted/agents-with-keys
  newsletter_sent: false
```

Live public HTTP validation returned `200`, resolved to the expected URL, and exposed page title `Agents With Keys`.

## ARTICLE ARTIFACT

- `docs/oar/measures_registry/undrifted_agents_with_keys_article_v1.md`

The Paragraph draft readback confirmed:

- title: `Agents With Keys`
- subtitle: `Systems Without Governance`
- article body present
- assessment CTA present
- all three publication-note links present
- status before publish: `draft`

## SOURCE VERIFICATION

No source URL was invented.

```yaml
sources:
  air_canada:
    title: Moffatt v. Air Canada
    standing: verified_http_200
    url: https://decisions.civilresolutionbc.ca/crt/crtd/en/item/525448/index.do
  mata_v_avianca:
    title: "Memorandum & Opinion — Document 54"
    standing: verified_http_200
    url: https://www.courtlistener.com/docket/63107798/54/mata-v-avianca-inc/
  agentsafe:
    title: "AGENTSAFE: A Unified Framework for Ethical Assurance and Governance in Agentic AI"
    standing: verified_arxiv_record
    url: https://arxiv.org/abs/2512.03180
```

## COVER MEDIA STANDING

```yaml
cover_media:
  media_role: agents_with_keys_cover
  storage_bucket: measures-registry
  storage_path: agents_with_keys.webp
  active_mappings: 2
  publication_state: published
  dispatch_key: agents_with_keys_dispatch_v1
  paragraph_post_id: 1iTDNlKWqWFOm0zkMgtS
  hardcoded_bucket_url_added: false
```

Both existing active mappings were preserved and bound. No media upload or bucket mutation occurred.

## CTA ROUTE CHECK

```yaml
cta:
  route: /ai-operations-assessment
  registry_key: ai_operations_assessment_landing
  release_state: released
  access_state: visible
  is_active: true
  article_link: https://measuresregistry.com/ai-operations-assessment
```

No assessment flow or route was altered.

## LANDING RECONCILIATION

The prior Agents With Keys landing entry incorrectly linked to the distinct published `Agents of Chaos` article.

Final seated landing state:

```yaml
landing_feature:
  title: Agents With Keys
  subtitle: Systems Without Governance
  dispatch_key: agents_with_keys_dispatch_v1
  media_role: agents_with_keys_cover
  publication_state: published
  article_url: https://paragraph.com/@undrifted/agents-with-keys
```

`Agents of Chaos` remains a separate published dispatch and was not modified.

## PUBLIC RENDERER READ

Anonymous Supabase readback—the frontend renderer boundary—returned:

```yaml
public_renderer_read:
  dispatch_key: agents_with_keys_dispatch_v1
  title: Agents With Keys
  status: published
  external_slug: agents-with-keys
  article_url: https://paragraph.com/@undrifted/agents-with-keys
  cover_media_role: agents_with_keys_cover
  cta_route: /ai-operations-assessment
```

## REPO ARTIFACTS

- `docs/oar/measures_registry/undrifted_agents_with_keys_article_v1.md`
- `supabase/migrations/202606230005_register_undrifted_agents_with_keys_article.sql`
- `supabase/migrations/202606230006_finalize_undrifted_agents_with_keys_paragraph_publication.sql`
- `docs/oar/measures_registry/oar1_register_and_publish_undrifted_agents_with_keys_article_v1.meta.md`

Both SQL migrations passed live PostgreSQL transaction validation with explicit rollback before execution.

## BOUNDARY CONFIRMATION

- unDrifted layout changed: false
- root encounter changed: false
- assessment route changed: false
- hardcoded media added: false
- existing Agents of Chaos article overwritten: false
- newsletter sent: false
- social post or schedule created: false
- `src` changed by this OAR: false

The worktree already contained unrelated `src/c1/antechamber/schemas/*` deletions before this execution; they were preserved and not modified.

## CLOSE

Agents With Keys is registered, published, media-bound, CTA-bound, publicly reachable, and readable through the frontend DB boundary.
