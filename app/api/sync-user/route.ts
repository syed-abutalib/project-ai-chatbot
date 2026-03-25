// app/api/sync-user/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/superbase/admin";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details from Clerk (you might need to fetch from Clerk API)
    const supabase = createAdminClient();

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (!existingUser) {
      // Create user in Supabase
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          id: userId,
          email: "temp@email.com", // You'll need to get this from Clerk
          name: "User",
        })
        .select()
        .single();

      if (createError) throw createError;

      return NextResponse.json({
        message: "User created successfully",
        user: newUser,
      });
    }

    return NextResponse.json({
      message: "User already exists",
      user: existingUser,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
