---
name: visual-identity
description: "<PROJECT>'s visual, motion, effect, and sound doctrine: accepted direction and rejected looks, silhouette test, one visual language per screen, materials/tokens, primary-action vocabulary, visible scene states, and capture review. Maintained by art-director. Use for art, mesh, animation, effects, camera, HUD, audio, and visual reviews."
---

# Visual identity

Doctrine for every new element. What <PROJECT> **is** (fantasy, cast, palette
values, signature materials) lives in `<CANON_PATHS>`; human decisions in
`<DECISION_LOG>`; per-element verdicts in the art manifest beside captures in
`<EVIDENCE_DIR>`. This skill caches direction, never defines it: `<CANON_PATHS>`
wins conflicts. Minimum: **original stylized geometry/illustration is acceptable;
generic primitives, stock textures, and enlarged smaller models are not the goal**.
Scale reads through weight: support, inertia, mass preceding motion.

## Rule 0 — readability beats spectacle

Viewers read scenes in seconds at `<FRAMINGS>`, sometimes partly obscured.
Targets, active actions, progress, and state read **without HUD** and **without
color alone**. Effects, smoke, or glow hiding information lose. Before/after is
the product: comparisons lacking obvious transformation fail delivery even if
every individual piece is attractive.

## Rule 1 — one visual language per screen

Layers with different origins (generated, procedural, code-drawn, imported) on
one screen share outline weight, palette, and simplification. Incompatible detail,
such as photorealistic bases under geometric effects or vice versa, is
`UNREADABLE THROUGH INCOHERENCE`, even when each isolated layer is `READABLE`.
One deliberate exception: the flat HUD never follows the scene's style.
Where a genre converges (a pattern shared by nearly every reference), deviations
are owner decisions recorded in `<DECISION_LOG>`, never accidental element drift.

## Rule 2 — overlays are designed, not pasted

Damage, dirt, residue, exposed weaknesses: overlays are the first place coherence
breaks; approved bases do not rescue them. Every layered-capture verdict checks:

1. **Volume, not just color:** shape changes, not merely regional hue.
2. **Consistent light/shadow source:** nothing floats without its own coherent shadow.
3. **Organic marks:** no repeated circles, ellipses, or hatching; irregular edges.
4. **Same technique as the base:** no generic stamps, filters, or textures pasted over it.
5. **Before/after share a language:** two moments of the same artwork, not two artworks.

Failure anywhere → `UNREADABLE THROUGH INCOHERENCE`.

## Silhouette and states

Reduce to ~64 px high (default, adjustable per project), mentally or through
<QA_AGENT>'s HUD-free crop. Every cast element/tool must differ **by outline**,
without color or labels. Color-only differences are `READABLE WITH ADJUSTMENTS`.
The element → key silhouette → required readable state table lives in
`<CANON_PATHS>`; art tasks preserve and strengthen it.

Every rule-distinguished state has visible form: intact/damaged/destroyed/rebuildable,
load, marked target, countdown warning, recovery, phase. **A state existing only
as a HUD number does not exist.** Weakness/damage use **shape + glow + color**,
in that order: change geometry, not just hue.

## Action, camera, HUD, and sound

Every player-triggered or player-received action goes through **anticipation →
execution → recoil → recovery**, and the target reacts. Actions merely rotating
and emitting results lack expression. Every phase has readable duration in
`<FRAMINGS>` and an event hook for effects/audio. Moving parts carry mass:
acceleration, brief overshoot, return.

The scene is primary; the HUD stays small, shows contextual state, and remains
readable at the smallest `<FRAMINGS>`, respecting safe areas. Attached indicators
follow the camera above their elements; returning to a useful view is always
available. Sound: distinct per-element signature, synthesized per instance;
weight comes from a short low-frequency attack, not volume. Limit repetition
to avoid noise. Everything can be disabled for A/B/preference; vibration starts
off. No sound is required to play and **no effect changes an outcome**. QA does
not listen to audio: deliver events/parameters; the human performs listening.

## Materials, palette, and tokens

At most **three materials per family** (environment, cast, objects), each with a
named value. Information colors for routes/previews/UI are reserved, never used
as materials. Tokens live in `<TOKENS_DIR>`; changing one is presentation work
requiring before/after captures. **Every new color is a named constant and starts
`TUNABLE`** (`canon-lookup`), settled only through comparative capture. Stray code
literals are defects, not style.

## Inspecting captures

1. Open PNGs with `Read`, **maximum 6 per dispatch**; every image costs a turn.
   Select before/after and the changed element in action at `<FRAMINGS>`.
2. First ignore the HUD: is the action obvious?
3. Check layer coherence (Rules 1/2), then silhouettes, states, obscuring effects.
4. Mentally desaturate: are target, active action, state, and progress still readable?
   Color-only readability is `UNREADABLE`, however clear the color version seems.
5. Compare an earlier capture with identical framing, when available.
6. Give **per-element** verdicts: `READABLE | READABLE WITH ADJUSTMENTS | UNREADABLE |
   UNREADABLE THROUGH INCOHERENCE`, with smallest fix, layer, and owner. Never
   "looks beautiful"; beauty and fun belong to the human playing.

## Constraints

Nothing depends on `<ENGINE>` features beyond the project's lowest supported
render profile, fixed in `<CANON_PATHS>`. Every effect names an acceptable cost,
measured in the heaviest existing scene using `perf-budget`. Attractive elements
that worsen p95 frame time are not deliverable. Use original or compatibly
licensed materials with provenance recorded beside each asset. Describe references,
never copy them; briefs name no artists or franchises. Content stays within
`<CANON_PATHS>`'s declared age range; when uncertain, use the stricter interpretation.

## Project block

<!-- Facts about <PROJECT>. Filled locally; kit copies never overwrite. -->

- `<CANON_PATHS>` / `<DECISION_LOG>` / `<EVIDENCE_DIR>`: —.
- `<FRAMINGS>`: — (resolution, distance, and conditions proving readability).
- `<ENGINE>` / render tier / performance scene: —.
- `<TOKENS_DIR>`: — (color/material constants).
- One-line thesis and **what the product refuses to resemble**; rejection list
  matters as much as direction: —.
