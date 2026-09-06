# c1ME_env implementation review

Authority: `oar2_implement_render_c3_field_c1ME_env_codex_astra_v1`, Drive ID `1VI6DZnO6r2dakaVAPa7rI7yWFI9cEHE1yKN6WKzmVFs`, exported-byte SHA-256 `c4da8887a52f374963f77dd885086bb0a7e41a7787b411bb5ff0ebf06e80497b`.

This change replaces the previous internal-status Connect page with the approved homepage/encounter copy and five verified local media bindings. The package is rendered only through a loopback review harness with an explicit dev flag and a validated captured Registry/package snapshot. Production builds show an unavailable page. The hosted package function returns 423 and cannot be opened by client flags. No release mechanism is added.

Capture requires name, email, explicit consent, accuracy attestation and participation intention. It accepts only surfaced candidate evidence and rejects client-supplied standing/disposition fields. It does not save, contact-verify, invoke NotChazz, register, persist or create Current. The existing missing C1 capture adapter remains a hold. Initiative selection remains unavailable until an eligible registered binding is supplied through a separate governed route.

## Reproduce

Use Node 22.12+ and the repository dependencies. The evidence archive supplies `evidence/oar2.raw.txt`, `package-sources.json`, `registry-rows.json` and `media/`. Keep that folder adjacent to the implementation checkout or pass its path explicitly:

```
node --import tsx scripts/review-c1-environment.ts ../evidence
```

The server listens only on `127.0.0.1:5188`, verifies OAR2/media SHA-256 and package copy references before starting, and invokes the actual Pages capture handler for local synthetic submissions. Existing production credentials are unnecessary. No external capture adapters are mounted. Stop with Ctrl-C.

```
node --import tsx --test functions/api/c3-community-connect-capture.test.ts src/c3_field_connect/c1EnvironmentPackage.test.ts src/c3_field_connect/c3FieldRouting.test.ts functions/_middleware.test.ts
npm run build:c3field
node scripts/test-c1-browser.mjs [absolute-playwright-index.mjs] [absolute-chromium-executable]
```

Browser tests use isolated headless Chromium against loopback only, synthetic `example.invalid` contact values, and a temporary loopback static server on 5190 to prove the production build remains held. They save screenshots and results under `../evidence/browser`. If Playwright is not installed locally, provide an existing installation or install it within a separately approved dependency workflow.

## Source bindings and limits

Canonical package `1v1i7fSVGjuOgZ6qtXehheC_UPJqHADvW`; reconciled manifest modified 2026-09-06T09:21:22.545Z; encounter copy modified 2026-09-06T09:21:52.138Z. Exact source IDs and selected asset hashes are in `scripts/c1-review-package.ts`. The approved master emblem is used without crop or pixel modification. Desktop master and mobile teaser decode at 1080x1920; durations 40.853s and 15s. A portrait still matches the player frame; the square derivative is retained in the verified binding inventory.

Source Concordance v8 remains semantic authority. The package projection is an environment-specific review artifact and contains no environment material identity or inherited standing. The four protected terms were observed live, not reconstructed from earlier notes. The consent sentence retains “C1 Connect” because it is the exact approved source copy; no additional internal mechanics are introduced into participant-facing prose.

The Registry snapshot is evidence captured for this review, not a continuing authorization source or proof of future live state. Review output is not a release decision.

## Validation and remaining work

28 focused tests, scoped TypeScript check, c3field build and seven browser checks passed. Required successful live persistence/Registry CAR/Boundary/NotChazz behavior is not proven: no eligible C1 adapter is seated in the observed route, contact verification is not implemented here, and runtime activation is held. Production media custody is not bound. No database/schema/RLS, deployment, public release, c2/c3 elevation, c3Key or token/value mutation was performed.

Cloudflare Pages method dispatch was checked against the official [Pages Functions API reference](https://developers.cloudflare.com/pages/functions/api-reference/). Build output still reports the existing large-chunk warning. Tests reused the existing workspace dependency installation; no dependency install or lockfile mutation occurred.
