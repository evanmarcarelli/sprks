import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X, Store as StoreIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ALL_LISTINGS, listingCategory } from "@/lib/data/listings";
import { fetchRemoteListings } from "@/lib/data/remote-listings";
import type { Speaker } from "@/lib/data/speakers";
import { DEFAULT_FILTERS, useStore } from "@/lib/store";
import { DetailDrawer } from "@/components/detail-drawer";
import { FilterSheet } from "@/components/filter-sheet";
import { MarketplaceListingCard } from "@/components/marketplace/listing-card";
import { SortSheet, SORT_LABELS, type SortKey } from "@/components/marketplace/sort-sheet";
import { CategoryRail } from "@/components/marketplace/category-rail";
import {
  CATEGORIES,
  getCategory,
  type CategoryId,
} from "@/lib/catalog/categories";
import { inferCategoryFromQuery } from "@/lib/catalog/match";

const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  cat: fallback(z.enum(["", ...CATEGORY_IDS]), "").default(""),
  sub: fallback(z.string(), "").default(""),
  focus: fallback(z.number().int(), 0).default(0),
});

export const Route = createFileRoute("/_tabs/marketplace")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Marketplace — SPKRS" },
      {
        name: "description",
        content:
          "Browse, search, filter, and compare premium hi-fi gear — speakers, amps, DACs, streamers, cables, headphones and more.",
      },
      { property: "og:title", content: "Marketplace — SPKRS" },
      {
        property: "og:description",
        content: "Search, filter, and compare hi-fi listings on SPKRS.",
      },
    ],
  }),
  component: MarketplaceTab,
});

