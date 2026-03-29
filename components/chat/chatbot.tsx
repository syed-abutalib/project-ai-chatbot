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
} from "lucide-react";
import { useUser, UserButton, Show, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import MarkdownMessage from "./markdown-message";
import { useChat } from "@/contexts/chat-context";
import { chatService, UploadedFile } from "@/lib/superbase/chat-service";
import ModelSelector from "./model-selector";

interface FileWithPreview extends UploadedFile {
  preview?: string;
  uploading?: boolean;
}

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
  const {
    messages,
    chats,
    currentChat,
    currentChatId,
    isSending,
    error,
    isSidebarOpen,
    isMobileSidebarOpen,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
    setIsSidebarOpen,
    setIsMobileSidebarOpen,
    clearError,
  } = useChat();

  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [selectedFiles]);

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

  const handleSendMessage = async () => {
    if (
      (!input.trim() &&
        selectedFiles.filter((f) => !f.uploading).length === 0) ||
      isSending
    )
      return;

    const filesToSend = selectedFiles.filter((f) => !f.uploading);
    const messageContent = input;

    setInput("");
    setSelectedFiles([]);

    await sendMessage(messageContent, filesToSend);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleRename = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
  };

  const saveRename = (chatId: string) => {
    if (editTitle.trim()) {
      renameChat(chatId, editTitle);
    }
    setEditingChatId(null);
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
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
        className="hidden lg:block fixed left-0 top-0 h-full bg-black/50 backdrop-blur-xl border-r border-white/10 z-50 overflow-y-auto"
      >
        <SidebarContent
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onRenameChat={handleRename}
          onCreateNewChat={createNewChat}
          editingChatId={editingChatId}
          setEditingChatId={setEditingChatId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          saveRename={saveRename}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </motion.aside>

      <motion.aside
        variants={sidebarVariants}
        initial="mobileClosed"
        animate={isMobileSidebarOpen ? "mobileOpen" : "mobileClosed"}
        className="fixed left-0 top-0 h-full w-[280px] bg-black/95 backdrop-blur-xl border-r border-white/10 z-50 lg:hidden overflow-y-scroll"
      >
        <SidebarContent
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onRenameChat={handleRename}
          onCreateNewChat={createNewChat}
          editingChatId={editingChatId}
          setEditingChatId={setEditingChatId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          saveRename={saveRename}
          isSidebarOpen={true}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobile
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </motion.aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-[280px] transition-all duration-300 h-full overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-shrink-0 z-10 bg-black/50 backdrop-blur-xl border-b border-white/10"
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
                {/* <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.4 }}
                  className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                </motion.div> */}
                <div>
                  <h1 className="font-semibold text-white text-sm">
                    EduDev AI
                  </h1>
                  <p className="text-xs text-white/40">
                    {currentChat?.title === "New Chat" || !currentChat
                      ? "New Conversation"
                      : currentChat?.title}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModelSelector />
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
                  <SignInButton mode="modal" />
                </Button>
              </Show>
            </div>
          </div>
        </motion.header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-3xl mx-auto py-8 px-4">
            <AnimatePresence mode="wait">
              {/* Show welcome message only when messages array is empty */}
              {messages.length === 0 ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-center min-h-[60vh] text-center"
                >
                  <div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
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
                      Welcome to EDU-DEV AI
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
                // Messages list - only show when there are messages
                <motion.div
                  key="messages"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      custom={index}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className={`flex gap-3 mb-6 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-3 relative group",
                          message.role === "user"
                            ? "bg-white/15 text-white"
                            : "bg-white/3 border border-white/10 text-white",
                        )}
                      >
                        <MarkdownMessage
                          content={message.content}
                          role={message.role}
                          onCopyCode={(code) => {
                            navigator.clipboard.writeText(code);
                            setCopiedMessageId(`code-${Date.now()}`);
                            setTimeout(() => setCopiedMessageId(null), 2000);
                          }}
                        />

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
                              <TooltipContent>Copy message</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <span className="text-[10px] text-white/40 mt-1 block">
                          {formatTime(message.timestamp)}
                          {/* {message.model && (
                            <span className="ml-1">
                              • {message.model.split("/").pop()}
                            </span>
                          )} */}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Typing Indicator - always shows when sending */}
              {isSending && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
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
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-red-400 mb-2">{error}</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSendMessage}
                          className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                        <Button
                          onClick={clearError}
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
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0 border-t border-white/10 bg-gradient-to-t from-black via-black to-transparent pt-4"
        >
          <div className="max-w-3xl mx-auto px-4 pb-4">
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
                        onClick={handleSendMessage}
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
              className="text-xs text-white/30 text-center mt-2"
            >
              EduDev AI can make mistakes. Check important info.
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
  editTitle,
  setEditTitle,
  saveRename,
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                {/* <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div> */}
                <span className="font-bold text-white">EDUDEV</span>
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
        <div className="p-4 flex-shrink-0">
          <Button
            onClick={onCreateNewChat}
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl py-5"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0">
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
                                      onRenameChat(chat.id, chat.title)
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
      </div>

      {isSidebarOpen && (
        <div className="p-4 border-t border-white/10 flex-shrink-0">
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
