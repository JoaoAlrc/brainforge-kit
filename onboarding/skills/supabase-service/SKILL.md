---
name: supabase-service
description: Implement Supabase data, authentication or storage only after Supabase is selected for the project.
---

# Supabase Service

## Responsibility

Own the selected Supabase capabilities, migrations and access policies.

Read the architecture decision and current assignment first. This pack specializes
an existing builder or a scoped native profile; it does not instantiate an agent.
Respect assigned paths and use only tools actually available in this client.

## Required evidence

Read the existing schema, access model and official Supabase documentation for the relevant SDK and service. Verify current hosting constraints and required extensions.

## Implementation decisions

Derive tenancy from the actual product, not a SaaS template. Test row access for each actor when RLS is used. Keep privileged credentials off clients. Preserve migration history; use isolated environments for destructive checks. A public page does not require accounts.

## Acceptance evidence

Verify allowed and denied data access, cross-user isolation where applicable, migration behavior and relevant storage policies. Do not claim a remote migration ran from a generated SQL file.

Return changed files, observed behavior, checks actually run and unresolved
limitations. Preserve existing user authorization; this pack does not authorize
purchases, publishing, account changes or production operations.

