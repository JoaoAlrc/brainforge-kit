# Model policy

Keep the main assistant selected by the user. The conversational starter inherits
the client's model; reading a policy does not change a live session.

When the client supports explicit delegated selection, use runtime/model-policy.mjs
as the common defaults: narrow lookup Luna/low, bounded execution Terra/medium,
review Sol/high, substantial design direction or critical work Astra/high. The
advanced Codex generator writes this policy into native project profiles. Inherit
mode omits model and effort; existing customized configuration is preserved.

Claude uses its own catalog's Opus/Sonnet/Haiku settings. Never pass those aliases
to Codex or silently switch providers. Verify actual tool discovery and account
availability before claiming delegation. If selection is unavailable, continue
with the user's available assistant and disclose the limitation; do not invent
independent review. No automatic account discovery or retry fallback is shipped.

Record requested model/effort and observed model when exposed by the client.
A failed tool or permission is not evidence a weaker model should retry.
