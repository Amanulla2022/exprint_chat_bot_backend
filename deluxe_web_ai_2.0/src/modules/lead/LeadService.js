import Counter from "../../models/Counter.js";
import Data from "../../models/Data.js";
import TelegramService from "../telegram/TelegramService.js";
import OrderRepository from "../../repositories/OrderRequestRepository.js";

const telegramService = new TelegramService();
const orderRepository = new OrderRepository();

export default class LeadService {
  /*
   * =====================================================
   * CREATE LEAD
   * =====================================================
   */

  async createLead(leadDocument) {
    const savedLead = await new Data(leadDocument).save();

    console.log("========== LEAD SAVED ==========");

    console.dir(savedLead.toObject(), {
      depth: null,
    });

    /*
     * IMPORTANT:
     *
     * ORDER notifications are sent only after
     * the existing order has been updated with:
     *
     * - customer
     * - leadId
     *
     * Therefore do NOT send the normal lead
     * notification for ORDER here.
     */

    if (savedLead.requestType !== "ORDER") {
      await telegramService.sendLead(savedLead);
    }

    return savedLead;
  }

  /*
   * =====================================================
   * NEXT LEAD REFERENCE NUMBER
   * =====================================================
   */

  async getNextRefNumber() {
    const counter = await Counter.findOneAndUpdate(
      {
        key: "refNo",
      },
      {
        $inc: {
          value: 1,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
      },
    );

    return counter.value;
  }

  /*
   * =====================================================
   * UPDATE ORDER AFTER LEAD
   * =====================================================
   */

  async updateOrderAfterLead(
    orderId,
    customer = {},
    leadId = null,
    lead = null,
  ) {
    if (!orderId) {
      console.warn("========== ORDER UPDATE SKIPPED ==========");

      console.warn("Missing orderId while attaching lead.");

      return null;
    }

    /*
     * ===================================================
     * UPDATE EXISTING ORDER
     * ===================================================
     *
     * IMPORTANT:
     *
     * We update ONLY:
     *
     * customer
     * leadId
     * updatedAt
     *
     * Existing order data remains untouched:
     *
     * items
     * product
     * selection
     * productData
     * quantity
     * requirements
     * artwork
     * delivery
     * pricing
     * orderNumber
     * status
     * totals
     */

    const updatedOrder = await orderRepository.attachLeadAndCustomer(
      orderId,
      leadId,
      customer,
    );

    if (!updatedOrder) {
      console.warn("Order not found:", orderId);

      return null;
    }

    console.log("========== ORDER UPDATED AFTER LEAD ==========");

    console.dir(updatedOrder.toObject?.() ?? updatedOrder, {
      depth: null,
    });

    /*
     * ===================================================
     * TELEGRAM
     * ===================================================
     *
     * Your TelegramService already provides:
     *
     * sendLeadWithOrder(lead, order)
     *
     * which is exactly what we need here.
     */

    if (lead) {
      await telegramService.sendLeadWithOrder(lead, updatedOrder);
    } else {
      /*
       * Fallback if a lead object is not supplied.
       */

      await telegramService.sendOrder(updatedOrder);
    }

    return updatedOrder;
  }
}
