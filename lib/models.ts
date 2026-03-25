// lib/models.ts
export const AVAILABLE_MODELS = {
  // Always available (Free for everyone)
  always: [
    {
      id: "auto",
      name: "Auto (Best Available)",
      provider: "OpenRouter",
      tempName: "EduDev Open Source",
      description:
        "Automatically selects the best available model for your request",
      contextLength: 200000,
      isFree: true,
      isAuto: true,
    },
  ],

  // Premium models (Require authentication)
  premium: [
    {
      id: "google/gemini-2.5-flash",
      name: "Gemini Pro",
      provider: "Google",
      tempName: "EduDev 3.5 Model",
      description:
        "A top-tier model with excellent performance in reasoning, coding, and creative tasks. Delivers fast, accurate, and reliable results across a wide range of complex use cases.",
      contextLength: 32768,
      isFree: false,
      requiresAuth: true,
      capabilities: ["reasoning", "coding", "creative", "multilingual"],
    },
    {
      id: "deepseek/deepseek-chat",
      name: "DeepSeek Chat",
      tempName: "EduDev 3.0 Model",
      provider: "DeepSeek",
      description:
        "A strong and reliable model with solid reasoning and analytical capabilities. Well-suited for coding, structured problem-solving, and technical tasks.",
      contextLength: 32768,
      isFree: false,
      requiresAuth: true,
      capabilities: ["reasoning", "coding", "analysis"],
    },
    {
      id: "google/gemini-2.5-flash-lite",
      name: "google/gemini-2.5-flash-lite",
      provider: "Google",
      tempName: "EduDev 2.5 Model",
      description: "An efficient and scalable model designed for handling complex reasoning and large-context tasks. Performs well in coding, analysis, and creative workflows.",
      contextLength: 200000,
      isFree: false,
      requiresAuth: true,
      capabilities: ["reasoning", "coding", "analysis", "creative"],
    },
  ],
};

export const getAvailableModels = (isAuthenticated: boolean) => {
  // Always include the auto model
  const models = [...AVAILABLE_MODELS.always];

  // Only include premium models if user is authenticated
  if (isAuthenticated) {
    models.push(...AVAILABLE_MODELS.premium);
  }

  return models;
};

export const getDefaultModel = (isAuthenticated: boolean) => {
  // For authenticated users, default to Gemini Pro
  if (isAuthenticated) {
    return "google/gemini-pro";
  }
  return "auto";
};

export const getModelById = (modelId: string) => {
  const allModels = [...AVAILABLE_MODELS.always, ...AVAILABLE_MODELS.premium];
  return allModels.find((model) => model.id === modelId);
};
