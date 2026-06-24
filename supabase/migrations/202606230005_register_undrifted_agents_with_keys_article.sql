-- Register the distinct unDrifted Agents With Keys article as publish-ready.
-- Source authority:
-- docs/oar/measures_registry/oar2_register_and_publish_undrifted_agents_with_keys_article_v1.meta.md

INSERT INTO public.measures_publication_dispatch (
  publication_key,
  dispatch_key,
  title,
  dispatch_body,
  excerpt,
  seo_description,
  tags,
  primary_cta,
  secondary_cta,
  "references",
  media_manifest,
  internal_route,
  external_platform,
  external_slug,
  external_url,
  status,
  published_at,
  metadata,
  issue_number,
  article_url,
  updated_at
)
VALUES (
  'undrifted',
  'agents_with_keys_dispatch_v1',
  'Agents With Keys',
  $article$
# Agents With Keys

## Systems Without Governance

An AI agent is not just a chatbot with a better interface.

An agent can act.

It can call tools, access systems, retrieve records, trigger workflows, draft responses, update files, move information, or influence decisions. When that agent holds keys — API keys, database access, platform permissions, workflow authority, or operational credentials — it becomes part of the institution’s active system.

That changes the risk.

The question is no longer only:

Can the model generate a correct answer?

The question becomes:

What can this system do when the answer is wrong?

That is where many public AI failures begin.

Not with intelligence.

With authority.

In 2024, Air Canada was ordered to compensate a customer after its chatbot gave inaccurate bereavement-fare guidance. The company argued that the chatbot should be treated separately from the airline. The tribunal rejected that position and held Air Canada responsible for information delivered through its own website.

That case was not about a rogue machine.

It was about an institution deploying an automated public-facing system without sufficient control over the information it delivered, the customer pathway it influenced, and the accountability attached to the outcome.

The chatbot did not own the policy.

Air Canada did.

The system shortfall was not simply that the chatbot gave a bad answer. The shortfall was that the customer had no reliable way to distinguish governed policy from generated guidance, and the institution had no effective boundary preventing inaccurate guidance from shaping a real transaction.

A second pattern appears in legal and professional settings.

In *Mata v. Avianca*, attorneys were sanctioned after submitting court filings containing fake cases generated through ChatGPT. The issue was not that AI hallucinated. That was already a known risk. The failure was that generated material crossed into a formal legal process without adequate verification, review, or professional control.

Again, the accountability did not belong to the tool.

It belonged to the professionals and the system of practice that allowed unverified output to become submitted work.

This is the central problem with agents holding keys inside ungoverned systems.

When a system gives AI access but does not define authority, review, containment, escalation, and traceability, the institution has not deployed intelligence.

It has deployed drift.

Agentic AI increases this pressure because agents are built to move through steps. They plan, act, observe, and continue. They may call tools, use memory, interact with data, and trigger downstream action. Research on agentic governance continues to identify the same operational need: design controls, runtime monitoring, authorization boundaries, audit trails, escalation, and accountability mechanisms.

That matters because an agent with keys does not merely produce language.

It may produce system behavior.

It may retrieve the wrong record.

It may update the wrong field.

It may expose data.

It may route a customer incorrectly.

It may preserve a corrupted memory.

It may execute a workflow before a human understands what happened.

The institution remains accountable.

Not because every failure is intentional.

Because deployment is a governance decision.

Institutions decide what AI may access, what it may trigger, what it may recommend, who reviews it, what gets logged, where exceptions go, and when automation stops.

If those decisions are undefined, accountability does not disappear.

It becomes harder to prove.

That is the unDrifted position.

AI systems should not be deployed into operational authority without governed system conditions.

Measures Registry exists to make those conditions visible before failure becomes public.

The standard is not better prompts.

The standard is systems governance.

A governed environment defines:

- authority boundaries
- role responsibilities
- review pathways
- automation exposure
- runtime behavior
- traceable action
- institutional accountability

Structural drift is detectable.

Collapse is not the default.

## Assess Your AI Environment

Begin where drift becomes visible.

[Begin the AI Operations Assessment](https://measuresregistry.com/ai-operations-assessment)

## Publication Notes

- [Moffatt v. Air Canada, 2024 BCCRT 149 — Civil Resolution Tribunal](https://decisions.civilresolutionbc.ca/crt/crtd/en/item/525448/index.do)
- [Mata v. Avianca, Inc. — Memorandum & Opinion, Document 54](https://www.courtlistener.com/docket/63107798/54/mata-v-avianca-inc/)
- [AGENTSAFE: A Unified Framework for Ethical Assurance and Governance in Agentic AI](https://arxiv.org/abs/2512.03180)
  $article$,
  'Systems without governance create institutional accountability risk.',
  'Agents with keys operating inside ungoverned systems create institutional accountability risk.',
  '[]'::jsonb,
  'Assess your AI environment.',
  'Begin where drift becomes visible.',
  jsonb_build_array(
    jsonb_build_object(
      'type', 'tribunal_decision',
      'year', '2024',
      'title', 'Moffatt v. Air Canada, 2024 BCCRT 149',
      'url', 'https://decisions.civilresolutionbc.ca/crt/crtd/en/item/525448/index.do'
    ),
    jsonb_build_object(
      'type', 'court_opinion',
      'year', '2023',
      'title', 'Mata v. Avianca, Inc. — Memorandum & Opinion, Document 54',
      'url', 'https://www.courtlistener.com/docket/63107798/54/mata-v-avianca-inc/'
    ),
    jsonb_build_object(
      'type', 'research_paper',
      'year', '2025',
      'title', 'AGENTSAFE: A Unified Framework for Ethical Assurance and Governance in Agentic AI',
      'url', 'https://arxiv.org/abs/2512.03180'
    )
  ),
  jsonb_build_object(
    'cover_media_role', 'agents_with_keys_cover',
    'storage_bucket', 'measures-registry',
    'storage_path', 'agents_with_keys.webp'
  ),
  NULL,
  'paragraph',
  'agents-with-keys',
  NULL,
  'publish_ready',
  NULL,
  jsonb_build_object(
    'source_oar2', 'docs/oar/measures_registry/oar2_register_and_publish_undrifted_agents_with_keys_article_v1.meta.md',
    'subtitle', 'Systems Without Governance',
    'cover_media_role', 'agents_with_keys_cover',
    'cta_route', '/ai-operations-assessment',
    'claim_boundary', 'public_safe_evidence_aware',
    'publish_state', 'publish_ready',
    'approval_state', 'operator_authorized_by_oar2',
    'paragraph_api_managed', true,
    'paragraph_publication_id', 'leouxPnZrCGqMYqnboYx',
    'paragraph_publication_slug', 'undrifted',
    'paragraph_post_id', NULL,
    'paragraph_draft_id', NULL,
    'sync_direction', 'DB_to_Paragraph'
  ),
  NULL,
  NULL,
  now()
)
ON CONFLICT (dispatch_key) DO UPDATE SET
  publication_key = EXCLUDED.publication_key,
  title = EXCLUDED.title,
  dispatch_body = EXCLUDED.dispatch_body,
  excerpt = EXCLUDED.excerpt,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  primary_cta = EXCLUDED.primary_cta,
  secondary_cta = EXCLUDED.secondary_cta,
  "references" = EXCLUDED."references",
  media_manifest = EXCLUDED.media_manifest,
  internal_route = EXCLUDED.internal_route,
  external_platform = EXCLUDED.external_platform,
  external_slug = EXCLUDED.external_slug,
  external_url = EXCLUDED.external_url,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  metadata = EXCLUDED.metadata,
  issue_number = EXCLUDED.issue_number,
  article_url = EXCLUDED.article_url,
  updated_at = now();

UPDATE public.measures_registry
SET metadata = jsonb_set(
  metadata,
  '{featured_article_set}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN article ->> 'title' = 'Agents With Keys' THEN
          (article - 'article_url' - 'article_route' - 'external_url') ||
          jsonb_build_object(
            'title', 'Agents With Keys',
            'subtitle', 'Systems Without Governance',
            'description', 'Systems without governance create institutional accountability risk.',
            'media_role', 'agents_with_keys_cover',
            'publication_state', 'publish_ready',
            'dispatch_key', 'agents_with_keys_dispatch_v1'
          )
        ELSE article
      END
      ORDER BY ordinal
    )
    FROM jsonb_array_elements(metadata -> 'featured_article_set') WITH ORDINALITY AS items(article, ordinal)
  ),
  false
), updated_at = now()
WHERE registry_key = 'undrifted_publication_landing';

UPDATE public.measures_registry
SET metadata = jsonb_set(
  metadata,
  '{undrifted_contract,featured_articles}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN article ->> 'title' = 'Agents With Keys' THEN
          article || jsonb_build_object(
            'publication_state', 'publish_ready',
            'dispatch_key', 'agents_with_keys_dispatch_v1'
          )
        ELSE article
      END
      ORDER BY ordinal
    )
    FROM jsonb_array_elements(metadata #> '{undrifted_contract,featured_articles}') WITH ORDINALITY AS items(article, ordinal)
  ),
  false
), updated_at = now()
WHERE registry_key = 'measures_registry_root';

UPDATE public.measures_media_map
SET metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
  'publication_state', 'publish_ready',
  'dispatch_key', 'agents_with_keys_dispatch_v1',
  'source_oar2', 'docs/oar/measures_registry/oar2_register_and_publish_undrifted_agents_with_keys_article_v1.meta.md'
), updated_at = now()
WHERE media_role = 'agents_with_keys_cover'
  AND is_active = true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_publication_dispatch
    WHERE dispatch_key = 'agents_with_keys_dispatch_v1'
      AND publication_key = 'undrifted'
      AND title = 'Agents With Keys'
      AND status = 'publish_ready'
      AND external_slug = 'agents-with-keys'
      AND internal_route IS NULL
      AND article_url IS NULL
      AND metadata ->> 'cover_media_role' = 'agents_with_keys_cover'
      AND metadata ->> 'cta_route' = '/ai-operations-assessment'
  ) THEN
    RAISE EXCEPTION 'Agents With Keys registration validation failed';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.measures_media_map
    WHERE media_role = 'agents_with_keys_cover'
      AND storage_bucket = 'measures-registry'
      AND storage_path = 'agents_with_keys.webp'
      AND is_active = true
      AND metadata ->> 'publication_state' = 'publish_ready'
  ) THEN
    RAISE EXCEPTION 'Agents With Keys cover binding validation failed';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.measures_registry
    WHERE registry_key = 'ai_operations_assessment_landing'
      AND is_active = true
      AND release_state = 'released'
      AND metadata ->> 'route_path' = '/ai-operations-assessment'
  ) THEN
    RAISE EXCEPTION 'Assessment CTA route validation failed';
  END IF;
END $$;
