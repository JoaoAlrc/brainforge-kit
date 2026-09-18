---
name: mobile-app
description: Implement a mobile application after native, cross-platform or browser delivery has been selected.
---

# Mobile App

## Responsibility

Own the device interaction, lifecycle and selected platform integrations.

Read the architecture decision and current assignment first. This pack specializes
an existing builder or a scoped native profile; it does not instantiate an agent.
Respect assigned paths and use only tools actually available in this client.

## Required evidence

Inspect chosen framework, supported OS versions, device capabilities and current official build/distribution requirements.

## Implementation decisions

Do not default to Expo or a cloud backend. Handle intermittent connectivity, permission refusal, safe areas and app interruption. Keep sensitive credentials in platform-appropriate storage. Reuse the selected backend contract.

## Acceptance evidence

Exercise the first user workflow, offline/error states and lifecycle restoration where needed. Distinguish simulator, physical-device and store validation. Never claim store submission from a local build.

Return changed files, observed behavior, checks actually run and unresolved
limitations. Preserve existing user authorization; this pack does not authorize
purchases, publishing, account changes or production operations.

