import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, GitCompare, ShoppingBag, X, Minus, Plus } from "lucide-react";
import type { Speaker } from "@/lib/data/speakers";
import { ALL_LISTINGS, listingCategory } from "@/lib/data/listings";
import { getCategory, type CategoryId } from "@/lib/catalog/categories";
import { useStore } from "@/lib/store";
import { DetailDrawer } from "@/components/detail-drawer";

export const Route = createFileRoute("/_tabs/saved")({
  head: () => ({
    meta: [
      { title: "Saved — SPKRS" },
      { name: "description", content: "Your shortlist, side-by-side comparisons, and cart across premium hi-fi gear." },
      { property: "og:title", content: "Saved — SPKRS" },
      { property: "og:description", content: "Shortlist, compare, and cart." },
    ],
  }),
  component: SavedTab,
});

type Tab = "saved" | "compare" | "cart";

function SavedTab() {
  const [tab, setTab] = useState<Tab>("saved");
  const [detail, setDetail] = useState<Speaker | null>(null);
  const { saved, compare, cart } = useStore();

  return (
    <div className="pt-[env(safe-area-inset-top)]">
      <header className="px-5 pt-4">
        <p className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">Library</p>
        <h1 className="font-display text-3xl leading-tight">Your shortlist.</h1>
      </header>

      <div className="sticky top-0 z-10 mt-4 bg-background/90 px-4 pb-3 pt-1 backdrop-blur">
        <div className="grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
          <SegBtn active={tab === "saved"} onClick={() => setTab("saved")} count={saved.length}>
            <Heart className="h-3.5 w-3.5" /> Saved
          </SegBtn>
          <SegBtn active={tab === "compare"} onClick={() => setTab("compare")} count={compare.length}>
            <GitCompare className="h-3.5 w-3.5" /> Compare
          </SegBtn>
          <SegBtn active={tab === "cart"} onClick={() => setTab("cart")} count={cart.length}>
            <ShoppingBag className="h-3.5 w-3.5" /> Cart
          </SegBtn>
        </div>
      </div>

      <div className="px-4 pb-8">
        {tab === "saved" && <SavedGrid onOpen={setDetail} />}
        {tab === "compare" && <CompareView />}
        {tab === "cart" && <CartView />}
      </div>

      <DetailDrawer speaker={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function SegBtn({
  children,
  active,
  count,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium transition ${
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
      }`}
    >
      {children}
      {count > 0 && (
        <span
          className={`tabular rounded-full px-1.5 text-[10px] ${active ? "bg-foreground text-background" : "bg-background/60"}`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function findItem(id: string) {
  return ALL_LISTINGS.find((s) => s.id === id);
}

function groupByCategory(items: Speaker[]): { cat: CategoryId; items: Speaker[] }[] {
  const map = new Map<CategoryId, Speaker[]>();
  for (const s of items) {
    const c = listingCategory(s);
    if (!map.has(c)) map.set(c, []);
    map.get(c)!.push(s);
  }
  return Array.from(map.entries()).map(([cat, items]) => ({ cat, items }));
}

function SavedGrid({ onOpen }: { onOpen: (s: Speaker) => void }) {
  const { saved, toggleSave, toggleCompare, compare } = useStore();
  const items = saved.map((id) => findItem(id)).filter(Boolean) as Speaker[];
  const grouped = useMemo(() => groupByCategory(items), [items]);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        body="Swipe right on Home to start building your shortlist."
      />
    );
  }

  return (
    <div className="pt-4 space-y-6">
      {grouped.map(({ cat, items }) => (
        <section key={cat}>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {getCategory(cat)?.label} · {items.length}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {items.map((s) => (
              <article
                key={s.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpen(s)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpen(s);
                    }
                  }}
                  className="block w-full cursor-pointer text-left"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img src={s.image} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(s.id);
                      }}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/85 backdrop-blur"
                      aria-label="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-0.5 p-3">
                    <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                      {s.brand}
                    </p>
                    <p className="truncate text-sm font-medium">{s.model}</p>
                    <p className="tabular text-xs">${s.price.toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCompare(s.id)}
                  className={`flex w-full items-center justify-center gap-1.5 border-t border-border py-2 text-[11px] font-medium transition ${
                    compare.includes(s.id)
                      ? "bg-teal-soft text-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <GitCompare className="h-3 w-3" />
                  {compare.includes(s.id) ? "In compare" : "Add to compare"}
                </button>
              </article>
            ))}
          </div>
        </section>
      ))}
      {compare.length >= 2 && (
        <p className="text-center text-xs text-muted-foreground">
          {compare.length} selected — switch to Compare to view side by side.
        </p>
      )}
    </div>
  );
}

