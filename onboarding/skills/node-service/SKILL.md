---
name: node-service
description: Implement a Node.js service when the selected architecture requires JavaScript or TypeScript server execution.
---

# Node Service

## Responsibility

Own API contracts, validation, domain behavior and server integrations within assigned files.

Read the architecture decision and current assignment first. This pack specializes
an existing builder or a scoped native profile; it does not instantiate an agent.
Respect assigned paths and use only tools actually available in this client.

## Required evidence

Inspect runtime version, package manager, framework, deployment constraints and current official compatibility documentation before adding packages.

## Implementation decisions

Validate untrusted inputs; enforce authorization server-side; bound expensive work. Keep credentials server-side. Handle cancellation, asynchronous failures and retry idempotency where relevant. Do not assume a relational database or add a service to a static site.

## Acceptance evidence

Exercise a real request path plus malformed input, unauthorized access and dependency failure. Run existing targeted tests and build/type checks. Use isolated data.

Return changed files, observed behavior, checks actually run and unresolved
limitations. Preserve existing user authorization; this pack does not authorize
purchases, publishing, account changes or production operations.

