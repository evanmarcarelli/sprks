import type { Speaker } from "@/lib/data/speakers";
import { listingCategory } from "@/lib/data/listings";

export type MarketStats = {
  count: number;
  minPrice: number;
  maxPrice: number;
  medianPrice: number;
  verifiedCount: number;
  localPickupCount: number;
  locations: string[];
};

export function normalizeModelKey(brand: string, model: string) {
  return `${brand} ${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function findMatchingListings(target: Speaker, pool: Speaker[]): Speaker[] {
  const key = normalizeModelKey(target.brand, target.model);
  const cat = listingCategory(target);
  return pool.filter(
    (s) =>
      normalizeModelKey(s.brand, s.model) === key &&
      listingCategory(s) === cat,
  );
}

export function getMarketStats(listings: Speaker[]): MarketStats {
  const prices = listings.map((l) => l.price).sort((a, b) => a - b);
  const median = prices.length
    ? prices.length % 2
      ? prices[(prices.length - 1) / 2]
      : Math.round((prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2)
    : 0;
  return {
    count: listings.length,
    minPrice: prices[0] ?? 0,
    maxPrice: prices[prices.length - 1] ?? 0,
    medianPrice: median,
    verifiedCount: listings.filter((l) => l.verified).length,
    localPickupCount: listings.filter((l) => l.localPickup).length,
    locations: Array.from(new Set(listings.map((l) => l.seller.location))),
  };
}

export function confidenceScore(a: Speaker, b: Speaker): number {
  if (listingCategory(a) !== listingCategory(b)) return 0;
  const same = normalizeModelKey(a.brand, a.model) === normalizeModelKey(b.brand, b.model);
  if (!same) return 0;
  let score = 0.8;
  if (a.finish === b.finish) score += 0.1;
  if (a.subcategory && a.subcategory === b.subcategory) score += 0.1;
  return Math.min(1, score);
}
