// hooks/useSupabase.ts
import { SupabaseContext } from "@/contexts/supabase-provider";
import { useContext } from "react";

export default function useSupabase() {
  const supabase = useContext(SupabaseContext);

  if (supabase === undefined) {
    throw new Error("useSupabase must be used within SupabaseProvider");
  }

  return { supabase, isReady: !!supabase };
}
