import ConversationRepository from "../../../repositories/ConversationRepository.js";
import LeadRequestRepository from "../../../repositories/LeadRepository.js";
import OrderRepository from "../../../repositories/OrderRequestRepository.js";
import MemoryService from "../../../modules/memory/MemoryService.js";

const conversationRepository = new ConversationRepository();
const leadRequestRepository = new LeadRequestRepository();
const orderRepository = new OrderRepository();
const memoryService = new MemoryService();

export default class LoadSessionNode {
  async execute(state) {
    if (!state.sessionId) {
      throw new Error("Session ID is required.");
    }

    /*
     * =====================================================
     * Load Conversation
     * =====================================================
     */

    let conversation = await conversationRepository.findBySessionId(
      state.sessionId,
    );

    console.log("SESSION:", state.sessionId);
    console.log("FOUND:", !!conversation);

    if (conversation) {
      // console.log("Messages:", conversation.messages.length);
      console.log("Workflow:", conversation.workflow);

      // console.dir(conversation.memory, {
      //   depth: null,
      // });
    }

    if (!conversation) {
      conversation = await conversationRepository.create({
        sessionId: state.sessionId,

        customer: {
          name: null,
          mobile: null,
          email: null,
          company: null,
        },

        messages: [],

        workflow: null,

        currentStep: null,

        memory: {},

        metadata: {},

        status: "ACTIVE",
      });
    }

    /*
     * =====================================================
     * Load Related Documents
     * =====================================================
     */

    const leadRequest = await leadRequestRepository.findActiveByConversationId(
      conversation._id,
    );

    let order = await orderRepository.findActiveBySession(state.sessionId);

    /*
     * =====================================================
     * Restore confirmed order during Lead workflow
     * =====================================================
     */

    if (!order && conversation.workflow === "LEAD") {
      console.log("No active order found. Restoring order by conversation.");

      order = await orderRepository.findByConversationId(conversation._id);
    }

    /*
     * =====================================================
     * Base Conversation
     * =====================================================
     */

    state.conversation = conversation;

    state.conversationId = conversation._id.toString();

    state.order = order ?? null;

    state.orderContext = order ?? null;

    state.leadRequest = leadRequest ?? null;

    state.customer = {
      name: null,
      mobile: null,
      email: null,
      company: null,
      ...(conversation.customer ?? {}),
    };

    state.history = Array.isArray(conversation.messages)
      ? [...conversation.messages.slice(-50)]
      : [];

    state.workflow = null;

    state.currentStep = conversation.currentStep ?? null;

    state.awaitingDecision = false;

    state.workflowStack = conversation.metadata?.workflowStack ?? [];

    /*
     * =====================================================
     * Restore Memory
     * =====================================================
     */

    state.memory = memoryService.build(conversation);

    /*
     * =====================================================
     * Restore Runtime Sales State
     * =====================================================
     */

    state.liveRequirement = state.memory.liveRequirement ?? null;

    state.productSales = state.memory.productSales ?? null;

    state.recommendation = state.memory.recommendation ?? null;

    state.recommendationContext =
      state.memory.recommendationContext ??
      memoryService.createRecommendationContext();

    state.recommendationSolution = state.recommendationContext.solution ?? {
      primary: [],
      supporting: [],
      upsell: [],
    };

    state.selectedProduct = state.memory.selectedProduct ?? null;

    state.comparison = state.memory.comparison ?? null;

    state.comparisonContext = state.memory.comparisonContext ?? null;

    state.comparisonProducts = state.memory.comparisonProducts ?? [];

    /*
     * =====================================================
     * Restore Active Workflow
     * Priority:
     * SALES > RECOMMENDATION > LEAD
     * =====================================================
     */

    const activeOrder =
      order && !["CONFIRMED", "CANCELLED", "DELETED"].includes(order.status);

    const activeSalesWorkflow =
      conversation.workflow === "SALES" &&
      (state.liveRequirement != null || state.productSales != null);

    if (activeOrder || activeSalesWorkflow) {
      state.workflow = "SALES";

      state.currentStep = conversation.currentStep ?? null;

      state.awaitingDecision = true;
    } else if (
      conversation.workflow === "RECOMMENDATION" &&
      state.recommendationContext.active &&
      !state.recommendationContext.completed
    ) {
      state.workflow = "RECOMMENDATION";

      state.currentStep =
        conversation.currentStep ??
        state.recommendationContext.currentStep ??
        "ASK_CUSTOMER_TYPE";

      state.awaitingDecision = true;
    } else if (
      conversation.workflow === "LEAD" &&
      leadRequest &&
      leadRequest.status !== "SUBMITTED"
    ) {
      state.workflow = "LEAD";

      state.currentStep =
        conversation.currentStep ?? leadRequest.currentStep ?? "ASK_NAME";

      state.awaitingDecision = true;
    }

    /*
     * =====================================================
     * Persistence Flags
     * =====================================================
     */

    state.persistence = {
      conversation: {
        dirty: false,
        updatedAt: null,
      },

      customer: {
        dirty: false,
        updatedAt: null,
      },

      leadRequest: {
        dirty: false,
        updatedAt: null,
      },

      order: {
        dirty: false,
        updatedAt: null,
      },
    };

    console.log("RESTORED WORKFLOW", {
      workflow: state.workflow,
      currentStep: state.currentStep,
      awaitingDecision: state.awaitingDecision,
      hasRequirement: !!state.liveRequirement,
      hasProductSales: !!state.productSales,
    });

    return state;
  }
}
