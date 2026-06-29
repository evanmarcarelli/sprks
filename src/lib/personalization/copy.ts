import type { BuyerProfile } from "./profile";
import { CATEGORY_MAP } from "@/lib/catalog/categories";

// Plain-English summary lines for the personalization preview screen.
export function previewStatements(p: BuyerProfile): string[] {
  const out: string[] = [];
  const cats = p.interested_categories.map((id) => CATEGORY_MAP[id]?.shortLabel ?? id);
  if (cats.length) {
    out.push(`Home tuned for ${joinHuman(cats.slice(0, 3))}.`);
  } else {
    out.push("Home stays broad — you'll see across the catalog.");
  }

  const setupCopy: Record<string, string> = {
    two_channel: "two-channel listening",
    desktop: "desktop setups",
    headphones: "headphone rigs",
    home_theater: "home theater",
    vinyl: "vinyl systems",
    studio: "studio / critical listening",
    exploring: "exploration",
  };
  if (p.setup_context) {
    out.push(`Discover will prioritize ${setupCopy[p.setup_context]}.`);
  }

  if (p.budget_preference.range) {
    const [lo, hi] = p.budget_preference.range;
    const primary = cats[0] ?? "gear";
    out.push(
      `Marketplace starts with ${primary.toLowerCase()} between $${lo.toLocaleString()} and $${hi.toLocaleString()}.`,
    );
  } else if (p.budget_preference.mode === "per_category") {
    out.push("Budget set per category — we'll ask in context.");
  }

  if (p.favorite_brands.length) {
    out.push(
      `${joinHuman(p.favorite_brands.slice(0, 3))} get a quiet boost in your feed.`,
    );
  } else if (p.openness_level === "broad") {
    out.push("Brand-agnostic — we'll keep recommendations wide.");
  }

  if (p.excluded_listing_types.includes("used")) out.push("Used listings muted by default.");
  if (p.excluded_listing_types.includes("entry")) out.push("Entry-level gear de-emphasized.");

  return out.slice(0, 5);
}

function joinHuman(arr: string[]): string {
  if (arr.length <= 1) return arr[0] ?? "";
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
}
