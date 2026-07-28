const VALID_CAPABILITIES = new Set([
  "greeting",
  "sales",
  "product_details",
  "faq",
  "support",
  "out_of_scope",

  // "recommendation",
  // "discovery",
  // "comparison",
  "lead",
  "resume_workflow",
  "cancel_workflow",
]);

const VALID_SOURCES = new Set([
  "ACTION",
  "RULE",
  "LLM",
  "LLM_PRODUCT",
  "WORKFLOW",
  "CONVERSATION",
  "RESUME",
  "FALLBACK",
]);

export default class RoutingValidator {
  validate(result = {}) {
    const capability = this.validateCapability(result.capability);

    return {
      capability,
      capabilities: [capability],
      confidence: this.validateConfidence(result.confidence),
      source: this.validateSource(result.source),
    };
  }

  validateCapability(capability) {
    if (typeof capability === "string" && VALID_CAPABILITIES.has(capability)) {
      return capability;
    }

    return "out_of_scope";
  }

  validateConfidence(confidence) {
    const value = Number(confidence);

    if (Number.isNaN(value)) {
      return 0;
    }

    return Math.max(0, Math.min(1, value));
  }

  validateSource(source) {
    if (VALID_SOURCES.has(source)) {
      return source;
    }

    return "RULE";
  }
}
