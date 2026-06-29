import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth";

const nav = [
  { label: "Discover", to: "/shop" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Sell", to: "/sell" },
  { label: "Saved", to: "/saved" },
  { label: "About", to: "/about" },
  { label: "Community", to: "/community" },
] as const;

export function SiteHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

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

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition"
            >
              {profile?.seller_status === "verified" && (
                <span
                  title="Verified seller"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-silver-bright"
                />
              )}
              {profile?.display_name || "Account"}
            </Link>
            <button
              onClick={handleSignOut}
              className="border border-border px-5 py-2.5 text-xs uppercase tracking-[0.25em] hover:bg-secondary transition"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="border border-border px-5 py-2.5 text-xs uppercase tracking-[0.25em] hover:bg-secondary transition"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
