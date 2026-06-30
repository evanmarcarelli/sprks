import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/sellers")({
  head: () => ({
    meta: [{ title: "Sellers — Spkrs Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminSellers,
});

type PendingSeller = {
  user_id: string;
  display_name: string | null;
  email: string | null;
  note: string | null;
  contact: string | null;
  proof_links: string[];
};

const PENDING = ["pending_manual_review", "pending_ai_review"];

function AdminSellers() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<PendingSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    // RLS only returns other users' verifications to admins.
    const { data: svs, error: e } = await supabase
      .from("seller_verifications")
      .select("user_id, status, note, contact, proof_links, requested_at")
      .in("status", PENDING)
      .order("requested_at", { ascending: true });
    if (e) {
      setError(e.message);
      setRows([]);
      setLoading(false);
      return;
    }
    const list = (svs as Omit<PendingSeller, "display_name" | "email">[]) ?? [];
    // Merge in profile name/email (separate table; no direct FK to embed).
    const ids = list.map((s) => s.user_id);
    let profilesById: Record<string, { display_name: string | null; email: string | null }> = {};
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, email")
        .in("id", ids);
      profilesById = Object.fromEntries(
        ((profs as { id: string; display_name: string | null; email: string | null }[]) ?? []).map(
          (p) => [p.id, { display_name: p.display_name, email: p.email }],
        ),
      );
    }
    setRows(
      list.map((s) => ({
        ...s,
        display_name: profilesById[s.user_id]?.display_name ?? null,
        email: profilesById[s.user_id]?.email ?? null,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && isAdmin) load();
    else if (!authLoading) setLoading(false);
  }, [authLoading, isAdmin, load]);

  const review = async (userId: string, approve: boolean) => {
    setBusy(userId);
    setError("");
    try {
      const { error: e } = await supabase.rpc("review_seller", {
        p_user: userId,
        p_approve: approve,
      });
      if (e) throw new Error(e.message);
      setRows((r) => r.filter((row) => row.user_id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusy(null);
    }
  };

  if (!authLoading && !isAdmin) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl flex-col items-center justify-center px-8 text-center">
        <h1 className="font-serif text-4xl">Admins only</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This page is restricted to Spkrs administrators.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-8 pt-24 pb-32">
      <p className="text-xs uppercase tracking-[0.4em] text-silver">Admin</p>
      <h1 className="mt-5 font-serif text-5xl">Seller applications</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Review and approve sellers. Approving publishes any listings they've already
        drafted and gives them the verified badge.
      </p>

      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="mt-12 text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">No pending applications.</p>
      ) : (
        <div className="mt-10 space-y-5">
          {rows.map((r) => (
            <div key={r.user_id} className="glass p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-2xl">{r.display_name || "Unnamed seller"}</p>
                  <p className="text-sm text-muted-foreground">{r.email}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => review(r.user_id, true)}
                    disabled={busy === r.user_id}
                    className="bg-silver-bright text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.25em] hover:opacity-90 transition disabled:opacity-60"
                  >
                    {busy === r.user_id ? "…" : "Approve"}
                  </button>
                  <button
                    onClick={() => review(r.user_id, false)}
                    disabled={busy === r.user_id}
                    className="border border-border px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-secondary transition disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {r.note && (
                <p className="mt-5 text-sm leading-relaxed text-foreground/90">{r.note}</p>
              )}
              <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {r.contact && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.3em] text-silver">Contact</dt>
                    <dd className="text-muted-foreground">{r.contact}</dd>
                  </div>
                )}
                {r.proof_links?.length > 0 && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.3em] text-silver">Proof</dt>
                    <dd className="text-muted-foreground break-words">
                      {r.proof_links.join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
