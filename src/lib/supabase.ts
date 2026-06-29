import { createClient } from "@supabase/supabase-js";

// Project URL + publishable (anon) key. These are safe to ship in the client —
// the database is protected by Row Level Security (waitlist is insert-only, no
// public reads). Override per-environment with VITE_SUPABASE_URL /
// VITE_SUPABASE_ANON_KEY if you ever rotate the project or key.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://cxexzksxgpuiuqmrkjce.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "sb_publishable_R8lkd84h8-a6UBkWSdEmgw_XCP2gG8k";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  // Real auth: persist the session (localStorage on the client) and keep the
  // access token fresh. On the server there's no storage, so supabase-js falls
  // back to an in-memory store — all auth calls run client-side (see auth.tsx).
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
