import axios from "axios";

export default class TelegramService {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.enabled = process.env.TELEGRAM_ENABLED === "true";

    if (this.enabled && (!this.token || !this.chatId)) {
      throw new Error(
        "Telegram configuration missing. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.",
      );
    }
  }

  /**
   * Escape HTML special characters
   */
  escape(value) {
    return String(value ?? "-")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /**
   * Send Telegram Message
   */
  async send(message) {
    console.log("send() called");
    console.log("Enabled:", this.enabled);
    console.log("Chat:", this.chatId);
    if (!this.enabled) return false;

    try {
      await axios.post(
        `https://api.telegram.org/bot${this.token}/sendMessage`,
        {
          chat_id: this.chatId,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        },
      );

      return true;
    } catch (error) {
      console.error("Telegram Error:", error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Lead Notification
   */
  async sendLead(lead = {}) {
    console.log("========== sendLead ==========");
    console.log("Lead Type:", lead.type);
    console.log("Lead Status:", lead.status);
    console.dir(lead.customer, { depth: null });


    const customer = lead.customer ?? {};

    const message = `
<b>🆕 NEW ${this.escape(lead.type)}</b>

👤 <b>Name:</b> ${this.escape(customer.name)}

📞 <b>Phone:</b> ${this.escape(customer.phone)}

${customer.company ? `🏢 <b>Company:</b> ${this.escape(customer.company)}` : ""}

📌 <b>Lead Type:</b> ${this.escape(lead.type)}

🕒 <b>Created:</b> ${new Date().toLocaleString()}
`;

    return this.send(message.trim());
  }

  /**
   * Order Notification
   */
  async sendOrder(order) {
    console.log("========== sendOrder ==========");

    if (!order) {
      console.log("Order is NULL");
      return false;
    }

    console.dir(order, { depth: null });

    const customer = order.customer ?? {};

    const items = order.items ?? [];

    const products =
      items.length > 0
        ? items
            .map((item, index) => {
              const product =
                item.product?.name ??
                item.product?.title ??
                item.productName ??
                "Unknown Product";

              const quantity = item.workflow?.quantity ?? item.quantity ?? "-";

              const specification = Object.entries(item.productData ?? {})
                .filter(([_, value]) => value !== null && value !== "")
                .map(([key, value]) => `• ${key}: ${value}`)
                .join("\n");

              return `
<b>${index + 1}. ${this.escape(product)}</b>

📦 Qty: ${this.escape(quantity)}

${specification ? `<b>Specifications</b>\n${this.escape(specification)}` : ""}
`;
            })
            .join("\n-------------------------\n")
        : "No Products";

    const message = `
<b>🛒 NEW ORDER RECEIVED</b>

🆔 <b>Order No:</b> ${this.escape(
      order.orderNumber ?? order.orderNo ?? order.id ?? "-",
    )}

👤 <b>Name:</b> ${this.escape(customer.name)}

📞 <b>Phone:</b> ${this.escape(customer.phone)}

📧 <b>Email:</b> ${this.escape(customer.email)}

🏢 <b>Company:</b> ${this.escape(customer.company)}

🆔 <b>Session:</b> ${this.escape(order.sessionId)}

━━━━━━━━━━━━━━━━━━

${products}

━━━━━━━━━━━━━━━━━━

📦 <b>Total Items:</b> ${items.length}

🔢 <b>Total Quantity:</b> ${this.escape(order.totalQuantity ?? "-")}

💰 <b>Total:</b> ${this.escape(
      order.pricing?.total ??
        order.total ??
        order.totalPrice ??
        order.grandTotal ??
        "-",
    )}

🕒 <b>Created:</b> ${new Date().toLocaleString()}
`;

    return this.send(message.trim());
  }

  /**
   * Custom Notification
   */
  async sendNotification(title, body) {
    const message = `
<b>${this.escape(title)}</b>

${this.escape(body)}

🕒 ${new Date().toLocaleString()}
`;

    return await this.send(message.trim());
  }

  /**
   * Error Notification
   */
  async sendError(error) {
    const message = `
<b>❌ APPLICATION ERROR</b>

${this.escape(error)}

🕒 ${new Date().toLocaleString()}
`;

    return await this.send(message.trim());
  }
}
