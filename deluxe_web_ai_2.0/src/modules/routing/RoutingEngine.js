// import GreetingClassifier from "./classifiers/GreetingClassifier.js";
// import RecommendationClassifier from "./classifiers/RecommendationClassifier.js";
// import RecommendationConversationClassifier from "./classifiers/RecommendationConversationClassifier.js";
// import SemanticProductRouter from "./classifiers/SemanticProductRouter.js";
// import FAQClassifier from "./classifiers/FAQClassifier.js";
// import SupportClassifier from "./classifiers/SupportClassifier.js";
// import IntentRouter from "./classifiers/IntentRouter.js";

// export default class RoutingEngine {
//   constructor() {
//     this.greeting = new GreetingClassifier();

//     this.recommendation = new RecommendationClassifier();

//     this.recommendationConversation =
//       new RecommendationConversationClassifier();

//     this.productRouter = new SemanticProductRouter();

//     this.faq = new FAQClassifier();

//     this.support = new SupportClassifier();

//     this.intentRouter = new IntentRouter();
//   }

//   /*
//    * =====================================================
//    * Route Request
//    * =====================================================
//    */
//   async route(state) {
//     /*
//      * =====================================================
//      * UI Action
//      * =====================================================
//      */

//     const action = this.routeAction(state.action);

//     if (action) {
//       return action;
//     }

//     /*
//      * =====================================================
//      * Active Workflow
//      * =====================================================
//      */

//     if (state.routing?.source === "WORKFLOW") {
//       return {
//         capability: state.capability,
//         confidence: 1,
//         source: "WORKFLOW",
//       };
//     }
//     /*
//      * =====================================================
//      * Greeting
//      * =====================================================
//      */

//     const greeting = this.greeting.classify(state);

//     console.log("Greeting:", greeting);

//     if (greeting) {
//       return greeting;
//     }

//     /*
//      * =====================================================
//      * New Recommendation
//      * =====================================================
//      */

//     const recommendation = await this.recommendation.classify(state);

//     console.log("Recommendation:", recommendation);

//     if (recommendation) {
//       return recommendation;
//     }

//     /*
//      * =====================================================
//      * Recommendation Conversation
//      * =====================================================
//      */

//     const recommendationConversation =
//       await this.recommendationConversation.classify(state);

//     console.log("RecommendationConversation:", recommendationConversation);

//     if (recommendationConversation) {
//       return recommendationConversation;
//     }

//     /*
//      * =====================================================
//      * Product Routing
//      * =====================================================
//      */

//     const product = await this.productRouter.classify(state);

//     console.log("ProductRouter:", product);

//     if (product) {
//       return product;
//     }

//     /*
//      * =====================================================
//      * FAQ
//      * =====================================================
//      */

//     const faq = this.faq.classify(state);

//     console.log("FAQ:", faq);

//     if (faq) {
//       return faq;
//     }

//     /*
//      * =====================================================
//      * Support
//      * =====================================================
//      */

//     const support = this.support.classify(state);

//     console.log("Support:", support);

//     if (support) {
//       return support;
//     }

//     /*
//      * =====================================================
//      * Intent Router
//      * =====================================================
//      */

//     const intent = await this.intentRouter.classify(state);

//     console.log("Intent:", intent);

//     return intent;
//   }

//   //   /*
//   //    * =====================================================
//   //    * Greeting
//   //    * =====================================================
//   //    */

//   //   const greeting = this.greeting.classify(state);

//   //   if (greeting) {
//   //     return greeting;
//   //   }

//   //   /*
//   //    * =====================================================
//   //    * FAQ
//   //    * =====================================================
//   //    */

//   //   const faq = this.faq.classify(state);

//   //   if (faq) {
//   //     return faq;
//   //   }

//   //   /*
//   //    * =====================================================
//   //    * Support / Service
//   //    * =====================================================
//   //    */

//   //   const support = this.support.classify(state);

//   //   if (support) {
//   //     return support;
//   //   }

//   //   /*
//   //    * =====================================================
//   //    * Recommendation Conversation
//   //    * =====================================================
//   //    */

//   //   const recommendation =
//   //     await this.recommendationConversation.classify(state);

//   //   if (recommendation) {
//   //     return recommendation;
//   //   }

