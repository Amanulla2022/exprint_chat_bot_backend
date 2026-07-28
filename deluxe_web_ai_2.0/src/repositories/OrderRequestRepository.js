import OrderModel from "../models/OrderRequest.js";

export default class OrderRepository {
  /*
   * =====================================================
   * Create
   * =====================================================
   */

  async create(order = {}) {
    return OrderModel.create(order);
  }

  /*
   * =====================================================
   * Save
   * =====================================================
   */

  async save(order) {
    if (!order) {
      return null;
    }

    order.updatedAt = new Date();

    return order.save();
  }

  /*
   * =====================================================
   * Find By Id
   * =====================================================
   */

  async findById(orderId) {
    if (!orderId) {
      return null;
    }

    return OrderModel.findById(orderId);
  }

  /*
   * =====================================================
   * Find By Order Number
   * =====================================================
   */

  async findByOrderNumber(orderNumber) {
    if (!orderNumber) {
      return null;
    }

    return OrderModel.findOne({
      orderNumber,
    });
  }

  /*
   * =====================================================
   * Active Order For Session
   * =====================================================
   */

  async findActiveBySession(sessionId) {
    if (!sessionId) {
      return null;
    }

    return OrderModel.findOne({
      sessionId,
      status: {
        $nin: ["CONFIRMED", "CANCELLED", "DELETED"],
      },
    }).sort({
      createdAt: -1,
    });
  }

  /*
   * =====================================================
   * Conversation Order
   * =====================================================
   */

  async findByConversationId(conversationId) {
    if (!conversationId) {
      return null;
    }

    return OrderModel.findOne({
      conversationId,
    }).sort({
      createdAt: -1,
    });
  }

  /*
   * =====================================================
   * Lead Order
   * =====================================================
   */

  async findByLeadId(leadId) {
    if (!leadId) {
      return null;
    }

    return OrderModel.findOne({
      leadId,
    });
  }

  /*
   * =====================================================
   * Order History
   * =====================================================
   */

  async findHistory(sessionId) {
    if (!sessionId) {
      return [];
    }

    return OrderModel.find({
      sessionId,
    }).sort({
      createdAt: -1,
    });
  }

  /*
   * =====================================================
   * Pending Sales Orders
   * =====================================================
   */

  async findPendingOrders() {
    return OrderModel.find({
      status: "CONFIRMED",
      leadId: {
        $exists: true,
      },
    }).sort({
      createdAt: -1,
    });
  }

  /*
   * =====================================================
   * Update
   * =====================================================
   */

  async update(orderId, updates = {}) {
    if (!orderId) {
      return null;
    }

    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /*
   * =====================================================
   * Attach Lead
   * =====================================================
   */

  async attachLead(orderId, leadId) {
    if (!orderId || !leadId) {
      return null;
    }

    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          leadId,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /*
   * =====================================================
   * Update Customer
   * =====================================================
   */

  async updateCustomer(orderId, customer = {}) {
    if (!orderId) {
      return null;
    }

    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          customer,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /*
   * =====================================================
   * Update Status
   * =====================================================
   */

  async updateStatus(orderId, status) {
    if (!orderId) {
      return null;
    }

    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /*
   * =====================================================
   * Soft Delete
   * =====================================================
   */

  async delete(orderId) {
    if (!orderId) {
      return null;
    }

    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          status: "DELETED",
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /*
   * =====================================================
   * Save Draft Order
   * =====================================================
   */

  async saveDraft(sessionId, conversationId, order = {}) {
    if (!order) {
      return null;
    }
    // console.log("========== INPUT ==========");
    // console.dir(order, { depth: null });

    const update = {
      conversationId,

      status: order.status,
      confirmed: order.confirmed,

      customer: order.customer,

      delivery: order.delivery,

      pricing: order.pricing,

      items: order.items,

      totalItems: order.totalItems,

      totalQuantity: order.totalQuantity,

      notes: order.notes,

      leadId: order.leadId,

      orderNumber: order.orderNumber,

      updatedAt: new Date(),
    };

    // console.log("========== UPDATE ==========");
    // console.dir(update, { depth: null });

    const doc = await OrderModel.findOneAndUpdate(
      { sessionId },
      {
        $set: update,
        $setOnInsert: { sessionId },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );

    // console.log("========== RETURN ==========");
    // console.dir(doc.toObject(), { depth: null });

    return doc;
  }
}
