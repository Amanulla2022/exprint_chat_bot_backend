import BaseAgent from "./BaseAgent.js";
import ResponseBuilder from "../../core/responses/Apiresponse.js";
import LeadEngine from "../../modules/lead/LeadEngine.js";
import LeadConstants from "../../modules/lead/helpers/LeadConstants.js";

const responseBuilder = new ResponseBuilder();

const leadEngine = new LeadEngine();

export default class LeadAgent extends BaseAgent {
  async execute(state) {
    console.log("========== LEAD AGENT ==========");

    /*
     * =====================================================
     * REQUEST TYPE
     * =====================================================
     *
     * Preserve the routing intent before LeadEngine runs.
     */

    const incomingRequestType =
      state.action?.payload?.requestType ??
      state.action?.requestType ??
      state.leadContext?.requestType ??
      state.requestType ??
      state.routing?.requestType ??
      null;

    if (incomingRequestType) {
      state.requestType = incomingRequestType;

      state.leadContext = {
        ...(state.leadContext ?? {}),
        requestType: incomingRequestType,
      };
    }

    /*
     * =====================================================
     * EXECUTE LEAD ENGINE
     * =====================================================
     */

    const result = await leadEngine.execute(state);

    /*
     * =====================================================
     * CUSTOMER FORM
     * =====================================================
     */

    if (!result.completed) {
      state.workflow = "LEAD";

      state.currentStep = "COLLECT_CUSTOMER";

      state.awaitingDecision = true;

      /*
       * Preserve request type.
       */

      state.leadContext = {
        ...(state.leadContext ?? {}),

        requestType:
          state.leadContext?.requestType ??
          state.requestType ??
          incomingRequestType ??
          LeadConstants.REQUEST_TYPES.EXPERT,
      };

      state.requestType = state.leadContext.requestType;

      state.response = responseBuilder.lead({
        status: result.status,

        response: result.form,

        form: result.form,
      });

      return state;
    }

    /*
     * =====================================================
     * CREATED LEAD
     * =====================================================
     */

    state.lead = result.lead;

    /*
     * =====================================================
     * UPDATED ORDER
     * =====================================================
     */

    if (result.order) {
      state.order = result.order;

      state.orderContext = result.order;

      if (state.liveRequirement) {
        state.liveRequirement = result.order;
      }

      if (state.productSales) {
        state.productSales = {
          ...state.productSales,

          customer: result.order.customer ?? state.productSales.customer,

          leadId: result.order.leadId ?? state.productSales.leadId,
        };
      }
    }

    /*
     * =====================================================
     * CUSTOMER
     * =====================================================
     */

    if (result.lead) {
      state.customer = {
        ...(state.customer ?? {}),

        name: result.lead.name,

        phone: result.lead.phoneNumber,

        email: result.lead.emailId,

        company: result.lead.companyName,
      };
    }

    /*
     * =====================================================
     * WORKFLOW
     * =====================================================
     */

    state.workflow = "LEAD";

    state.currentStep = "LEAD_COMPLETED";

    state.awaitingDecision = false;

    /*
     * =====================================================
     * PERSISTENCE
     * =====================================================
     */

    if (state.persistence) {
      if (state.persistence.customer) {
        state.persistence.customer.dirty = true;

        state.persistence.customer.updatedAt = new Date();
      }

      if (state.persistence.conversation) {
        state.persistence.conversation.dirty = true;

        state.persistence.conversation.updatedAt = new Date();
      }

      if (state.persistence.order) {
        state.persistence.order.dirty = true;

        state.persistence.order.updatedAt = new Date();
      }
    }

    /*
     * =====================================================
     * REQUEST TYPE
     * =====================================================
     */

    const requestType =
      result.lead?.requestType ??
      state.leadContext?.requestType ??
      state.requestType ??
      incomingRequestType ??
      LeadConstants.REQUEST_TYPES.EXPERT;

    /*
     * Keep state synchronized.
     */

    state.requestType = requestType;

    state.leadContext = {
      ...(state.leadContext ?? {}),
      requestType,
    };

    /*
     * =====================================================
     * SUCCESS MESSAGE
     * =====================================================
     */

    let title = "Request Submitted Successfully";

    let message = "Thank you! Our sales team will contact you shortly.";

    /*
     * -----------------------------------------------------
     * ORDER
     * -----------------------------------------------------
     */

    if (requestType === LeadConstants.REQUEST_TYPES.ORDER) {
      title = "Order Request Submitted Successfully";

      message =
        "Thank you! Your order request has been received successfully. Our sales team will contact you shortly.";
    } else if (requestType === LeadConstants.REQUEST_TYPES.QUOTATION) {

    /*
     * -----------------------------------------------------
     * QUOTATION
     * -----------------------------------------------------
     */
      title = "Quotation Request Submitted Successfully";

      message =
        "Thank you! Your quotation request has been received. Our sales team will review your requirements and contact you shortly.";
    } else if (requestType === LeadConstants.REQUEST_TYPES.EXPERT) {

    /*
     * -----------------------------------------------------
     * EXPERT
     * -----------------------------------------------------
     */
      title = "Expert Request Submitted Successfully";

      message =
        "Thank you! Your request has been received. Our printing expert will contact you shortly.";
    } else if (requestType === LeadConstants.REQUEST_TYPES.CONTACT_SALES) {

    /*
     * -----------------------------------------------------
     * CONTACT SALES
     * -----------------------------------------------------
     */
      title = "Sales Request Submitted Successfully";

      message =
        "Thank you! Your request has been received. Our sales team will contact you shortly.";
    }

    /*
     * =====================================================
     * RESPONSE
     * =====================================================
     */

    state.response = responseBuilder.lead({
      status: "COMPLETED",

      lead: result.lead,

      ...(result.order
        ? {
            order: result.order,
          }
        : {}),

      response: {
        step: "LEAD_COMPLETED",

        title,

        message,
      },
    });

    return state;
  }
}
