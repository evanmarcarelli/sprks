import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Store, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

// Product tabs for the in-site app experience. "Discover" is the swipe home,
// mounted at /shop (the product entry that replaces the coming-soon page).
const tabs = [
  { to: "/shop", label: "Discover", icon: Compass },
  { to: "/marketplace", label: "Marketplace", icon: Store },
  { to: "/saved", label: "Saved", icon: Bookmark },
] as const;

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="pointer-events-none fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 px-5"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 14px)" }}
      aria-label="Primary"
    >
      <ul className="glass pointer-events-auto relative flex items-center justify-around overflow-hidden rounded-full px-3 py-2.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="relative flex items-center justify-center py-1.5"
                aria-label={label}
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-silver-bright"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  className={`relative h-[22px] w-[22px] transition-colors ${
                    active ? "text-background" : "text-foreground/70"
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
