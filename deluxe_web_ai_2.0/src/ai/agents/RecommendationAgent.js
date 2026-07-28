import BaseAgent from "./BaseAgent.js";

import ResponseBuilder from "../../core/responses/Apiresponse.js";

import RecommendationService from "../../modules/recommendation/RecommendationService.js";
import RecommendationQuestionService from "../../modules/recommendation/questions/RecommendationQuestionService.js";

const responseBuilder = new ResponseBuilder();

const recommendationService = new RecommendationService();
const recommendationQuestionService = new RecommendationQuestionService();

export default class RecommendationAgent extends BaseAgent {
  async execute(state) {
    /*
     * =====================================================
     * Recommendation Questions
     * =====================================================
     */

    const isConversation =
      state.recommendationContext?.active &&
      state.recommendationContext?.completed &&
      (state.recommendationContext?.catalogProducts?.length ?? 0) > 0 &&
      !state.awaitingDecision;

    if (!isConversation) {
      const questionResult = await recommendationQuestionService.execute(state);

      if (!questionResult.ready) {
        state.response = questionResult.response;

        state.persistence.conversation = {
          ...state.persistence.conversation,
          dirty: true,
          updatedAt: new Date(),
        };

        return state;
      }
    }

    /*
     * =====================================================
     * Recommendation Engine
     * Engine decides whether this is:
     * - Fresh recommendation
     * - Recommendation conversation
     * =====================================================
     */

    const result = await recommendationService.execute(state);

    /*
     * =====================================================
     * RAG Context
     * =====================================================
     */

    state.rag = {
      context: result.context,
      documents: result.documents,
    };

    /*
     * =====================================================
     * Recommendation Conversation
     * =====================================================
     */

    if (isConversation) {
      state.persistence.conversation = {
        ...state.persistence.conversation,
        dirty: true,
        updatedAt: new Date(),
      };

      state.response = responseBuilder.recommendation(result.recommendation);

      if (state.workflowStack?.length) {
        responseBuilder.appendResumePrompt(
          state.response,
          state.workflowStack.at(-1),
        );
      }

      return state;
    }

    /*
     * =====================================================
     * Fresh Recommendation
     * =====================================================
     */

    state.recommendation = result.recommendation;

    state.recommendationContext = {
      ...(state.recommendationContext ?? {}),

      active: true,
      completed: true,
      completedAt: new Date(),

      products: result.recommendation.products ?? [],
      catalogProducts: result.catalogProducts ?? [],

      totalProducts: result.recommendation.products?.length ?? 0,

      page: 1,
      hasMore: false,
    };

    state.workflow = "RECOMMENDATION";
    state.currentStep = "RECOMMENDATION_RESULTS";
    state.awaitingDecision = false;

    state.persistence.conversation = {
      ...state.persistence.conversation,
      dirty: true,
      updatedAt: new Date(),
    };

    state.response = responseBuilder.recommendation(result.recommendation);

    if (state.workflowStack?.length) {
      responseBuilder.appendResumePrompt(
        state.response,
        state.workflowStack.at(-1),
      );
    }

    return state;
  }
}
