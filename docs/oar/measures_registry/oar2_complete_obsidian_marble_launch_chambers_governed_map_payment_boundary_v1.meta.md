---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_chambers
title: OAR2 — Complete Obsidian + Marble Launch Chambers and Governed MAP Payment Boundary
status: approved_for_execution
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  executor: cody_or_claude
  src: renderer
tags:
  - oar2
  - measures-registry
  - obsidian
  - marble
  - map-the-environment
  - stripe
  - governed-payment
  - media-map
  - launch-readiness
  - seat-held
  - c3-key-held
  - wallet-held
---

# OAR2 — Complete Obsidian + Marble Launch Chambers and Governed MAP Payment Boundary v1

## OBSERVED

The launch path now has two chambers that must be completed before moving back to Lapis / SEO / socials / launch campaign.

Current launch path:

Obsidian Chamber
→ registered Marble Passage
→ Marble Chamber Directory
→ MAP the Environment commerce

Confirmed standing:

- Obsidian assessment media uploaded to Supabase bucket.
- Stripe account set up.
- MAP products/pricing defined.
- MAP requires governed payment integration, not static payment links.
- Webhook secret is pending because webhook endpoint does not exist yet.
- c3 Key, SEAT contracts, and wallet integration remain post-launch holds.

Obsidian needs final surface/media binding for:

- contact capture
- assessment surface
- evaluation result surface

Marble needs final directory/commerce binding for:

- registered Marble Passage
- MAP the Environment standing-specific circuits
- Stripe Checkout session flow
- payment confirmation
- System Readiness Consultation scheduling unlock
- SEAT hold boundary

## ALIGNED

Architecture remains:

Codex → Field → Measures → OAR2 → Chazz → Cody/Claude → src

Renderer must not own truth.

Frontend must not:

- hardcode Stripe links
- hardcode product pricing
- hardcode MAP descriptions
- hardcode media paths
- invent payment success
- unlock scheduling without payment verification
- reveal SEAT contracts before MAP completion
- activate c3 Key or wallet standing

MAP launch boundary:

- MAP the Environment = paid audit / review / identify / recommend
- SEAT = post-MAP contract, held
- c3 Key = not required for MAP, required for SEAT
- wallet integration = held post-launch

Payment boundary:

Stripe Checkout must be created server-side from Codex-held MAP commerce contract state.

Stripe webhook must verify payment before Measures releases scheduling.

Static Stripe payment links are not governed integration and may not be used as runtime authority.

## ROUTED

### 1. Complete Obsidian surface media bindings

Bind Supabase media assets to Obsidian surfaces:

contact capture
→ obsidian_contact_surface_visual_v1.webp

AI Operations Assessment
→ obsidian_assessment_surface_visual_v1.webp

evaluation result
→ obsidian_eval_result_surface_visual_v1.webp

Rules:

- no embedded media text
- no media-owned copy
- no media-owned CTA
- no media-owned routing

Assessment content, scoring, result copy, CTA, and routing must remain DB/contract driven.

Evaluation result public-safe line:

A structured environmental alignment path has been prepared for your review.

Evaluation result routes only to:

registered Marble Passage

### 2. Preserve registered Marble Passage

Marble entry must resolve through the registered passage.

Valid route:

evaluation_result
→ registered_marble_passage
→ marble_chamber_directory

Invalid route:

evaluation_result
→ direct MAP checkout

The passage must not reveal:

- SEAT pricing
- Direct / Mapped / Federated SEAT
- C1 / C2 / C3
- c3 Key issuance
- wallet standing
- Registry Certification
- Registered System
- DAO / 33x3x1

### 3. Seat Marble Chamber Directory

Marble Directory renders the evaluation-determined MAP circuit:

- Pre-Deployment MAP the Environment
- Optimization MAP the Environment
- Remediation MAP the Environment

Each circuit must include:

- evaluation-determined recommendation
- system standing
- standing-specific MAP description
- standing-specific access requirement
- standing-specific deliverables
- MAP boundary
- price
- payment action
- SEAT hold notice

Pricing:

- Pre-Deployment MAP the Environment — $3,333
- Optimization MAP the Environment — $7,777
- Remediation MAP the Environment — $9,999

MAP boundary:

MAP the Environment reviews, identifies, and recommends.

MAP does not implement system changes, issue Registry Certification, establish SEAT standing, activate c3 Field Optics, or determine the final SEAT Contract before the audit is complete.

A full SEAT Contract may be generated only after MAP the Environment is complete.

Access boundary:

Full MAP evaluation requires sufficient access to the runtime and AI-influenced surfaces being reviewed.

Access may be read-only, guided, screen-shared, exported, documented, or AI-assisted.

Sensitive credentials, confidential contents, regulated records, or private client data are not transferred unless separately authorized and governed.

### 4. Seat governed Stripe Checkout integration

Do not use static payment links as authority.

Required flow:

user selects Proceed to MAP Payment
→ frontend requests checkout session from backend
→ backend validates evaluation result + MAP standing + DB price contract
→ backend creates Stripe Checkout Session
→ Stripe handles payment
→ Stripe webhook confirms payment
→ DB records payment event
→ Measures releases scheduling route

Required backend endpoints:

- POST /api/map/create-checkout-session
- POST /api/stripe/webhook
- GET /api/map/payment-status/:map_order_id

Required environment variables:

- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

Current standing:

- STRIPE_SECRET_KEY can be configured now.
- STRIPE_WEBHOOK_SECRET is pending until webhook endpoint exists in Stripe.

