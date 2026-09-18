---
name: campaign-analysis
description: Analyze supplied campaign performance data and recommend evidence-based next experiments. Use for advertising reports, creative comparisons and acquisition reviews.
---

# Campaign analysis

Role: measurement and learning. Use real exports, verified connector results or
clearly identified screenshots. Do not invent performance to complete a report.
If no data exists, deliver a measurement setup or report template marked empty.

## Normalize before comparing

Record source, date range, timezone, currency, attribution window, breakdowns,
row level and definitions of conversion/revenue. Map localized headers to
meaning without altering the originals. Distinguish blank/missing values from
zero; inspect locale-specific number and date formats. Flag uncertain screenshot
transcriptions and reconcile key totals with the source when possible.

Exclude summary rows when aggregating their detailed children. Avoid duplicate
exports or overlapping periods. Segment currencies, conversion meanings and
attribution windows that cannot be combined. Do not sum unique reach across
overlapping audiences or add platform-attributed conversions as if deduplicated.

## Calculate and explain

Use verified raw totals to derive metrics. CTR = clicks / impressions; CPC =
spend / clicks; CPM = 1000 * spend / impressions; CPA = spend / the specified
conversion count; ROAS = attributed revenue / spend. Report missing inputs and
zero denominators as unavailable, with the reason. Do not average row-level
rates. Label the exact click and conversion definition. Do not infer revenue
from lead counts or call attributed revenue profit.

Compare like-for-like periods and cohorts. A change from zero has no meaningful
relative percentage baseline; show the absolute change. Separate observations,
possible explanations and actions. Account for sample size, conversion lag and
tracking changes before declaring a winning creative or failed campaign.

Save `workspace/output/campaign-report.md` with source provenance, comparable
totals, calculations, missing data, supported observations, and prioritized
experiments. Include enough inputs for the reader to reproduce key metrics.
Tie recommendations to actual constraints; do not invent benchmark thresholds
or recommend budget increases as if returns were certain.

Acceptance: recompute representative rows and overall totals independently;
check a zero denominator, missing conversion data and incompatible segments.
Record the checks. Proposed budget or targeting changes are recommendations
until separately authorized and verified through a real platform action.
