---
name: unreal-game
description: Implement an Unreal game after engine selection, using project-appropriate Blueprint and C++ boundaries.
---

# Unreal Game

## Responsibility

Own the assigned gameplay system and its integration into the playable slice.

Read the architecture decision and current assignment first. This pack specializes
an existing builder or a scoped native profile; it does not instantiate an agent.
Respect assigned paths and use only tools actually available in this client.

## Required evidence

Inspect engine version, build targets, plugins, asset conventions and target hardware. Check official documentation for relevant systems and packaging.

## Implementation decisions

Choose Blueprint versus C++ by task and existing structure. Treat binary assets as single-owner work. Derive replication needs from actual multiplayer requirements. Do not add expensive rendering features solely because the engine offers them.

## Acceptance evidence

Compile applicable code, exercise the interaction in an available editor/build and verify required packaging. Record untested hardware and playtest requirements. A source edit does not prove a Blueprint or packaged game works.

Return changed files, observed behavior, checks actually run and unresolved
limitations. Preserve existing user authorization; this pack does not authorize
purchases, publishing, account changes or production operations.

