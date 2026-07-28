"use client";

import { useEffect, useState } from "react";
import { Bot, User, Mail, Phone, Building2, CheckCircle2 } from "lucide-react";

import ActionButton from "./ActionButton";

function getFieldIcon(type, id) {
  if (id === "name") return <User size={18} />;
  if (id === "phone") return <Phone size={18} />;
  if (id === "email") return <Mail size={18} />;
  if (id === "company") return <Building2 size={18} />;

  switch (type) {
    case "email":
      return <Mail size={18} />;

    case "tel":
      return <Phone size={18} />;

    default:
      return <User size={18} />;
  }
}

export default function LeadCard({
  step,
  title = "",
  subtitle = "",
  message = "",
  description = "",
  support = null,
  fields = [],
  errors = {},
  submitAction = null,
}) {
  const [formData, setFormData] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.id, field.value ?? ""])),
  );

  const updateField = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const payload = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  );

  if (step === "LEAD_COMPLETED") {
    return (
      <div className="rounded-3xl border border-green-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-green-600 text-white p-6 flex items-center gap-4">
          <CheckCircle2 size={28} />
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="leading-8 text-slate-700 whitespace-pre-line">
            {message}
          </p>

          {support && (
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
              <h3 className="font-semibold mb-2">{support.title}</h3>

              <p className="text-sm text-slate-600 mb-5">
                {support.description}
              </p>

              <div className="space-y-3">
                {support.channels?.map((channel) => (
                  <div
                    key={channel.type}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium">{channel.label}</span>

                    {channel.url ? (
                      <a
                        href={channel.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <span>{channel.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Bot size={24} />
          </div>

          <div>
            <h2 className="font-semibold">{title || "Deluxe AI Assistant"}</h2>

            {subtitle && <p className="text-sm text-slate-300">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {message && (
          <div>
            <h3 className="font-semibold mb-2">AI Assistant</h3>

            <p className="leading-8 text-slate-700 whitespace-pre-line">
              {message}
            </p>
          </div>
        )}

        {description && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm leading-7 text-slate-700">{description}</p>
          </div>
        )}

        <div className="space-y-5">
          {fields.map((field) => {
            const value = formData[field.id] ?? "";
            const error = errors[field.id];

            const inputClass = `
w-full
rounded-2xl
bg-white
px-4
py-3
text-sm
outline-none
transition
border
${
  error
    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
}
focus:ring-4
`;

            return (
              <div key={field.id} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-blue-600">
                    {getFieldIcon(field.type, field.id)}
                  </span>

                  {field.label}

                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {["text", "email", "tel"].includes(field.type) && (
                  <input
                    type={field.type}
                    value={value}
                    placeholder={field.placeholder}
                    onChange={(e) => updateField(field.id, e.target.value)}
                    className={inputClass}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    rows={4}
                    value={value}
                    placeholder={field.placeholder}
                    onChange={(e) => updateField(field.id, e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                )}

                {field.type === "select" && (
                  <select
                    value={value}
                    onChange={(e) => updateField(field.id, e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select {field.label}</option>

                    {(field.options ?? []).map((option) => (
                      <option
                        key={option.value ?? option.id}
                        value={option.value ?? option.id}
                      >
                        {option.label ?? option.name}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "checkbox" && (
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(e) => updateField(field.id, e.target.checked)}
                    />

                    <span>{field.placeholder || field.label}</span>
                  </label>
                )}

                {field.description && (
                  <p className="text-xs text-slate-500">{field.description}</p>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            );
          })}
        </div>

        {submitAction && (
          <div className="border-t border-slate-200 pt-6">
            <ActionButton
              action={{
                ...submitAction,
                payload: {
                  ...(submitAction.payload ?? {}),
                  fields: payload,
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
