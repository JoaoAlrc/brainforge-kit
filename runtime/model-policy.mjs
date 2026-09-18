// Shared defaults, not account availability or benchmark guarantees.
export const TIERS = {
  lookup: { model: "gpt-5.6-luna", effort: "low" },
  execution: { model: "gpt-5.6-terra", effort: "medium" },
  review: { model: "gpt-5.6-sol", effort: "high" },
  critical: { model: "gpt-6-astra", effort: "high" },
};
export function selectModel(
  provider,
  agent,
  role,
  complexity = "standard",
  policy = "balanced",
  skills = [],
) {
  if (policy === "inherit")
    return { model: null, effort: null, reason: "Client configuration" };
  if (provider === "claude")
    return {
      model:
        complexity === "critical"
          ? "opus"
          : agent?.model && agent.model !== "inherit"
            ? agent.model
            : role === "review"
              ? "opus"
              : complexity === "simple"
                ? "haiku"
                : "sonnet",
      effort:
        complexity === "critical"
          ? "xhigh"
          : agent?.effort ||
            (complexity === "simple"
              ? "low"
              : role === "review"
                ? "high"
                : "medium"),
      reason: agent ? "Preserved Claude catalog model" : "Task responsibility",
    };
  const tier =
    complexity === "critical"
      ? "critical"
      : complexity !== "simple" && ["design-steward", "game-designer", "level-designer"].includes(agent?.id)
        ? "critical"
        : complexity !== "simple" && role === "review" && skills.includes("impeccable")
          ? "critical"
      : complexity === "simple" && (["context-scout", "docs-librarian", "design-librarian"].includes(
            agent?.id,
          ) || role === "research")
        ? "lookup"
        : role === "review" ||
            /reviewer|auditor|architecture|security|commerce|money|task-author|domain-engineer|rules-engineer|kids-compliance|persistence-dev|backend-dev|platform-dev|scrum-master/.test(
              agent?.id || "",
            )
          ? "review"
          : "execution";
  return {
    ...TIERS[tier],
    effort:
      complexity === "simple" && tier === "execution"
        ? "low"
        : TIERS[tier].effort,
    reason: tier === "critical" && complexity !== "critical"
      ? "Codex design direction policy"
      : `Codex ${tier} policy`,
  };
}

export const DESIGN_PLANNING_GUIDE = `Design quality and capability planning:
For a new or materially redesigned visual surface without an established direction, schedule design direction before surface implementation. Use design-steward for visual direction, tokens and shared primitives, game-designer for game mechanics/specifications, and the relevant implementation owner for screens or gameplay. Respect each role's actual ownership; a direction specialist is not automatically the screen builder.
Use impeccable for frontend design work when relevant, loading only the selected references. Reuse real project references and approved content. The design handoff must describe the actual target surface: audience, primary action, hierarchy, layout, typography, palette, asset requirements, interaction states, narrow/wide behavior, and concrete acceptance checks. A generic adjective such as premium is not a sufficient handoff. Do not invent imagery, factual claims, brands or authorization.
In matched-model mode substantial design direction uses Astra/high for Codex; bounded implementation can use Terra/medium, and simple retrieval can use Luna/low. Reproducing a demanding visual reference is not automatically simple implementation: mark it critical when needed instead of downgrading solely because a plan exists. Add an independent visual review using impeccable with fresh desktop/mobile evidence; a substantial impeccable review uses Astra/high. Simple copy/spacing corrections can remain simple. These assignments do not guarantee quality or measured token savings.
Read-only research should complete its actual information-gathering acceptance, not require unrelated application test writes. Report unavailable formats/tools precisely and preserve the useful facts already observed. Never say a PDF was read because its filename was listed. A missing visual source genuinely required for the design remains a blocker; do not silently pass it. Browser checks require real browser tools or supplied captures. Code inspection alone is not visual evidence. Do not mark a local milestone blocked solely because future production hosting or unrequested external services have not been provisioned.`;

