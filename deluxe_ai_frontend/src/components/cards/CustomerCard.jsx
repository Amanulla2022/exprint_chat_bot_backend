"use client";

import { useState } from "react";
import { User, Phone, Mail } from "lucide-react";

export default function CustomerCard({
  title = "Customer Details",
  subtitle = "",
  message = "",
  field = null,
  onSubmit,
}) {
  const [value, setValue] = useState("");

  if (!field) {
    return null;
  }

  const getIcon = () => {
    switch (field.id) {
      case "phone":
        return <Phone size={18} />;

      case "email":
        return <Mail size={18} />;

      default:
        return <User size={18} />;
    }
  };

  const submit = () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    onSubmit({
      id: "COLLECT_CUSTOMER",
      label: "Continue",
      payload: {
        fieldId: field.id,
        value: trimmedValue,
      },
    });
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="bg-slate-900 px-6 py-5 text-white">
        <h2 className="font-semibold">{title}</h2>

        {subtitle && <p className="mt-1 text-sm text-slate-300">{subtitle}</p>}
      </div>

      {/* Content */}

      <div className="space-y-6 p-6">
        {/* Message */}

        {message && (
          <div>
            <h3 className="mb-2 font-semibold text-slate-800">AI Assistant</h3>

            <p className="whitespace-pre-line leading-8 text-slate-700">
              {message}
            </p>
          </div>
        )}

        {/* Field */}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="text-blue-600">{getIcon()}</span>

            {field.label}

            {field.required && <span className="text-red-500">*</span>}
          </label>

          <input
            type={
              field.id === "email"
                ? "email"
                : field.id === "phone"
                  ? "tel"
                  : "text"
            }
            value={value}
            placeholder={field.question ?? `Enter ${field.label}`}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submit();
              }
            }}
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "
          />
        </div>

        {/* Continue */}

        <button
          type="button"
          onClick={submit}
          disabled={!value.trim()}
          className="
            w-full
            rounded-2xl
            bg-blue-600
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Continue
        </button>
      </div>
    </div>
  );
}
