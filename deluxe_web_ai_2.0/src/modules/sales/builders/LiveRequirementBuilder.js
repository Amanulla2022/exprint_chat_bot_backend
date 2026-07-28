import ConversationModes from "../helpers/ConversationModes.js";

export default class LiveRequirementBuilder {
  /*
   * =====================================================
   * Live Order
   * =====================================================
   */

  build() {
    return {
      mode: ConversationModes.DISCOVERY,

      currentItem: 0,

      items: [],

      customer: {
        name: null,
        company: null,
        phone: null,
        email: null,
      },

      delivery: {
        method: null,
        address: null,
        requiredDate: null,
      },

      //edit order

      editing: {
        active: false,
        step: null,
      },

      pricing: {
        currency: "AED",

        subtotal: 0,

        delivery: 0,

        tax: 0,

        total: 0,
      },

      reviewCompleted: false,

      confirmed: false,

      status: "COLLECTING",

      notes: [],
    };
  }

  /*
   * =====================================================
   * Order Item
   * =====================================================
   */

  createItem(product = {}) {
    return {
      product: {
        id: product.id ?? null,
        name: product.name ?? null,
        slug: product.slug ?? null,
      },

      selection: null,

      productData: {},

      requirements: [],

      workflow: {
        quantity: null,

        artwork: {
          status: null,
          reference: null,
        },
      },

      pricing: {
        currency: "AED",
        unitPrice: null,
        subtotal: 0,
        discount: 0,
        total: 0,
      },

      addons: {
        completed: false,
        items: [],
        notes: null,
      },

      notes: [],

      completed: false,
    };
  }

  /*
   * =====================================================
   * Merge
   * =====================================================
   */

  merge(order = {}, values = {}) {
    return {
      ...order,

      ...values,

      customer: {
        ...(order.customer ?? {}),
        ...(values.customer ?? {}),
      },

      delivery: {
        ...(order.delivery ?? {}),
        ...(values.delivery ?? {}),
      },

      pricing: {
        ...(order.pricing ?? {}),
        ...(values.pricing ?? {}),
      },

      notes:
        values.notes !== undefined
          ? [...values.notes]
          : [...(order.notes ?? [])],
    };
  }

  /*
   * =====================================================
   * Reset
   * =====================================================
   */

  reset() {
    return this.build();
  }
}
