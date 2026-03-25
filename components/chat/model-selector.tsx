// components/chat/model-selector.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronDown,
  Check,
  Zap,
  Cpu,
  Lock,
  Bot,
  Brain,
  Globe,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useChat } from "@/contexts/chat-context";
import { cn } from "@/lib/utils";

const ModelSelector = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { selectedModel, changeModel, availableModels, isSending } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log("ModelSelector - isSignedIn:", isSignedIn);
    console.log("ModelSelector - availableModels:", availableModels);
    console.log("ModelSelector - selectedModel:", selectedModel);
  }, [isSignedIn, availableModels, selectedModel]);

  if (!isLoaded) {
    return (
      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
        <span className="text-xs text-white/60">Loading models...</span>
      </div>
    );
  }

  const models = Array.isArray(availableModels) ? availableModels : [];
  const currentModel = models.find((m: any) => m.id === selectedModel);

  const getModelIcon = (modelId: string) => {
    if (modelId?.includes("gemini")) return <Zap className="w-4 h-4" />;
    if (modelId?.includes("deepseek")) return <Cpu className="w-4 h-4" />;
    if (modelId?.includes("claude")) return <Brain className="w-4 h-4" />;
    if (modelId?.includes("gpt")) return <Bot className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  const getModelColor = (modelId: string) => {
    if (modelId?.includes("gemini"))
      return "from-blue-500/20 to-cyan-500/20 border-blue-500/30";
    if (modelId?.includes("deepseek"))
      return "from-purple-500/20 to-pink-500/20 border-purple-500/30";
    if (modelId?.includes("claude"))
      return "from-amber-500/20 to-orange-500/20 border-amber-500/30";
    if (modelId?.includes("gpt"))
      return "from-emerald-500/20 to-teal-500/20 border-emerald-500/30";
    return "from-white/20 to-white/10 border-white/20";
  };

  if (models.length === 0) {
    return (
      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
        <span className="text-xs text-white/60">No models available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSending}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200",
          "bg-gradient-to-r border text-sm font-medium",
          getModelColor(selectedModel),
          "hover:opacity-90 disabled:opacity-50",
        )}
      >
        {getModelIcon(selectedModel)}
        <span className="hidden sm:inline">
          {currentModel?.tempName || "Select Model"}
        </span>
        <span className="sm:hidden">
          {currentModel?.tempName?.split(" ")[0] || "Model"}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full mt-2 right-0 w-65 sm:w-80 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-50"
            >
              <div className="p-2">
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Available Models
                  </p>
                  {isSignedIn && (
                    <p className="text-[10px] text-green-400/60 mt-1">
                      ✓ Premium models unlocked
                    </p>
                  )}
                </div>

                <div className="space-y-1 max-h-[550px] overflow-y-auto">
                  {models.map((model: any) => {
                    const isPremium = !model.isFree;
                    const isLocked = isPremium && !isSignedIn;
                    const isSelected = selectedModel === model.id;

                    return (
                      <button
                        key={model.id}
                        onClick={() => {
                          if (!isLocked) {
                            changeModel(model.id);
                            setIsOpen(false);
                          }
                        }}
                        disabled={isLocked}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg transition-all duration-200",
                          isSelected
                            ? "bg-white/10 border border-white/20"
                            : "hover:bg-white/5",
                          isLocked && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getModelIcon(model.id)}
                              <span className="font-medium text-sm text-white">
                                {model.tempName}
                              </span>
                              {isPremium && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
                                  PREMIUM
                                </span>
                              )}
                              {isSelected && (
                                <Check className="w-3 h-3 text-green-400 ml-auto" />
                              )}
                            </div>

                            <p className="text-xs text-white/40 mb-1">
                              {model.description}
                            </p>

                            <div className="flex items-center gap-2 text-[10px] text-white/30">
                              <span>
                                {Math.round(model.contextLength / 1000)}k
                                context
                              </span>
                              {model.capabilities && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {model.capabilities.slice(0, 2).join(", ")}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {isLocked && (
                            <Lock className="w-3 h-3 text-white/40 ml-2 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!isSignedIn && (
                  <div className="mt-2 pt-2 border-t border-white/10 px-3 py-2">
                    <p className="text-xs text-white/40 text-center">
                      🔒 Sign in to unlock EduDev AI Most Powerfull & Fastest Model
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelSelector;
