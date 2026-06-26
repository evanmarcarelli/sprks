import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero-speaker.jpg";
import { Check } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Marketplace — Coming Soon | Aura Audio" },
      { name: "description", content: "The Aura Audio marketplace is opening soon. Request beta access to be among the first." },
      { property: "og:title", content: "Marketplace — Coming Soon" },
      { property: "og:description", content: "Request beta access to the Aura Audio marketplace." },
    ],
  }),
  component: ShopComingSoon,
});

function ShopComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="relative -mt-20 min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="" className="h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-8 pt-32 pb-20">
        <p className="text-xs uppercase tracking-[0.4em] text-silver">The Marketplace · Private Beta</p>
        <h1 className="mt-6 font-serif text-6xl leading-[1.05] md:text-7xl">
          Opening soon, by <em className="text-silver not-italic">invitation</em>.
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
          The Aura Audio marketplace is in private beta with a small circle of collectors and makers. Leave your email to be considered for early access.
        </p>

        {submitted ? (
          <div className="mt-12 glass max-w-lg p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-silver bg-silver-bright text-primary-foreground">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-serif text-2xl">You're on the list.</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  We'll be in touch at <span className="text-foreground">{email}</span> when an invitation opens up.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-12 max-w-lg">
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.3em] text-silver mb-2">Email Address</span>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="flex-1 bg-transparent border-b border-border focus:border-silver outline-none py-3 text-sm placeholder:text-muted-foreground/60"
                />
                <button
                  type="submit"
                  className="bg-silver-bright text-primary-foreground px-8 py-3.5 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition"
                >
                  Request Access
                </button>
              </div>
            </label>
            <p className="mt-4 text-xs text-muted-foreground">
              One email when access opens. No marketing, ever.
            </p>
          </form>
        )}

        <div className="mt-20 flex flex-wrap items-center gap-10 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <span>Invitation Only</span><span>·</span>
          <span>Authenticated Pieces</span><span>·</span>
          <span>Launching 2026</span>
        </div>
      </div>
    </section>
  );
}
