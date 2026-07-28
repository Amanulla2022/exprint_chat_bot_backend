"use client";

import LeadCard from "../cards/LeadCard";

export default function LeadRenderer({ data = {}, message = "" }) {
  if (!data) {
    return null;
  }

  return (
    <LeadCard
      step={data.step}
      title={data.title}
      subtitle={data.subtitle}
      message={message || data.message}
      description={data.description}
      support={data.support ?? null}
      fields={data.fields ?? []}
      errors={data.errors ?? {}}
      submitAction={data.submitAction ?? null}
    />
  );
}
