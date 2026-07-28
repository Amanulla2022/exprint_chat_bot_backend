"use client";

import { Sparkles, Package, FileText, ArrowRight } from "lucide-react";

import { motion } from "framer-motion";

import { useChatContext } from "../../context/ChatContext";

const PROMPTS = [
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
    icon: FileText,
    title: "Request Quotation",
    description: "Get a quotation for printing",
    prompt: "Request quotation",
  },
];

export default function SuggestedPrompts() {
  const { sendMessage, loading } = useChatContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-blue-600" />

        <span className="text-sm font-semibold text-slate-700">Try asking</span>
      </div>

      <div className="grid gap-3">
        {PROMPTS.map((item) => {
          const Icon = item.icon;

          return (
            <motion.button
              key={item.title}
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
              disabled={loading}
              onClick={() => sendMessage(item.prompt)}
              className="
                group

                flex
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
                    h-11
                    w-11
                    items-center
                    justify-center

                    rounded-xl

                    bg-blue-100

                    text-blue-600
                  "
                >
                  <Icon size={20} />
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
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
