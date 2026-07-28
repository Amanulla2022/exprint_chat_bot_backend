import ProductResolver from "../../catalog/ProductResolver.js";
import LLMService from "../../../ai/llm/LLMService.js";

import {
  SALES_PATTERNS,
  // COMPARISON_PATTERNS,
  DETAIL_PATTERNS,
  // DISCOVERY_PATTERNS,
} from "../utils/RoutingConstants.js";

const resolver = new ProductResolver();
const llm = new LLMService();

export default class SemanticProductRouter {
  async classify(state) {
    /*
     * =====================================================
     * Resolve Catalog Context
     * =====================================================
     */

    const catalogContext = await resolver.resolveContext(
      state.userMessage,
      state,
    );

    state.catalogContext = catalogContext;

    /*
     * =====================================================
     * Recommendation Workflow
     * =====================================================
     */

    // if (state.workflow === "RECOMMENDATION" && state.awaitingDecision) {
    //   return null;
    // }

    /*
     * =====================================================
     * Recommendation Intent
     * =====================================================
     */

    // if (catalogContext.intent === "recommendation") {
    //   return null;
    // }

    /*
     * =====================================================
     * No Product Found
     * =====================================================
     */

    if (!catalogContext.products?.length) {
      return null;
    }

    const message = (state.userMessage ?? "").trim();
    const normalized = message.toLowerCase();

    /*
     * =====================================================
     * Multiple Products
     * =====================================================
     */

    if (
      catalogContext.products.length > 1 &&
      COMPARISON_PATTERNS.some((pattern) => pattern.test(normalized))
    ) {
      return {
        capability: "comparison",
        confidence: 1,
        source: "RULE",
      };
    }

    /*
     * =====================================================
     * Sales
     * =====================================================
     */

    if (
      SALES_PATTERNS.some((pattern) => pattern.test(normalized)) ||
      /\b\d+\b/.test(normalized)
    ) {
      return {
        capability: "sales",
        confidence: 1,
        source: "RULE",
      };
    }

    /*
     * =====================================================
     * Product Details
     * =====================================================
     */

    if (DETAIL_PATTERNS.some((pattern) => pattern.test(normalized))) {
      return {
        capability: "product_details",
        confidence: 1,
        source: "RULE",
      };
    }

    /*
     * =====================================================
     * Discovery
     * =====================================================
     */

    const product = catalogContext.products[0].toLowerCase();

    if (
      normalized === product ||
      DISCOVERY_PATTERNS.some((pattern) => pattern.test(normalized))
    ) {
      return {
        capability: "discovery",
        confidence: 1,
        source: "RULE",
      };
    }

    /*
     * =====================================================
     * Tiny LLM Fallback
     * =====================================================
     */

    const schema = {
      type: "object",
      properties: {
        capability: {
          type: "string",
          enum: ["sales", "product_details"],
        },
        confidence: {
          type: "number",
        },
      },
      required: ["capability", "confidence"],
    };

    const result = await llm.invokeStructured({
      schema,

      systemPrompt: `
You are a product intent classifier.

Known Products:
${catalogContext.products.join(", ")}

Return ONLY valid JSON.

Choose ONE capability.

sales
- buy
- order
- purchase
- quantity
- checkout
- review order
- modify order
- confirm order

product_details
- price
- specification
- material
- finish
- size
- features
- printing options
`,

      userMessage: message,
    });

    return {
      capability: result.capability,
      confidence: Number(result.confidence ?? 0.8),
      source: "LLM_PRODUCT",
    };
  }
}
