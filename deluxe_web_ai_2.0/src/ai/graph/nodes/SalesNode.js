import SalesService from "../../../modules/sales/SalesService.js";
import ResponseBuilder from "../../../core/responses/Apiresponse.js";
import OrderManager from "../../../modules/sales/services/OrderManager.js";
import LeadManager from "../../../modules/lead/LeadManager.js";
import LeadAgent from "../../agents/LeadAgent.js";

const salesService = new SalesService();
const responseBuilder = new ResponseBuilder();
const orderManager = new OrderManager();
const leadManager = new LeadManager();
const leadAgent = new LeadAgent();

export default class SalesNode {
  async execute(state = {}) {
    console.log("========== SALES NODE ==========");
    console.log("SalesNode reached");

    const result = await salesService.execute(state);

    // console.log("===== SALES SERVICE RESULT =====");
    // console.dir(result, { depth: null });

    // console.log("liveRequirement =", result.liveRequirement);

    /*
     * =====================================================
     * Build / Update Runtime Order
     * =====================================================
     */
    // console.log("===== RESULT LIVE REQUIREMENT =====");
    // console.dir(result.liveRequirement, { depth: null });

    const order = orderManager.buildOrder(result.liveRequirement, state.order);

    // console.log("===== BUILT ORDER =====");
    // console.dir(order, { depth: null });
    /*
     * =====================================================
     * Build Response
     * =====================================================
     */

    const response = result.completed
      ? responseBuilder.salesCompleted(result, result.metadata ?? {})
      : responseBuilder.sales(result, result.metadata ?? {});

    /*
     * =====================================================
     * Build Next State
     * =====================================================
     */

    const nextState = {
      ...state,

      assistantMessage: result.message,

      liveRequirement: result.liveRequirement,

      productSales: result.liveRequirement,

      sales: result,

      response,

      workflow: result.workflow ?? "SALES",

      currentStep: result.currentStep,

      order,

      orderContext: order,
    };

    /*
     * =====================================================
     * Persistence Flags
     * =====================================================
     */

    if (nextState.persistence) {
      nextState.persistence.conversation.dirty = true;
      nextState.persistence.conversation.updatedAt = new Date();

      nextState.persistence.order.dirty = true;
      nextState.persistence.order.updatedAt = new Date();
    }

    /*
     * =====================================================
     * Sales -> Lead Handoff
     * =====================================================
     */

    if (result.completed && result.workflow === "LEAD") {
      console.log("========== SALES -> LEAD ==========");

      nextState.workflow = "LEAD";
      nextState.currentStep = null;
      nextState.awaitingDecision = false;

      nextState.leadRequest = leadManager.createLead({
        customer: result.liveRequirement?.customer,
        order: result.liveRequirement,
      });

      nextState.leadRequest.type = result.metadata?.leadType ?? "ORDER_REQUEST";

      /*
       * =====================================================
       * Start Lead Workflow Immediately
       * =====================================================
       */

      return await leadAgent.execute(nextState);
    }

    console.log("SALES NODE currentStep:", nextState.currentStep);

    return nextState;
  }
}
