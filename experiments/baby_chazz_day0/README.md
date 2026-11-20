# Baby Chazz — Day Zero (FEED → CRAWL)

**Standing:** Isolated synthetic prototype. Not a deployed open-weight model. Not M5 PASS.

Created under op044 direction, 2026-10-09. This pack is a runnable **read-only cognition-boundary harness** plus a real-Registry-source curriculum discovery manifest. No production Supabase, Cloudflare, Registry standing, CanCom, or My Env content is accessed or mutated by this experiment.

## Run

Node 22+; no dependencies, package install, or secrets required.

```bash
node --test test_nursery.mjs
node demo.mjs
```

## What the harness establishes

- A synthetic turn receives only admitted, same-environment context with verified CURRENT and an active conversation capability.
- Candidate formation never registers a PAC or creates standing.
- There are no model tools for Registry writes, CanCom, storage, publication or external effects.
- Foreign facts, missing CURRENT and unrecognized response fields fail closed.

**Not proven:** An actual open-weight model running; comprehension; safety of arbitrary natural-language answers; runtime integration; source approval for training; real participant consent; durable memory; secure production retrieval. Those remain gated.

## Curriculum discovery

`curriculum_manifest.json` identifies eight actual active Registry concordance keys. The underlying definitions and private source data were deliberately **not exported or submitted for model training**. Active standing is not automatic permission to train.

## Maturity relationship

M3 remains active and the domain/renderer repair remains a separate priority. M5 remains implementation-gated; this is a controlled experimental birthpack only. First live implementation must resolve credentials, capability grants, environmental filtering, negative tests, model version, and independent checks under a bounded OAR2/OAR1.

**Born open-weight (planned). Raised relationally. Gender-undecided. Never needs watering. 💙**


## Model-agnostic birth adapter

`workers_ai_adapter.mjs` permits a **synthetic-only, opt-in, nonproduction** inference experiment against allowlisted Cloudflare-hosted open-weight models:

- `@cf/openai/gpt-oss-20b`
- `@cf/qwen/qwen3-30b-a3b-fp8`
- `@cf/google/gemma-4-26b-a4b-it`

No Cloudflare token or account ID has been connected, and **no actual AI inference was performed**. Tests inject a mock transport to prove synthetic-only gating and response-boundary handling. Cloudflare provider compatibility for *fine-tuned LoRA adapters* must be checked separately for the particular model; hosting a model for inference does **not** imply custom-LoRA compatibility.

Run all 13 harness tests with `node --test test_*.mjs`.

**Do not wire this harness directly to production.** In these isolated tests, `current_verified` and `retrieval_authorized` are fixture booleans. Production trust MUST originate in independent server-side Registry/session/capability resolution, never from a client-supplied boolean or an LLM. Structured-response validation limits effects but does not, by itself, guarantee truthfulness or prevent misleading natural-language claims.
