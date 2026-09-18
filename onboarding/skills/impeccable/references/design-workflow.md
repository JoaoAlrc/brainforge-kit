# Product Context, Direction and Implementation

Modified Brainforge adaptation of Impeccable 4.3.1 guidance from `init.md`,
`new-work.md`, `visualize.md` and `document.md`. The native engine, launchers,
generated decision pages and mandatory native-agent handoffs are not included.
Copyright 2025 Paul Bakaus. See [../NOTICE.md](../NOTICE.md) and
[../LICENSE](../LICENSE).

## Start from evidence

Read the saved brief, relevant project files, supplied references and actual
assets. Inspect the incumbent interface if possible. Prefer fresh rendered
evidence; identify the version and route of any existing screenshot before using
it as current truth. Preserve deliberate identity choices already visible in the
product even when there is no `DESIGN.md`.

For a new product, establish who it serves, the result they need, the primary
action, content and proof available, operating context, and constraints. Ask one
plain product question at a time only when the answer changes the work. Reuse the
user's existing answers and delegated decisions; do not ask them to choose CSS
values, frameworks or design jargon.

Keep three kinds of context separate:

- **Product truth:** audience, purpose, positioning, real capabilities, approved
  claims and brand commitments. Use an existing product brief or `PRODUCT.md`.
- **Design system:** reusable palette, typography, spacing, components and states.
  Use an existing design document or `DESIGN.md`.
- **Surface brief:** this route's purpose, primary action, composition, content,
  memorable interaction, acceptance checks and unresolved choices.

Do not create competing records when the project already has these documents.
Research tasks can propose this material as text; the assigned build task writes
it within its allowed paths. Keep saved Brainforge decisions consistent with the
documents so later tasks receive the same brief.

## Decide how much change is needed

For a local addition, inherit the current world and solve the new content,
hierarchy, states and interaction. For a whole new surface inside an established
brand, preserve its tokens and explore composition. For a new or explicitly
replaced identity, derive a visual direction from the audience's environment,
subject and product mechanism.

When the visual direction is open, compare a small set of materially different,
viable directions. Explain what changes in the first viewport, content flow,
imagery and interaction, with a practical tradeoff. A palette swap alone is not
a different direction. Use supplied references to understand composition and
craft rather than transplanting another product's copy or identity.

Honor a pinned reference or a user's delegated choice. Where a meaningful choice
remains theirs, present the options in the available conversational interface.
Do not claim a choice was approved merely because the assistant recommended it.
No dice script, decision server or repeated concept tournament is required here.

## Record a compact direction before building

The surface brief should let another specialist implement the same intention:

- Audience and outcome; what the first viewport must make clear.
- Visual character: palette, type voice, image approach, density and shape.
- Content order and scale relationships; the primary action's location.
- One useful signature moment, if the surface benefits from one.
- Required responsive states and concrete acceptance checks.
- Supplied facts/assets, illustrative material and missing inputs.

Use an annotated wireframe or concise structure description when useful. If real
image-generation tools are available and visual exploration is valuable, a comp
can make a direction reviewable. This is optional; no image tool is implied by
the skill. State whether the reference is approved, illustrative or unverified.

## Build from the direction

Implement the visible journey and important states with semantic, responsive
components. Use the project's selected stack; design work is not a reason to
replace it or add a backend. Carry the content, scale relationships and interaction
from the brief into actual behavior. Preserve function during a visual redesign.

Use supplied or properly sourced assets when imagery materially carries the
concept. Do not simulate a photograph with a decorative code placeholder and
call the imagery complete. Without suitable assets or generation tools, choose
a deliberate design that works with what is available, or mark the required
asset as missing. Never silently substitute fictional property photos, people,
results or testimonials for factual material.

For generated comps, distinguish the reference image from production assets.
Keep text, controls and page layout in code. Produce reusable assets at the
needed resolution when tools permit, preserve originals, and record source or
generation provenance in development-only notes. Remove abandoned assets only
within the current authorized scope; do not clean unrelated user files.

## Verify, review and document

Use [quality-review.md](quality-review.md) for a bounded inspection pass and a
review handoff. The review packet carries the original goal, direction, changed
files, actual screenshots/checks and known limitations. It does not rely on the
builder's claim that the result looks good.

After a new visual system or an authorized system change is implemented, record
the reusable design rules evidenced by the built product. Include palette roles,
type scale, spacing rhythm, widths, component states, elevation, motion and
responsive behavior where applicable. Link to actual code tokens instead of
maintaining a second inconsistent source of truth.

For a small extension, preserve the incumbent design documents and update only
new durable decisions. Do not canonize a known defect into the design system to
make the implementation appear compliant. Report unrelated drift separately.
This portable workflow does not create upstream `.impeccable` engine state or
claim compatibility with its live-panel sidecar format.
