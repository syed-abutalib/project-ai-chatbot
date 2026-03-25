// hooks/use-supabase-chat.ts
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Chat, Message, FileAttachment } from "@/types/database";
import { chatService } from "@/lib/superbase/chat-service";
import {
  getAvailableModels,
  getDefaultModel,
  getModelById,
} from "@/lib/models";

export const useSupabaseChat = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  // Available models based on auth status
  const availableModels = getAvailableModels(!!isSignedIn);

  // Set default model when auth status changes
  useEffect(() => {
    if (isLoaded) {
      setSelectedModel(getDefaultModel(!!isSignedIn));
    }
  }, [isLoaded, isSignedIn]);

  // Load chats when user is authenticated
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      loadChats();
    } else if (isLoaded && !isSignedIn) {
      // Clear chats when user signs out
      setChats([]);
      setCurrentChatId(null);
    }
  }, [isLoaded, isSignedIn, user]);

  const loadChats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userChats = await chatService.getChats(user.id);
      setChats(userChats);

      if (userChats.length > 0 && !currentChatId) {
        setCurrentChatId(userChats[0].id);
        // Set model from the first chat
        if (userChats[0].model_used) {
          setSelectedModel(userChats[0].model_used);
        }
      }
    } catch (err) {
      console.error("Error loading chats:", err);
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setIsLoading(false);
    }
  };

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  // hooks/use-supabase-chat.ts (updated sendMessage function)
  const sendMessage = useCallback(
    async (content: string, files?: FileAttachment[]) => {
      if (!isSignedIn || !user) {
        setError("You must be logged in to send messages");
        return;
      }

      if (!currentChatId) {
        setError("No active chat selected");
        return;
      }

      if (!content.trim() && (!files || files.length === 0)) {
        return;
      }

      setIsSending(true);
      setError(null);

      try {
        // Add user message
        const userMessage = await chatService.addMessage(
          currentChatId,
          "user",
          content,
          files?.map((f) => ({
            filename: f.filename,
            url: f.url,
            mediaType: f.mediaType,
            size: f.size,
          })),
        );

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? { ...chat, messages: [...chat.messages, userMessage] }
              : chat,
          ),
        );

        // Get current model for this chat
        const chatModel = currentChat?.model_used || selectedModel;

        console.log("📤 Sending message with model:", chatModel);

        // Call API for AI response
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, { role: "user", content }].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            model: chatModel,
          }),
        });

        console.log("📥 API response status:", response.status);

        if (!response.ok) {
          let errorMessage = `API error: ${response.status}`;

          try {
            const errorData = await response.json();
            console.error("❌ API error details:", errorData);
            errorMessage = errorData.error || errorMessage;

            // Handle specific errors
            if (response.status === 401 && errorData.requiresAuth) {
              errorMessage = "Please sign in to use this model";
            } else if (response.status === 403 && errorData.requiresUpgrade) {
              errorMessage = "Premium subscription required for this model";
            }
          } catch (e) {
            console.error("Failed to parse error response:", e);
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("✅ Received AI response:", {
          contentLength: data.content?.length,
          model: data.model,
        });

        const aiContent = data.content;

        if (aiContent) {
          // Add AI response
          const aiMessage = await chatService.addMessage(
            currentChatId,
            "assistant",
            aiContent,
          );

          setChats((prev) =>
            prev.map((chat) =>
              chat.id === currentChatId
                ? { ...chat, messages: [...chat.messages, aiMessage] }
                : chat,
            ),
          );

          // Update chat title if it's the first user message
          if (messages.length === 1 && currentChat?.title === "New Chat") {
            const title =
              content.length > 30 ? content.substring(0, 30) + "..." : content;

            await chatService.updateChatTitle(currentChatId, title);
            setChats((prev) =>
              prev.map((chat) =>
                chat.id === currentChatId ? { ...chat, title } : chat,
              ),
            );
          }
        } else {
          throw new Error("No response content from AI");
        }
      } catch (err) {
        console.error("🔥 Error sending message:", err);
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setIsSending(false);
      }
    },
    [currentChatId, messages, isSignedIn, user, selectedModel, currentChat],
  );

  const createNewChat = useCallback(async () => {
    if (!isSignedIn || !user) {
      setError("You must be logged in to create a chat");
      return;
    }

    try {
      setIsLoading(true);
      const newChat = await chatService.createChat(user.id, selectedModel);
      setChats((prev) => [{ ...newChat, messages: [] }, ...prev]);
      setCurrentChatId(newChat.id);
      setIsMobileSidebarOpen(false);
    } catch (err) {
      console.error("Error creating chat:", err);
      setError(err instanceof Error ? err.message : "Failed to create chat");
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, user, selectedModel]);

  const selectChat = useCallback(
    (chatId: string) => {
      const chat = chats.find((c) => c.id === chatId);
      if (chat && chat.model_used) {
        setSelectedModel(chat.model_used);
      }
      setCurrentChatId(chatId);
      setIsMobileSidebarOpen(false);
    },
    [chats],
  );

  const deleteChat = useCallback(
    async (chatId: string) => {
      try {
        setIsLoading(true);
        await chatService.deleteChat(chatId);
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));

        if (currentChatId === chatId) {
          const remainingChats = chats.filter((chat) => chat.id !== chatId);
          setCurrentChatId(remainingChats[0]?.id || null);
          if (remainingChats[0]?.model_used) {
            setSelectedModel(remainingChats[0].model_used);
          }
        }
      } catch (err) {
        console.error("Error deleting chat:", err);
        setError(err instanceof Error ? err.message : "Failed to delete chat");
      } finally {
        setIsLoading(false);
      }
    },
    [currentChatId, chats],
  );

  const renameChat = useCallback(async (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    try {
      await chatService.updateChatTitle(chatId, newTitle.trim());
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: newTitle.trim() } : chat,
        ),
      );
    } catch (err) {
      console.error("Error renaming chat:", err);
      setError(err instanceof Error ? err.message : "Failed to rename chat");
    }
  }, []);

  const changeModel = useCallback(
    async (modelId: string) => {
      setSelectedModel(modelId);

      // Update current chat's model if exists
      if (currentChatId) {
        try {
          await chatService.updateChatModel(currentChatId, modelId);
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === currentChatId
                ? { ...chat, model_used: modelId }
                : chat,
            ),
          );
        } catch (err) {
          console.error("Error updating chat model:", err);
          setError(
            err instanceof Error ? err.message : "Failed to update model",
          );
        }
      }
    },
    [currentChatId],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    chats,
    currentChatId,
    messages,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
    changeModel,
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isLoading,
    isSending,
    error,
    clearError,
    isAuthenticated: isSignedIn,
    selectedModel,
    availableModels,
  };
};
