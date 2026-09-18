---
name: paid-campaigns
description: Prepare a measurable paid acquisition campaign with copy, creative references and platform-specific setup artifacts. Use for Google, Meta or other paid channels selected by a marketing brief.
---

# Paid campaign preparation and authorized launch

Role: campaign structure and measurement. Read the brief, product availability,
copy, creative manifest and existing account/export information. Reuse known
answers; ask only for missing facts needed by the current step, such as spending
limit, currency, destination, geographic scope or conversion action.

## Design the campaign

Select the channel from the audience and objective, not from a fixed template.
Define offer, destination, audience or search intent, conversion event,
experiment, dates when relevant, and explicitly daily versus total budget.
Unknown spending limits block launch, not research and draft preparation.

For search, group keywords by intent and landing-page relevance. Research
current matching options and exclusions; do not invent volumes or use stale
match-type conventions. For social, define the audience hypothesis, placement
fit and distinct creative angles; do not treat inferred sensitive traits as
targeting facts. Verify the platform's current rules for the product category.

Map each campaign/group to text variants, creative asset identifiers and final
destination. Verify offer consistency, URLs, current text/asset constraints,
required fields and actual product readiness. Unsupported claims and missing
assets remain blockers for affected ads.

## Produce a usable setup artifact

Save `workspace/output/campaign-plan.md` with structure, budget assumptions,
measurement, asset mapping, prerequisites and exact intended account action.
When a platform supports import, derive its schema from current official docs
or a fresh supplied export. Produce the actual CSV/other supported artifact,
with correct encoding and escaping, only after required fields can be supplied.
Do not call a generic table an import-ready campaign.

For Google Ads Editor, consult
[CSV columns](https://support.google.com/google-ads/editor/answer/57747?hl=en)
and [import review](https://support.google.com/google-ads/editor/answer/30564?hl=en).
Keep draft campaigns paused where supported. An import may change existing
items: preserve identifying fields and inspect the proposed changes. Validate
by parsing the output and, when available, using the platform's import preview.
Distinguish schema-checked from platform-validated. For Meta or other channels,
verify their actual supported setup path; do not assume the Google CSV works.

If import support or platform access is unavailable, deliver a clearly labeled
manual setup package with field mapping and complete assets, not a fake import.
Do not create integrations or collect account credentials in workspace files.

## Measurement and external action

Define conversion meaning, event deduplication where needed, attribution
limitations, campaign/creative identifiers and a privacy-appropriate measurement
path. Coordinate required product events with implementation. Do not place
personal data in tracking URLs. A tracking plan is not verified event delivery.

Before spending or publishing, verify authorization covers this account,
creative, destination, budget and schedule. Present the concrete prepared
package only if permission is still missing. When authorized and tooling is
available, execute and verify resulting status and budget. Never imply this
procedure itself grants permission to spend or schedule future execution.

Report prepared, imported, submitted, approved and delivering as distinct states.
Record external identifiers only from observed responses, with no secrets.
Pass real exports and experiment context to campaign-analysis for follow-up.
