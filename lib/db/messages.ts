import { createServerSupabase } from "@/lib/superbase/server";

export async function saveMessage({
  user_id,
  role,
  content,
  model,
}: {
  user_id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
}) {
  const supabase = createServerSupabase();

  const { error } = await supabase.from("messages").insert({
    user_id,
    role,
    content,
    model,
  });

  if (error) {
    console.error("❌ Supabase insert error:", error);
  }
}
