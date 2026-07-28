"use client";

import { Sparkles, Package, FileText, ArrowRight } from "lucide-react";

import { motion } from "framer-motion";

import { useChatContext } from "../../context/ChatContext";

const QUICK_ACTIONS = [
  {
    icon: Package,
    title: "Order Business Cards",
    description: "Start a business card order",
    prompt: "I want to order business cards",
  },
  {
    icon: Package,
    title: "Order Self Ink Stamps",
    description: "Start a stamp order",
    prompt: "I want to order self ink stamps",
  },
  {
    icon: Package,
    title: "Order Pop Up Display Stands",
    description: "Start a Pop Up Display Stands order",
    prompt: "I want to order Pop Up Display Stands",
  },
  {
    icon: FileText,
    title: "Request Quotation",
    description: "Get a quotation for printing",
    prompt: "Request quotation",
  },
];

export default function WelcomeScreen() {
  const { sendMessage } = useChatContext();

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col justify-center px-4 py-8">
      {/* Logo */}

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto"
      >
        <div
          className="
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            bg-gradient-to-br
            from-blue-600
            to-indigo-600
            text-white
            shadow-xl
          "
        >
          <Sparkles size={34} />
        </div>
      </motion.div>

      {/* Heading */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-7 text-center"
      >
        <h1 className="text-3xl font-bold text-slate-900">
          Deluxe AI Sales Assistant
        </h1>

        <p className="mt-3 leading-7 text-slate-500">
          I can recommend products, compare printing solutions, explain product
          details, create quotations and help you place complete orders.
        </p>
      </motion.div>

      {/* Quick Actions */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-10 space-y-3"
      >
        {QUICK_ACTIONS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => sendMessage(item.prompt)}
              className="
                group
                flex
                w-full
                items-center
                justify-between

                rounded-2xl

                border
                border-slate-200

                bg-white

                p-4

                text-left

                shadow-sm

                transition-all

                hover:border-blue-300
                hover:bg-blue-50
                hover:shadow-lg
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center

                    rounded-2xl

                    bg-blue-100
                    text-blue-600
                  "
                >
                  <Icon size={22} />
                </div>

                <div>
                  <div className="font-semibold text-slate-900">
                    {item.title}
                  </div>

                  <div className="text-sm text-slate-500">
                    {item.description}
                  </div>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="
                  text-slate-400
                  transition
                  group-hover:translate-x-1
                  group-hover:text-blue-600
                "
              />
            </button>
          );
        })}
      </motion.div>

      {/* Footer */}

      <div className="mt-8 text-center text-xs text-slate-400">
        Powered by AI • Recommendations • Orders • Quotations • Product
        Knowledge
      </div>
    </div>
  );
}
