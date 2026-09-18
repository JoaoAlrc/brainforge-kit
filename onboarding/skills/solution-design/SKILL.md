---
name: solution-design
description: Choose a software architecture and prepare project specialists from a user's product goal. Use for new sites, applications, games, or requirements that materially change an existing architecture.
---

# From a goal to a working team

This is a shared procedure executed by the current assistant, not a separate
reasoning service or a deterministic technology selector. Read only the
specialization packs needed for the chosen solution.

## Discover the experience

Read saved context and inspect an existing project before suggesting changes.
Preserve explicit technology choices and working infrastructure unless a real
constraint requires reconsideration. Do not migrate merely to match a template.

Ask in the user's language, one concrete product question at a time. Skip facts
already known. Do not ask about programming expertise, frameworks, databases,
agent counts, or internal tracks. Use everyday choices and examples:

- Website: what should visitors do? Read a menu, contact the owner, book, order,
  pay? Who updates content and how often? Do customers need accounts?
- Application: what is the first useful action? Phone, browser, or desktop?
  Must it work without internet? Who can see or change each kind of information?
- Game: what does the player do? For a car game, see the car from above, behind,
  or inside? Flat artwork or a world with depth? Phone, computer, console, or
  browser? Alone or with other players? Arcade handling or realistic simulation?
  Ask only what affects the first playable version, not every possible feature.
- Existing project: what must change, and what already works? Inspect manifests,
  code, assets and tests instead of making the user explain the technology.

Stop asking when the next reversible implementation step is clear. Record
uncertainties; investigate technical unknowns with a small prototype. Ask the
user only when a missing product decision materially changes the result.

## Choose the smallest sufficient architecture

Translate the experience into capabilities: rendering, content editing, storage,
identity, payments, offline work, realtime interaction, deployment and operations.
Omit capabilities that are unnecessary. A brochure site need not have a backend;
a local game need not have accounts or cloud storage.

Compare a small number of plausible approaches against actual requirements,
existing assets, accessibility, maintenance, budget, platform constraints and
delivery time. Do not declare a universal best stack or score options with
invented precision. A track label never selects Supabase, React, Unity or any
other dependency by itself. Language, engine, framework and hosted service are
different choices and can be combined only when compatible.

Use current official documentation for compatibility, support, export targets,
licensing and material service limits/prices when relevant. Record the source
and date checked. If browsing is unavailable, mark those facts unverified and
avoid commitments that depend on them. Existing verified local documentation
can support a provisional, reversible first step.

Make the technical decision autonomously within the user's constraints. Explain
the practical reason briefly; do not require routine stack approval. Purchases,
account creation, production changes and publishing retain their own actual
authorization requirements. Software setup may require build tools later; do
not disguise those requirements or make them prerequisites to this interview.

Save the choice, alternatives, reasons, unknowns, evidence and conditions for
reconsideration in `workspace/output/architecture.md`. Link it from context.md
and team.md. Keep the short memory budgets; do not copy research into each agent.

## Compose specialists

Consult [the pack index](../../SPECIALISTS.md). Select responsibilities from
the architecture, then the relevant skill packs; never load the entire catalog.
Reuse a compatible existing profile. One builder may cover a small project;
separate specialists only for meaningful work, boundaries or independent review.

Each assignment records in team.md: responsibility, selected skill paths,
current task, architecture reference, allowed files, dependencies and acceptance
checks. Translate the pack's role into a focused assignment; it is not a separate
model and does not prove expertise or execution.

For an uncovered technology, use
[capability expansion](../capability-expansion/SKILL.md) to research, compose
and calibrate a local pack. This same process covers gaps outside software.

Follow [specialist activation](../../SPECIALISTS.md#activate-specialists) to
prepare native profiles where supported. Preserve custom files, current model,
permissions and client boundaries. With no native delegation, use the same
assignments sequentially and disclose the lack of independent review.

## Deliver and verify

Start the smallest useful vertical slice: one visitor action, app workflow or
playable interaction. Verify behavior, not just file creation. Use actual project
commands; never copy a track's example checks without confirming them.
Save evidence and update next.md. A plan is not a finished product; generated
profiles are not proof of discovery, execution or quality.
