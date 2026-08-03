import BaseAgent from "./BaseAgent.js";

import ResponseBuilder from "../../core/responses/Apiresponse.js";
import LeadService from "../../modules/lead/LeadService.js";

const responseBuilder = new ResponseBuilder();
const leadService = new LeadService();

export default class LeadAgent extends BaseAgent {
  async execute(state) {
    console.log("========== LEAD AGENT ==========");

    console.log("ORDER EXISTS:", !!state.order);
    console.log("ORDER TYPE:", typeof state.order);

    console.dir(state.order, { depth: null });
    console.log("========== LEAD AGENT ==========");

    const result = await leadService.process(state);

    /*
     * =====================================================
     * Lead
     * =====================================================
     */

    state.leadRequest = result.leadRequest;

    /*
     * =====================================================
     * Customer
     * =====================================================
     */

    if (state.leadRequest?.customer) {
      state.customer = {
        ...(state.customer ?? {}),
        ...state.leadRequest.customer,
      };

      if (state.order) {
        console.log("Updating Runtime Order Customer");

        state.order.customer = {
          ...(state.order.customer ?? {}),
          ...state.leadRequest.customer,
        };

        state.persistence.order.dirty = true;
        state.persistence.order.updatedAt = new Date();
      }
    }

    /*
     * =====================================================
     * Workflow
     * =====================================================
     */

    state.workflow = "LEAD";

    state.currentStep = result.currentStep ?? result.response?.step ?? null;

    state.awaitingDecision = result.awaitingDecision ?? false;

    /*
     * =====================================================
     * Completed
     * =====================================================
     */

    if (result.status === "COMPLETED") {
      state.currentStep = "LEAD_COMPLETED";
      state.awaitingDecision = false;
    }

    /*
     * =====================================================
     * Persistence
     * =====================================================
     */

    state.persistence.leadRequest.dirty = true;
    state.persistence.leadRequest.updatedAt = new Date();

    state.persistence.customer.dirty = true;
    state.persistence.customer.updatedAt = new Date();

    state.persistence.conversation.dirty = true;
    state.persistence.conversation.updatedAt = new Date();

    /*
     * =====================================================
     * Response
     * =====================================================
     */

    state.response = responseBuilder.lead(result.response);

    return state;
  }
}
