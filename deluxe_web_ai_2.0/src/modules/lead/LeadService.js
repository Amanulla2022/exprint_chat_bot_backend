import LeadManager from "./LeadManager.js";
import LeadExtractor from "./LeadExtractor.js";
import LeadIntentResolver from "./IntentTypes/LeadIntentResolver.js";

const extractor = new LeadExtractor();
const manager = new LeadManager();
const intentResolver = new LeadIntentResolver();

export default class LeadService {
  async process(state) {
    let lead =
      state.leadRequest ??
      manager.createLead({
        customer: state.customer,
        order: state.liveRequirement,
      });

    /*
     * =====================================================
     * First Entry
     * =====================================================
     */

    if (!state.currentStep) {
      let priority = null;

      if (!lead.type) {
        const intent = await intentResolver.resolve(state.userMessage);

        manager.updateType(lead, intent.type);

        priority = intent.priority ?? null;
      }

      state.metadata = {
        ...(state.metadata ?? {}),
        leadType: lead.type,
        leadPriority: priority,
      };

      manager.updateStatus(lead, "COLLECTING_CUSTOMER");

      return {
        status: "COLLECTING_CUSTOMER",

        leadRequest: lead,

        awaitingDecision: true,

        currentStep: "COLLECT_CUSTOMER",

        response: manager.getCustomerForm(lead),
      };
    }

    /*
     * =====================================================
     * Collect Form Data
     * =====================================================
     */

    const extracted = await extractor.extract(state);

    manager.updateCustomer(lead, extracted);

    /*
     * =====================================================
     * Resolve Lead Type
     * =====================================================
     */

    if (!lead.type) {
      const intent = await intentResolver.resolve(state.userMessage);

      manager.updateType(lead, intent.type);
    }

    /*
     * =====================================================
     * Validate Form
     * =====================================================
     */

    const errors = {};

    if (!manager.isNameValid(lead.customer.name)) {
      errors.name = "Please enter your full name.";
    }

    if (!manager.isPhoneValid(lead.customer.phone)) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!manager.isEmailValid(lead.customer.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (
      lead.customer.company &&
      !manager.isCompanyValid(lead.customer.company)
    ) {
      errors.company = "Please enter a valid company name.";
    }

    if (Object.keys(errors).length) {
      manager.updateStatus(lead, "COLLECTING_CUSTOMER");

      return {
        status: "COLLECTING_CUSTOMER",

        leadRequest: lead,

        awaitingDecision: true,

        currentStep: "COLLECT_CUSTOMER",

        response: {
          ...manager.getCustomerForm(lead),

          errors,
        },
      };
    }

    /*
     * =====================================================
     * Lead Completed
     * =====================================================
     */

    manager.assignSalesPerson(lead, {
      role: "Admin",
      name: "Admin User",
    });

    manager.updateStatus(lead, "SUBMITTED");

    return {
      status: "COMPLETED",

      leadRequest: lead,

      awaitingDecision: false,

      currentStep: "LEAD_COMPLETED",

      response: {
        step: "LEAD_COMPLETED",

        title: "Request Submitted Successfully",

        message:
          "Thank you for choosing Deluxe Printing. Your request has been received successfully.\n\nOur product specialist will review your requirements and prepare a personalized quotation. We'll contact you as soon as possible using the contact details you provided.",

        support: {
          title: "Need immediate assistance?",

          description:
            "If you have additional artwork, files, or specifications to share, you can send them directly via WhatsApp or email using the contact information below.",

          channels: [
            {
              type: "email",
              label: "Email",
              value: "sales@deluxeprinting.ae",
            },
            {
              type: "phone",
              label: "Call Us",
              value: "+971XXXXXXXXX",
            },
            {
              type: "whatsapp",
              label: "WhatsApp",
              value: "+971XXXXXXXXX",
              url: "https://wa.me/971XXXXXXXXX",
            },
          ],
        },
      },
    };
  }
}
