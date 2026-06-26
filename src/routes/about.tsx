import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Aura Audio" },
      { name: "description", content: "The philosophy and standards behind Aura Audio, the world's curated marketplace for reference-grade audio." },
      { property: "og:title", content: "About — Aura Audio" },
      { property: "og:description", content: "Our philosophy and standards." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 pt-24 pb-32">
      <p className="text-xs uppercase tracking-[0.3em] text-silver">Our philosophy</p>
      <h1 className="mt-6 font-serif text-5xl md:text-7xl leading-[1.05]">
        We believe sound is an <em className="text-silver not-italic">art form</em>.
      </h1>
      <div className="mt-16 grid gap-12 text-lg leading-relaxed text-muted-foreground md:grid-cols-2">
        <p>Aura Audio was founded in 2019 by a small collective of engineers, collectors and listeners who could not find a marketplace worthy of the equipment they cared about. So we built one.</p>
        <p>Every piece on Aura is hand-selected and physically inspected. We work directly with the world's most exacting makers and most trusted private collectors to bring rare, reference-grade equipment to a community that understands its value.</p>
      </div>

      <div className="hairline mt-24 pt-16 grid gap-8 md:grid-cols-3">
        {[
          { n: "1,400+", l: "Verified pieces" },
          { n: "62", l: "Countries delivered" },
          { n: "100%", l: "Authentication rate" },
        ].map((s) => (
          <div key={s.l}>
            <div className="font-serif text-5xl text-silver">{s.n}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
