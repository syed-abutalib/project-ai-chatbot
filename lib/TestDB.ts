import { supabase } from "./superbase";
export async function getMessages() {
  const { data, error } = await supabase.from("messages").select("*");

  if (error) {
    console.error(error);
  }
  console.log("hello")
  console.log("Messages:", data);
  return data;
}
getMessages();