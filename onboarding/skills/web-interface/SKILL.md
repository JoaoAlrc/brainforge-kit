---
name: web-interface
description: Build a public website or browser interface after architecture selection.
---

# Web Interface

## Responsibility

Own the visitor journey, semantic markup, responsive layout and accessible interaction.

Read the architecture decision and current assignment first. This pack specializes
an existing builder or a scoped native profile; it does not instantiate an agent.
Respect assigned paths and use only tools actually available in this client.

## Required evidence

Inspect the selected framework or static-site setup and its official accessibility and rendering guidance. Match existing design assets and content editing needs.

## Implementation decisions

Do not introduce authentication, a database, a framework or a CMS just to render public content. Keep secrets off the client. Handle form errors and loading states; avoid layout shift and unnecessary scripts.

## Acceptance evidence

Verify the primary visitor action, keyboard navigation, narrow and wide screens, empty/error states and the actual production build. Use browser evidence when available; disclose visual checks not performed.

Return changed files, observed behavior, checks actually run and unresolved
limitations. Preserve existing user authorization; this pack does not authorize
purchases, publishing, account changes or production operations.

