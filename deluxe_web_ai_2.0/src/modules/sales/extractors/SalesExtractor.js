import SalesCatalogService from "../services/SalesCatalogService.js";
import SalesProductResolver from "../services/SalesProductResolver.js";
import VariantResolver from "../services/VariantResolver.js";
import FieldResolver from "../services/FieldResolver.js";
import DeliveryService from "../services/DeliveryService.js";

const catalogService = new SalesCatalogService();

const productResolver = new SalesProductResolver();
const selectionResolver = new VariantResolver();
const fieldResolver = new FieldResolver();
const deliveryService = new DeliveryService();

const CONFIRM_KEYWORDS = [
  "yes",
  "confirm",
  "confirmed",
  "place order",
  "submit",
  "continue",
  "looks good",
  "proceed",
  "go ahead",
  "okay",
  "ok",
];

const ADD_PRODUCT_KEYWORDS = ["also", "another", "add", "plus", "along with"];

export default class SalesExtractor {
  extract(requirement = {}, message = "", currentStep = null) {
    const text = this.normalize(message);

    const currentItem = requirement.items?.[requirement.currentItem] ?? {};

    /*
     * =====================================================
     * Product
     * =====================================================
     */

    const product = this.resolveProduct(currentItem, text);

    /*
     * =====================================================
     * Selection
     * =====================================================
     */

    const selection = this.resolveSelection(product, currentItem, text);

    /*
     * =====================================================
     * Product Data
     * =====================================================
     */

    const productData = this.resolveField(product, currentItem, text);

    /*
     * =====================================================
     * Requirements
     * =====================================================
     */

    const requirements = [];

    /*
     * =====================================================
     * Quantity
     * =====================================================
     */

    const quantity = this.extractQuantity(product, currentItem, text);

    /*
     * =====================================================
     * Artwork
     * =====================================================
     */

    const artwork = this.extractArtwork(text);

    /*
     * =====================================================
     * Delivery
     * =====================================================
     */

    const delivery = this.extractDelivery(text, currentStep, message);

    return {
      /*
       * Product
       */

      product: currentItem.product?.id ? null : product,

      /*
       * Selection
       */

      selection,

      /*
       * Product Data
       */

      productData,

      /*
       * Requirements
       */

      requirements,

      /*
       * Workflow
       */

      quantity,

      artwork,

      /*
       * Delivery
       */

      deliveryMethod: delivery.method,

      address: delivery.address,

      requiredDate: delivery.requiredDate,

      /*
       * Conversation
       */

      confirmed: this.extractConfirmation(text),

      addAnotherProduct: this.extractAddAnotherProduct(text),
    };
  }

  /*
   * =====================================================
   * Product
   * =====================================================
   */

  resolveProduct(currentItem = {}, text = "") {
    if (currentItem.product?.id) {
      return catalogService.getProduct(currentItem.product.id);
    }

    return productResolver.resolve(text);
  }

  /*
   * =====================================================
   * Selection
   * =====================================================
   */

  resolveSelection(product = null, currentItem = {}, text = "") {
    if (!product) {
      return null;
    }

    if (currentItem.selection?.id) {
      return catalogService.getSelectionOption(
        product,
        currentItem.selection.id,
      );
    }

    return selectionResolver.resolve(product, text);
  }

  /*
   * =====================================================
   * Product Field
   * =====================================================
   */

  resolveField(product = null, currentItem = {}, text = "") {
    if (!product) {
      return {};
    }

    const field = catalogService.getCurrentField(product, currentItem);

    if (!field) {
      return {};
    }

    return fieldResolver.resolve(field, text);
  }

  /*
   * =====================================================
   * Quantity
   * =====================================================
   */

  extractQuantity(product = null, currentItem = {}, text = "") {
    if (product && catalogService.getCurrentField(product, currentItem)) {
      return null;
    }

    if (/\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/.test(text)) {
      return null;
    }

    const match = text.match(/^\d+$/);

    return match ? Number(match[0]) : null;
  }

  /*
   * =====================================================
   * Artwork
   * =====================================================
   */

  extractArtwork(text = "") {
    if (/need design|design service|design it|create artwork/i.test(text)) {
      return {
        status: "NEED_DESIGN",
        reference: null,
      };
    }

    if (/have artwork|artwork ready|already have|ready/i.test(text)) {
      return {
        status: "CUSTOMER_ARTWORK",
        reference: null,
      };
    }

    return null;
  }

  /*
   * =====================================================
   * Delivery
   * =====================================================
   */

  extractDelivery(text = "", currentStep = null, message = "") {
    const delivery = deliveryService.parse(text);

    if (
      currentStep === "ASK_DELIVERY_ADDRESS" &&
      !delivery.address &&
      message.trim()
    ) {
      delivery.address = message.trim();
    }

    if (
      currentStep === "ASK_DELIVERY_DATE" &&
      !delivery.requiredDate &&
      message.trim()
    ) {
      delivery.requiredDate = message.trim();
    }

    return delivery;
  }

  /*
   * =====================================================
   * Confirmation
   * =====================================================
   */

  extractConfirmation(text = "") {
    return this.contains(text, CONFIRM_KEYWORDS);
  }

  /*
   * =====================================================
   * Add Product
   * =====================================================
   */

  extractAddAnotherProduct(text = "") {
    return this.contains(text, ADD_PRODUCT_KEYWORDS);
  }

  /*
   * =====================================================
   * Helpers
   * =====================================================
   */

  normalize(message = "") {
    return message.trim().toLowerCase().replace(/\s+/g, " ");
  }

  contains(text = "", keywords = []) {
    return keywords.some((keyword) => text.includes(keyword));
  }
}
