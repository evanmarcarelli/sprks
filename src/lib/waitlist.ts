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
    // Locked by default: the in-app export is disabled until WAITLIST_KEY is set,
    // and then the matching key must be supplied.
    const required = process.env.WAITLIST_KEY;
    if (!required) {
      throw new Error("Export is locked. Set WAITLIST_KEY on the server to enable the in-app export (or export from the Supabase dashboard).");
    }
    if (key !== required) throw new Error("Incorrect access key.");

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      throw new Error("Set SUPABASE_SERVICE_ROLE_KEY in the server environment, or export from the Supabase dashboard.");
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
