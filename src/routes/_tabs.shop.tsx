import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SwipeDeck } from "@/components/swipe-deck";
import { DetailDrawer } from "@/components/detail-drawer";
import { FilterSheet } from "@/components/filter-sheet";
import { CategoryRail } from "@/components/marketplace/category-rail";
import type { Speaker } from "@/lib/data/speakers";
import { DEFAULT_FILTERS, useStore } from "@/lib/store";
import { Waveform } from "@/components/audio-motifs";
import type { CategoryId } from "@/lib/catalog/categories";

const ease = [0.22, 1, 0.36, 1] as const;

// Discover — the dating-style swipe deck. Mounted at /shop as the product entry
// (replaces the old coming-soon page).
export const Route = createFileRoute("/_tabs/shop")({
  head: () => ({
    meta: [
      { title: "Discover — Spkrs" },
      { name: "description", content: "Swipe through curated premium hi-fi gear handpicked for you — speakers, amps, DACs, headphones and more." },
      { property: "og:title", content: "Discover — Spkrs" },
      { property: "og:description", content: "Swipe through curated premium hi-fi gear handpicked for you." },
    ],
  }),
  component: DiscoverTab,
});

function DiscoverTab() {
  const [detail, setDetail] = useState<Speaker | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const { filters, setFilters, profile } = useStore();
  const [category, setCategory] = useState<CategoryId | null>(
    profile.interested_categories[0] ?? null,
  );
  const navigate = useNavigate();

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (filters.priceMax < DEFAULT_FILTERS.priceMax)
      chips.push({
        key: "price",
        label: `Up to $${filters.priceMax.toLocaleString()}`,
        clear: () => setFilters({ ...filters, priceMax: DEFAULT_FILTERS.priceMax }),
      });
    filters.brands.forEach((b) =>
      chips.push({ key: `b-${b}`, label: b, clear: () => setFilters({ ...filters, brands: filters.brands.filter((x) => x !== b) }) }),
    );
    filters.conditions.forEach((c) =>
      chips.push({ key: `c-${c}`, label: c, clear: () => setFilters({ ...filters, conditions: filters.conditions.filter((x) => x !== c) }) }),
    );
    if (filters.localPickup) chips.push({ key: "local", label: "Local pickup", clear: () => setFilters({ ...filters, localPickup: false }) });
    if (filters.verifiedOnly) chips.push({ key: "verified", label: "Verified", clear: () => setFilters({ ...filters, verifiedOnly: false }) });
    return chips;
  }, [filters, setFilters]);

  const goToMarketplaceSearch = () =>
    navigate({ to: "/marketplace", search: { q: "", cat: "", sub: "", focus: 1 } });

  return (
    <div className="relative flex h-svh flex-col overflow-hidden pt-[env(safe-area-inset-top)]">
      {/* Subtle silver glow backdrop (site-native; replaces the app's WebGL field) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[62%]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.3 0.01 240 / 0.45), transparent 70%)",
        }}
      />

      <motion.header
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 px-5 pt-5"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-[10.5px] uppercase tracking-[0.28em] text-muted-foreground">For you</p>
            <h1 className="font-display text-[34px] leading-none">Today's picks</h1>
          </div>
          <Link
            to="/welcome"
            className="flex flex-col items-end gap-1 text-silver"
            aria-label="Personalize your picks"
          >
            <Waveform className="h-5 w-20" bars={22} />
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Personalize
            </span>
          </Link>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={goToMarketplaceSearch}
            className="flex flex-1 items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-2.5 text-left text-sm text-muted-foreground backdrop-blur"
          >
            <Search className="h-4 w-4" />
            Search speakers, amps, DACs, brands…
          </button>
          <button
            onClick={() => setFilterOpen(true)}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-border bg-surface/80 backdrop-blur"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeChips.length > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-silver-bright" />
            )}
          </button>
        </div>

        <CategoryRail active={category} onChange={setCategory} className="mt-3" />

        {activeChips.length > 0 && (
          <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
            {activeChips.map((c) => (
              <button
                key={c.key}
                onClick={c.clear}
                className="flex shrink-0 items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[11px] text-background"
              >
                {c.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.12 }}
        className="relative z-10 mt-4 flex-1 px-5 pb-28"
      >
        <SwipeDeck onOpenDetail={setDetail} category={category} />
      </motion.div>

      <DetailDrawer speaker={detail} onClose={() => setDetail(null)} />
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} category={category} />
    </div>
  );
}
