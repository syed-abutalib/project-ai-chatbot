"use client";

import React from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import { useChat } from "@/contexts/chat-context";
import { Button } from "@/components/ui/button";
import ModelSelector from "./model-selector";

const ChatHeader = () => {
  const { setIsMobileSidebarOpen, currentChatId, chats } = useChat();

  // Find the current chat using currentChatId
  const currentChat = chats.find((chat) => chat.id === currentChatId);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden text-white/60 hover:text-white hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Chat info */}
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            className="w-8 h-8 bg-gradient-to-br from-white to-white/80 rounded-lg flex items-center justify-center"
          >
            <Sparkles className="w-4 h-4 text-black" />
          </motion.div>

          <div>
            <h1 className="font-semibold text-white">
              {currentChat?.title === "New Chat"
                ? "New Conversation"
                : currentChat?.title || "SaaSFlow AI"}
            </h1>
            {currentChat?.model_used && (
              <p className="text-xs text-white/40">
                Using{" "}
                {currentChat.model_used.split("/").pop()?.replace(/-/g, " ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Model selector */}
      <ModelSelector />
    </motion.div>
  );
};

export default ChatHeader;
