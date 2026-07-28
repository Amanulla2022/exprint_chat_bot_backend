"use client";

import {
  Bot,
  Package,
  User,
  Truck,
  DollarSign,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

import ActionButton from "./ActionButton";

function formatLabel(key = "") {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined || value === "")
    return <span className="text-slate-400 italic">Pending</span>;

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    if (value.name) return value.name;
    if (value.label) return value.label;
    if (value.value) return value.value;

    return JSON.stringify(value);
  }

  return String(value);
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2 border-b border-slate-100 last:border-0">
      <div className="text-sm text-slate-500 font-medium min-w-[140px]">
        {label}
      </div>

      <div className="text-sm text-slate-800 text-right break-words">
        {formatValue(value)}
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  if (!children) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b bg-slate-50">
        <Icon className="w-5 h-5 text-blue-600" />

        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}

export default function SalesCard({
  message = "",
  requirement = {},
  actions = [],
}) {
  const item = requirement?.items?.[requirement?.currentItem ?? 0] ?? {};

  const product = item.product ?? {};

  const selection = item.selection ?? {};

  const pricing = item.pricing ?? requirement.pricing ?? {};

  const customer = requirement.customer ?? {};

  const delivery = requirement.delivery ?? {};

  const productData = item.productData ?? {};

  const requirements = item.requirements ?? {};

  const workflow = item.workflow ?? {};

  return (
    <div className="space-y-5">
      {/* =======================================================
          Header
      ======================================================== */}

      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Deluxe AI Sales Consultant
            </h2>

            <p className="text-sm text-blue-100 mt-1">
              I'll help you choose the right printing solution for your
              business.
            </p>
          </div>
        </div>
      </div>

      {/* =======================================================
          Assistant Message
      ======================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b bg-slate-50">
          <MessageSquare className="w-5 h-5 text-blue-600" />

          <h3 className="font-semibold text-slate-800">AI Assistant</h3>
        </div>

        <div className="p-5">
          <p className="text-slate-700 leading-7 whitespace-pre-wrap">
            {message}
          </p>
        </div>
      </div>

      {/* =======================================================
          Empty State
      ======================================================== */}

      {!product?.id && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <Package className="w-10 h-10 mx-auto text-slate-400 mb-4" />

          <h3 className="font-semibold text-slate-700">No Product Selected</h3>

          <p className="text-sm text-slate-500 mt-2">
            Choose one of the available products below to begin your order.
          </p>
        </div>
      )}

      {/* =======================================================
          Product
      ======================================================== */}

      {product?.id && (
        <Section icon={Package} title="Product">
          <InfoRow label="Product" value={product.name} />

          {selection?.id && (
            <InfoRow label="Selection" value={selection.name} />
          )}
        </Section>
      )}

      {/* =======================================================
          Product Fields
      ======================================================== */}

      {Object.keys(productData).length > 0 && (
        <Section icon={ClipboardList} title="Product Information">
          {Object.entries(productData).map(([key, value]) => (
            <InfoRow key={key} label={formatLabel(key)} value={value} />
          ))}
        </Section>
      )}

      {/* =======================================================
          Requirements
      ======================================================== */}

      {Object.keys(requirements).length > 0 && (
        <Section icon={ClipboardList} title="Requirements">
          {Object.entries(requirements).map(([key, value]) => (
            <InfoRow key={key} label={formatLabel(key)} value={value} />
          ))}
        </Section>
      )}

      {/* =======================================================
          Workflow
      ======================================================== */}

      {Object.keys(workflow).length > 0 && (
        <Section icon={ClipboardList} title="Order Details">
          {Object.entries(workflow).map(([key, value]) => (
            <InfoRow key={key} label={formatLabel(key)} value={value} />
          ))}
        </Section>
      )}

      {/* =======================================================
          Customer
      ======================================================== */}

      {Object.keys(customer).length > 0 && (
        <Section icon={User} title="Customer">
          {Object.entries(customer).map(([key, value]) => (
            <InfoRow key={key} label={formatLabel(key)} value={value} />
          ))}
        </Section>
      )}

      {/* =======================================================
          Delivery
      ======================================================== */}

      {Object.keys(delivery).length > 0 && (
        <Section icon={Truck} title="Delivery">
          {Object.entries(delivery).map(([key, value]) => (
            <InfoRow key={key} label={formatLabel(key)} value={value} />
          ))}
        </Section>
      )}

      {/* =======================================================
          Pricing
      ======================================================== */}

      {Object.keys(pricing).length > 0 && (
        <Section icon={DollarSign} title="Pricing">
          {Object.entries(pricing).map(([key, value]) => (
            <InfoRow key={key} label={formatLabel(key)} value={value} />
          ))}
        </Section>
      )}

      {/* =======================================================
          Actions
      ======================================================== */}

      {actions.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-slate-50">
            <h3 className="font-semibold text-slate-800">Available Actions</h3>

            <p className="text-sm text-slate-500 mt-1">
              Continue the conversation by selecting one of the options below.
            </p>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {actions.map((action, index) => (
                <ActionButton
                  key={`${action.id}-${index}`}
                  action={action}
                  requirement={requirement}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          Waiting
      ======================================================== */}

      {!actions.length && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <Bot className="w-8 h-8 mx-auto text-slate-400 mb-3" />

          <p className="text-sm text-slate-600">
            Waiting for your next message...
          </p>
        </div>
      )}
    </div>
  );
}
