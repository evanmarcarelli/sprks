export function SiteFooter() {
  return (
    <footer className="hairline mt-32">
      <div className="mx-auto max-w-7xl px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl">Aura <span className="text-silver">Audio</span></div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            A curated marketplace for the world's most discerning listeners. Every piece authenticated, every transaction insured.
          </p>
        </div>
        <FooterCol title="Marketplace" items={["Speakers", "Headphones", "Amplifiers", "Turntables"]} />
        <FooterCol title="Aura" items={["About", "Community", "Authentication", "Contact"]} />
      </div>
      <div className="hairline">
        <div className="mx-auto max-w-7xl px-8 py-6 flex flex-wrap justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>© {new Date().getFullYear()} Aura Audio</span>
          <span>Crafted for the audiophile</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.3em] text-silver mb-5">{title}</h4>
      <ul className="space-y-3 text-sm text-muted-foreground">
        {items.map((i) => <li key={i} className="hover:text-foreground cursor-pointer transition">{i}</li>)}
      </ul>
    </div>
  );
}
