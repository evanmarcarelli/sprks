import type { Speaker } from "@/lib/data/speakers";
import { listingCategory } from "@/lib/data/listings";
import type { CategoryId } from "@/lib/catalog/categories";
import type { BuyerProfile, ExcludedListingType } from "./profile";

// Soft-suppress flag for listings — true means it would normally be hidden,
// but callers can override (e.g. when the user actively searched for it).
export function isSuppressed(l: Speaker, p: BuyerProfile): boolean {
  const cat = listingCategory(l);
  if (p.excluded_categories.includes(cat)) return true;
  if (p.excluded_brands.some((b) => b.toLowerCase() === l.brand.toLowerCase())) return true;
  for (const t of p.excluded_listing_types) {
    if (matchesExcludedType(l, t)) return true;
  }
  return false;
}

function matchesExcludedType(l: Speaker, t: ExcludedListingType): boolean {
  const condition = (l.condition ?? "").toLowerCase();
  switch (t) {
    case "used":
      return condition.includes("used");
    case "entry":
      return l.price < 600;
    case "ultra_high_end":
      return l.price > 30000;
    case "repair_needed":
      return condition.includes("repair") || condition.includes("for parts");
    case "diy":
      return (l.tags ?? []).some((tag) => /diy|custom/i.test(tag));
    case "local_only":
      return l.localPickup === true;
    case "sold":
      return /sold/i.test(l.condition ?? "");
  }
}

export function scoreListing(l: Speaker, p: BuyerProfile): number {
  let s = 0;
  const cat = listingCategory(l);
  if (p.interested_categories.includes(cat)) s += 3;
  const subs = p.interested_subcategories[cat] ?? [];
  if (l.subcategory && subs.includes(l.subcategory)) s += 4;
  if (l.type && subs.includes(l.type)) s += 2;
  if (p.favorite_brands.some((b) => b.toLowerCase() === l.brand.toLowerCase())) s += 5;
  // Budget decay
  const r = p.budget_preference.range;
  if (r) {
    const [lo, hi] = r;
    if (l.price >= lo && l.price <= hi) s += 2;
    else if (l.price > hi) s -= Math.min(3, (l.price - hi) / hi);
    else if (l.price < lo) s -= 0.5;
  }
  // Openness: broad gets slight diversity bonus for unselected categories
  if (p.openness_level === "broad" && !p.interested_categories.includes(cat)) s += 0.5;
  return s;
}

export function rankListings(
  listings: Speaker[],
  p: BuyerProfile,
  opts: { allowSuppressed?: boolean } = {},
): Speaker[] {
  const filtered = opts.allowSuppressed
    ? listings
    : listings.filter((l) => !isSuppressed(l, p));
  // Stable sort by score desc; preserve original order for ties.
  return filtered
    .map((l, i) => ({ l, i, s: scoreListing(l, p) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.l);
}

export function defaultCategoryFor(p: BuyerProfile): CategoryId | null {
  return p.interested_categories[0] ?? null;
}

export function defaultChipOrder(
  all: CategoryId[],
  p: BuyerProfile,
): CategoryId[] {
  const interested = new Set(p.interested_categories);
  const excluded = new Set(p.excluded_categories);
  const head = p.interested_categories.filter((c) => !excluded.has(c));
  const tail = all.filter((c) => !interested.has(c) && !excluded.has(c));
  const muted = all.filter((c) => excluded.has(c));
  return [...head, ...tail, ...muted];
}

export function defaultPriceMax(p: BuyerProfile): number | null {
  const r = p.budget_preference.range;
  return r ? r[1] : null;
}

export function routeAfterOnboarding(
  p: BuyerProfile,
): { to: "/" | "/marketplace" | "/saved" | "/discover" } {
  switch (p.primary_intent) {
    case "buy":
      return { to: "/marketplace" };
    case "compare":
      return { to: "/saved" };
    case "build":
    case "browse":
      return { to: "/discover" };
    case "sell":
    case null:
    default:
      return { to: "/" };
  }
}
