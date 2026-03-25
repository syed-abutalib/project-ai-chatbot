// lib/superbase/chat-service.ts
import { createClient } from "./superbase";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
  files?: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Chat {
  id: string;
  user_id: string | null;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

const supabase = createClient();

export const chatService = {
  // Upload file to Supabase Storage
  async uploadFile(file: File, userId: string): Promise<UploadedFile> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = fileName;

    const { data, error } = await supabase.storage
      .from("chat-files")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("chat-files").getPublicUrl(filePath);

    return {
      id: crypto.randomUUID(),
      name: file.name,
      url: publicUrl,
      type: file.type,
      size: file.size,
    };
  },

  // Get all chats for a user
  async getUserChats(userId: string | null): Promise<Chat[]> {
    if (!userId) {
      const localChats = localStorage.getItem("chats");
      return localChats ? JSON.parse(localChats) : [];
    }

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching chats:", error);
      throw error;
    }

    return data || [];
  },

  // Create a new chat
  async createChat(userId: string | null, modelId?: string): Promise<Chat> {
    const newChat = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: "New Chat",
      messages: [],
      model_used: modelId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!userId) {
      const existingChats = localStorage.getItem("chats");
      const chats = existingChats ? JSON.parse(existingChats) : [];
      chats.unshift(newChat);
      localStorage.setItem("chats", JSON.stringify(chats));
      return newChat;
    }

    const { data, error } = await supabase
      .from("chats")
      .insert([newChat])
      .select()
      .single();

    if (error) {
      console.error("Error creating chat:", error);
      throw error;
    }

    return data;
  },

  async updateChatModel(
    chatId: string,
    userId: string | null,
    modelId: string,
  ): Promise<void> {
    if (!userId) {
      const existingChats = localStorage.getItem("chats");
      if (existingChats) {
        const chats = JSON.parse(existingChats);
        const updatedChats = chats.map((chat: Chat) =>
          chat.id === chatId ? { ...chat, model_used: modelId } : chat,
        );
        localStorage.setItem("chats", JSON.stringify(updatedChats));
      }
      return;
    }

    const { error } = await supabase
      .from("chats")
      .update({
        model_used: modelId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating chat model:", error);
      throw error;
    }
  },

  // Update chat messages
  async updateChatMessages(
    chatId: string,
    userId: string | null,
    messages: Message[],
  ): Promise<void> {
    if (!userId) {
      const existingChats = localStorage.getItem("chats");
      if (existingChats) {
        const chats = JSON.parse(existingChats);
        const updatedChats = chats.map((chat: Chat) =>
          chat.id === chatId
            ? { ...chat, messages, updated_at: new Date().toISOString() }
            : chat,
        );
        localStorage.setItem("chats", JSON.stringify(updatedChats));
      }
      return;
    }

    const { error } = await supabase
      .from("chats")
      .update({
        messages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating chat:", error);
      throw error;
    }
  },

  // Update chat title
  async updateChatTitle(
    chatId: string,
    userId: string | null,
    title: string,
  ): Promise<void> {
    if (!userId) {
      const existingChats = localStorage.getItem("chats");
      if (existingChats) {
        const chats = JSON.parse(existingChats);
        const updatedChats = chats.map((chat: Chat) =>
          chat.id === chatId ? { ...chat, title } : chat,
        );
        localStorage.setItem("chats", JSON.stringify(updatedChats));
      }
      return;
    }

    const { error } = await supabase
      .from("chats")
      .update({
        title,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating chat title:", error);
      throw error;
    }
  },

  // Delete a chat
  async deleteChat(chatId: string, userId: string | null): Promise<void> {
    if (!userId) {
      const existingChats = localStorage.getItem("chats");
      if (existingChats) {
        const chats = JSON.parse(existingChats);
        const updatedChats = chats.filter((chat: Chat) => chat.id !== chatId);
        localStorage.setItem("chats", JSON.stringify(updatedChats));
      }
      return;
    }

    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("id", chatId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting chat:", error);
      throw error;
    }
  },
};
