import { createServerFn } from "@tanstack/react-start";

// Waitlist persistence. Each submitted email is appended to data/waitlist.csv
// on the server. NOTE: this uses the local filesystem, so it works in `vite dev`
// and on any Node host (e.g. Render). It does NOT persist on serverless/edge
// targets (Cloudflare, Vercel functions) — swap the handlers for a database
// (Supabase, D1, KV) before deploying there.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function csvField(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

async function waitlistPaths() {
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "data");
  return { dir, file: path.join(dir, "waitlist.csv") };
}

const CSV_HEADER = "email,subscribed_at\n";

/** Save one email to the waitlist CSV (de-duplicated, case-insensitive). */
export const addToWaitlist = createServerFn({ method: "POST" })
  .validator((email: unknown) => {
    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      throw new Error("Please enter a valid email address.");
    }
    return email.trim().toLowerCase();
  })
  .handler(async ({ data: email }) => {
    const { promises: fs } = await import("node:fs");
    const { dir, file } = await waitlistPaths();
    await fs.mkdir(dir, { recursive: true });

    let existing = "";
    try {
      existing = await fs.readFile(file, "utf8");
    } catch {
      // file doesn't exist yet
    }
    if (!existing) {
      existing = CSV_HEADER;
      await fs.writeFile(file, existing);
    }

    const already = existing
      .split("\n")
      .slice(1)
      .some((line) => line.split(",")[0].replace(/^"|"$/g, "").toLowerCase() === email);

    if (!already) {
      await fs.appendFile(file, `${csvField(email)},${new Date().toISOString()}\n`);
    }
    return { ok: true, duplicate: already };
  });

/**
 * Read back the whole waitlist as CSV (for export). If WAITLIST_KEY is set in
 * the environment, the matching key must be supplied — gate this before
 * deploying so the email list isn't public.
 */
export const getWaitlist = createServerFn({ method: "GET" })
  .validator((key: unknown) => (typeof key === "string" ? key : ""))
  .handler(async ({ data: key }) => {
    const required = process.env.WAITLIST_KEY;
    if (required && key !== required) throw new Error("Unauthorized");

    const { promises: fs } = await import("node:fs");
    const { file } = await waitlistPaths();
    let csv = CSV_HEADER;
    try {
      csv = await fs.readFile(file, "utf8");
    } catch {
      // no signups yet
    }
    const count = Math.max(0, csv.trim().split("\n").filter(Boolean).length - 1);
    return { csv, count };
  });
