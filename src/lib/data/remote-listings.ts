// Real, user-created listings stored in Supabase (the `listings` table). These
// are mapped into the same `Speaker` shape the rest of the app renders, so they
// flow through the marketplace / discover pipelines unchanged.
import { supabase } from "@/lib/supabase";
import type { Speaker } from "@/lib/data/speakers";
import type { CategoryId } from "@/lib/catalog/categories";

export type ListingRow = {
  id: string;
  created_at: string;
  brand: string;
  model: string;
  price: number;
  category: string | null;
  subcategory: string | null;
  type: string | null;
  condition: string | null;
  finish: string | null;
  tags: string[] | null;
  image: string | null;
  gallery: string[] | null;
  description: string | null;
  location: string | null;
  seller_name: string | null;
  passive: boolean | null;
  room_size: string | null;
  local_pickup: boolean | null;
  verified: boolean | null;
  status: string | null;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80";

// Map a DB row to a COMPLETE Speaker — every field the type declares gets a safe
// default so downstream code (cards, ranking, category lookups) never hits null.
export function rowToSpeaker(r: ListingRow): Speaker {
  const roomSize = (["Small", "Medium", "Large"] as const).includes(r.room_size as any)
    ? (r.room_size as Speaker["roomSize"])
    : "Medium";
  return {
    id: `remote-${r.id}`,
    brand: r.brand,
    model: r.model,
    price: r.price,
    condition: r.condition ?? "Used — Good",
    type: r.type ?? "Speaker",
    passive: r.passive ?? true,
    tags: r.tags ?? [],
    finish: r.finish ?? "—",
    roomSize,
    localPickup: r.local_pickup ?? false,
    verified: r.verified ?? false,
    image: r.image || FALLBACK_IMAGE,
    gallery: r.gallery ?? [],
    description: r.description ?? "",
    category: (r.category as CategoryId) ?? "speakers",
    subcategory: r.subcategory ?? undefined,
    specs: {},
    seller: {
      name: r.seller_name || "Private seller",
      location: r.location || "—",
      rating: 0,
    },
  };
}

export async function fetchRemoteListings(): Promise<Speaker[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error || !data) {
    if (error) console.error("[listings] fetch failed:", error.message);
    return [];
  }
  return (data as ListingRow[]).map(rowToSpeaker);
}

// True for ids produced by rowToSpeaker — lets views flag "just listed" items.
export function isRemoteListing(id: string): boolean {
  return id.startsWith("remote-");
}
