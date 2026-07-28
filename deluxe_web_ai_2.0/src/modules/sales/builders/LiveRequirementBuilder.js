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
      /*
       * =====================================================
       * Product
       * =====================================================
       */

      product: {
        id: product.id ?? null,
        name: product.name ?? null,
        slug: product.slug ?? null,
      },

      /*
       * =====================================================
       * Selection
       * =====================================================
       */

      selection: null,

      /*
       * =====================================================
       * Dynamic Product Data
       * Example:
       * {
       *   numberOfNames: 2,
       *   width: 100,
       *   height: 200
       * }
       * =====================================================
       */

      productData: {},

      /*
       * =====================================================
       * Product Requirements
       * Example:
       * [
       *   {
       *     id,
       *     name,
       *     required,
       *     value,
       *     status
       *   }
       * ]
       * =====================================================
       */

      requirements: [],

      /*
       * =====================================================
       * Workflow
       * Shared by every product
       * =====================================================
       */

      workflow: {
        quantity: null,

        artwork: {
          status: null,
          reference: null,
        },
      },

      /*
       * =====================================================
       * Pricing
       * =====================================================
       */

      pricing: {
        currency: "AED",

        unitPrice: null,

        subtotal: 0,

        discount: 0,

        total: 0,
      },

      /*
       * =====================================================
       * Optional
       * =====================================================
       */

      addons: [],

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
