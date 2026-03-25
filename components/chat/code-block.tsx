// components/chat/code-block.tsx
"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const detectLanguage = () => {
    if (language) return language;

    // Auto-detect common languages
    if (
      value.includes("def ") ||
      value.includes("import ") ||
      value.includes("print(")
    )
      return "python";
    if (
      value.includes("function ") ||
      value.includes("const ") ||
      value.includes("let ")
    )
      return "javascript";
    if (value.includes("public class") || value.includes("System.out"))
      return "java";
    if (value.includes("#include") || value.includes("std::")) return "cpp";
    if (value.includes("<!DOCTYPE")) return "html";
    if (value.includes("{") && value.includes("}") && value.includes(";"))
      return "css";
    return "text";
  };

  const detectedLang = detectLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/60 uppercase">
            {detectedLang}
          </span>
        </div>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={detectedLang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "rgba(0,0,0,0.5)",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        wrapLongLines={true}
      >
        {value}
      </SyntaxHighlighter>
    </motion.div>
  );
};

export default CodeBlock;
