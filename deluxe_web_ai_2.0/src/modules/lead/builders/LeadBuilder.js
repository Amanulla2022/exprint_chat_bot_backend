import crypto from "crypto";
import LeadConstants from "../helpers/LeadConstants.js";

export default class LeadBuilder {
  build(lead = {}, refNo) {
    /*
     * =====================================================
     * PRODUCTS
     * =====================================================
     */

    let products = [];

    if (Array.isArray(lead.products) && lead.products.length > 0) {
      products = lead.products.map((product) => ({
        productName: String(product.productName ?? "").trim(),

        /*
         * Supports:
         *
         * number
         * string
         * null
         */

        productId: product.productId ?? null,
      }));
    } else if (lead.required_item) {
      products = [
        {
          productName: lead.required_item.trim(),

          productId: LeadConstants.PRODUCT_ID ?? null,
        },
      ];
    }

    /*
     * =====================================================
     * BUILD LEAD
     * =====================================================
     */

    return {
      /*
       * Identity
       */

      refNo,

      uid: crypto.randomUUID(),

      /*
       * Customer
       */

      name: lead.name,

      phoneNumber: lead.phoneNumber,

      emailId: lead.emailId ?? "",

      companyName: lead.companyName ?? "",

      /*
       * Lead Source
       */

      source: LeadConstants.SOURCE,

      /*
       * Request
       */

      requestType: lead.requestType,

      requiredItem: lead.required_item ?? "",

      requestDetails: lead.requestDetails ?? "",

      /*
       * Products
       */

      products,

      /*
       * CRM
       */

      division: lead.division ?? "N/A",

      assignToSalesPerson: lead.assignToSalesPerson ?? "Admin",

      dealStatus: "Open",

      dealAmount: 0,

      quoteNumber: 0,

      quoteDate: null,

      initialRemartks: lead.initialRemartks ?? "",

      invoiceNumber: 0,

      invoiceDate: null,

      assignFollowUp: "NA",

      followUpInstruction: "",

      followUps: [],
    };
  }
}
