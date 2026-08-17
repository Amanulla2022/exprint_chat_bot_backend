import ConversationRepository from "../../../repositories/ConversationRepository.js";
import MemoryService from "../../../modules/memory/MemoryService.js";
import OrderRepository from "../../../repositories/OrderRequestRepository.js";

const conversationRepository = new ConversationRepository();

const orderRepository = new OrderRepository();

const memoryService = new MemoryService();

export default class SaveSessionNode {
  async execute(state) {
    console.log("SAVE NODE currentStep:", state.currentStep);

    /*
     * =====================================================
     * Synchronize Customer
     * =====================================================
     *
     * New Lead module uses:
     *
     * state.lead
     *
     * NOT:
     *
     * state.leadRequest
     */

    if (state.lead) {
      state.customer = {
        ...(state.customer ?? {}),

        name: state.lead.name ?? state.customer?.name ?? null,

        phone: state.lead.phoneNumber ?? state.customer?.phone ?? null,

        email: state.lead.emailId ?? state.customer?.email ?? null,

        company: state.lead.companyName ?? state.customer?.company ?? null,
      };
    }

    /*
     * =====================================================
     * Build Latest Memory Snapshot
     * =====================================================
     */

    state.memory = memoryService.merge(state.memory, state);

    state.recommendation = state.memory.recommendation;

    state.recommendationContext = state.memory.recommendationContext;

    state.memory = memoryService.merge(state.memory, state);

    /*
     * =====================================================
     * Clean Conversation History
     * =====================================================
     */

    state.history = (state.history ?? [])
      .filter(
        (message) =>
          message &&
          message.role &&
          typeof message.content === "string" &&
          message.content.trim().length > 0,
      )
      .slice(-50);

    /*
     * =====================================================
     * Persist Conversation
     * =====================================================
     */

    const active =
      state.order &&
      !["CONFIRMED", "CANCELLED", "DELETED"].includes(state.order.status);

    const workflow = active ? "SALES" : (state.workflow ?? null);

    /*
     * Order workflow is form-based.
     * Only Recommendation / Lead persist
     * conversational steps.
     */

    const currentStep = state.order?.active
      ? null
      : (state.currentStep ?? null);

    const conversationUpdate = {
      customer: state.customer,

      workflow,

      currentStep,

      metadata: {
        ...(state.metadata ?? {}),

        workflowStack: state.workflowStack ?? [],

        lastRecommendationAt: state.recommendationContext?.completedAt ?? null,
      },

      memory: {
        ...state.memory,

        recommendation: state.recommendation,

        recommendationContext: state.recommendationContext,
      },

      messages: state.history,

      updatedAt: new Date(),
    };

    console.log({
      workflow,
      currentStep,
    });

    state.conversation = await conversationRepository.update(
      {
        sessionId: state.sessionId,
      },

      {
        $set: conversationUpdate,
      },

      {
        upsert: true,
      },
    );

    /*
     * =====================================================
     * Reload Conversation Snapshot
     * =====================================================
     */

    await conversationRepository.findBySessionId(state.sessionId);

    /*
     * =====================================================
     * Synchronize Memory Snapshot
     * =====================================================
     */

    state.memory = memoryService.build(state.conversation);

    state.persistence.conversation.dirty = false;

    /*
     * =====================================================
     * Link Order -> Lead
     * =====================================================
     *
     * New Lead document is already saved by:
     *
     * LeadEngine
     *    ↓
     * LeadService
     *    ↓
     * Data
     *
     * Therefore SaveSessionNode does NOT create/update
     * the lead.
     *
     * It only uses the generated Lead _id if an order
     * needs to reference it.
     */

    const pendingLeadId =
      state.order && state.lead?._id && state.order.leadId !== state.lead._id
        ? state.lead._id
        : null;

    /*
     * =====================================================
     * Persist Order
     * =====================================================
     */

    if (state.persistence?.order?.dirty && state.order) {
      state.order.updatedAt = new Date();

      state.order = await orderRepository.saveDraft(
        state.sessionId,
        state.conversationId,
        state.order,
      );

      /*
       * ---------------------------------------------------
       * Link Order -> Lead
       * ---------------------------------------------------
       */

      if (pendingLeadId) {
        state.order = await orderRepository.update(
          state.order._id,

          {
            leadId: pendingLeadId,
          },
        );
      }

      state.orderContext = state.order;

      state.persistence.order.dirty = false;
    }

    return state;
  }
}
