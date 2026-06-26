import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronUp, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Feedback — Spkrs" },
      { name: "description", content: "Submit feature requests and shape the future of the Spkrs marketplace." },
      { property: "og:title", content: "Community Feedback — Spkrs" },
      { property: "og:description", content: "Submit feature requests and shape the future of Spkrs." },
    ],
  }),
  component: CommunityPage,
});

type Item = { id: number; title: string; desc: string; category: string; votes: number; comments: number; voted?: boolean };

const seed: Item[] = [
  { id: 1, title: "Side-by-side speaker comparison tool", desc: "Compare specs, frequency response and price across up to 4 speakers.", category: "Feature", votes: 247, comments: 32 },
  { id: 2, title: "Verified audition events in major cities", desc: "Host curated listening sessions hosted by sellers in select cities.", category: "Feature", votes: 184, comments: 18 },
  { id: 3, title: "Add support for vintage tube amplifiers (pre-1970)", desc: "Authentication criteria and dedicated category for vintage gear.", category: "Marketplace", votes: 156, comments: 41 },
  { id: 4, title: "Mobile app for iOS / Android", desc: "Native app with watchlist, price alerts and offer messaging.", category: "Platform", votes: 132, comments: 12 },
  { id: 5, title: "Bug: filters reset on back navigation", desc: "Active marketplace filters are cleared when returning from a listing.", category: "Bug", votes: 67, comments: 5 },
];

export function CommunityPage() {
  const [items, setItems] = useState(seed);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Feature");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setItems((prev) => [{ id: Date.now(), title, desc, category, votes: 1, comments: 0, voted: true }, ...prev]);
    setTitle(""); setDesc("");
  };

  const toggleVote = (id: number) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, voted: !i.voted, votes: i.votes + (i.voted ? -1 : 1) } : i));
  };

  return (
    <div className="mx-auto max-w-5xl px-8 pt-16 pb-24">
      <header className="mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-silver">The Salon</p>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">Community feedback.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Shape the marketplace. Submit requests, report issues, and vote on what matters.</p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          {items.sort((a,b) => b.votes - a.votes).map((i) => (
            <article key={i.id} className="group flex gap-5 border border-border bg-card p-6 hover:border-silver/40 transition">
              <button
                onClick={() => toggleVote(i.id)}
                className={`shrink-0 flex flex-col items-center justify-center w-14 h-14 border transition ${
                  i.voted ? "border-silver bg-silver-bright text-primary-foreground" : "border-border text-muted-foreground hover:border-silver/50 hover:text-foreground"
                }`}
              >
                <ChevronUp className="h-4 w-4" strokeWidth={2} />
                <span className="text-xs font-medium mt-0.5">{i.votes}</span>
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-silver">{i.category}</span>
                </div>
                <h3 className="mt-2 font-serif text-xl">{i.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MessageCircle className="h-3.5 w-3.5" /> {i.comments} comments
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <form onSubmit={submit} className="glass p-7 space-y-5">
            <div>
              <h2 className="font-serif text-2xl">Submit a request</h2>
              <p className="mt-1 text-sm text-muted-foreground">We read every post.</p>
            </div>
            <Field label="Title">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A concise summary"
                className="w-full bg-transparent border-b border-border focus:border-silver outline-none py-2.5 text-sm placeholder:text-muted-foreground/50" />
            </Field>
            <Field label="Description">
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Tell us more…" rows={4}
                className="w-full bg-transparent border border-border focus:border-silver outline-none p-3 text-sm placeholder:text-muted-foreground/50 resize-none" />
            </Field>
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-card border border-border focus:border-silver outline-none p-3 text-sm">
                {["Feature", "Marketplace", "Platform", "Bug"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <button type="submit" className="w-full bg-silver-bright text-primary-foreground py-3.5 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition">
              Submit
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-silver mb-1.5">{label}</span>
      {children}
    </label>
  );
}
