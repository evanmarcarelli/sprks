import { createServerFn } from "@tanstack/react-start";

// Waitlist export. Signups are stored in the Supabase `waitlist` table (inserts
// happen client-side via the publishable key in `supabase.ts`, protected by
// RLS). Reading the whole list back requires the service-role key, which must
// stay server-only — set SUPABASE_SERVICE_ROLE_KEY in the environment. Without
// it, export from the Supabase dashboard instead (Table editor -> waitlist ->
// Export to CSV).

function csvField(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://cxexzksxgpuiuqmrkjce.supabase.co";

export const getWaitlist = createServerFn({ method: "GET" })
  .validator((key: unknown) => (typeof key === "string" ? key : ""))
  .handler(async ({ data: key }) => {
    const required = process.env.WAITLIST_KEY;
    if (required && key !== required) throw new Error("Unauthorized.");

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      throw new Error(
        "In-app export isn't configured. Set SUPABASE_SERVICE_ROLE_KEY in the server environment, or export from the Supabase dashboard.",
      );
    }

    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(SUPABASE_URL, serviceKey, { auth: { persistSession: false } });
    const { data, error } = await admin
      .from("waitlist")
      .select("email, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const csv =
      "email,subscribed_at\n" +
      rows.map((r) => `${csvField(r.email)},${r.created_at}`).join("\n") +
      (rows.length ? "\n" : "");
    return { csv, count: rows.length };
  });
