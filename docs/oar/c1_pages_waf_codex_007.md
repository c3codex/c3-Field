# c1 Pages WAF edge control — OAR2 007

Standing: held_with_exact_remaining_gap. Adapter correction and configuration preparation only.

The exact 30 requests/60 seconds baseline requires Cloudflare Pro or higher.
Free permits a 10-second counting period and 10-second mitigation period only.
The resolution's Free-plan implication therefore cannot support its exact baseline.
No plan purchase or baseline substitution is authorized here. Operator must confirm a
supported plan or route a revised baseline before configuration.
[Current availability](https://developers.cloudflare.com/waf/rate-limiting-rules/).

## Proposed rule

Target zone: c3field.online. Phase: http_ratelimit. Rule payload:
[c1-waf-rate-limit.json](c1-waf-rate-limit.json).
This is a configuration artifact, not an executed deployment.

Expression:
```
(http.request.uri.path eq "/api/c3-community-connect-capture" or http.request.uri.path eq "/api/c3-community-connect-verify")
```

One shared budget across both paths, all methods, per source IP and Cloudflare location.
Threshold: 30 requests in 60 seconds. Block duration: 60 seconds.
The default rate-limit Block response is HTTP 429. No custom response, counting expression,
cache exclusion, method, body, or header field is needed.
[Parameters](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/).

For a future authorized setup, verify the exact zone ID, plan and available rule slot,
then GET /zones/{zone_id}/rulesets/phases/http_ratelimit/entrypoint.
If present, append this payload via POST /zones/{zone_id}/rulesets/{ruleset_id}/rules.
If absent, create a zone ruleset with kind zone, phase http_ratelimit, and this payload
as its rules entry. Preserve existing rules; never replace the whole ruleset blindly.
Read back the rule ID, expression, action, enabled flag and rate settings.
[Rulesets API procedure](https://developers.cloudflare.com/waf/rate-limiting-rules/create-api/).

## Runtime verification required by a later route

Confirm traffic uses the protected zone, inspect rule ordering and skip/bypass behavior,
and verify Pages production and preview hostnames cannot bypass this control to reach
an enabled passage. Do not presume zone WAF covers pages.dev. Keep real email disabled
during the bounded synthetic runtime check. From one test IP/location, exercise both
paths and confirm WAF 429 and the matching rule event after exceeding the shared budget.
Confirm requests resume after mitigation and unrelated paths remain unaffected.
Observe platform counter delay; do not assert precisely 30 requests reach the adapter.
Shared NAT clients share the budget.
[Counter scope](https://developers.cloudflare.com/waf/rate-limiting-rules/request-rate/).

## Application and database boundary

No Pages RateLimit binding or in-process counter remains. WAF blocks abuse before Pages.
Database challenge rules remain the semantic protection: 60-second cooldown, five issues
per hour, five verification attempts, expiry, supersession, failed lock and consumed state.
Secrets, signed receipts, environment/state/evidence/consent checks and generic public errors
remain required. Edge acceptance never grants participant standing.

The historical OAR006 document describes its prior implementation and is superseded only
for its Pages limiter assumptions by this OAR007 correction.
No database migration, dependency install, WAF write, email, push, merge or deployment.
