import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/superbase/admin";

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    const supabase = createAdminClient();

    if (!WEBHOOK_SECRET) {
      throw new Error("Missing WEBHOOK_SECRET");
    }
    // ✅ Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse("Missing Svix headers", { status: 400 });
    }

    // ✅ IMPORTANT: Read body ONLY ONCE
    const body = await req.text();

    const wh = new Webhook(WEBHOOK_SECRET);

    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });

    // 👉 Example: get user
    const eventType = evt.type;

    if (eventType === "user.created") {
      const user = evt.data;
      const email = user.email_addresses?.[0]?.email_address ?? null;
      const name =
        [user.first_name, user.last_name].filter(Boolean).join(" ") || null;

      const { data, error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          email,
          name,
          avatar_url: user.image_url || null,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error("❌ Supabase error:", error);
      }
    }
    if (eventType === "user.deleted") {
      const { id } = evt.data;

      const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (error) console.error("❌ Supabase delete error:", error);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Webhook error:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
