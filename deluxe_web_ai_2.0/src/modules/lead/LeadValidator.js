import LeadMessages from "./helpers/LeadMessages.js";
import LeadConstants from "./helpers/LeadConstants.js";

export default class LeadValidator {
  validate(lead = {}) {
    /*
     * =====================================================
     * NAME
     * =====================================================
     */

    if (!lead.name?.trim()) {
      throw new Error(LeadMessages.NAME_REQUIRED);
    }

    lead.name = lead.name.trim();

    /*
     * =====================================================
     * PHONE
     * =====================================================
     */

    if (!lead.phoneNumber?.trim()) {
      throw new Error(LeadMessages.PHONE_REQUIRED);
    }

    lead.phoneNumber = lead.phoneNumber.replace(/\s+/g, "").trim();

    const phoneRegex = /^\+?[0-9]{7,15}$/;

    if (!phoneRegex.test(lead.phoneNumber)) {
      throw new Error(LeadMessages.INVALID_PHONE);
    }

    /*
     * =====================================================
     * EMAIL
     * =====================================================
     */

    if (lead.emailId) {
      lead.emailId = lead.emailId.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(lead.emailId)) {
        throw new Error(LeadMessages.INVALID_EMAIL);
      }
    }

    /*
     * =====================================================
     * REQUEST TYPE
     * =====================================================
     *
     * IMPORTANT:
     *
     * LeadExtractor must already resolve the request type.
     *
     * Validator only validates it.
     *
     * Do NOT silently change an invalid/missing request
     * into EXPERT here.
     */

    const requestType = lead.requestType;

    const validRequestTypes = new Set(
      Object.values(LeadConstants.REQUEST_TYPES),
    );

    if (!requestType || !validRequestTypes.has(requestType)) {
      throw new Error(LeadMessages.INVALID_REQUEST_TYPE);
    }

    lead.requestType = requestType;

    /*
     * =====================================================
     * ORDER
     * =====================================================
     */

    if (requestType === LeadConstants.REQUEST_TYPES.ORDER) {
      const hasProducts =
        Array.isArray(lead.products) && lead.products.length > 0;

      if (!hasProducts) {
        throw new Error(LeadMessages.REQUIRED_ITEM_REQUIRED);
      }

      const productName = lead.products[0]?.productName?.trim() ?? "";

      if (!productName) {
        throw new Error(LeadMessages.REQUIRED_ITEM_REQUIRED);
      }

      /*
       * NEVER trust required_item for ORDER.
       *
       * Always derive it from the real order.
       */

      lead.required_item = productName;
    }

    /*
     * =====================================================
     * QUOTATION
     * =====================================================
     */

    if (requestType === LeadConstants.REQUEST_TYPES.QUOTATION) {
      if (!lead.required_item?.trim()) {
        throw new Error(LeadMessages.REQUIRED_ITEM_REQUIRED);
      }

      lead.required_item = lead.required_item.trim();
    }

    /*
     * =====================================================
     * EXPERT
     * =====================================================
     */

    if (requestType === LeadConstants.REQUEST_TYPES.EXPERT) {
      if (!lead.required_item?.trim()) {
        throw new Error(LeadMessages.REQUIRED_ITEM_REQUIRED);
      }

      lead.required_item = lead.required_item.trim();
    }

    /*
     * =====================================================
     * CONTACT SALES
     * =====================================================
     */

    if (requestType === LeadConstants.REQUEST_TYPES.CONTACT_SALES) {
      if (!lead.required_item?.trim()) {
        throw new Error(LeadMessages.REQUIRED_ITEM_REQUIRED);
      }

      lead.required_item = lead.required_item.trim();
    }

    /*
     * =====================================================
     * NORMALIZE PRODUCTS
     * =====================================================
     *
     * productId may be:
     *
     * number
     * string
     * null
     *
     * Never cast it.
     */

    if (Array.isArray(lead.products)) {
      lead.products = lead.products
        .filter((product) => product?.productName)
        .map((product) => ({
          productName: String(product.productName).trim(),
          productId: product.productId ?? null,
        }));
    }

    return lead;
  }
}
