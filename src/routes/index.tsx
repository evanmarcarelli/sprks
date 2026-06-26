import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import LineWaves from "@/components/line-waves";
import { ShieldCheck, Truck, Sparkles, Headphones } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spkrs — The Marketplace for High-End Sound" },
      { name: "description", content: "Curated, authenticated, audiophile-grade speakers, headphones, amplifiers and turntables." },
      { property: "og:title", content: "Spkrs" },
      { property: "og:description", content: "The premium marketplace for luxury audio equipment." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 4);
  return (
    <>
      {/* HERO */}
      <section className="relative -mt-20 min-h-screen w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <LineWaves
            speed={0.3}
            innerLineCount={32}
            outerLineCount={36}
            warpIntensity={1.0}
            rotation={-45}
            edgeFadeWidth={0.0}
            colorCycleSpeed={1.0}
            brightness={0.2}
            color1="#ffffff"
            color2="#ffffff"
            color3="#ffffff"
            enableMouseInteraction={true}
            mouseInfluence={2.0}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-8 pt-32 pb-20">
          <p className="text-xs uppercase tracking-[0.4em] text-silver">A Curated Marketplace</p>
          <h1 className="mt-6 max-w-3xl font-serif text-6xl leading-[1.05] md:text-8xl">
            Sound, <em className="text-silver not-italic">distilled</em> to its purest form.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            Spkrs is where the world's most discerning listeners discover, trade, and collect reference-grade equipment. Every piece, authenticated. Every transaction, insured.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/shop" className="bg-silver-bright text-primary-foreground px-8 py-4 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition">
              Enter the Marketplace
            </Link>
            <Link to="/about" className="border border-border px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-secondary transition">
              Our Standard
            </Link>
          </div>
          <div className="mt-20 flex flex-wrap items-center gap-10 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span>Est. 2019</span><span>·</span>
            <span>1,400+ Verified Pieces</span><span>·</span>
            <span>Worldwide White-Glove</span>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-8 py-32">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-silver">Featured Collection</p>
            <h2 className="mt-4 font-serif text-5xl">Reference, in residence.</h2>
          </div>
          <Link to="/shop" className="hidden md:block text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* WHY */}
      <section className="hairline">
        <div className="mx-auto max-w-7xl px-8 py-32">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-silver">The Spkrs Standard</p>
            <h2 className="mt-4 font-serif text-5xl">Built for those who hear the difference.</h2>
          </div>
          <div className="mt-20 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Authenticated", body: "Every piece inspected by senior technicians before listing." },
              { icon: Truck, title: "White-Glove Delivery", body: "Climate-controlled transit and concierge installation." },
              { icon: Sparkles, title: "Curated Inventory", body: "Reference equipment from the world's most exacting makers." },
              { icon: Headphones, title: "Audition at Home", body: "30-day in-residence trial on select reference systems." },
            ].map((f) => (
              <div key={f.title} className="bg-background p-10">
                <f.icon className="h-6 w-6 text-silver" strokeWidth={1.25} />
                <h3 className="mt-8 font-serif text-2xl">{f.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
