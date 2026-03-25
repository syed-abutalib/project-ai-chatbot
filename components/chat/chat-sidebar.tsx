// components/ChatBot.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Menu,
  Sparkles,
  Loader2,
  X,
  RefreshCw,
  MoveLeft,
  Paperclip,
  Image as ImageIcon,
  File,
  Plus,
  Trash2,
  Edit2,
  MoreVertical,
  Check,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useUser, UserButton, Show } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import MarkdownMessage from "./markdown-message";
import {
  chatService,
  Message,
  Chat,
  UploadedFile,
} from "@/lib/superbase/chat-service";

interface FileWithPreview extends UploadedFile {
  preview?: string;
  uploading?: boolean;
}

// Animation variants
const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: custom * 0.05,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

const sidebarVariants = {
  open: {
    width: 280,
    transition: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] },
  },
  closed: {
    width: 0,
    transition: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] },
  },
  mobileOpen: {
    x: 0,
    transition: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] },
  },
  mobileClosed: {
    x: "-100%",
    transition: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function ChatBot() {
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chats
  useEffect(() => {
    loadChats();
  }, [isSignedIn, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [selectedFiles]);

  const loadChats = async () => {
    try {
      const userId = isSignedIn ? user?.id || null : null;
      const loadedChats = await chatService.getUserChats(userId);
      setChats(loadedChats);

      if (loadedChats.length > 0 && !currentChatId) {
        const mostRecent = loadedChats[0];
        setCurrentChatId(mostRecent.id);
        setMessages(mostRecent.messages || []);
      } else if (loadedChats.length === 0) {
        createNewChat();
      }
    } catch (err) {
      console.error("Error loading chats:", err);
      setError("Failed to load chats");
    }
  };

  const createNewChat = async () => {
    try {
      const userId = isSignedIn ? user?.id || null : null;
      const newChat = await chatService.createChat(userId);
      setChats([newChat, ...chats]);
      setCurrentChatId(newChat.id);
      setMessages([]);
      setIsSidebarOpen(false);
      setIsMobileSidebarOpen(false);
      setError(null);
    } catch (err) {
      console.error("Error creating chat:", err);
      setError("Failed to create new chat");
    }
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages || []);
      setError(null);
      setIsMobileSidebarOpen(false);
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const userId = isSignedIn ? user?.id || null : null;
      await chatService.deleteChat(chatId, userId);

      const updatedChats = chats.filter((c) => c.id !== chatId);
      setChats(updatedChats);

      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].id);
          setMessages(updatedChats[0].messages || []);
        } else {
          createNewChat();
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
      setChats(
        chats.map((chat) =>
          chat.id === chatId ? { ...chat, title: newTitle.trim() } : chat,
        ),
      );
    } catch (err) {
      console.error("Error renaming chat:", err);
      setError("Failed to rename chat");
    } finally {
      setEditingChatId(null);
      setEditTitle("");
    }
  };

  const updateChatMessages = async (chatId: string, newMessages: Message[]) => {
    try {
      const userId = isSignedIn ? user?.id || null : null;
      await chatService.updateChatMessages(chatId, userId, newMessages);

      setChats(
        chats.map((chat) =>
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: FileWithPreview[] = [];

    for (const file of files) {
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined;
      newFiles.push({
        id: crypto.randomUUID(),
        name: file.name,
        url: "",
        type: file.type,
        size: file.size,
        preview,
        uploading: true,
      });
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    for (const file of newFiles) {
      try {
        const uploadedFile = await chatService.uploadFile(
          files.find((f) => f.name === file.name)!,
          user?.id || "guest",
        );

        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...uploadedFile, preview: file.preview, uploading: false }
              : f,
          ),
        );
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("Failed to upload file");
        setSelectedFiles((prev) => prev.filter((f) => f.id !== file.id));
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (fileId: string) => {
    const file = selectedFiles.find((f) => f.id === fileId);
    if (file?.preview) URL.revokeObjectURL(file.preview);
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const sendMessage = async () => {
    if (
      (!input.trim() &&
        selectedFiles.filter((f) => !f.uploading).length === 0) ||
      isSending
    )
      return;

    setIsSending(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input || "[File uploaded]",
      timestamp: new Date(),
      files: selectedFiles.filter((f) => !f.uploading),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setSelectedFiles([]);

    if (currentChatId) {
      await updateChatMessages(currentChatId, updatedMessages);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
            files: m.files,
          })),
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

      if (currentChatId) {
        await updateChatMessages(currentChatId, finalMessages);
      }

      if (updatedMessages.length === 1 && currentChatId) {
        const currentChat = chats.find((c) => c.id === currentChatId);
        if (currentChat?.title === "New Chat") {
          const newTitle =
            input.slice(0, 30) + (input.length > 30 ? "..." : "");
          const userId = isSignedIn ? user?.id || null : null;
          await chatService.updateChatTitle(currentChatId, userId, newTitle);

          setChats(
            chats.map((chat) =>
              chat.id === currentChatId ? { ...chat, title: newTitle } : chat,
            ),
          );
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.",
      );

      setMessages(messages);
      if (currentChatId) {
        await updateChatMessages(currentChatId, messages);
      }
    } finally {
      setIsSending(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const currentChat = chats.find((c) => c.id === currentChatId);

  return (
    <div className="flex h-screen bg-black">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        className="hidden lg:block fixed left-0 top-0 h-full bg-black/50 backdrop-blur-xl border-r border-white/10 z-50"
      >
        <SidebarContent
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
          onCreateNewChat={createNewChat}
          editingChatId={editingChatId}
          setEditingChatId={setEditingChatId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </motion.aside>

      <motion.aside
        variants={sidebarVariants}
        initial="mobileClosed"
        animate={isMobileSidebarOpen ? "mobileOpen" : "mobileClosed"}
        className="fixed left-0 top-0 h-full w-[280px] bg-black/95 backdrop-blur-xl border-r border-white/10 z-50 lg:hidden"
      >
        <SidebarContent
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
          onCreateNewChat={createNewChat}
          editingChatId={editingChatId}
          setEditingChatId={setEditingChatId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          isSidebarOpen={true}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobile
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </motion.aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-[280px] transition-all duration-300 overflow-y-auto">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-10 bg-black/50 backdrop-blur-xl border-b border-white/10"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden text-white/60 hover:text-white hover:bg-white/10"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.4 }}
                  className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                </motion.div>
                <div>
                  <h1 className="font-semibold text-white text-sm">
                    AI ChatBot
                  </h1>
                  <p className="text-xs text-white/40">
                    {currentChat?.title === "New Chat"
                      ? "New Conversation"
                      : currentChat?.title || "Ready to help"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-white/5 border-white/10 text-white/60 text-xs"
              >
                Auto Model
              </Badge>
              <Show when="signed-in">
                <UserButton afterSignOutUrl="/" />
              </Show>
              <Show when="signed-out">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </Show>
            </div>
          </div>
        </motion.header>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto py-8 px-4">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-center min-h-[60vh] text-center"
                >
                  <div>
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center"
                    >
                      <Sparkles className="w-8 h-8 text-white/40" />
                    </motion.div>
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      Welcome to AI ChatBot
                    </h2>
                    <p className="text-white/60 max-w-md">
                      Start a conversation by typing a message below
                    </p>
                    <p className="text-xs text-white/40 mt-4 flex items-center justify-center gap-1">
                      <Paperclip className="w-3 h-3" />
                      Attach images and files
                    </p>
                    {!isSignedIn && (
                      <p className="text-xs text-white/40 mt-2">
                        💡 Sign in to save your chats permanently
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    custom={index}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`flex gap-3 mb-6 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 relative group",
                        message.role === "user"
                          ? "bg-white text-black"
                          : "bg-white/5 border border-white/10 text-white",
                      )}
                    >
                      {/* Message Content with Markdown */}
                      <MarkdownMessage
                        content={message.content}
                        role={message.role}
                      />

                      {/* Files */}
                      {message.files && message.files.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.files.map((file) => (
                            <a
                              key={file.id}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2 py-1 bg-black/5 dark:bg-white/10 rounded-lg text-xs hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                            >
                              {file.type.startsWith("image/") ? (
                                <ImageIcon className="w-3 h-3" />
                              ) : (
                                <File className="w-3 h-3" />
                              )}
                              <span className="max-w-[150px] truncate">
                                {file.name}
                              </span>
                              <span className="text-white/40">
                                ({formatFileSize(file.size)})
                              </span>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Message Actions */}
                      <div
                        className={cn(
                          "flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start",
                        )}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  copyToClipboard(message.content, message.id)
                                }
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {message.role === "assistant" && (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Good response</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                  >
                                    <ThumbsDown className="w-3 h-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Bad response</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        )}
                      </div>

                      <span className="text-[10px] text-white/40 mt-1 block">
                        {formatTime(message.timestamp)}
                        {message.model && (
                          <span className="ml-1">
                            • {message.model.split("/").pop()}
                          </span>
                        )}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Typing Indicator */}
              {isSending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{
                            y: [0, -5, 0],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          className="w-1.5 h-1.5 bg-white/40 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-red-400 mb-2">{error}</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => sendMessage()}
                          className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry
                        </Button>
                        <Button
                          onClick={() => setError(null)}
                          variant="ghost"
                          className="text-xs px-3 py-1 text-white/60 hover:text-white"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-t border-white/10 bg-gradient-to-t from-black via-black to-transparent pt-4"
        >
          <div className="max-w-3xl mx-auto px-4 pb-4">
            {/* File Previews */}
            <AnimatePresence>
              {selectedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-wrap gap-2 mb-3"
                >
                  {selectedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="relative group flex items-center gap-2 px-2 py-1 bg-white/10 rounded-lg text-sm"
                    >
                      {file.type.startsWith("image/") && file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : file.type.startsWith("image/") ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <File className="w-4 h-4" />
                      )}
                      <span className="max-w-[150px] truncate text-white/80">
                        {file.name}
                      </span>
                      <span className="text-xs text-white/40">
                        {formatFileSize(file.size)}
                      </span>
                      {file.uploading && (
                        <Loader2 className="w-3 h-3 animate-spin text-white/40" />
                      )}
                      {!file.uploading && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Message AI ChatBot... (Shift + Enter for new line)"
                className="min-h-[60px] max-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl resize-none focus:border-white/20 focus:ring-0 pr-24"
                rows={1}
                disabled={isSending}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending}
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Attach files</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={sendMessage}
                        disabled={
                          (!input.trim() &&
                            selectedFiles.filter((f) => !f.uploading).length ===
                              0) ||
                          isSending
                        }
                        size="icon"
                        className={cn(
                          "transition-all duration-200",
                          (input.trim() ||
                            selectedFiles.filter((f) => !f.uploading).length >
                              0) &&
                            !isSending
                            ? "bg-white text-black hover:bg-white/90"
                            : "bg-white/10 text-white/30 cursor-not-allowed",
                        )}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
              onChange={handleFileSelect}
              className="hidden"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-white/30 text-center mt-2"
            >
              OpenRouter AI • Auto-selects best available model • Supports
              images and files
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Sidebar Content Component
function SidebarContent({
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onCreateNewChat,
  editingChatId,
  setEditingChatId,
  editTitle,
  setEditTitle,
  isSidebarOpen,
  setIsSidebarOpen,
  isMobile = false,
  onClose,
}: any) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  const groupedChats = chats.reduce((groups: any, chat: Chat) => {
    const date = formatDate(chat.created_at);
    if (!groups[date]) groups[date] = [];
    groups[date].push(chat);
    return groups;
  }, {});

  const handleRename = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
  };

  const saveRename = (chatId: string) => {
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle);
    }
    setEditingChatId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <span className="font-bold text-white">AI ChatBot</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCreateNewChat}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreateNewChat}
              className="w-full text-white/60 hover:text-white hover:bg-white/10"
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div className="p-4">
          <Button
            onClick={onCreateNewChat}
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl py-5"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(groupedChats).map(
            ([date, dateChats]: [string, any]) => (
              <div key={date}>
                {isSidebarOpen && (
                  <h3 className="text-xs font-medium text-white/40 mb-2 px-2">
                    {date}
                  </h3>
                )}
                <div className="space-y-1">
                  {dateChats.map((chat: Chat) => (
                    <div key={chat.id} className="relative group">
                      {editingChatId === chat.id ? (
                        <div className="px-2 py-1">
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => saveRename(chat.id)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && saveRename(chat.id)
                            }
                            className="w-full h-8 px-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => onSelectChat(chat.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                            currentChatId === chat.id
                              ? "bg-white/10 text-white"
                              : "text-white/60 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <div className="w-5 h-5 flex-shrink-0">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className="w-4 h-4"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                          </div>
                          {isSidebarOpen && (
                            <>
                              <span className="text-sm truncate flex-1 text-left">
                                {chat.title}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-black border-white/10"
                                >
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRename(chat.id, chat.title)
                                    }
                                    className="text-white/80 hover:text-white"
                                  >
                                    <Edit2 className="w-3 h-3 mr-2" />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => onDeleteChat(chat.id, e)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="w-3 h-3 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </ScrollArea>

      {isSidebarOpen && (
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => (window.location.href = "/")}
          >
            <MoveLeft className="w-4 h-4 mr-2" />
            Back To Home
          </Button>
        </div>
      )}
    </div>
  );
}
