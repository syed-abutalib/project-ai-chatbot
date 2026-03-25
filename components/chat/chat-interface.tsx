// components/chat/chat-interface.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownMessage from "./markdown-message";
import ThinkingIndicator from "./thinking-indicator";
import {
  Send,
  Menu,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Check,
  Paperclip,
  X,
  Image as ImageIcon,
  File,
  Loader2,
} from "lucide-react";
import { useChat } from "@/contexts/chat-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import FilePreview from "./file-preview";
import UploadProgress from "./upload-progress";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import ChatHeader from "./chat-header";

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  url?: string;
}

const ChatInterface = () => {
  const { messages, sendMessage, currentChatId, setIsMobileSidebarOpen } =
    useChat();

  // State
  const [isThinking, setIsThinking] = useState(false);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<UploadingFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addFiles = (files: File[]) => {
    const newFiles = files.map((file) => ({
      id: nanoid(),
      file,
      progress: 0,
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Move from uploading to selected
        setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, progress: 100, url: URL.createObjectURL(f.file) }
              : f,
          ),
        );
      } else {
        setUploadingFiles((prev) => {
          const exists = prev.some((f) => f.id === fileId);
          if (!exists) {
            const file = selectedFiles.find((f) => f.id === fileId);
            if (file) return [...prev, { ...file, progress }];
          }
          return prev.map((f) => (f.id === fileId ? { ...f, progress } : f));
        });
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setSelectedFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.url) URL.revokeObjectURL(file.url);
      return prev.filter((f) => f.id !== fileId);
    });
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;

    const filesToSend = selectedFiles.map((f) => ({
      id: f.id,
      filename: f.file.name,
      url: f.url || "",
      mediaType: f.file.type,
    }));

    setInput("");
    setSelectedFiles([]);
    setIsThinking(true);

    try {
      await sendMessage(input, filesToSend);
    } finally {
      setIsThinking(false);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: custom * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    }),
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div
      className="flex flex-col h-full bg-black relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={dropZoneRef}
    >
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 border-2 border-dashed border-white/20 rounded-lg z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/60">Drop files anywhere to upload</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
        className="hidden"
      />

      {/* Header */}
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <div className="max-w-3xl mx-auto py-8 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  variants={messageVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={`flex gap-4 mb-6 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={cn(
                      "max-w-[85%] group",
                      message.role === "user" ? "order-1" : "order-2",
                    )}
                  >
                    {/* Message content with markdown */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "rounded-2xl px-5 py-3 relative overflow-hidden",
                        message.role === "user"
                          ? "bg-transparent "
                          : "bg-transparent from-black/10 to-black/20 text-white",
                      )}
                    >
                      {message.role === "assistant" && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-16 -translate-y-16" />
                        </>
                      )}
                      <div className="relative z-10">
                        <MarkdownMessage
                          content={message.content}
                          role={message.role}
                        />
                      </div>
                    </motion.div>

                    {/* File attachments in message */}
                    {message.files && message.files.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2 mt-2"
                      >
                        {message.files.map((file, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-white/5 border-white/10 text-white/60 hover:bg-white/10 transition-colors cursor-pointer"
                            onClick={() => window.open(file.url, "_blank")}
                          >
                            {file.mediaType.startsWith("image/") ? (
                              <ImageIcon className="w-3 h-3 mr-1" />
                            ) : (
                              <File className="w-3 h-3 mr-1" />
                            )}
                            {file.filename}
                          </Badge>
                        ))}
                      </motion.div>
                    )}

                    {/* Message actions */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className={cn(
                        "flex items-center gap-2 mt-1",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <span className="text-xs text-white/40">
                        {formatTime(message.timestamp)}
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          copyToClipboard(message.content, message.id)
                        }
                        className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </motion.button>

                      {message.role === "assistant" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </motion.button>
                        </>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Thinking indicator */}
            <ThinkingIndicator isVisible={isThinking} />
          </motion.div>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4"
                >
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
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border-t border-white/10 bg-gradient-to-t from-black via-black to-transparent pt-4"
      >
        <div className="max-w-3xl mx-auto px-4 pb-4">
          {/* File previews */}
          <AnimatePresence>
            {(selectedFiles.length > 0 || uploadingFiles.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap gap-2 mb-3"
              >
                {/* Uploading files */}
                {uploadingFiles.map((file) => (
                  <UploadProgress
                    key={file.id}
                    progress={file.progress}
                    filename={file.file.name}
                  />
                ))}

                {/* Selected files */}
                {selectedFiles.map((file) => (
                  <FilePreview
                    key={file.id}
                    file={{
                      id: file.id,
                      filename: file.file.name,
                      url: file.url || "",
                      mediaType: file.file.type,
                    }}
                    onRemove={removeFile}
                  />
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
              placeholder="Message SaaSFlow AI... (Shift + Enter for new line)"
              className="min-h-[60px] max-h-[200px] pr-24 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl resize-none focus:border-white/20 focus:ring-0 transition-all duration-200"
              rows={1}
            />

            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {/* File upload button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </motion.div>

              {/* Send button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() && selectedFiles.length === 0}
                  size="icon"
                  className={cn(
                    "transition-all duration-200",
                    input.trim() || selectedFiles.length > 0
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-white/10 text-white/30 cursor-not-allowed",
                  )}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-white/30 text-center mt-2"
          >
            SaaSFlow AI may produce inaccurate information. Consider checking
            important information.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInterface;
