import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

const nav = [
  { label: "Discover", to: "/shop" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Sell", to: "/sell" },
  { label: "Saved", to: "/saved" },
  { label: "About", to: "/about" },
  { label: "Community", to: "/community" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <span className="font-serif text-xl tracking-[0.02em]">Spkrs</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/login"
          className="border border-border px-5 py-2.5 text-xs uppercase tracking-[0.25em] hover:bg-secondary transition"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
