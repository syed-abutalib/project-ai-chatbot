// components/chat/upload-progress.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface UploadProgressProps {
  progress: number;
  filename: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  filename,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/5 border border-white/10 rounded-lg p-3 max-w-[250px]"
    >
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
        <span className="text-xs text-white/60 truncate flex-1">
          {filename}
        </span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-white/60"
        />
      </div>
    </motion.div>
  );
};

export default UploadProgress;
