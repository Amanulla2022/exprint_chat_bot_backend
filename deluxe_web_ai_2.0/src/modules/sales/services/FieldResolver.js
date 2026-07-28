export default class FieldResolver {
  resolve(target = {}, message = "") {
    if (!target || !message.trim()) {
      return {};
    }

    // Single field
    if (target.id && target.type) {
      const value = this.resolveField(target, message);

      if (value === null || value === undefined || value === "") {
        return {};
      }

      return {
        [target.id]: value,
      };
    }

    // Product (backward compatible)
    const extracted = {};

    for (const field of target.fields ?? []) {
      const value = this.resolveField(field, message);

      if (value !== null && value !== undefined && value !== "") {
        extracted[field.id] = value;
      }
    }

    return extracted;
  }

  resolveField(field = {}, message = "") {
    switch ((field.type ?? "").toLowerCase()) {
      case "select":
        return this.resolveSelect(field, message);

      case "number":
        return this.resolveNumber(message);

      case "boolean":
        return this.resolveBoolean(message);

      case "text":
        return this.resolveText(message);

      case "confirmation":
        return this.resolveBoolean(message);

      default:
        return null;
    }
  }

  resolveSelect(field = {}, message = "") {
    const text = message.toLowerCase();

    for (const option of field.options ?? []) {
      if (this.matches(text, option)) {
        return option.value ?? option.name;
      }
    }

    return null;
  }

  resolveNumber(message = "") {
    const match = message.match(/-?\d+(\.\d+)?/);

    if (!match) {
      return null;
    }

    const value = Number(match[0]);

    return Number.isNaN(value) ? null : value;
  }

  resolveBoolean(message = "") {
    const text = message.toLowerCase().trim();

    const truthy = [
      "yes",
      "yeah",
      "yep",
      "true",
      "correct",
      "sure",
      "ok",
      "okay",
      "have",
      "available",
      "ready",
    ];

    const falsy = ["no", "nope", "false", "not", "don't", "do not", "none"];

    if (truthy.some((word) => text.includes(word))) {
      return true;
    }

    if (falsy.some((word) => text.includes(word))) {
      return false;
    }

    return null;
  }

  resolveText(message = "") {
    const text = message.trim();

    return text.length ? text : null;
  }

  getMissing(product = {}, productData = {}) {
    return (product.fields ?? []).filter((field) => {
      if (field.required === false) {
        return false;
      }

      const value = productData?.[field.id];

      return value === null || value === undefined || value === "";
    });
  }

  isCompleted(product = {}, productData = {}) {
    return this.getMissing(product, productData).length === 0;
  }

  isCompleted(product = {}, currentFields = {}) {
    return this.getMissing(product, currentFields).length === 0;
  }

  matches(message = "", option = {}) {
    const keywords = [option.name, ...(option.aliases ?? [])]
      .filter(Boolean)
      .map((value) => value.toLowerCase());

    return keywords.some((keyword) => message.includes(keyword));
  }
}
