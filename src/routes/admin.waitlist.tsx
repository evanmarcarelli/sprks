import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { getWaitlist } from "@/lib/waitlist";

export const Route = createFileRoute("/admin/waitlist")({
  head: () => ({ meta: [{ title: "Waitlist — Spkrs Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminWaitlist,
});

function AdminWaitlist() {
  const [key, setKey] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [csv, setCsv] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getWaitlist({ data: key });
      setCount(res.count);
      setCsv(res.csv);
    } catch {
      setError("Unauthorized, or the waitlist is unavailable.");
      setCount(null);
      setCsv("");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spkrs-waitlist.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto min-h-screen max-w-3xl px-8 pt-40 pb-24">
      <p className="text-xs uppercase tracking-[0.4em] text-silver">Admin</p>
      <h1 className="mt-6 font-serif text-5xl">Waitlist export</h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Every email submitted on the marketplace page is saved to <code className="text-foreground">data/waitlist.csv</code>.
        Load it below and download a copy. If <code className="text-foreground">WAITLIST_KEY</code> is set, enter it first.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block">
          <span className="block text-[10px] uppercase tracking-[0.3em] text-silver mb-2">Access key (if set)</span>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="optional"
            className="w-64 bg-transparent border-b border-border focus:border-silver outline-none py-3 text-sm placeholder:text-muted-foreground/60"
          />
        </label>
        <button
          onClick={load}
          disabled={loading}
          className="border border-border px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-secondary transition disabled:opacity-60"
        >
          {loading ? "Loading…" : "Load waitlist"}
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

      {count !== null && (
        <div className="mt-12 glass max-w-md p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-silver">Signups</p>
          <p className="mt-2 font-serif text-6xl">{count}</p>
          <button
            onClick={download}
            disabled={count === 0}
            className="mt-8 inline-flex items-center gap-3 bg-silver-bright text-primary-foreground px-7 py-3.5 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Download CSV
          </button>
        </div>
      )}
    </section>
  );
}
