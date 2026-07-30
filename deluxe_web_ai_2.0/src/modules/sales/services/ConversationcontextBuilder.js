import DecisionTypes from "../helpers/DecisionTypes.js";
import OrderManager from "./OrderManager.js";
import SalesCatalogService from "./SalesCatalogService.js";

const orderManager = new OrderManager();
const catalogService = new SalesCatalogService();

export default class ConversationContextBuilder {
  build(requirement = {}, decision = {}, customerMessage = "") {
    const item = orderManager.getCurrentItem(requirement);

    const product = item?.product?.id
      ? catalogService.getProduct(item.product.id)
      : null;

    const selection =
      product && item?.selection?.id
        ? catalogService.getSelection(product, item.selection.id)
        : null;

    switch (decision.type) {
      case DecisionTypes.SELECT_PRODUCT:
        return this.buildProductSelection(customerMessage);

      case DecisionTypes.RECOMMEND_SELECTION:
        return this.buildSelectionRecommendation(
          customerMessage,
          product,
          selection,
        );

      case DecisionTypes.SELECT_SELECTION:
        return this.buildSelectionOptions(customerMessage, product);

      case DecisionTypes.COLLECT_PRODUCT_FIELD:
        return this.buildProductField(customerMessage, product, item);

      case DecisionTypes.COLLECT_REQUIREMENT:
        return this.buildRequirement(customerMessage, product, item);

      case DecisionTypes.SELECT_ADDONS:
        return this.buildAddons(customerMessage, product);

      case DecisionTypes.SKIP_ADDONS:
        return this.skipAddons(customerMessage, product);

      case DecisionTypes.COLLECT_QUANTITY:
        return this.buildQuantity(customerMessage, product, selection);

      case DecisionTypes.COLLECT_ARTWORK:
        return this.buildArtwork(customerMessage, product);

      case DecisionTypes.SELECT_DELIVERY_METHOD:
        return this.buildDeliveryMethod(customerMessage);

      case DecisionTypes.ASK_DELIVERY_ADDRESS:
        return this.buildDeliveryAddress(customerMessage, requirement);

      case DecisionTypes.ASK_DELIVERY_DATE:
        return this.buildDeliveryDate(customerMessage, requirement);

      case DecisionTypes.REVIEW_ORDER:
        return this.buildReview(customerMessage, requirement);

      default:
        return {
          customerMessage,
          action: decision.type,
        };
    }
  }

  buildProductSelection(customerMessage) {
    return {
      customerMessage,

      action: DecisionTypes.SELECT_PRODUCT,

      products: catalogService.getProducts().map((p) => p.name),
    };
  }

  buildSelectionRecommendation(customerMessage, product) {
    const recommendation = catalogService.getRecommendedSelection(product);

    return {
      customerMessage,

      action: DecisionTypes.RECOMMEND_SELECTION,

      product: product?.name,

      recommended: recommendation?.name,

      reason:
        recommendation?.recommendationReason ?? recommendation?.description,
    };
  }

  buildSelectionOptions(customerMessage, product) {
    return {
      customerMessage,

      action: DecisionTypes.SELECT_SELECTION,

      product: product?.name,

      options: catalogService
        .getSelectionOptions(product)
        .map((option) => option.name),
    };
  }

  buildProductField(customerMessage, product, item) {
    const field = catalogService.getCurrentField(product, item);

    return {
      customerMessage,

      action: DecisionTypes.COLLECT_PRODUCT_FIELD,

      product: product?.name,

      field: field?.label,

      question: field?.question,

      type: field?.type,
    };
  }

  buildRequirement(customerMessage, product, item) {
    const requirement = catalogService.getCurrentRequirement(product, item);

    return {
      customerMessage,

      action: DecisionTypes.COLLECT_REQUIREMENT,

      product: product?.name,

      requirement: requirement?.name,

      instruction: requirement?.instruction,
    };
  }

  buildAddons(customerMessage, product) {
    const addons = catalogService.getAddons(product);

    return {
      customerMessage,

      action: DecisionTypes.SELECT_ADDONS,

      product: product?.name,

      addons: addons?.options?.map((addon) => addon.name) ?? [],
    };
  }

  buildSkipAddons(customerMessage, product) {
    return {
      customerMessage,

      action: DecisionTypes.SKIP_ADDONS,

      product: product?.name,
    };
  }

  buildQuantity(customerMessage, product, selection) {
    return {
      customerMessage,

      action: DecisionTypes.COLLECT_QUANTITY,

      product: product?.name,

      selection: selection?.name,
    };
  }

  buildArtwork(customerMessage, product) {
    return {
      customerMessage,

      action: DecisionTypes.COLLECT_ARTWORK,

      product: product?.name,
    };
  }

  buildDeliveryMethod(customerMessage) {
    return {
      customerMessage,

      action: DecisionTypes.SELECT_DELIVERY_METHOD,

      options: ["Delivery", "Pickup"],
    };
  }

  buildDeliveryAddress(customerMessage, requirement) {
    return {
      customerMessage,

      action: DecisionTypes.ASK_DELIVERY_ADDRESS,

      deliveryMethod: requirement?.delivery?.method,
    };
  }

  buildDeliveryDate(customerMessage, requirement) {
    return {
      customerMessage,

      action: DecisionTypes.ASK_DELIVERY_DATE,

      deliveryMethod: requirement?.delivery?.method,
    };
  }

  buildReview(customerMessage, requirement) {
    return {
      customerMessage,

      action: DecisionTypes.REVIEW_ORDER,

      totalItems: requirement?.items?.length ?? 0,

      currency: requirement?.pricing?.currency ?? "AED",
    };
  }
}
