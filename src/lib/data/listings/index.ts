import { SPEAKERS } from "@/lib/data/speakers";
import { NON_SPEAKER_LISTINGS } from "./non-speakers";
import type { Speaker } from "@/lib/data/speakers";
import type { CategoryId } from "@/lib/catalog/categories";

// Every speaker entry implicitly belongs to the "speakers" category.
const SPEAKERS_WITH_CAT: Speaker[] = SPEAKERS.map((s) => ({
  ...s,
  category: s.category ?? "speakers",
  subcategory: s.subcategory ?? s.type,
}));

export const ALL_LISTINGS: Speaker[] = [
  ...SPEAKERS_WITH_CAT,
  ...NON_SPEAKER_LISTINGS,
];

export function byCategory(id: CategoryId | null | undefined): Speaker[] {
  if (!id) return ALL_LISTINGS;
  return ALL_LISTINGS.filter((l) => (l.category ?? "speakers") === id);
}

export function listingCategory(l: Speaker): CategoryId {
  return (l.category as CategoryId) ?? "speakers";
}
