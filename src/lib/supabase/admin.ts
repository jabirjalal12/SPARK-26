import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://aestqtbstvyhcpwkkyut.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!serviceRoleKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations may be restricted.");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey || "", {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
