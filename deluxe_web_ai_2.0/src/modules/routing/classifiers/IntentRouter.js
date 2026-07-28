import LLMService from "../../../ai/llm/LLMService.js";
import RoutingPrompt from "../../../ai/llm/prompts/RoutingPrompt.js";

import {
  SERVICE_PATTERNS,
  SUPPORT_PATTERNS,
  LEAD_PATTERNS,
  // COMPARISON_PATTERNS,
  DETAIL_PATTERNS,
  SALES_PATTERNS,
  DISCOVERY_PATTERNS,
} from "../utils/RoutingConstants.js";

const llm = new LLMService();

export default class IntentRouter {
  async classify(state) {
    const message = (state.userMessage ?? "").trim();

    if (!message) {
      return {
        capability: "out_of_scope",
        confidence: 0,
        source: "RULE",
      };
    }

    const normalized = message.toLowerCase();

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
     * Sales
     * =====================================================
     */

    if (SALES_PATTERNS.some((pattern) => pattern.test(normalized))) {
      return {
        capability: "sales",
        confidence: 1,
        source: "RULE",
      };
    }

    /*
     * =====================================================
     * FAQ
     * =====================================================
     */

    if (SERVICE_PATTERNS.some((pattern) => pattern.test(normalized))) {
      return {
        capability: "faq",
        confidence: 1,
        source: "RULE",
      };
    }

    /*
     * =====================================================
     * Support
     * =====================================================
     */

    if (SUPPORT_PATTERNS.some((pattern) => pattern.test(normalized))) {
      return {
        capability: "support",
        confidence: 1,
        source: "RULE",
      };
    }

    /*
     * =====================================================
     * Comparison
     * =====================================================
     */

    // if (COMPARISON_PATTERNS.some((pattern) => pattern.test(normalized))) {
    //   return {
    //     capability: "comparison",
    //     confidence: 1,
    //     source: "RULE",
    //   };
    // }

    /*
     * =====================================================
     * Discovery
     * =====================================================
     */

    if (DISCOVERY_PATTERNS.some((pattern) => pattern.test(normalized))) {
      return {
        capability: "discovery",
        confidence: 1,
        source: "RULE",
      };
    }

    /*
     * =====================================================
     * Lead
     * =====================================================
     */

    if (LEAD_PATTERNS.some((pattern) => pattern.test(normalized))) {
      return {
        capability: "lead",
        confidence: 1,
        source: "RULE",
      };
    }

    /*
     * =====================================================
     * LLM Fallback
     * =====================================================
     */

    const schema = {
      type: "object",

      properties: {
        capability: {
          type: "string",

          enum: [
            "sales",
            "lead",
            "product_details",
            "faq",
            "support",
            "out_of_scope",
          ],
        },

        confidence: {
          type: "number",
        },
      },

      required: ["capability", "confidence"],
    };

    const result = await llm.invokeStructured({
      schema,

      systemPrompt: RoutingPrompt({
        history: state.history ?? [],
        message,
        catalogContext: state.catalogContext ?? {},
      }),

      userMessage: message,
    });

    return {
      capability: result.capability ?? "out_of_scope",
      confidence: Number(result.confidence ?? 0.8),
      source: "LLM",
    };
  }
}
