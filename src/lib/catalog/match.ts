import { CATEGORIES, type CategoryId } from "./categories";

// Infer the most likely category from a free-text query. Used by both
// Home + Marketplace search to route users into the right category.
export function inferCategoryFromQuery(q: string): CategoryId | null {
  const s = q.toLowerCase().trim();
  if (!s) return null;
  let best: { id: CategoryId; score: number } | null = null;
  for (const cat of CATEGORIES) {
    let score = 0;
    for (const kw of cat.searchKeywords) {
      if (s.includes(kw)) score += kw.length;
    }
    if (s.includes(cat.label.toLowerCase()) || s.includes(cat.shortLabel.toLowerCase())) {
      score += 6;
    }
    if (score > (best?.score ?? 0)) best = { id: cat.id, score };
  }
  return best && best.score >= 3 ? best.id : null;
}
