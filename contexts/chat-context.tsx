// contexts/chat-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useUser } from "@clerk/nextjs";
import {
  chatService,
  Message,
  Chat,
  UploadedFile,
} from "@/lib/superbase/chat-service";
import {
  getAvailableModels,
  getDefaultModel,
  getModelById,
} from "@/lib/models";

interface ChatContextType {
  messages: Message[];
  chats: Chat[];
  currentChatId: string | null;
  currentChat: Chat | null;
  isSending: boolean;
  error: string | null;
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  selectedModel: string;
  availableModels: any[];
  sendMessage: (content: string, files?: UploadedFile[]) => Promise<void>;
  createNewChat: () => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  changeModel: (modelId: string) => Promise<void>;
  setIsSidebarOpen: (open: boolean) => void;
  setIsMobileSidebarOpen: (open: boolean) => void;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");

  const currentChat = chats.find((c) => c.id === currentChatId) || null;

  // Get available models based on auth status
  const availableModels = useMemo(() => {
    const models = getAvailableModels(!!isSignedIn);
    console.log(
      "Available models for user:",
      isSignedIn ? "authenticated" : "guest",
      models,
    );
    return models;
  }, [isSignedIn]);

  // Also update the default model when auth changes
  useEffect(() => {
    if (isLoaded) {
      const defaultModel = getDefaultModel(!!isSignedIn);
      setSelectedModel(defaultModel);
      console.log("Default model set to:", defaultModel);
    }
  }, [isLoaded, isSignedIn]);

  // Load chats
  useEffect(() => {
    if (isLoaded) {
      loadChats();
    }
  }, [isSignedIn, user, isLoaded]);

  const loadChats = async () => {
    try {
      const userId = isSignedIn ? user?.id || null : null;
      const loadedChats = await chatService.getUserChats(userId);
      setChats(loadedChats);

      if (loadedChats.length > 0 && !currentChatId && !isInitialized) {
        setCurrentChatId(loadedChats[0].id);
        setMessages(loadedChats[0].messages || []);
        // Set model from the chat if available
        if (loadedChats[0].model_used) {
          setSelectedModel(loadedChats[0].model_used);
        }
      } else if (loadedChats.length === 0 && !isInitialized) {
        await createNewChat();
      }
      setIsInitialized(true);
    } catch (err) {
      console.error("Error loading chats:", err);
      setError("Failed to load chats");
    }
  };

  const createNewChat = async () => {
    try {
      const userId = isSignedIn ? user?.id || null : null;
      const newChat = await chatService.createChat(userId, selectedModel);
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error("Error creating chat:", err);
      setError("Failed to create new chat");
    }
  };

  const selectChat = async (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages || []);
      // Update selected model based on chat's model
      if (chat.model_used) {
        setSelectedModel(chat.model_used);
      }
      setError(null);
      setIsMobileSidebarOpen(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const userId = isSignedIn ? user?.id || null : null;
      await chatService.deleteChat(chatId, userId);

      const updatedChats = chats.filter((c) => c.id !== chatId);
      setChats(updatedChats);

      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].id);
          setMessages(updatedChats[0].messages || []);
          if (updatedChats[0].model_used) {
            setSelectedModel(updatedChats[0].model_used);
          }
        } else {
          await createNewChat();
        }
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      setError("Failed to delete chat");
    }
  };

  const renameChat = async (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      const userId = isSignedIn ? user?.id || null : null;
      await chatService.updateChatTitle(chatId, userId, newTitle.trim());
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: newTitle.trim() } : chat,
        ),
      );
    } catch (err) {
      console.error("Error renaming chat:", err);
      setError("Failed to rename chat");
    }
  };

  const changeModel = async (modelId: string) => {
    // Check if user has access to this model
    const model = getModelById(modelId);
    if (!isSignedIn && !model?.isFree) {
      setError("Please sign in to use premium models");
      return;
    }

    setSelectedModel(modelId);

    // Update current chat's model if exists
    if (currentChatId) {
      try {
        const userId = isSignedIn ? user?.id || null : null;
        await chatService.updateChatModel(currentChatId, userId, modelId);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId ? { ...chat, model_used: modelId } : chat,
          ),
        );
      } catch (err) {
        console.error("Error updating chat model:", err);
        setError("Failed to update model");
      }
    }
  };

  const updateChatMessages = async (chatId: string, newMessages: Message[]) => {
    try {
      const userId = isSignedIn ? user?.id || null : null;
      await chatService.updateChatMessages(chatId, userId, newMessages);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: newMessages,
                updated_at: new Date().toISOString(),
              }
            : chat,
        ),
      );
    } catch (err) {
      console.error("Error saving messages:", err);
      setError("Failed to save messages");
    }
  };

  const sendMessage = async (content: string, files?: UploadedFile[]) => {
    if (
      (!content.trim() && (!files || files.length === 0)) ||
      isSending ||
      !currentChatId
    )
      return;

    setIsSending(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content || "[File uploaded]",
      timestamp: new Date(),
      files: files || [],
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    await updateChatMessages(currentChatId, updatedMessages);

    try {
      // Get the model from current chat or use selected model
      const modelToUse = currentChat?.model_used || selectedModel || "auto";

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
            files: m.files,
          })),
          model: modelToUse,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
        model: data.model,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await updateChatMessages(currentChatId, finalMessages);

      // Update title on first message
      if (updatedMessages.length === 1) {
        const newTitle =
          content.slice(0, 30) + (content.length > 30 ? "..." : "");
        await renameChat(currentChatId, newTitle);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      setMessages(messages);
      await updateChatMessages(currentChatId, messages);
    } finally {
      setIsSending(false);
    }
  };

  const clearError = () => setError(null);

  const value: ChatContextType = {
    messages,
    chats,
    currentChatId,
    currentChat,
    isSending,
    error,
    isSidebarOpen,
    isMobileSidebarOpen,
    selectedModel,
    availableModels,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
    changeModel,
    setIsSidebarOpen,
    setIsMobileSidebarOpen,
    clearError,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
