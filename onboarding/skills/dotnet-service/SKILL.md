---
name: dotnet-service
description: Implement a C# or .NET application/service after the architecture selects it; Unity work uses the Unity pack.
---

# Dotnet Service

## Responsibility

Own application boundaries, typed domain behavior and the selected .NET integration.

Read the architecture decision and current assignment first. This pack specializes
an existing builder or a scoped native profile; it does not instantiate an agent.
Respect assigned paths and use only tools actually available in this client.

## Required evidence

Inspect solution/project files, target framework and deployment platform. Check official documentation for supported SDK and framework combinations.

## Implementation decisions

Keep engine-specific C# separate from ASP.NET assumptions. Validate boundary inputs, authorization and cancellation. Dispose owned resources and handle concurrency deliberately. Do not prescribe a database or ORM before its need is established.

## Acceptance evidence

Build the actual solution or selected project and exercise domain behavior and failure paths. Use the project's test framework; report unavailable SDKs or platform dependencies instead of inventing passing results.

Return changed files, observed behavior, checks actually run and unresolved
limitations. Preserve existing user authorization; this pack does not authorize
purchases, publishing, account changes or production operations.

