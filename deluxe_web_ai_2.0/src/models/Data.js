import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    /*
     * ===================================================
     * CREATED BY
     * ===================================================
     */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    /*
     * ===================================================
     * LEAD IDENTITY
     * ===================================================
     */

    refNo: {
      type: Number,

      unique: true,

      required: true,
    },

    uid: {
      type: String,

      default: null,
    },

    /*
     * ===================================================
     * CUSTOMER
     * ===================================================
     */

    name: {
      type: String,

      required: true,

      trim: true,
    },

    companyName: {
      type: String,

      default: "",

      trim: true,
    },

    emailId: {
      type: String,

      default: "",

      trim: true,

      lowercase: true,
    },

    phoneNumber: {
      type: String,

      required: true,

      trim: true,
    },

    billingAddress: {
      type: String,

      default: "",
    },

    /*
     * ===================================================
     * LEAD SOURCE
     * ===================================================
     */

    source: {
      type: String,

      enum: [
        "Exprintmart Chatbot",
        "Oncall",
        "Walk-In",
        "WhatsApp",
        "WhatsApp-(Re)",
        "Email",
        "Email-(Re)",
        "Google Ads Signage-(WA)",
        "Google Ads Signage-(Email)",
        "Google Ads Events-(WA)",
        "Google Ads Events-(Email)",
        "Google Ads Sta-(WA)",
        "Google Ads Sta-(Email)",
        "Google Ads-(Re)",
        "Social Media-(DLX)",
        "Exprintmart-(WA)",
        "Exprintmart-(Email)",
        "Social Media-(Exprint)",
      ],

      default: "Exprintmart Chatbot",
    },

    /*
     * ===================================================
     * REQUEST TYPE
     * ===================================================
     */

    requestType: {
      type: String,

      enum: ["ORDER", "QUOTATION", "EXPERT", "CONTACT_SALES"],

      default: "EXPERT",

      index: true,
    },

    /*
     * ===================================================
     * REQUIRED ITEM
     * ===================================================
     */

    requiredItem: {
      type: String,

      default: "",

      trim: true,
    },

    /*
     * ===================================================
     * REQUEST DETAILS
     * ===================================================
     */

    requestDetails: {
      type: String,

      default: "",

      trim: true,
    },

    /*
     * ===================================================
     * DIVISION
     * ===================================================
     */

    division: {
      type: String,

      enum: [
        "Signage",
        "Stationery",
        "Event (Digital)",
        "Event (Fashion & Fabric)",
        "Store Branding",
        "Gifts",
        "Gift & Stationery",
        "N/A",
      ],

      default: "N/A",
    },

    /*
     * ===================================================
     * SALES PERSON
     * ===================================================
     */

    assignToSalesPerson: {
      type: String,

      enum: [
        "Admin",
        "Aliasgar",
        "Arif",
        "Atif",
        "Azmat",
        "Huzaifa",
        "Exprintmart",
        "Junaid",
        "Misba",
        "Mohsin",
        "Muazzam",
        "Nayeem",
        "Nishan",
        "Rizwan",
        "Saniya",
        "Salman",
        "Sharifa",
        "Umair",
        "Ziyad",
        "Zohaib",
      ],

      default: "Admin",
    },

    /*
     * ===================================================
     * PRODUCTS
     * ===================================================
     */

    products: [
      {
        productName: {
          type: String,

          required: true,
        },

        productId: {
          type: mongoose.Schema.Types.Mixed,

          default: null,
        },
      },
    ],

    /*
     * ===================================================
     * CRM
     * ===================================================
     */

    dealStatus: {
      type: String,

      enum: [
        "Open",
        "Contacted",
        "Quoted",
        "On-Going",
        "No-reply",
        "Won",
        "Lost",
      ],

      default: "Open",
    },

    dealAmount: {
      type: Number,

      default: 0,
    },

    quoteNumber: {
      type: Number,

      default: 0,
    },

    quoteDate: {
      type: Date,

      default: null,
    },

    initialRemartks: {
      type: String,

      default: "",
    },

    leadAddedDate: {
      type: Date,

      default: Date.now,
    },

    invoiceNumber: {
      type: Number,

      default: 0,
    },

    invoiceDate: {
      type: Date,

      default: null,
    },

    /*
     * ===================================================
     * FOLLOW UP
     * ===================================================
     */

    assignFollowUp: {
      type: String,

      enum: [
        "Hafsa",
        "Fariha",
        "Wasifa",
        "Sana",
        "Aliasgar",
        "Arif",
        "Atif",
        "Azmat",
        "Huzaifa",
        "MurtazaTS",
        "Junaid",
        "Md-Kaif",
        "Misba",
        "Mohsin",
        "Muazzam",
        "Nayeem",
        "Nishan",
        "Rizwan",
        "Saniya",
        "Salman",
        "Sharifa",
        "Umair",
        "Wajid",
        "Ziyad",
        "Zohaib",
        "Completed",
        "NA",
      ],

      default: "NA",
    },

    followUpInstruction: {
      type: String,

      default: "",
    },

    followUps: [
      {
        followUpDate: Date,

        followUpTakenVia: {
          type: String,

          enum: ["Whatsapp", "Email", "Phone Call", "Meeting", "Other"],
        },

        adminName: String,

        followUpNotes: String,

        clientResponse: {
          type: String,

          default: "",
        },

        followUpGap: {
          type: Number,

          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Data", dataSchema);