Required Stripe public-safe IDs to collect:

- pre_deployment_price_id = price_...
- optimization_price_id = price_...
- remediation_price_id = price_...

Do not paste secret keys into thread, docs, or frontend.

### 5. Seat MAP commerce contract state

Create or update DB/contract state equivalent to:

map_commerce_contracts

Required fields:

- contract_key
- evaluation_standing
- product_name
- amount_usd
- currency
- stripe_price_id
- release_state
- payment_processor
- payment_scope
- c3_key_required
- wallet_required
- seat_contract_generated
- seat_contract_state

Required values:

- payment_processor = stripe
- payment_scope = map_the_environment
- c3_key_required = false
- wallet_required = false
- seat_contract_generated = false
- seat_contract_state = held_until_map_complete

### 6. Seat MAP payment event logging

Create or update DB/contract state equivalent to:

map_payment_events

Required tracked values:

- map_order_id
- evaluation_result_id
- map_standing
- stripe_checkout_session_id
- stripe_payment_intent_id
- payment_status
- amount_paid
- currency
- paid_at
- webhook_event_id
- oar_state

Payment success must be webhook-confirmed before scheduling unlock.

### 7. Post-payment scheduling unlock

After verified payment:

- payment_status = paid
- map_order_state = paid
- scheduling_state = released

Then route to:

System Readiness Consultation scheduling

Do not unlock:

- SEAT contract
- c3 Key
- wallet
- Registry Certification
- Registered System
- Optics
- DAO / distribution

### 8. Holds

Post-launch held systems:

- c3 Key issuance
- SEAT contracts
- wallet integration
- Registry Certification
- Registered System standing
- c3 Field Optics
- DAO / 33x3x1

Hold states:

- c3_key_state = held_post_launch
- seat_contract_state = held_until_map_complete
- wallet_state = held_post_launch
- registry_certification_state = not_granted_by_map
- registered_system_state = not_granted_by_map
- optics_state = held
- dao_distribution_state = held

## CODY / CLAUDE ROLE

Executor may:

- bind registered media map entries
- seat/update DB contracts
- wire renderer to seated contracts
- create server-side Stripe Checkout endpoint
- create Stripe webhook receiver
- record payment events
- gate scheduling release from verified payment
- return validation output
- write OAR1

Executor may not:

- use static Stripe payment links as runtime authority
- hardcode Stripe URLs in frontend
- hardcode MAP prices outside DB/contract state
- hardcode media paths outside media map
- mutate assessment questions/contact fields/scoring unless explicitly required
- reveal SEAT before MAP completion
- activate c3 Key/wallet/DAO/certification/Optics
- invent fallback payment success

## VALIDATION

Validation must prove:

1. Obsidian contact surface resolves registered media.
2. Obsidian assessment surface resolves registered media.
3. Obsidian evaluation result resolves registered media.
4. Evaluation result routes to registered Marble Passage.
5. Marble Passage routes to Marble Directory.
6. Marble Directory renders correct MAP circuit from evaluation standing.
7. MAP prices resolve from DB/contract state.
8. Stripe Checkout Session is created server-side.
9. Frontend contains no static Stripe payment links as authority.
10. Webhook endpoint exists or is explicitly marked pending until deployment.
11. Payment success is recorded only through verified webhook event.
12. Scheduling unlocks only after verified payment.
13. c3 Key remains not required for MAP.
14. SEAT remains held until MAP completion.
15. Wallet integration remains held post-launch.
16. No C1/C2/C3 public leakage.
17. No Direct/Mapped/Federated SEAT pricing is displayed.
18. No Registry Certification / Registered System / Optics / DAO standing is implied.
19. Renderer reads from DB/media map/contract state only.
20. OAR1 is written after execution.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_complete_obsidian_marble_launch_chambers_governed_map_payment_boundary_v1.meta.md

## NEXT OAR PLAN

### OAR2-Next 1

OAR2 — Seat Stripe Webhook Endpoint and MAP Payment Event Verification v1

Scope:

- server-side checkout session
- webhook endpoint
- Stripe signature validation
- payment event table
- scheduling release gate

### OAR2-Next 2

OAR2 — Complete Lapis Chamber SEO Social and Launch Campaign Directory v1

Scope:

- Lapis chamber content/style
- SEO metadata
- Open Graph / Twitter previews
- campaign route surfaces
- Paragraph / social seeding alignment
- no mutation to Obsidian or Marble commerce

### OAR2-Next 3

OAR2 — Seat Post-Launch c3 Key SEAT Wallet Readiness Audit v1

Scope:

- c3 Key readiness
- wallet integration requirements
- SEAT contract generation after MAP
- Direct / Mapped / Federated SEAT contract structure
- entity/EIN/payment reconciliation if needed
- no launch-blocking mutation

### OAR2-Next 4

OAR2 — Launch Readiness QA and Public Boundary Verification v1

Scope:

- public route QA
- mobile/laptop containment
- no C1/C2/C3 leak
- no SEAT leak
- no c3 Key/wallet premature activation
- Stripe test payment validation
- media map validation
- final launch checklist

## CLOSE

Clean sequence:

1. Complete Obsidian + Marble launch chambers.
2. Seat/verify governed Stripe MAP payment.
3. Finish Lapis SEO / socials / campaign.
4. QA launch boundaries.
5. Post-launch c3 Key / SEAT / wallet.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Executor implements from OAR2 only.
src renders seated state only.
