export async function geminiChat(messages: any[]) {
  const prompt = messages.map((m) => m.content).join("\n");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!res.ok) throw new Error("Gemini failed");

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
