import DeliveryService from "./DeliveryService.js";
import SalesCatalogService from "./SalesCatalogService.js";

const deliveryService = new DeliveryService();
const catalogService = new SalesCatalogService();

export default class PricingService {
  calculate(requirement = {}) {
    const items = requirement.items ?? [];

    const calculatedItems = items.map((item) => this.calculateItem(item));

    const subtotal = calculatedItems.reduce(
      (total, item) => total + (item.pricing?.total ?? 0),
      0,
    );

    const delivery = deliveryService.calculate(requirement);

    const deliveryCharge = delivery.charge ?? 0;

    return {
      items: calculatedItems,

      subtotal,

      deliveryCharge,

      total: subtotal + deliveryCharge,

      currency: "AED",
    };
  }

  /*
   * =====================================================
   * Item Pricing
   * =====================================================
   */

  calculateItem(item = {}) {
    const quantity = Number(item.workflow?.quantity ?? 0);

    const unitPrice = this.getUnitPrice(item, quantity);

    const subtotal = unitPrice * quantity;

    return {
      ...item,

      pricing: {
        currency: "AED",

        unitPrice,

        quantity,

        subtotal,

        discount: 0,

        total: subtotal,
      },
    };
  }
  /*
   * =====================================================
   * Unit Price
   * =====================================================
   */

  getUnitPrice(item = {}, quantity = 0) {
    if (!item.product?.id || !item.selection?.id || quantity <= 0) {
      return 0;
    }

    const product = catalogService.getProduct(item.product.id);

    if (!product) {
      return 0;
    }

    const selection = catalogService.getSelectionOption(
      product,
      item.selection.id,
    );

    if (!selection) {
      return 0;
    }

    const startingPrice = Number(selection.startingPrice ?? 0);

    // startingPrice represents the price for 100 pieces
    return startingPrice / 100;
  }
}
