import crypto from "node:crypto";
import LEAD_MESSAGES from "./IntentTypes/LeadMessages.js";
import LEAD_TYPES from "./IntentTypes/LeadTypes.js";

export default class LeadManager {
  createLead(data = {}) {
    return {
      leadId: crypto.randomUUID(),

      type: null,

      status: "DRAFT",

      customer: {
        name: null,
        phone: null,
        email: null,
        company: null,
        ...(data.customer ?? {}),
      },

      order: data.order ?? null,

      notes: null,

      assignedTo: null,

      source: "AI_ASSISTANT",

      createdAt: new Date(),

      updatedAt: new Date(),
    };
  }

  getLeadIntroduction(type) {
    return (
      LEAD_MESSAGES[type]?.introduction ??
      LEAD_MESSAGES[LEAD_TYPES.GENERAL_ENQUIRY].introduction
    );
  }

  updateCustomer(lead, customer = {}) {
    console.log("Before:", lead?.customer);
    console.log("Incoming:", customer);

    if (!lead) {
      lead = this.createLead();
    }

    lead.customer = {
      ...lead.customer,
      ...customer,
    };
    lead.updatedAt = new Date();

    console.log("After:", lead.customer);

    return lead;
  }
  updateNotes(lead, notes) {
    if (!lead) {
      return null;
    }

    lead.notes = notes;

    lead.updatedAt = new Date();

    return lead;
  }

  updateType(lead, type) {
    if (!lead) {
      return null;
    }

    lead.type = type;

    lead.updatedAt = new Date();

    return lead;
  }

  assignSalesPerson(lead, assignedTo) {
    if (!lead) {
      return null;
    }

    lead.assignedTo = assignedTo;

    lead.status = "ASSIGNED";

    lead.updatedAt = new Date();

    return lead;
  }

  updateStatus(lead, status) {
    if (!lead) {
      return null;
    }

    lead.status = status;

    lead.updatedAt = new Date();

    return lead;
  }
  /*
   * ---------------------------------------------------------
   * Conversation Flow
   * ---------------------------------------------------------
   */

  getCustomerForm(lead) {
    const customer = lead.customer ?? {};

    return {
      step: "COLLECT_CUSTOMER",

      type: "FORM",

      title: "Contact Information",

      subtitle: "Complete your request",

      message: this.getLeadIntroduction(lead.type),

      description:
        "Please provide your contact details so our product specialist can prepare your quotation and get in touch with you.",

      fields: [
        {
          id: "name",
          label: "Full Name",
          placeholder: "John Smith",
          type: "text",
          required: true,
          value: customer.name,
        },
        {
          id: "phone",
          label: "Phone Number",
          placeholder: "+971 50 123 4567",
          type: "tel",
          required: true,
          value: customer.phone,
        },
        {
          id: "email",
          label: "Email Address",
          placeholder: "john@example.com",
          type: "email",
          required: false,
          value: customer.email,
        },
        {
          id: "company",
          label: "Company",
          placeholder: "Optional",
          type: "text",
          required: false,
          value: customer.company,
        },
      ],

      submitAction: {
        id: "SUBMIT_LEAD",
        label: "Submit Request",
      },
    };
  }
  /*
   * ---------------------------------------------------------
   * Validation Helpers
   * ---------------------------------------------------------
   */

  isEmailValid(email) {
    if (!email) {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  isPhoneValid(phone) {
    if (!phone) {
      return false;
    }

    return /^[+\d\s()-]{7,20}$/.test(phone.trim());
  }
  isNameValid(name) {
    if (!name) {
      return false;
    }

    const value = name.trim();

    if (value.length < 2) {
      return false;
    }

    if (/^\d+$/.test(value)) {
      return false;
    }

    if (/@/.test(value)) {
      return false;
    }

    return true;
  }

  isCompanyValid(company) {
    if (!company) {
      return false;
    }

    return company.trim().length >= 2;
  }
  /*
   * ---------------------------------------------------------
   * Completion Check
   * ---------------------------------------------------------
   */
  isCustomerComplete(lead) {
    const customer = lead.customer ?? {};

    return (
      this.isNameValid(customer.name) &&
      this.isPhoneValid(customer.phone) &&
      this.isEmailValid(customer.email)
    );
  }
}
