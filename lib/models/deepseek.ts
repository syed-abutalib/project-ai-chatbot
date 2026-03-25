export async function deepseekChat(messages: any[]) {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
    }),
  });

  if (!res.ok) throw new Error("DeepSeek failed");

  const data = await res.json();
  return data.choices[0].message.content;
}
