// contexts/supabase-provider.tsx
"use client";

import { useSession } from "@clerk/nextjs";
import React, { useEffect, useState, createContext, useMemo } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Create context
export const SupabaseContext = createContext<SupabaseClient | null>(null);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoaded: isSessionLoaded } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        const token = await session?.getToken();

        const client = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
            },
            global: {
              headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {},
            },
          },
        );

        setSupabase(client);
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
      }
    };

    if (isSessionLoaded) {
      initClient();
    }
  }, [session, isSessionLoaded]);

  const value = useMemo(() => supabase, [supabase]);

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}
