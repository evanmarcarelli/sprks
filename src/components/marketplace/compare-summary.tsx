import { ChevronRight, BadgeCheck } from "lucide-react";
import type { Speaker } from "@/lib/data/speakers";
import { SPEAKERS } from "@/lib/data/speakers";
import { findMatchingListings, getMarketStats } from "@/lib/marketplace/compare";

export function CompareSummary({
  speaker,
  onOpen,
}: {
  speaker: Speaker;
  onOpen: () => void;
}) {
  const matches = findMatchingListings(speaker, SPEAKERS);
  if (matches.length < 2) return null;
  const stats = getMarketStats(matches);

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Market for this model
        </h3>
        <span className="text-[10.5px] text-muted-foreground">
          {stats.count} listings
        </span>
      </div>
      <button
        onClick={onOpen}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface-elev px-4 py-3.5 text-left"
      >
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <p className="tabular text-base font-medium">
              ${stats.minPrice.toLocaleString()} – ${stats.maxPrice.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">
              median ${stats.medianPrice.toLocaleString()}
            </p>
          </div>
          <p className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
            {stats.verifiedCount > 0 && (
              <span className="inline-flex items-center gap-0.5">
                <BadgeCheck className="h-3 w-3 text-teal" />
                {stats.verifiedCount} verified
              </span>
            )}
            {stats.localPickupCount > 0 && (
              <span>{stats.localPickupCount} local pickup</span>
            )}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>
    </section>
  );
}
