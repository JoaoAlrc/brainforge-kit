---
name: godot-game
description: Implement a Godot game after engine selection with scenes, input and a playable loop.
---

# Godot Game

## Responsibility

Own the assigned scene, gameplay script and resource boundaries.

Read the architecture decision and current assignment first. This pack specializes
an existing builder or a scoped native profile; it does not instantiate an agent.
Respect assigned paths and use only tools actually available in this client.

## Required evidence

Inspect engine version, renderer, scripting language and target export requirements. Consult official documentation for that version.

## Implementation decisions

Choose camera, dimensionality, movement and physics from the desired experience. Preserve resource identities and scene references. Confirm target support before choosing a language or plugin. Avoid editing shared scenes concurrently.

## Acceptance evidence

Verify the gameplay loop, input, scene transitions and reset behavior in the engine when available. Check an appropriate export or headless test where supported; distinguish those checks from visual playtesting.

Return changed files, observed behavior, checks actually run and unresolved
limitations. Preserve existing user authorization; this pack does not authorize
purchases, publishing, account changes or production operations.

