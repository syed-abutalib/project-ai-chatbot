// components/chat/file-preview.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, File, Image as ImageIcon, FileText, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilePreviewProps {
  file: {
    id: string;
    filename: string;
    url: string;
    mediaType: string;
  };
  onRemove: (id: string) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  const isImage = file.mediaType.startsWith("image/");

  const getFileIcon = () => {
    if (isImage) return <ImageIcon className="w-4 h-4" />;
    if (file.mediaType.includes("pdf")) return <FileText className="w-4 h-4" />;
    if (file.mediaType.includes("text"))
      return <FileText className="w-4 h-4" />;
    if (
      file.mediaType.includes("code") ||
      file.filename.endsWith(".js") ||
      file.filename.endsWith(".ts")
    )
      return <FileCode className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "relative group rounded-lg overflow-hidden",
        isImage ? "w-20 h-20" : "w-auto",
      )}
    >
      {isImage ? (
        <div className="relative w-full h-full">
          <img
            src={file.url}
            alt={file.filename}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
          {getFileIcon()}
          <span className="text-xs text-white/60 truncate max-w-[100px]">
            {file.filename}
          </span>
        </div>
      )}

      <Button
        size="icon"
        variant="ghost"
        onClick={() => onRemove(file.id)}
        className={cn(
          "absolute transition-all",
          isImage
            ? "top-1 right-1 w-6 h-6 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100"
            : "-top-2 -right-2 w-5 h-5 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white rounded-full",
        )}
      >
        <X className="w-3 h-3" />
      </Button>
    </motion.div>
  );
};

export default FilePreview;
