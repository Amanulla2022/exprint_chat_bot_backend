"use client";

import RecommendationRenderer from "./Recommedationrenderer";
import ProductDetailsRenderer from "./ProductsDetailsRenderer";
import ComparisonRenderer from "./ComparisonRenderer";
import DiscoveryRenderer from "./DiscoveryRenderer";
import SalesRenderer from "./SalesRenderer";
import LeadRenderer from "./LeadRenderer";
import FAQRenderer from "./FAQRenderer";
import SupportRenderer from "./SupportRenderer";
import MarkdownRenderer from "./MarkdownRenderer";
import ErrorRenderer from "./ErrorRenderer";

import TextCard from "../cards/TextCard";

export default function ResponseRenderer({ message }) {
  if (!message) return null;

  /*
   * =====================================================
   * User Message
   * =====================================================
   */

  if (message.role === "user") {
    return <TextCard text={message.content} />;
  }

  /*
   * =====================================================
   * Assistant Response
   * =====================================================
   */

  const {
    type = "text",
    message: responseMessage = "",
    data = {},
    actions = [],
  } = message;

  const rendererActions = actions.length > 0 ? actions : (data.actions ?? []);

  const text = responseMessage || data.message || "";

  /*
   * =====================================================
   * Backend Response Types
   * =====================================================
   */

  switch (type) {
    case "recommendation":
      return <RecommendationRenderer data={data} actions={rendererActions} />;

    case "product_details":
    case "PRODUCT_DETAILS":
      return <ProductDetailsRenderer data={data} actions={rendererActions} />;

    case "comparison":
      return <ComparisonRenderer data={data} actions={rendererActions} />;

    case "discovery":
      return <DiscoveryRenderer data={data} actions={rendererActions} />;

    case "sales":
      if (data.workflow === "LEAD") {
        return (
          <LeadRenderer data={data} message={text} actions={rendererActions} />
        );
      }

    case "sales":
    case "SHOW_SELECTIONS":
    case "SELECT_SELECTION":
    case "COLLECT_PRODUCT_FIELD":
    case "COLLECT_REQUIREMENT":
    case "COLLECT_QUANTITY":
    case "COLLECT_ARTWORK":
    case "SELECT_DELIVERY_METHOD":
    case "ASK_DELIVERY_ADDRESS":
    case "ASK_DELIVERY_DATE":
    case "REVIEW_ORDER":
    case "CONFIRM_ORDER":
    case "ORDER_COMPLETED":
      return (
        <SalesRenderer data={data} message={text} actions={rendererActions} />
      );

    case "out_of_scope":
      return <MarkdownRenderer text={data.message} actions={rendererActions} />;

    case "lead":
      return (
        <LeadRenderer data={data} message={text} actions={rendererActions} />
      );

    case "faq":
      return (
        <FAQRenderer data={data} message={text} actions={rendererActions} />
      );

    case "support":
      return (
        <SupportRenderer data={data} message={text} actions={rendererActions} />
      );

    case "quotation":
      return (
        <MarkdownRenderer
          text={data.summary ?? text}
          actions={rendererActions}
        />
      );

    case "error":
      return <ErrorRenderer message={text} />;

    case "text":
    default:
      return <MarkdownRenderer text={text} actions={rendererActions} />;
  }
}
