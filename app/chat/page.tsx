
import React from "react";
import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatInterface from "@/components/chat/chat-interface";
import ChatBot from "@/components/chat/chatbot";
import { ChatProvider } from "@/contexts/chat-context";
import { Metadata } from "next";
// app/chat/page.ts
export const metadata: Metadata = {
  title: "EduDev AI Chat | Intelligent Coding & Learning Assistant",
  description:
    "Interact with EduDev's AI-powered chatbot for coding help, learning assistance, and educational guidance.",
  keywords: [
    "EduDev AI chat",
    "AI assistant",
    "coding help",
    "learning assistant",
    "chatbot",
  ],
  openGraph: {
    title: "EduDev AI Chat | Intelligent Coding & Learning Assistant",
    description:
      "Engage with EduDev's AI chatbot to boost your coding skills, get instant help, and explore educational insights.",
    url: "/chat",
    siteName: "EduDev",
    images: [
      {
        url: "/logo.png", // <-- your logo here
        width: 512,
        height: 512,
        alt: "EduDev Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduDev AI Chat | Intelligent Coding & Learning Assistant",
    description:
      "Get instant coding help, learning support, and AI guidance with EduDev's chatbot.",
    images: ["/logo.png"],
  },
};
export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatBot />
    </ChatProvider>
  );
}