function CompareView() {
  const { compare, toggleCompare } = useStore();
  const items = compare.map((id) => findItem(id)).filter(Boolean) as Speaker[];
  const grouped = useMemo(() => groupByCategory(items), [items]);
  const mixed = grouped.length > 1;

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing to compare"
        body="Pick items from Saved to line them up side by side — compare works within a category."
      />
    );
  }

  return (
    <div className="pt-4 space-y-6">
      {mixed && (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-3 text-[12px] text-muted-foreground">
          Compare works within a single category. Your selection spans {grouped.length} categories — shown grouped below.
        </div>
      )}
      {grouped.map(({ cat, items }) => (
        <CompareGroup key={cat} cat={cat} items={items} onRemove={toggleCompare} />
      ))}
    </div>
  );
}

function CompareGroup({
  cat,
  items,
  onRemove,
}: {
  cat: CategoryId;
  items: Speaker[];
  onRemove: (id: string) => void;
}) {
  const category = getCategory(cat);
  const keys = category?.compareKeys ?? [];

  const valueOf = (s: Speaker, key: string): string => {
    if (key === "price") return `$${s.price.toLocaleString()}`;
    if (key.startsWith("specs.")) {
      const v = (s.specs as any)?.[key.slice(6)];
      return v == null ? "—" : Array.isArray(v) ? v.join(", ") : String(v);
    }
    const v = (s as any)[key];
    return v == null ? "—" : String(v);
  };

  return (
    <section>
      <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {category?.label}
      </h3>
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-3" style={{ minWidth: items.length * 200 }}>
          {items.map((s) => (
            <div key={s.id} className="w-[200px] shrink-0 overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="relative aspect-square bg-muted">
                <img src={s.image} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => onRemove(s.id)}
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-background/85"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{s.brand}</p>
                <p className="text-sm font-medium">{s.model}</p>
              </div>
              <dl className="divide-y divide-border border-t border-border text-xs">
                <Row label="Price" value={`$${s.price.toLocaleString()}`} />
                <Row label="Condition" value={s.condition} />
                {keys.map((row) => (
                  <Row key={row.key} label={row.label} value={valueOf(s, row.key)} />
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="tabular mt-0.5">{value}</dd>
    </div>
  );
}

function CartView() {
  const { cart, removeFromCart } = useStore();
  const items = cart.map((id) => findItem(id)).filter(Boolean) as Speaker[];
  const subtotal = items.reduce((sum, s) => sum + s.price, 0);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Cart is empty"
        body="Add an item from its detail view to keep tabs on what you're considering."
      />
    );
  }

  return (
    <div className="pt-4">
      <ul className="space-y-3">
        {items.map((s) => (
          <li key={s.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
            <img src={s.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{s.brand}</p>
              <p className="text-sm font-medium">{s.model}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <button className="grid h-6 w-6 place-items-center rounded-full border border-border">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="tabular text-sm">1</span>
                <button className="grid h-6 w-6 place-items-center rounded-full border border-border">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="tabular text-sm font-medium">${s.price.toLocaleString()}</p>
              <button
                onClick={() => removeFromCart(s.id)}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2 rounded-2xl border border-border bg-surface p-4 text-sm">
        <SumRow label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
        <SumRow label="Shipping" value="Calculated at next step" muted />
        <div className="my-2 h-px bg-border" />
        <SumRow label="Total" value={`$${subtotal.toLocaleString()}`} bold />
      </div>

      <button
        disabled
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3.5 text-sm font-medium text-background opacity-60"
      >
        Checkout
        <span className="rounded-full bg-background/20 px-2 py-0.5 text-[10px] uppercase tracking-wider">Soon</span>
      </button>
    </div>
  );
}

function SumRow({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between ${muted ? "text-muted-foreground" : ""}`}>
      <span>{label}</span>
      <span className={`tabular ${bold ? "font-medium" : ""}`}>{value}</span>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-16 flex flex-col items-center px-8 text-center">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="eq-bar w-[3px] rounded-full bg-border-strong"
            style={{ height: 24, animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
      <h3 className="mt-6 font-display text-2xl">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
