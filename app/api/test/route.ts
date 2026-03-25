// app/api/models/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Check which API keys are configured server-side
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const hasDeepSeekKey = !!process.env.DEEPSEEK_API_KEY;

  return NextResponse.json({
    models: [
      {
        id: "auto",
        name: "Auto (Best Available)",
        provider: "OpenRouter",
        isAvailable: true,
      },
      {
        id: "google/gemini-pro",
        name: "Gemini Pro",
        provider: "Google",
        isAvailable: hasGeminiKey,
        requiresAuth: true,
      },
      {
        id: "deepseek/deepseek-chat",
        name: "DeepSeek Chat",
        provider: "DeepSeek",
        isAvailable: hasDeepSeekKey,
        requiresAuth: true,
      },
    ],
  });
}
