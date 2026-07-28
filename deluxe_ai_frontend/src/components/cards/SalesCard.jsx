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

/*
 * =====================================================
 * Helpers
 * =====================================================
 */

function formatLabel(key = "") {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return <span className="italic text-slate-400">Pending</span>;
  }

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
    <div className="flex items-start justify-between gap-6 py-3 border-b border-slate-100 last:border-0">
      <div className="min-w-[150px] text-sm font-medium text-slate-500">
        {label}
      </div>

      <div className="text-sm text-right text-slate-800 break-words">
        {formatValue(value)}
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  if (!children) return null;

  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 px-5 py-4 bg-slate-50 border-b">
        <Icon className="w-5 h-5 text-blue-600" />

        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}

/*
 * =====================================================
 * Sales Card
 * =====================================================
 */

export default function SalesCard({
  message = "",
  requirement = {},
  actions = [],
}) {
  /*
   * =====================================================
   * Current Order
   * =====================================================
   */

  const item = requirement?.items?.[requirement?.currentItem ?? 0] ?? {};

  const product = item.product ?? {};

  const selection = item.selection ?? {};

  const productData = item.productData ?? {};

  const requirements = item.requirements ?? [];

  const workflow = item.workflow ?? {};

  const customer = requirement.customer ?? {};

  const delivery = requirement.delivery ?? {};

  const pricing = item.pricing ?? requirement.pricing ?? {};

  const isCollectingField = actions.some(
    (action) => action.id === "COLLECT_PRODUCT_FIELD",
  );

  /*
   * =====================================================
   * Product Information
   * =====================================================
   */
  /*
   * =====================================================
   * Product Information
   * =====================================================
   */

  const selectionFeatures = selection?.features ?? [];

  const productFeatures = product?.features ?? [];

  const availableAddons = product?.addons?.options ?? [];

  const selectedAddons = Array.isArray(item?.addons?.items)
    ? item.addons.items
    : [];

  /*
   * =====================================================
   * Conversation State
   * =====================================================
   */

  const hasProduct = !!product?.id;

  const hasSelection = !!selection?.id;

  const hasProductData = Object.keys(productData).length > 0;

  const isReview = actions.some(
    (action) => action.id === "CONFIRM_ORDER" || action.id === "EDIT_ORDER",
  );

  /*
   * Customer is viewing all variants
   */

  const isComparison =
    !hasSelection && actions.some((action) => action.id === "SELECT_SELECTION");

  /*
   * AI has recommended one variant
   */

  const isRecommendation = hasProduct && !hasSelection && !isComparison;

  /*
   * Customer selected one variant
   * but hasn't started filling
   * order information yet.
   */

  const isSelectedVariant =
    hasSelection && !hasProductData && !isReview && !isCollectingField;

  /*
   * Customer is now answering
   * questions like quantity,
   * artwork etc.
   */

  const isOrderCollection = hasSelection && hasProductData && !isReview;

  /*
   * =====================================================
   * Render Helpers
   * =====================================================
   */

  function renderFeatureList(features = []) {
    if (!features.length) return null;

    return (
      <div className="space-y-2">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-2">
            <span className="mt-1 text-green-600">✓</span>

            <span className="text-sm text-slate-700">{feature}</span>
          </div>
        ))}
      </div>
    );
  }

  function renderAddonList() {
    if (!availableAddons.length) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {availableAddons.map((addon) => (
          <div
            key={addon.id}
            className="rounded-xl border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{addon.name}</h4>

              {selectedAddons.some((a) => a.id === addon.id) && (
                <span className="text-xs font-semibold text-blue-600">
                  Selected
                </span>
              )}
            </div>

            {addon.description && (
              <p className="mt-2 text-sm text-slate-600">{addon.description}</p>
            )}

            {addon.price && (
              <div className="mt-3 text-sm font-semibold text-green-600">
                {addon.price.currency} {addon.price.amount}
                {addon.price.unit && ` / ${addon.price.unit}`}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-5">
      {/* ===========================================
          Header
      =========================================== */}

      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="flex items-center gap-4 p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
            <Bot className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Deluxe AI Sales Consultant
            </h2>

            <p className="mt-1 text-sm text-blue-100">
              I'll help you choose the perfect printing solution for your
              business.
            </p>
          </div>
        </div>
      </div>

      {/* ===========================================
          Assistant Message
      =========================================== */}

      <Section icon={MessageSquare} title="AI Assistant">
        <p className="leading-7 whitespace-pre-wrap text-slate-700">
          {message}
        </p>
      </Section>

      {/* ===========================================
          RECOMMENDATION MODE
      =========================================== */}

      {/* ===========================================
          RECOMMENDATION
      =========================================== */}

      {isRecommendation && (
        <>
          <Section icon={Package} title="AI Recommendation">
            <InfoRow label="Product" value={product.name} />

            <div className="mt-5 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    ⭐ Recommended
                  </div>

                  <h3 className="mt-1 text-xl font-bold text-slate-800">
                    {selection.name}
                  </h3>

                  {selection.badge && (
                    <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {selection.badge}
                    </span>
                  )}
                </div>

                {selection.startingPrice && (
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Starting From</div>

                    <div className="text-2xl font-bold text-green-600">
                      {pricing.currency || "AED"} {selection.startingPrice}
                    </div>
                  </div>
                )}
              </div>

              {selection.description && (
                <p className="mt-5 leading-7 text-slate-600">
                  {selection.description}
                </p>
              )}
            </div>
          </Section>

          {selectionFeatures.length > 0 && (
            <Section icon={ClipboardList} title="Why We Recommend This">
              {renderFeatureList(selectionFeatures)}
            </Section>
          )}

          {productFeatures.length > 0 && (
            <Section icon={Package} title="General Features">
              {renderFeatureList(productFeatures)}
            </Section>
          )}

          {availableAddons.length > 0 && (
            <Section icon={Package} title="Available Finishing Options">
              {renderAddonList()}
            </Section>
          )}
        </>
      )}

      {/* ===========================================
          PRODUCT COMPARISON
      =========================================== */}

      {isComparison && (
        <Section icon={Package} title={`Choose Your ${product.name}`}>
          <div className="grid gap-4">
            {actions.map((action, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{action.label}</h3>

                    <div className="mt-2 text-sm text-slate-500">
                      Premium printing option
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      ✓ Premium Quality
                    </div>

                    <div className="flex items-center gap-2">
                      ✓ High Resolution Printing
                    </div>

                    <div className="flex items-center gap-2">
                      ✓ Fast Turnaround
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <ActionButton action={action} requirement={requirement} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===========================================
          SELECTED VARIANT
      =========================================== */}

      {isSelectedVariant && (
        <>
          <Section icon={Package} title="Selected Product">
            <InfoRow label="Product" value={product.name} />

            <InfoRow label="Selection" value={selection.name} />

            {selection.badge && (
              <InfoRow label="Category" value={selection.badge} />
            )}

            {selection.startingPrice && (
              <InfoRow
                label="Starting Price"
                value={`${pricing.currency || "AED"} ${selection.startingPrice}`}
              />
            )}

            {selection.description && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                {selection.description}
              </div>
            )}
          </Section>


          {selectionFeatures.length > 0 && (
            <Section icon={ClipboardList} title={`${selection.name} Features`}>
              {renderFeatureList(selectionFeatures)}
            </Section>
          )}

          {availableAddons.length > 0 && (
            <Section icon={Package} title="Available Finishing Options">
              {renderAddonList()}
            </Section>
          )}
        </>
      )}

      {/* ===========================================
          ORDER COLLECTION
      =========================================== */}

      {isOrderCollection && (
        <>
          <Section icon={Package} title="Current Order">
            <InfoRow label="Product" value={product.name} />

            <InfoRow label="Selection" value={selection.name} />

            {selection.badge && (
              <InfoRow label="Category" value={selection.badge} />
            )}

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="mb-4 text-sm font-semibold text-blue-700">
                Order Progress
              </div>

              {Object.keys(productData).length > 0 &&
                Object.entries(productData).map(([key, value]) => (
                  <InfoRow key={key} label={formatLabel(key)} value={value} />
                ))}

              {workflow.quantity && (
                <InfoRow label="Quantity" value={workflow.quantity} />
              )}

              {workflow.artwork && (
                <InfoRow
                  label="Artwork"
                  value={
                    workflow.artwork.status === "CUSTOMER_ARTWORK"
                      ? "Customer Artwork"
                      : "Need Design Service"
                  }
                />
              )}

              {selectedAddons.length > 0 && (
                <div className="pt-5">
                  <div className="mb-3 text-sm font-semibold text-slate-700">
                    Selected Finishing
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedAddons.map((addon) => (
                      <span
                        key={addon.id}
                        className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                      >
                        ✓ {addon.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        </>
      )}

      {/* ===========================================
          REVIEW
      =========================================== */}

      {isReview && (
        <>
          <Section icon={Package} title="Order Summary">
            <InfoRow label="Product" value={product.name} />

            <InfoRow label="Selection" value={selection.name} />

            {selection.badge && (
              <InfoRow label="Category" value={selection.badge} />
            )}

            {selection.startingPrice && (
              <InfoRow
                label="Starting Price"
                value={`${pricing.currency || "AED"} ${selection.startingPrice}`}
              />
            )}

            {selection.description && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                {selection.description}
              </div>
            )}
          </Section>

          {selectionFeatures.length > 0 && (
            <Section icon={ClipboardList} title="Selected Product Features">
              {renderFeatureList(selectionFeatures)}
            </Section>
          )}

          {Object.keys(productData).length > 0 && (
            <Section icon={ClipboardList} title="Product Information">
              {Object.entries(productData).map(([key, value]) => (
                <InfoRow key={key} label={formatLabel(key)} value={value} />
              ))}
            </Section>
          )}

          {selectedAddons.length > 0 && (
            <Section icon={Package} title="Selected Finishing Options">
              <div className="grid gap-4 md:grid-cols-2">
                {selectedAddons.map((addon) => (
                  <div
                    key={addon.id}
                    className="rounded-xl border border-green-200 bg-green-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{addon.name}</h4>

                      <span className="text-green-600">✓</span>
                    </div>

                    {addon.description && (
                      <p className="mt-2 text-sm text-slate-600">
                        {addon.description}
                      </p>
                    )}

                    {addon.price && (
                      <div className="mt-3 font-semibold text-green-600">
                        {addon.price.currency} {addon.price.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {Object.keys(workflow).length > 0 && (
            <Section icon={ClipboardList} title="Order Details">
              {Object.entries(workflow).map(([key, value]) => (
                <InfoRow key={key} label={formatLabel(key)} value={value} />
              ))}
            </Section>
          )}

          {Object.keys(delivery).length > 0 && (
            <Section icon={Truck} title="Delivery Details">
              {Object.entries(delivery).map(([key, value]) => (
                <InfoRow key={key} label={formatLabel(key)} value={value} />
              ))}
            </Section>
          )}

          {Object.keys(customer).length > 0 && (
            <Section icon={User} title="Customer Details">
              {Object.entries(customer).map(([key, value]) => (
                <InfoRow key={key} label={formatLabel(key)} value={value} />
              ))}
            </Section>
          )}

          {Object.keys(pricing).length > 0 && (
            <Section icon={DollarSign} title="Price Summary">
              {Object.entries(pricing).map(([key, value]) => (
                <InfoRow key={key} label={formatLabel(key)} value={value} />
              ))}
            </Section>
          )}
        </>
      )}

      {/* ===========================================
          ACTIONS
      =========================================== */}

      {actions.length > 0 &&
        !isRecommendation &&
        !isComparison &&
        !isSelectedVariant && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b bg-gradient-to-r from-slate-50 to-blue-50 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {isReview
                  ? "Review & Confirm"
                  : isComparison
                    ? "Available Options"
                    : "Next Step"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {isReview && "Please review your order before submitting."}

                {isComparison &&
                  "Compare the available options and choose the one that best suits your business."}

                {!isReview &&
                  !isComparison &&
                  "Select one of the available options below to continue."}
              </p>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ===========================================
          FOOTER
      =========================================== */}

      {!isReview && actions.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <div className="font-semibold text-slate-800">
                Waiting for your response
              </div>

              <div className="mt-1 text-sm text-slate-500">
                Continue the conversation by answering the question above.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================================
          REVIEW FOOTER
      =========================================== */}

      {isReview && (
        <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <ClipboardList className="h-6 w-6 text-green-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Review Your Order
              </h3>

              <p className="mt-3 leading-7 text-green-700">
                Please verify the information above carefully.
                <br />
                If everything looks correct, click
                <strong> Confirm Order </strong>
                to submit your request.
                <br />
                If you need to make any changes, click
                <strong> Edit Order </strong>
                and I'll guide you through updating the order.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
