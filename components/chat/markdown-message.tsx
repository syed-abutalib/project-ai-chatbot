// components/chat/markdown-message.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Sparkles, Check, Copy } from "lucide-react";
import CodeBlock from "./code-block";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarkdownMessageProps {
  content: string;
  role: "user" | "assistant";
  onCopyCode?: (code: string) => void;
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
  role,
  onCopyCode,
}) => {
  const [copiedCodeId, setCopiedCodeId] = React.useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    if (onCopyCode) {
      onCopyCode(code);
    } else {
      navigator.clipboard.writeText(code);
    }
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const codeString = String(children).replace(/\n$/, "");
      const codeId = Math.random().toString(36).substring(7);

      if (!inline && match) {
        return (
          <div className="relative group my-4">
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                      onClick={() => handleCopyCode(codeString, codeId)}
                    >
                      {copiedCodeId === codeId ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy code</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CodeBlock language={language} value={codeString} />
          </div>
        );
      }

      return (
        <code
          className={cn(
            "px-1.5 py-0.5 rounded-md text-sm font-mono",
            role === "assistant"
              ? "bg-white/10 text-white/80 border border-white/10"
              : "bg-black/10 text-black/80 border border-black/10",
          )}
          {...props}
        >
          {children}
        </code>
      );
    },
    pre({ children }: any) {
      return <div className="not-prose">{children}</div>;
    },
    h1({ children }: any) {
      return (
        <h1 className="text-2xl font-bold mt-6 mb-4 text-white">{children}</h1>
      );
    },
    h2({ children }: any) {
      return (
        <h2 className="text-xl font-bold mt-5 mb-3 text-white/90">
          {children}
        </h2>
      );
    },
    h3({ children }: any) {
      return (
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white/80">
          {children}
        </h3>
      );
    },
    p({ children }: any) {
      return (
        <p className="text-sm leading-relaxed mb-4 text-white/80">{children}</p>
      );
    },
    ul({ children }: any) {
      return (
        <ul className="list-disc list-inside mb-4 space-y-1 text-white/80">
          {children}
        </ul>
      );
    },
    ol({ children }: any) {
      return (
        <ol className="list-decimal list-inside mb-4 space-y-1 text-white/80">
          {children}
        </ol>
      );
    },
    li({ children }: any) {
      return <li className="text-sm leading-relaxed">{children}</li>;
    },
    blockquote({ children }: any) {
      return (
        <blockquote className="border-l-4 border-white/20 pl-4 py-2 my-4 bg-white/5 rounded-r-lg">
          <p className="text-sm italic text-white/60">{children}</p>
        </blockquote>
      );
    },
    a({ href, children }: any) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      );
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border border-white/10 rounded-lg">
            {children}
          </table>
        </div>
      );
    },
    th({ children }: any) {
      return (
        <th className="px-4 py-2 text-left text-sm font-medium text-white/80 bg-white/5 border-b border-white/10">
          {children}
        </th>
      );
    },
    td({ children }: any) {
      return (
        <td className="px-4 py-2 text-sm text-white/60 border-b border-white/10">
          {children}
        </td>
      );
    },
  };

  if (role === "assistant") {
    const hasCode = content.includes("```");

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-invert max-w-none"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>

        {hasCode && (
          <div className="mt-2 text-right">
            <span className="text-xs text-white/20 flex items-center justify-end gap-1">
              <Sparkles className="w-3 h-3" />
              Code formatted
            </span>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
  );
};

export default MarkdownMessage;
