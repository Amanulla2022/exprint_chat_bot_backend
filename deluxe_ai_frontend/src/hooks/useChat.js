"use client";

import { useCallback, useState } from "react";

import chatService from "../services/ChatService";
import sessionService from "../services/SessionService";

export default function useChat() {
  const [sessionId, setSessionId] = useState(() =>
    sessionService.getSessionId(),
  );

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [typing, setTyping] = useState(false);

  /* -------------------------------------------------- */

  const createMessage = ({
    role,
    type = "text",
    content = "",
    message = "",
    data = {},
    actions = [],
    metadata = {},
  }) => ({
    id: crypto.randomUUID(),

    role,

    type,

    content,

    message,

    data,

    actions,

    metadata,

    createdAt: new Date().toISOString(),
  });

  /* -------------------------------------------------- */

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      createMessage({
        role: "user",
        content: text,
      }),
    ]);
  };

  /* -------------------------------------------------- */

  const addAssistantMessage = (response) => {
    const payload = response.context ?? response.data ?? {};

    setMessages((prev) => [
      ...prev,
      createMessage({
        role: "assistant",

        type: response.type,

        message: response.message,

        data: payload,

        metadata: payload,

        actions: response.actions ?? [],
      }),
    ]);
  };

  /* -------------------------------------------------- */

  const sendMessage = useCallback(
    async (text = "", action = null) => {
      const message = text?.trim() ?? "";

      if (!message && !action) return;

      if (loading) return;

      /*
       * Show button click as a user message
       */

      if (message) {
        addUserMessage(message);
      } else if (action?.label) {
        addUserMessage(action.label);
      }

      setLoading(true);
      setTyping(true);

      try {
        const response = await chatService.sendMessage(
          sessionId,
          message,
          action,
        );

        addAssistantMessage(response);
      } catch (error) {
        addAssistantMessage({
          type: "error",
          message: error?.message || "Something went wrong.",
        });
      } finally {
        setTyping(false);
        setLoading(false);
      }
    },
    [loading, sessionId],
  );

  const FORWARD_ACTIONS = new Set([
    // Recommendation
    "RECOMMENDATION_BUSINESS",
    "RECOMMENDATION_INDIVIDUAL",
    "BUSINESS_CAFE",
    "BUSINESS_RESTAURANT",
    "BUSINESS_HOTEL",
    "BUSINESS_RETAIL",
    "BUSINESS_HOSPITAL",
    "BUSINESS_OTHER",
    "GOAL_BRANDING",
    "GOAL_PROMOTION",
    "GOAL_PACKAGING",
    "GOAL_SIGNAGE",

    // Product
    "START_ORDER",
    "ORDER_PRODUCT",
    "SHOW_PRODUCT_DETAILS",
    "COMPARE_PRODUCT",
    "COMPARE_PRODUCTS",
    "GET_QUOTE",
    "CONTACT_SALES",

    // Sales
    "SELECT_PRODUCT",
    "SHOW_SELECTIONS",
    "SELECT_SELECTION",
    "COLLECT_PRODUCT_FIELD",
    "COLLECT_REQUIREMENT",
    "SELECT_ADDONS",
    "SKIP_ADDONS",
    "COLLECT_QUANTITY",
    "EDIT_ORDER",
    "COLLECT_ARTWORK",
    "SELECT_DELIVERY_METHOD",
    "ASK_DELIVERY_ADDRESS",
    "ASK_DELIVERY_DATE",
    "REVIEW_ORDER",
    "CONFIRM_ORDER",
    "CANCEL_ORDER",
    "ORDER_COMPLETED",
    "SUBMIT_LEAD",
  ]);

  const handleAction = useCallback(
    (action) => {
      if (!action) return;

      if (FORWARD_ACTIONS.has(action.id)) {
        sendMessage("", action);
        return;
      }

      switch (action.id) {
        case "RECOMMEND_PRODUCTS":
          sendMessage("Recommend products");
          break;

        case "SEND_PROFILE":
          sendMessage("Send me your company profile");
          break;

        case "CONTACT_SUPPORT":
          sendMessage("I need customer support");
          break;

        case "SUBMIT_LEAD":
          sendMessage("", action);
          break;

        default:
          console.warn("Unhandled action:", action.id);
      }
    },
    [sendMessage],
  );
  /* -------------------------------------------------- */

  const clearChat = () => {
    const id = sessionService.newSession();

    setSessionId(id);

    setMessages([]);
  };

  /* -------------------------------------------------- */

  return {
    sessionId,

    messages,

    loading,

    typing,

    sendMessage,

    handleAction,

    clearChat,

    setMessages,
  };
}
