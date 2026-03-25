// components/chat/thinking-indicator.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ThinkingIndicatorProps {
  isVisible: boolean;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3 mb-4"
    >
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-sm"
        />
        <div className="relative w-6 h-6 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center border border-white/10">
          <Sparkles className="w-3 h-3 text-white/60" />
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 max-w-[80%]">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-1.5 h-1.5 bg-white/40 rounded-full"
              />
            ))}
          </div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-white/30 mt-1 ml-2"
        >
          AI is thinking...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ThinkingIndicator;
