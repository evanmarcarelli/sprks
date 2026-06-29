import type { CategoryId } from "@/lib/catalog/categories";

export type PrimaryIntent = "buy" | "sell" | "compare" | "build" | "browse";
export type SetupContext =
  | "two_channel"
  | "desktop"
  | "headphones"
  | "home_theater"
  | "vinyl"
  | "studio"
  | "exploring";
export type ExcludedListingType =
  | "entry"
  | "ultra_high_end"
  | "used"
  | "repair_needed"
  | "diy"
  | "local_only"
  | "sold";
export type Openness = "broad" | "balanced" | "specific";
export type BudgetMode = "global" | "per_category" | "open";

export type BudgetPreference = {
  mode: BudgetMode;
  range?: [number, number];
  perCategory?: Partial<Record<CategoryId, [number, number]>>;
};

export type BuyerProfile = {
  primary_intent: PrimaryIntent | null;
  interested_categories: CategoryId[];
  interested_subcategories: Partial<Record<CategoryId, string[]>>;
  favorite_brands: string[];
  budget_preference: BudgetPreference;
  excluded_categories: CategoryId[];
  excluded_brands: string[];
  excluded_listing_types: ExcludedListingType[];
  setup_context: SetupContext | null;
  openness_level: Openness;
  seller_interest: boolean;
  onboarding_completed: boolean;
  onboarding_confidence: number; // 0..1
  updated_at: string;
};

export const EMPTY_PROFILE: BuyerProfile = {
  primary_intent: null,
  interested_categories: [],
  interested_subcategories: {},
  favorite_brands: [],
  budget_preference: { mode: "open" },
  excluded_categories: [],
  excluded_brands: [],
  excluded_listing_types: [],
  setup_context: null,
  openness_level: "balanced",
  seller_interest: false,
  onboarding_completed: false,
  onboarding_confidence: 0,
  updated_at: new Date(0).toISOString(),
};

export const BUDGET_BANDS: { id: string; label: string; range: [number, number] }[] = [
  { id: "u1k", label: "Under $1,000", range: [0, 1000] },
  { id: "1to3", label: "$1,000 – $3,000", range: [1000, 3000] },
  { id: "3to8", label: "$3,000 – $8,000", range: [3000, 8000] },
  { id: "8to20", label: "$8,000 – $20,000", range: [8000, 20000] },
  { id: "20p", label: "$20,000+", range: [20000, 500000] },
];

export function computeConfidence(p: BuyerProfile): number {
  // Required-ish signals (0.6 weight), optional (0.4)
  const required = [
    !!p.primary_intent,
    p.interested_categories.length > 0,
    !!p.setup_context,
  ];
  const optional = [
    Object.values(p.interested_subcategories).some((s) => (s ?? []).length > 0),
    p.favorite_brands.length > 0 || p.openness_level === "broad",
    p.budget_preference.mode !== "open" || !!p.budget_preference.range,
    p.excluded_listing_types.length > 0 || p.excluded_brands.length > 0,
  ];
  const r = required.filter(Boolean).length / required.length;
  const o = optional.filter(Boolean).length / optional.length;
  return Math.round((r * 0.6 + o * 0.4) * 100) / 100;
}
