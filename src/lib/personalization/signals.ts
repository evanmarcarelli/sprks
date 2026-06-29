// Lightweight in-app signals for progressive profiling. Counters live in the
// store and are persisted; an analytics transport can be added later by
// mirroring the same event names.

import type { CategoryId } from "@/lib/catalog/categories";

export type SignalEvent =
  | { kind: "view_category"; category: CategoryId }
  | { kind: "save_listing"; brand: string; used: boolean }
  | { kind: "compare_open" }
  | { kind: "search_brand"; brand: string }
  | { kind: "apply_price_filter"; max: number }
  | { kind: "open_seller_route" };

export type SignalCounters = {
  categoryViews: Partial<Record<CategoryId, number>>;
  brandSearches: Record<string, number>;
  usedSaves: number;
  compareOpens: number;
  sellerVisits: number;
};

export const EMPTY_COUNTERS: SignalCounters = {
  categoryViews: {},
  brandSearches: {},
  usedSaves: 0,
  compareOpens: 0,
  sellerVisits: 0,
};

export function applySignal(c: SignalCounters, e: SignalEvent): SignalCounters {
  switch (e.kind) {
    case "view_category":
      return {
        ...c,
        categoryViews: {
          ...c.categoryViews,
          [e.category]: (c.categoryViews[e.category] ?? 0) + 1,
        },
      };
    case "save_listing":
      return { ...c, usedSaves: e.used ? c.usedSaves + 1 : c.usedSaves };
    case "compare_open":
      return { ...c, compareOpens: c.compareOpens + 1 };
    case "search_brand": {
      const key = e.brand.toLowerCase();
      return {
        ...c,
        brandSearches: { ...c.brandSearches, [key]: (c.brandSearches[key] ?? 0) + 1 },
      };
    }
    case "open_seller_route":
      return { ...c, sellerVisits: c.sellerVisits + 1 };
    case "apply_price_filter":
      return c;
  }
}

export type Prompt = {
  id: string;
  title: string;
  body: string;
  acceptLabel: string;
};

// Returns at most one prompt for the current counters + profile state.
export function nextPrompt(
  c: SignalCounters,
  dismissed: string[],
): Prompt | null {
  const seen = new Set(dismissed);
  if (!seen.has("headphones-prio") && (c.categoryViews.headphones ?? 0) >= 5) {
    return {
      id: "headphones-prio",
      title: "Prioritize headphones?",
      body: "You've been looking at a lot of headphone gear. Want us to weight your feed toward it?",
      acceptLabel: "Prioritize",
    };
  }
  if (!seen.has("show-used") && c.usedSaves >= 3) {
    return {
      id: "show-used",
      title: "Show used gear by default?",
      body: "You've saved several used listings. We'll surface more of them.",
      acceptLabel: "Show more used",
    };
  }
  if (!seen.has("pin-compare") && c.compareOpens >= 4) {
    return {
      id: "pin-compare",
      title: "Pin Compare to Saved?",
      body: "You compare often. We'll keep Compare front-and-center.",
      acceptLabel: "Pin Compare",
    };
  }
  if (!seen.has("seller-verify") && c.sellerVisits >= 1) {
    return {
      id: "seller-verify",
      title: "Start seller verification?",
      body: "Get your gear ready to list with identity + payout setup.",
      acceptLabel: "Begin",
    };
  }
  const topBrand = Object.entries(c.brandSearches).sort((a, b) => b[1] - a[1])[0];
  if (topBrand && topBrand[1] >= 3 && !seen.has(`fav-${topBrand[0]}`)) {
    return {
      id: `fav-${topBrand[0]}`,
      title: `Favorite ${capitalize(topBrand[0])}?`,
      body: `You've searched ${capitalize(topBrand[0])} a few times. We'll boost it in your feed.`,
      acceptLabel: "Favorite",
    };
  }
  return null;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
