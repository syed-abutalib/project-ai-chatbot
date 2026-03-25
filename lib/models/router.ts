export type ModelType = "auto" | "gemini" | "deepseek";

export function selectModel(messages: any[]): ModelType {
  const lastMessage = messages[messages.length - 1]?.content || "";

  // simple logic (you can improve later)
  if (lastMessage.length > 1000) return "deepseek";
  if (lastMessage.includes("code")) return "deepseek";

  return "gemini";
}
