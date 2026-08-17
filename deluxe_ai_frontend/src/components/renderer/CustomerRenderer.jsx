"use client";

import CustomerCard from "../cards/CustomerCard";

export default function CustomerRenderer({
  data = {},
  message = "",
  onAction,
}) {
  if (!data) {
    return null;
  }

  const field =
    data.field ?? data.context?.field ?? data.metadata?.field ?? null;

  if (!field) {
    return null;
  }

  return (
    <CustomerCard
      title={data.title ?? "Customer Details"}
      subtitle={data.subtitle ?? ""}
      message={message || data.message || ""}
      field={field}
      onSubmit={onAction}
    />
  );
}
