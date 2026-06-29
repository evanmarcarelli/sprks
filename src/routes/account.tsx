import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Account — Spkrs" }, { name: "robots", content: "noindex" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, profile, loading, refreshProfile } = useAuth();

  if (loading) {
    return <Centered>Loading…</Centered>;
  }

  if (!user) {
    return (
      <Centered>
        <h1 className="font-serif text-4xl">Sign in to view your account</h1>
        <Link
          to="/login"
          search={{ redirect: "/account" }}
          className="mt-8 inline-block bg-silver-bright text-primary-foreground px-8 py-4 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition"
        >
          Sign in
        </Link>
      </Centered>
    );
  }

  const status = profile?.seller_status ?? "none";

  return (
    <section className="mx-auto max-w-2xl px-8 pt-24 pb-32">
      <p className="text-xs uppercase tracking-[0.4em] text-silver">Account</p>
      <h1 className="mt-5 font-serif text-5xl">
        {profile?.display_name || "Your account"}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">{user.email}</p>

      <div className="mt-12">
        <h2 className="text-xs uppercase tracking-[0.3em] text-silver">Seller status</h2>

        {status === "verified" && (
          <div className="mt-5 glass p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-silver bg-silver-bright text-primary-foreground">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div>
                <p className="font-serif text-2xl">Verified seller</p>
                <p className="text-sm text-muted-foreground">
                  Your listings go live immediately.
                </p>
              </div>
            </div>
            <Link
              to="/sell"
              className="mt-7 inline-block bg-silver-bright text-primary-foreground px-7 py-3.5 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition"
            >
              List a piece
            </Link>
          </div>
        )}

        {status === "pending" && (
          <div className="mt-5 glass p-8">
            <p className="font-serif text-2xl">Application under review</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Thanks — we're reviewing your seller application. You can still create
              listings now; they'll publish automatically the moment you're approved.
            </p>
            <Link
              to="/sell"
              className="mt-7 inline-block border border-border px-7 py-3.5 text-xs uppercase tracking-[0.3em] hover:bg-secondary transition"
            >
              Draft a listing
            </Link>
          </div>
        )}

        {(status === "none" || status === "rejected") && (
          <SellerRequestForm
            rejected={status === "rejected"}
            onSubmitted={refreshProfile}
          />
        )}
      </div>
    </section>
  );
}

function SellerRequestForm({
  rejected,
  onSubmitted,
}: {
  rejected: boolean;
  onSubmitted: () => void;
}) {
  const [note, setNote] = useState("");
  const [contact, setContact] = useState("");
  const [links, setLinks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!note.trim() || !contact.trim()) {
      setError("Tell us a bit about what you sell and how to reach you.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error: rpcError } = await supabase.rpc("request_seller_verification", {
        p_note: note.trim(),
        p_contact: contact.trim(),
        p_links: links
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      if (rpcError) throw new Error(rpcError.message);
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't submit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 glass p-8">
      <p className="font-serif text-2xl">Become a verified seller</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {rejected
          ? "Your previous application wasn't approved. You're welcome to apply again with more detail."
          : "Spkrs is a trusted marketplace. Sellers are reviewed before their listings go public. Tell us about your gear and we'll get you verified."}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        <Field label="What do you sell?">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="e.g. I'm an audiophile downsizing my collection — KEF, Focal, McIntosh. Mostly bookshelf speakers and integrated amps."
            className="w-full bg-transparent border border-border focus:border-silver outline-none p-3 text-sm placeholder:text-muted-foreground/50 resize-none"
          />
        </Field>
        <Field label="Contact (email or phone)">
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="you@domain.com · (555) 123-4567"
            className={inputCls}
          />
        </Field>
        <Field label="Proof links (optional, comma separated)">
          <input
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            placeholder="instagram.com/you, audiogon profile, etc."
            className={inputCls}
          />
        </Field>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-silver-bright text-primary-foreground px-9 py-4 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl flex-col items-center justify-center px-8 text-center">
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-border focus:border-silver outline-none py-3 text-sm placeholder:text-muted-foreground/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-silver">{label}</span>
      {children}
    </label>
  );
}
