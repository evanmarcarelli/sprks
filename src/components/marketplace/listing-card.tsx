import { Heart, BadgeCheck, MapPin } from "lucide-react";
import type { Speaker } from "@/lib/data/speakers";
import { useStore } from "@/lib/store";
import { getCategory } from "@/lib/catalog/categories";
import { listingCategory } from "@/lib/data/listings";

export function MarketplaceListingCard({
  speaker,
  onOpen,
}: {
  speaker: Speaker;
  onOpen: () => void;
}) {
  const { saved, toggleSave } = useStore();
  const isSaved = saved.includes(speaker.id);
  const cat = getCategory(listingCategory(speaker));
  const meta = (cat?.cardMeta(speaker as any) ?? [speaker.type]).filter(Boolean);

  const quickTag =
    speaker.condition === "Used — Mint"
      ? "Mint"
      : speaker.verified
        ? "Verified"
        : speaker.localPickup
          ? "Local pickup"
          : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-surface text-left transition active:scale-[0.99]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        <img
          src={speaker.image}
          alt={`${speaker.brand} ${speaker.model}`}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] tracking-wide backdrop-blur">
          {speaker.condition}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSave(speaker.id);
          }}
          aria-label={isSaved ? "Unsave" : "Save"}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/85 backdrop-blur"
        >
          <Heart
            className={`h-3.5 w-3.5 ${isSaved ? "fill-foreground text-foreground" : "text-foreground"}`}
          />
        </button>
        {quickTag && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-foreground/90 px-2 py-0.5 text-[10px] text-background">
            {quickTag === "Verified" && <BadgeCheck className="h-3 w-3" />}
            {quickTag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 p-2.5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {speaker.brand}
        </p>
        <p className="line-clamp-1 text-[13.5px] font-medium leading-tight">
          {speaker.model}
        </p>
        <p className="tabular mt-0.5 text-[14px] font-medium">
          ${speaker.price.toLocaleString()}
        </p>
        {meta.length > 0 && (
          <p className="mt-0.5 line-clamp-1 text-[10.5px] text-muted-foreground">
            {meta.join(" · ")}
          </p>
        )}
        <div className="mt-1 flex items-center gap-1 text-[10.5px] text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{speaker.seller.location}</span>
        </div>
      </div>
    </div>
  );
}