function MarketplaceTab() {
  const { q, cat, sub, focus } = Route.useSearch();
  const navigate = useNavigate({ from: "/marketplace" });
  const { filters } = useStore();

  // Real user-created listings from Supabase, merged ahead of the mock catalog.
  const { data: remote = [] } = useQuery({ queryKey: ["listings"], queryFn: fetchRemoteListings });
  const allListings = useMemo(() => [...remote, ...ALL_LISTINGS], [remote]);

  const [query, setQuery] = useState(q);
  const [committed, setCommitted] = useState(q);
  const [searchActive, setSearchActive] = useState(focus === 1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [detail, setDetail] = useState<Speaker | null>(null);
  const [activeCat, setActiveCat] = useState<CategoryId | null>((cat || null) as CategoryId | null);
  const [activeSub, setActiveSub] = useState<string>(sub);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep URL roughly in sync
  useEffect(() => {
    navigate({
      to: "/marketplace",
      search: {
        q: committed,
        cat: (activeCat ?? "") as "" | CategoryId,
        sub: activeSub,
        focus: searchActive ? 1 : 0,
      },
      replace: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committed, activeCat, activeSub, searchActive]);

  useEffect(() => {
    if (searchActive) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [searchActive]);

  const category = getCategory(activeCat);
  const subcategories = category?.subcategories ?? [];

  const activeQuery = committed.trim().toLowerCase();

  const filtered = useMemo(() => {
    let list: Speaker[] = activeCat
      ? allListings.filter((s) => listingCategory(s) === activeCat)
      : allListings;

    list = list.filter((s) => {
      if (filters.priceMax < DEFAULT_FILTERS.priceMax && s.price > filters.priceMax) return false;
      if (filters.brands.length && !filters.brands.includes(s.brand)) return false;
      if (filters.conditions.length && !filters.conditions.includes(s.condition)) return false;
      if (filters.localPickup && !s.localPickup) return false;
      if (filters.verifiedOnly && !s.verified) return false;
      return true;
    });

    if (activeSub) {
      list = list.filter(
        (s) => (s.subcategory ?? s.type) === activeSub || matchesSubcategory(s, activeSub),
      );
    }

    if (activeQuery) {
      list = list.filter((s) =>
        `${s.brand} ${s.model} ${s.type} ${s.subcategory ?? ""} ${s.finish} ${s.tags.join(" ")}`
          .toLowerCase()
          .includes(activeQuery),
      );
    }

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "verified":
        list = [...list].sort((a, b) => Number(b.verified) - Number(a.verified));
        break;
      case "nearby":
        list = [...list].sort((a, b) => Number(b.localPickup) - Number(a.localPickup));
        break;
      default:
        break;
    }

    return list;
  }, [filters, activeCat, activeSub, activeQuery, sort, allListings]);

  const inResultsMode = !!(activeQuery || activeSub || activeCat);

  const clearQuery = () => {
    setQuery("");
    setCommitted("");
  };

  const placeholder = category
    ? `Search ${category.label.toLowerCase()}, brands, or models`
    : "Search speakers, amps, DACs, brands…";

  return (
    <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
      <header className="pb-2 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10.5px] uppercase tracking-[0.22em] text-silver">
              Shop the market
            </p>
            <h1 className="font-display text-4xl leading-none md:text-5xl">Marketplace</h1>
          </div>
          <StoreIcon className="h-6 w-6 text-muted-foreground" />
        </div>
      </header>

      {/* Sticky search + category + chip rail (sits below the 5rem site header) */}
      <div className="sticky top-20 z-30 space-y-3 bg-background/95 pb-3 pt-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchActive(true)}
            className="flex flex-1 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-left text-sm text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            {committed || placeholder}
          </button>
          <button
            onClick={() => setFilterOpen(true)}
            aria-label="Filters"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSortOpen(true)}
            aria-label="Sort"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>

        <CategoryRail
          active={activeCat}
          onChange={(id) => {
            setActiveCat(id);
            setActiveSub(""); // reset subcategory on category change
          }}
        />

        {category && (
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {subcategories.map((s) => {
              const on = activeSub === s;
              return (
                <button
                  key={s}
                  onClick={() => setActiveSub(on ? "" : s)}
                  className={`shrink-0 rounded-full border px-3 py-1 text-[11.5px] transition ${
                    on
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="pb-20 pt-4">
        {inResultsMode ? (
          <ResultsView
            list={filtered}
            sort={sort}
            onOpen={setDetail}
            onClearSub={() => setActiveSub("")}
            onClearQuery={clearQuery}
            onClearCat={() => {
              setActiveCat(null);
              setActiveSub("");
            }}
            activeCat={category?.label ?? ""}
            activeSub={activeSub}
            query={committed}
          />
        ) : (
          <LandingView remote={remote} onOpen={setDetail} onPickCat={(id) => setActiveCat(id)} />
        )}
      </div>

      <DetailDrawer speaker={detail} onClose={() => setDetail(null)} />
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        category={activeCat}
      />
      <SortSheet
        open={sortOpen}
        value={sort}
        onChange={setSort}
        onClose={() => setSortOpen(false)}
      />

      <SearchOverlay
        open={searchActive}
        initialQuery={query}
        inputRef={inputRef}
        onClose={() => setSearchActive(false)}
        onCommit={(v, inferredCat) => {
          setQuery(v);
          setCommitted(v);
          if (inferredCat && !activeCat) setActiveCat(inferredCat);
          setSearchActive(false);
        }}
      />
    </div>
  );
}

// Loose mapping for legacy speaker type strings → subcategory chip labels.
function matchesSubcategory(s: Speaker, sub: string): boolean {
  const t = (s.type ?? "").toLowerCase();
  const sl = sub.toLowerCase();
  return t === sl || t.includes(sl);
}

function LandingView({
  remote,
  onOpen,
  onPickCat,
}: {
  remote: Speaker[];
  onOpen: (s: Speaker) => void;
  onPickCat: (c: CategoryId) => void;
}) {
  const featured = useMemo(
    () =>
      [...ALL_LISTINGS]
        .sort((a, b) => Number(b.verified) - Number(a.verified))
        .slice(0, 8),
    [],
  );
  return (
    <div className="space-y-7">
      {remote.length > 0 && (
        <section>
          <h2 className="mb-2.5 text-[11px] uppercase tracking-[0.18em] text-silver">
            Just listed
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {remote.slice(0, 10).map((s) => (
              <MarketplaceListingCard key={s.id} speaker={s} onOpen={() => onOpen(s)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-2.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Featured across the market
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {featured.map((s) => (
            <MarketplaceListingCard key={s.id} speaker={s} onOpen={() => onOpen(s)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Browse by category
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => onPickCat(c.id)}
                className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-4 text-left text-sm"
              >
                <span>{c.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ResultsView({
  list,
  sort,
  onOpen,
  onClearSub,
  onClearQuery,
  onClearCat,
  activeCat,
  activeSub,
  query,
}: {
  list: Speaker[];
  sort: SortKey;
  onOpen: (s: Speaker) => void;
  onClearSub: () => void;
  onClearQuery: () => void;
  onClearCat: () => void;
  activeCat: string;
  activeSub: string;
  query: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 text-[11.5px] text-muted-foreground">
        <span>{list.length} listings</span>
        <span>{SORT_LABELS[sort]}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {query && (
          <button
            onClick={onClearQuery}
            className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[11px] text-background"
          >
            "{query}"
            <X className="h-3 w-3" />
          </button>
        )}
        {activeCat && (
          <button
            onClick={onClearCat}
            className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[11px] text-background"
          >
            {activeCat}
            <X className="h-3 w-3" />
          </button>
        )}
        {activeSub && (
          <button
            onClick={onClearSub}
            className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[11px] text-background"
          >
            {activeSub}
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm">No listings match</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Try clearing a filter or broadening your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((s) => (
            <MarketplaceListingCard key={s.id} speaker={s} onOpen={() => onOpen(s)} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchOverlay({
  open,
  initialQuery,
  inputRef,
  onClose,
  onCommit,
}: {
  open: boolean;
  initialQuery: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onCommit: (v: string, inferredCat: CategoryId | null) => void;
}) {
  const [q, setQ] = useState(initialQuery);
  useEffect(() => {
    if (open) setQ(initialQuery);
  }, [open, initialQuery]);

  if (!open) return null;

  const live = q.trim().toLowerCase();
  const recent = readRecent();
  const inferred = live ? inferCategoryFromQuery(q) : null;

  const liveMatchesByCat = (() => {
    if (!live) return [] as { cat: CategoryId; items: Speaker[] }[];
    const grouped = new Map<CategoryId, Speaker[]>();
    for (const s of ALL_LISTINGS) {
      if (`${s.brand} ${s.model}`.toLowerCase().includes(live)) {
        const c = listingCategory(s);
        if (!grouped.has(c)) grouped.set(c, []);
        if (grouped.get(c)!.length < 4) grouped.get(c)!.push(s);
      }
    }
    return Array.from(grouped.entries()).map(([cat, items]) => ({ cat, items }));
  })();

  const trending = ["KEF LS50", "Focal Clear", "McIntosh", "Chord Qutest", "Open back", "XLR cables"];

  const commit = (v: string, catOverride?: CategoryId | null) => {
    const t = v.trim();
    if (t) saveRecent(t);
    onCommit(t, catOverride ?? (t ? inferCategoryFromQuery(t) : null));
  };

  return (
    <div className="fixed inset-0 z-50 flex w-full flex-col bg-background/98 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 border-b border-border px-4 py-4">
        <button onClick={onClose} className="px-2 text-sm">
          Cancel
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            commit(q);
          }}
          className="flex flex-1 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search speakers, amps, DACs, brands…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear"
              className="text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-5 pb-10 pt-6">
        {live ? (
          <div className="space-y-5">
            {inferred && (
              <button
                onClick={() => commit(q, inferred)}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 text-left"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Browse category
                  </p>
                  <p className="mt-0.5 text-sm">
                    All in <strong>{getCategory(inferred)?.label}</strong>
                  </p>
                </div>
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            )}

            {liveMatchesByCat.length === 0 ? (
              <p className="px-2 text-[12px] text-muted-foreground">No suggestions.</p>
            ) : (
              liveMatchesByCat.map(({ cat, items }) => (
                <section key={cat}>
                  <h4 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {getCategory(cat)?.label}
                  </h4>
                  <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
                    {items.map((s) => (
                      <li key={s.id}>
                        <button
                          onClick={() => commit(`${s.brand} ${s.model}`, cat)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
                        >
                          <img
                            src={s.image}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-[13px]">
                              {s.brand} <span className="font-medium">{s.model}</span>
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {s.subcategory ?? s.type}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}

            <button
              onClick={() => commit(q)}
              className="w-full rounded-full bg-foreground py-3 text-sm text-background"
            >
              Search for "{q}"
            </button>
          </div>
        ) : (
          <div className="space-y-7">
            {recent.length > 0 && (
              <section>
                <h4 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Recent searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => commit(r)}
                      className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h4 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Trending
              </h4>
              <div className="flex flex-wrap gap-2">
                {trending.map((t) => (
                  <button
                    key={t}
                    onClick={() => commit(t)}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Browse by category
              </h4>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => onCommit("", c.id)}
                      className="flex items-center justify-between rounded-2xl border border-border bg-surface px-3 py-3 text-sm"
                    >
                      {c.label}
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

const RECENT_KEY = "spkrs-recent-searches";
function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveRecent(v: string) {
  if (typeof window === "undefined") return;
  const list = [v, ...readRecent().filter((x) => x !== v)].slice(0, 8);
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {}
}
