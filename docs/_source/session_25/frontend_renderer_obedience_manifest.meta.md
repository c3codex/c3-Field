Resolver Rules

Allowed:

map metadata → resolution fields
normalize casing
pass through DB state

Not allowed:

hardcoded nodes
hardcoded navigation
fallback UI replacing DB
frontend-derived release logic
component-owned capture targets
GenericEncounter Responsibilities

Allowed:

select render branch from renderer.layout
render media from resolution.media
render actions from resolution.actions
render capture from resolution.capture
render phase map from resolution.phase_map
render structural absence

Not allowed:

invent nodes
invent actions
invent labels
invent explanations
invent open/sealed logic
override DB media behavior
Phase Map Rendering Rules

Must consume:

phase_map.nodes
phase_map.edges
phase_map.layout
phase_map.routing
phase_map.node_states
phase_map.labels
phase_map.legend
phase_map.explanation

Frontend draws:

node positions
edge lines
node states
legend
explanation
navigation triggers

Frontend does not define meaning.

Capture Rendering Rules

Render only when:

capture.enabled = true
capture.mode = codex_connect_capture

Submit must include:

source_registry_key
capture_context
name
email
message
metadata

No implicit system actions.

Passage Rendering Rules

Passage surfaces obey:

layout = passage_only
show_action_rail = false
auto_advance_on_video_end = true
advance_delay_ms
settle_ms
fade_ms

Frontend executes timing only.

Temple Home Rules

Crystal Temple Home:

layout = choice_surface
choice_surface_mode = still_first
no auto navigation

Must present:

Inanna’s Seat route
Antechamber route
Error Handling

If contract is missing:

show structural absence
do not substitute content
Success Condition

Frontend is aligned when:

no component-owned truth
no frontend-derived Phase Map
no hardcoded encounter behavior
media renders correctly
actions route correctly
capture writes to Codex
Phase Map renders from DB
Closing

Frontend is the encounter surface, not the authority.