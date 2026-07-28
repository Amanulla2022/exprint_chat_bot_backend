"use client";

import SalesCard from "../cards/SalesCard";

export default function SalesRenderer({
  data = {},
  message = "",
  actions = [],
}) {
  return (
    <SalesCard
      message={message}
      requirement={data.liveRequirement}
      actions={actions}
    />
  );
}
