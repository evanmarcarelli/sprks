import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/catalog/categories";

const CONDITIONS = [
  "New",
  "Open Box",
  "Used — Mint",
  "Used — Excellent",
  "Used — Good",
  "Used — Fair",
];

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "List a Piece — Spkrs" },
      { name: "description", content: "List your audio gear on the Spkrs marketplace." },
    ],
  }),
  component: SellPage,
});

function SellPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, profile, loading: authLoading } = useAuth();
  const isVerified = profile?.seller_status === "verified";

  const [form, setForm] = useState({
    brand: "",
    model: "",
    price: "",
    category: "speakers",
    subcategory: "",
    condition: "Used — Excellent",
    finish: "",
    location: "",
    seller_name: "",
    image: "",
    tags: "",
    description: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    // Honeypot: a real person never fills the hidden field. If it's filled it's
    // a bot — show the success state but skip the insert.
    if (honeypot.trim()) {
      setDone(true);
      return;
    }
    const price = Math.round(Number(form.price));
    if (!form.brand.trim() || !form.model.trim() || !Number.isFinite(price) || price < 0) {
      setError("Brand, model, and a valid price are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error: insertError } = await supabase.from("listings").insert({
        user_id: user?.id ?? null,
        brand: form.brand.trim(),
        model: form.model.trim(),
        price,
        category: form.category,
        subcategory: form.subcategory.trim() || null,
        condition: form.condition,
        finish: form.finish.trim() || null,
        location: form.location.trim() || null,
        seller_name: form.seller_name.trim() || null,
        image: form.image.trim() || null,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        description: form.description.trim() || null,
      });
      if (insertError) throw new Error(insertError.message);
      await qc.invalidateQueries({ queryKey: ["listings"] });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Selling requires an account. Gate before showing the form.
  if (!authLoading && !user) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl flex-col items-center justify-center px-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-silver">Sell on Spkrs</p>
        <h1 className="mt-5 font-serif text-5xl">Sign in to list a piece.</h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
          Spkrs is a verified marketplace. Create a free account to list your gear —
          new sellers are reviewed before listings go public.
        </p>
        <Link
          to="/login"
          search={{ redirect: "/sell" }}
          className="mt-9 inline-block bg-silver-bright text-primary-foreground px-9 py-4 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition"
        >
          Sign in to continue
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-8 pt-24 pb-32">
        <div className="glass p-10">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-silver bg-silver-bright text-primary-foreground">
              <Check className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-serif text-3xl">
                {isVerified ? "Your piece is listed." : "Listing submitted."}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {isVerified ? (
                  <>
                    {form.brand} {form.model} is now live on the marketplace.
                  </>
                ) : (
                  <>
                    {form.brand} {form.model} is saved. It goes live automatically once
                    you're approved as a verified seller —{" "}
                    <Link to="/account" className="text-foreground border-b border-silver/40">
                      check your status
                    </Link>
                    .
                  </>
                )}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/marketplace"
                  className="bg-silver-bright text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition"
                >
                  View in marketplace
                </Link>
                <button
                  onClick={() => {
                    setDone(false);
                    setForm((f) => ({ ...f, brand: "", model: "", price: "", image: "", tags: "", description: "" }));
                  }}
                  className="border border-border px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-secondary transition"
                >
                  List another
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-8 pt-20 pb-32">
      <p className="text-xs uppercase tracking-[0.4em] text-silver">Sell on Spkrs</p>
      <h1 className="mt-5 font-serif text-5xl md:text-6xl">List a piece.</h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
        {isVerified
          ? "Reach a community of serious listeners. Add the details below — your listing goes live on the marketplace immediately."
          : "Reach a community of serious listeners. Add the details below — your listing is held until you're approved as a verified seller, then publishes automatically."}
      </p>

      {!isVerified && (
        <div className="mt-7 glass p-5 text-sm leading-relaxed text-muted-foreground">
          {profile?.seller_status === "pending" ? (
            <>Your seller application is under review. Listings you create now will publish once you're approved.</>
          ) : (
            <>
              You're not a verified seller yet.{" "}
              <Link to="/account" className="text-foreground border-b border-silver/40">
                Apply for verification
              </Link>{" "}
              so your listings can go live.
            </>
          )}
        </div>
      )}

      <form onSubmit={submit} className="mt-12 space-y-7">
        {/* honeypot — hidden from people, catches form bots */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
        <div className="grid gap-7 sm:grid-cols-2">
          <Field label="Brand" required>
            <input value={form.brand} onChange={set("brand")} placeholder="KEF" className={inputCls} />
          </Field>
          <Field label="Model" required>
            <input value={form.model} onChange={set("model")} placeholder="LS50 Meta" className={inputCls} />
          </Field>
          <Field label="Price (USD)" required>
            <input value={form.price} onChange={set("price")} inputMode="numeric" placeholder="1599" className={inputCls} />
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={set("category")} className={selectCls}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Condition">
            <select value={form.condition} onChange={set("condition")} className={selectCls}>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Type / subcategory">
            <input value={form.subcategory} onChange={set("subcategory")} placeholder="Bookshelf" className={inputCls} />
          </Field>
          <Field label="Finish / colour">
            <input value={form.finish} onChange={set("finish")} placeholder="Carbon Black" className={inputCls} />
          </Field>
          <Field label="Location">
            <input value={form.location} onChange={set("location")} placeholder="Brooklyn, NY" className={inputCls} />
          </Field>
        </div>

        <Field label="Photo URL">
          <input value={form.image} onChange={set("image")} placeholder="https://…/your-photo.jpg" className={inputCls} />
        </Field>
        <Field label="Tags (comma separated)">
          <input value={form.tags} onChange={set("tags")} placeholder="Detailed, Studio, Near-field" className={inputCls} />
        </Field>
        <Field label="Your name (seller)">
          <input value={form.seller_name} onChange={set("seller_name")} placeholder="Alex M." className={inputCls} />
        </Field>
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={5}
            placeholder="Condition notes, history, what's included…"
            className="w-full bg-transparent border border-border focus:border-silver outline-none p-3 text-sm placeholder:text-muted-foreground/50 resize-none"
          />
        </Field>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-silver-bright text-primary-foreground px-10 py-4 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Listing…" : "List it"}
        </button>
      </form>
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-border focus:border-silver outline-none py-3 text-sm placeholder:text-muted-foreground/50";
const selectCls =
  "w-full bg-card border border-border focus:border-silver outline-none px-3 py-2.5 text-sm";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-silver">
        {label}
        {required && <span className="text-muted-foreground"> *</span>}
      </span>
      {children}
    </label>
  );
}
