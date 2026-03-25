// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { messages } = await req.json();

//     if (!messages || !Array.isArray(messages)) {
//       return NextResponse.json(
//         { error: "Invalid messages format" },
//         { status: 400 },
//       );
//     }

//     const apiKey = process.env.OPENROUTER_API_KEY;
//     if (!apiKey) {
//       console.error("OPENROUTER_API_KEY not configured");
//       return NextResponse.json(
//         { error: "API configuration error" },
//         { status: 500 },
//       );
//     }

//     // Format messages for OpenRouter, including file information
//     const formattedMessages = messages.map((m: any) => {
//       let content = m.content;

//       // If there are files, add them to the content
//       if (m.files && m.files.length > 0) {
//         const fileDescriptions = m.files
//           .map((file: any) => {
//             if (file.type.startsWith("image/")) {
//               return `[Image: ${file.name} - ${Math.round(file.size / 1024)}KB]`;
//             }
//             return `[File: ${file.name} (${Math.round(file.size / 1024)}KB)]`;
//           })
//           .join("\n");

//         content = `${content}\n\nAttached files:\n${fileDescriptions}`;
//       }

//       return {
//         role: m.role,
//         content: content,
//       };
//     });

//     const response = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Access-Control-Allow-Origin": "*",

//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//           "HTTP-Referer":
//             process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
//           "X-Title": "AI ChatBot",
//         },
//         body: JSON.stringify({
//           messages: formattedMessages,
//           temperature: 0.7,
//           max_tokens: 2000,
//           model: "auto",
//         }),
//       },
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("OpenRouter error:", errorText);

//       return NextResponse.json(
//         { error: "Service temporarily busy. Please try again." },
//         { status: response.status },
//       );
//     }

//     const data = await response.json();
//     const content = data.choices?.[0]?.message?.content;
//     const modelUsed = data.model;

//     if (!content) {
//       return NextResponse.json(
//         { error: "No response from AI" },
//         { status: 500 },
//       );
//     }

//     return NextResponse.json({
//       content: content,
//       model: modelUsed,
//     });
//   } catch (error) {
//     console.error("Chat API error:", error);
//     return NextResponse.json(
//       { error: "Internal server error. Please try again." },
//       { status: 500 },
//     );
//   }
// }

// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    console.log("📨 Received request:", {
      model,
      messagesCount: messages?.length,
    });

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("❌ OPENROUTER_API_KEY not configured");
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 },
      );
    }

    // Determine which model to use
    let modelToUse = model;

    // If model is 'auto', let OpenRouter auto-select
    if (modelToUse === "auto") {
      console.log("🚀 Using OpenRouter auto-selection");
    } else {
      console.log(`🚀 Using specific model: ${modelToUse}`);
    }

    // Prepare the request body
    const requestBody: any = {
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      model: 'auto',
      temperature: 0.7,
      max_tokens: 2000,
    };

    // Only add model if it's not 'auto'
    if (modelToUse !== "auto") {
      requestBody.model = modelToUse;
    }

    console.log("📤 Sending to OpenRouter:", {
      hasModel: !!requestBody.model,
      model: requestBody.model || "auto",
      messagesCount: requestBody.messages.length,
    });

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "AI ChatBot",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ OpenRouter error response:", errorText);

      let errorMessage = "Service temporarily busy";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage =
          errorJson.error?.message || errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || `HTTP ${response.status}`;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const modelUsed = data.model || modelToUse || "auto-selected";

    if (!content) {
      console.error("❌ No content in OpenRouter response");
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 },
      );
    }

    console.log(`✅ Response received from model: ${modelUsed}`);

    return NextResponse.json({
      content: content,
      model: modelUsed,
    });
  } catch (error) {
    console.error("🔥 Chat API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

// const mod = " mistral-7b-instruct-v0.1";
