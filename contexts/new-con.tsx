// contexts/chat-context.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useSupabaseChat } from "@/hooks/use-supabase-chat";
import { FileAttachment, Message, Chat } from "@/types/database";

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  messages: Message[];
  sendMessage: (content: string, files?: FileAttachment[]) => Promise<void>;
  createNewChat: () => Promise<void>;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  isAuthenticated: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const chat = useSupabaseChat();

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