//   //   /*
//   //    * =====================================================
//   //    * Product Routing
//   //    * =====================================================
//   //    */

//   //   const product = await this.productRouter.classify(state);

//   //   if (product) {
//   //     return product;
//   //   }

//   //   /*
//   //    * =====================================================
//   //    * General Intent
//   //    * =====================================================
//   //    */

//   //   return this.intentRouter.classify(state);
//   // }

//   /*
//    * =====================================================
//    * UI Actions
//    * =====================================================
//    */

//   routeAction(action) {
//     if (!action?.id) {
//       return null;
//     }

//     /*
//      * Recommendation
//      */

//     if (action.id.startsWith("RECOMMENDATION_")) {
//       return {
//         capability: "recommendation",
//         confidence: 1,
//         source: "ACTION",
//       };
//     }

//     /*
//      * Product Details
//      */

//     if (
//       [
//         "SHOW_PRODUCT_DETAILS",
//         "RELATED_PRODUCT",
//         "SHOW_RELATED_PRODUCT",
//       ].includes(action.id)
//     ) {
//       return {
//         capability: "product_details",
//         confidence: 1,
//         source: "ACTION",
//       };
//     }

//     /*
//      * Comparison
//      */

//     if (["COMPARE_PRODUCT", "COMPARE_PRODUCTS"].includes(action.id)) {
//       return {
//         capability: "comparison",
//         confidence: 1,
//         source: "ACTION",
//       };
//     }

//     /*
//      * Order
//      */

//     if (
//       [
//         "START_ORDER",
//         "CONTINUE_ORDER",
//         "ADD_RELATED_PRODUCT",
//         "ADD_MORE_ITEMS",
//         "ADD_MORE_PRODUCTS",
//         "REVIEW_ORDER",
//         "CONFIRM_ORDER",
//         "CANCEL_ORDER",
//         "CLEAR_ORDER",
//         "REMOVE_ITEM",
//       ].includes(action.id)
//     ) {
//       return {
//         capability: "order",
//         confidence: 1,
//         source: "ACTION",
//       };
//     }

//     /*
//      * Lead
//      */

//     if (["REQUEST_QUOTE", "GET_QUOTE", "CONTACT_SALES"].includes(action.id)) {
//       return {
//         capability: "lead",
//         confidence: 1,
//         source: "ACTION",
//       };
//     }

//     /*
//      * Workflow
//      */

//     if (action.id === "RESUME_WORKFLOW") {
//       return {
//         capability: "resume_workflow",
//         confidence: 1,
//         source: "ACTION",
//       };
//     }

//     if (action.id === "CANCEL_WORKFLOW") {
//       return {
//         capability: "cancel_workflow",
//         confidence: 1,
//         source: "ACTION",
//       };
//     }

//     return null;
//   }
// }

import GreetingClassifier from "./classifiers/GreetingClassifier.js";
// import RecommendationClassifier from "./classifiers/RecommendationClassifier.js";
// import RecommendationConversationClassifier from "./classifiers/RecommendationConversationClassifier.js";
import SemanticProductRouter from "./classifiers/SemanticProductRouter.js";
import FAQClassifier from "./classifiers/FAQClassifier.js";
import SupportClassifier from "./classifiers/SupportClassifier.js";
import IntentRouter from "./classifiers/IntentRouter.js";

export default class RoutingEngine {
  constructor() {
    this.greeting = new GreetingClassifier();

    // this.recommendation = new RecommendationClassifier();

    // this.recommendationConversation =
    //   new RecommendationConversationClassifier();

    this.productRouter = new SemanticProductRouter();

    this.faq = new FAQClassifier();

    this.support = new SupportClassifier();

    this.intentRouter = new IntentRouter();
  }

  /*
   * =====================================================
   * Route Request
   * =====================================================
   */

