---
name: brainstorming
description: Use before any creative or implementation work — a new feature, a new project, a behavior change — to turn a request into a scoped, approved design before any code or scaffolding happens. Classifies the request into spike/bounded/architectural and scales ceremony to match; the approval gate never scales down.
---

# Brainstorming Ideas Into Designs

> Third-party license notice: see .brainforge/licenses/THIRD_PARTY_NOTICES.md in generated projects or THIRD_PARTY_NOTICES.md at repository root.

Turn an idea into a scoped design through dialogue, before touching
implementation. This is what stands between "the user wants X" and a
`task-protocol` task ready to delegate — or, when X is a whole new
project, the bridge into `project-bootstrap`.

<HARD-GATE>
No implementation, no scaffolding, no code — on any path below —
until you've stated what you intend and the human has approved it.
Ceremony scales with the task. The approval gate never does.
</HARD-GATE>

## Classify first, out loud

Say the classification before the first question — *"this looks
bounded, so I'll propose a short design in chat"* — so the human can
override it before you've invested in the wrong path.

- **Spike** — a feasibility question ("can we…", "is this possible").
  Output is an answer, not kept code. State the question and the probe
  in 2-3 sentences, get a nod, investigate as cheaply as correctness
  allows, report a recommendation. Anything built stays labeled
  throwaway.
- **Bounded** — a well-scoped change to a flow that already exists in
  this repo: a flag, a small endpoint, a one-file fix. No existing flow
  to change → not bounded, however familiar the pattern looks. Ask the
  clarifying questions that matter, one at a time; present a short
  design in chat (a few sentences); **stop** for an explicit yes before
  writing anything.
- **Architectural** — a new project, new subsystem, or a change to an
  interface other things depend on. Full process: clarifying questions
  one at a time, 2-3 approaches with a recommendation, design presented
  in sections with approval after each, then written to
  `docs/specs/<date>-<topic>.md` and committed. Only then hand off to
  `task-protocol` for delegation, or to `project-bootstrap` if this is
  a new project's first shape.

**When in doubt, take the heavier path.** The ratchet is one-way:
complexity discovered mid-task upgrades the classification — stop, say
so, move up. Nothing downgrades mid-task, and a spike's kept code is a
new request that needs its own classification.

## Anti-pattern: "too simple to need approval"

Every path ends in an explicit yes before implementation — a two-
sentence chat design still needs the nod. Simplicity shortens the
artifact, never removes the gate. Unexamined assumptions on a "simple"
task are the most expensive kind, precisely because no one paused to
say them out loud.

## Red flags — you're about to skip the gate

| Thought | Reality |
|---|---|
| "It's bounded, I'll start while they read it" | The gate is the approval, not the design's length. Present, then stop. |
| "I understand this kind of app, so it's bounded" | Bounded measures what's already in *this* repo, not your familiarity. A new project has no existing flow — it's architectural. |
| "It grew, but I'm almost done" | Hidden complexity upgrades the path mid-task, even at 90%. |
| "They approved the spike, this follow-up is covered" | Each task gets its own classification and its own approval. |

## Checklist by path

**Spike:** explore context → present question + probe (2-3 sentences)
→ get a nod → investigate → report a recommendation, throwaway labeled.

**Bounded:** explore context → clarifying questions one at a time →
short design in chat → **stop for explicit yes** → implement via
normal `test-driven-development` flow, no plan document.

**Architectural:** explore context → clarifying questions one at a
time → 2-3 approaches with trade-offs → design in sections, approval
per section → write the spec, commit it → hand off to `task-protocol`
or `project-bootstrap`.
