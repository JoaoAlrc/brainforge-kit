---
name: unity-game
description: Implement a Unity game after engine selection, focusing on a playable interaction and target platform.
---

# Unity Game

## Responsibility

Own gameplay components, scenes and input integration for the assigned slice.

Read the architecture decision and current assignment first. This pack specializes
an existing builder or a scoped native profile; it does not instantiate an agent.
Respect assigned paths and use only tools actually available in this client.

## Required evidence

Inspect editor version, packages, rendering pipeline, asset licenses and intended device. Consult official documentation matching the project's version.

## Implementation decisions

Derive 2D/3D, camera, physics and input choices from the intended experience. Keep Unity-specific C# lifecycle and serialization in mind. Preserve asset metadata and avoid parallel edits to the same scene. Do not assume multiplayer or cloud services.

## Acceptance evidence

Verify the interaction in the editor or a target build when available, including input, collisions and reset behavior. Use appropriate engine tests. Code compilation alone does not verify game feel; record human playtest needs.

Return changed files, observed behavior, checks actually run and unresolved
limitations. Preserve existing user authorization; this pack does not authorize
purchases, publishing, account changes or production operations.