  async route(state) {
    /*
     * =====================================================
     * UI Action
     * =====================================================
     */

    const action = this.routeAction(state.action);

    if (action) {
      return action;
    }

    /*
     * =====================================================
     * Active Workflow
     * =====================================================
     */

    if (state.routing?.source === "WORKFLOW") {
      return {
        capability: state.capability,
        confidence: 1,
        source: "WORKFLOW",
      };
    }

    /*
     * =====================================================
     * Greeting
     * =====================================================
     */

    const greeting = this.greeting.classify(state);

    console.log("Greeting:", greeting);

    if (greeting) {
      return greeting;
    }

    /*
     * =====================================================
     * Recommendation
     * =====================================================
     */

    // const recommendation = await this.recommendation.classify(state);

    // console.log("Recommendation:", recommendation);

    // if (recommendation) {
    //   return recommendation;
    // }

    /*
     * =====================================================
     * Recommendation Conversation
     * =====================================================
     */

    // const recommendationConversation =
    //   await this.recommendationConversation.classify(state);

    // console.log("RecommendationConversation:", recommendationConversation);

    // if (recommendationConversation) {
    //   return recommendationConversation;
    // }

    /*
     * =====================================================
     * Product Routing
     * Handles:
     * - Sales
     * - Product Details
     * =====================================================
     */

    const product = await this.productRouter.classify(state);

    console.log("ProductRouter:", product);

    if (product) {
      return product;
    }

    /*
     * =====================================================
     * FAQ
     * =====================================================
     */

    const faq = this.faq.classify(state);

    console.log("FAQ:", faq);

    if (faq) {
      return faq;
    }

    /*
     * =====================================================
     * Support
     * =====================================================
     */

    const support = this.support.classify(state);

    console.log("Support:", support);

    if (support) {
      return support;
    }

    /*
     * =====================================================
     * Intent Router (LLM Fallback)
     * =====================================================
     */

    const intent = await this.intentRouter.classify(state);

    console.log("Intent:", intent);

    return intent;
  }

  /*
   * =====================================================
   * UI Actions
   * =====================================================
   */

  routeAction(action) {
    if (!action?.id) {
      return null;
    }

    /*
     * Recommendation
     */

    // if (action.id.startsWith("RECOMMENDATION_")) {
    //   return {
    //     capability: "recommendation",
    //     confidence: 1,
    //     source: "ACTION",
    //   };
    // }

    /*
     * Product Details
     */

    if (
      [
        "SHOW_PRODUCT_DETAILS",
        "RELATED_PRODUCT",
        "SHOW_RELATED_PRODUCT",
      ].includes(action.id)
    ) {
      return {
        capability: "product_details",
        confidence: 1,
        source: "ACTION",
      };
    }

    /*
     * Comparison
     */

    // if (["COMPARE_PRODUCT", "COMPARE_PRODUCTS"].includes(action.id)) {
    //   return {
    //     capability: "comparison",
    //     confidence: 1,
    //     source: "ACTION",
    //   };
    // }

    const SALES_ACTIONS = new Set([
      "START_ORDER",
      "CONTINUE_ORDER",

      "SELECT_PRODUCT",
      "SELECT_VARIANT",
      "SELECT_SPECIFICATIONS",

      "ASK_ARTWORK",
      "ASK_QUANTITY",
      "ASK_NUMBER_OF_NAMES",

      "SELECT_DELIVERY_METHOD",
      "ASK_DELIVERY_ADDRESS",
      "ASK_DELIVERY_DATE",

      "REVIEW_ORDER",
      "COMPLETE_ORDER",
      "CONFIRM_ORDER",

      "ADD_RELATED_PRODUCT",
      "ADD_MORE_ITEMS",
      "ADD_MORE_PRODUCTS",

      "REMOVE_ITEM",
      "CLEAR_ORDER",
      "CANCEL_ORDER",
    ]);

    if (SALES_ACTIONS.has(action.id)) {
      return {
        capability: "sales",
        capabilities: ["sales"],
        confidence: 1,
        source: "ACTION",
      };
    }

    /*
     * Lead
     */

    if (["REQUEST_QUOTE", "GET_QUOTE", "CONTACT_SALES"].includes(action.id)) {
      return {
        capability: "lead",
        confidence: 1,
        source: "ACTION",
      };
    }

    /*
     * Workflow
     */

    if (action.id === "RESUME_WORKFLOW") {
      return {
        capability: "resume_workflow",
        confidence: 1,
        source: "ACTION",
      };
    }

    if (action.id === "CANCEL_WORKFLOW") {
      return {
        capability: "cancel_workflow",
        confidence: 1,
        source: "ACTION",
      };
    }

    return null;
  }
}
